'use client';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '../../lib/types';
import TaskCard from '../TaskCard';
import useColumn, { UseColumnProps } from './useColumn';

interface ColumnProps extends UseColumnProps {
  title: string;
  tasks: Task[];
}

export default function Column({ id, title, tasks, mode }: ColumnProps) {
  const { state, actions } = useColumn({ id, mode });
  const { containerClasses, listClasses } = state;
  const { setNodeRef } = actions;

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
