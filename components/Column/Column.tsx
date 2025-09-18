'use client';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '../../lib/types';
import { getDayStatusIcon, type DayStatus } from '../../lib/dayStatus';
import TaskCard from '../TaskCard/TaskCard';
import useColumn, { UseColumnProps } from './useColumn';

interface ColumnProps extends UseColumnProps {
  title: string;
  tasks: Task[];
  status?: DayStatus;
}

export default function Column({
  id,
  title,
  tasks,
  mode,
  status,
}: ColumnProps) {
  const { state, actions } = useColumn({ id, mode });
  const { containerClasses, listClasses } = state;
  const { setNodeRef } = actions;
  const StatusIcon = status ? getDayStatusIcon(status) : null;

  return (
    <div
      ref={setNodeRef}
      className={containerClasses}
    >
      <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        {StatusIcon ? (
          <StatusIcon
            aria-hidden="true"
            className="h-5 w-5 text-blue-600 dark:text-blue-200"
          />
        ) : null}
        {title}
      </h2>
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
              mode={mode}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
