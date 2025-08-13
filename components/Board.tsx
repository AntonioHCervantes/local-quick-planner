'use client';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { useState } from 'react';
import { Task } from '../lib/types';
import { useStore } from '../lib/store';
import Column from './Column';
import TaskCard from './TaskCard';

interface BoardProps {
  mode: 'my-day' | 'kanban';
}

export default function Board({ mode }: BoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const { tasks, lists, order, moveTask, reorderTask } = useStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const columns =
    mode === 'my-day'
      ? [
          { id: 'todo', title: 'To Do' },
          { id: 'doing', title: 'In Progress' },
          { id: 'done', title: 'Done' },
        ]
      : [...lists]
          .sort((a, b) => a.order - b.order)
          .map(l => ({ id: l.id, title: l.title }));

  function getTasks(columnId: string): Task[] {
    const key = mode === 'my-day' ? `day-${columnId}` : `list-${columnId}`;
    const ids = order[key] || [];
    return ids
      .map(id => tasks.find(t => t.id === id))
      .filter((t): t is Task => !!t)
      .filter(t => (mode === 'my-day' ? t.plannedFor === today : true));
  }

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    const task = tasks.find(t => t.id === id) || null;
    setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const activeContainer = active.data.current?.sortable.containerId as string;
    const overContainer =
      (over.data.current?.sortable?.containerId as string) ||
      (over.id as string);
    const overIndex =
      over.data.current?.sortable?.index ?? getTasks(overContainer).length;

    if (activeContainer !== overContainer) {
      if (mode === 'my-day') {
        moveTask(activeId, { dayStatus: overContainer as any });
      } else {
        moveTask(activeId, { listId: overContainer });
      }
    }
    reorderTask(activeId, overContainer, overIndex, mode);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overContainer =
      (over.data.current?.sortable?.containerId as string) ||
      (over.id as string);
    const overIndex =
      over.data.current?.sortable?.index ?? getTasks(overContainer).length;

    reorderTask(activeId, overContainer, overIndex, mode);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto p-4">
        {columns.map(col => (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={getTasks(col.id)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            dragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
