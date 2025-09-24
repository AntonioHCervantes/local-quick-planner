'use client';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '../../lib/types';
import { getDayStatusIcon, type DayStatus } from '../../lib/dayStatus';
import { useStore } from '../../lib/store';
import { useI18n } from '../../lib/i18n';
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
  const { t } = useI18n();
  const clearCompletedMyDayTasks = useStore(s => s.clearCompletedMyDayTasks);
  const showClearCompletedAction =
    mode === 'my-day' && id === 'done' && tasks.length >= 2;

  return (
    <div
      ref={setNodeRef}
      className={containerClasses}
    >
      <div className="mb-6 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          {StatusIcon ? (
            <StatusIcon
              aria-hidden="true"
              className="h-5 w-5 text-blue-600 dark:text-blue-200"
            />
          ) : null}
          {title}
        </h2>
        {showClearCompletedAction ? (
          <button
            type="button"
            onClick={clearCompletedMyDayTasks}
            className="rounded px-1 text-sm font-medium text-[#57886C] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57886C]"
          >
            {t('myDayPage.progress.clearCompleted')}
          </button>
        ) : null}
      </div>
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
