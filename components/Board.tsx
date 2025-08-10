'use client';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { Task } from '../lib/types';
import { useStore } from '../lib/store';
import Column from './Column';

interface BoardProps {
  mode: 'my-day' | 'kanban';
}

export default function Board({ mode }: BoardProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const { tasks, lists, order, moveTask, reorderTask } = useStore();

  const today = new Date().toISOString().slice(0, 10);

  const columns = mode === 'my-day'
    ? [
        { id: 'todo', title: 'To Do' },
        { id: 'doing', title: 'In Progress' },
        { id: 'done', title: 'Done' },
      ]
    : [...lists].sort((a, b) => a.order - b.order).map((l) => ({ id: l.id, title: l.title }));

  function getTasks(columnId: string): Task[] {
    const key = mode === 'my-day' ? `day-${columnId}` : `list-${columnId}`;
    const ids = order[key] || [];
    return ids
      .map((id) => tasks.find((t) => t.id === id))
      .filter((t): t is Task => !!t)
      .filter((t) => (mode === 'my-day' ? t.plannedFor === today : true));
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const activeContainer = active.data.current?.sortable.containerId as string;
    const overContainer = over.data.current?.sortable.containerId as string;
    const overIndex = over.data.current?.sortable.index as number;

    if (activeContainer === overContainer) {
      reorderTask(activeId, overContainer, overIndex, mode);
    } else {
      if (mode === 'my-day') {
        moveTask(activeId, { dayStatus: overContainer as any });
      } else {
        moveTask(activeId, { listId: overContainer });
      }
      reorderTask(activeId, overContainer, overIndex, mode);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-4">
        {columns.map((col) => (
          <Column key={col.id} id={col.id} title={col.title} tasks={getTasks(col.id)} />
        ))}
      </div>
    </DndContext>
  );
}
