'use client';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '../lib/types';
import TaskCard from './TaskCard';

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  mode: 'my-day' | 'kanban';
}

export default function Column({ id, title, tasks, mode }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });
  const containerClasses =
    mode === 'my-day' ? 'flex-1 min-w-0' : 'w-80 flex-shrink-0';
  const listClasses =
    mode === 'my-day' ? 'space-y-4 min-h-4' : 'space-y-2 min-h-4';

  return (
    <div
      ref={setNodeRef}
      className={containerClasses}
    >
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <SortableContext
        id={id}
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={listClasses}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
