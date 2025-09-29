'use client';
import { useEffect, useState, type MouseEvent } from 'react';
import { Check, Trash2, Play, Clock } from 'lucide-react';
import Link from '../Link/Link';
import Timer from './Timer';
import useTaskCard, { UseTaskCardProps } from './useTaskCard';
import LinkifiedText from '../LinkifiedText/LinkifiedText';
import { useStore } from '../../lib/store';

const priorityColors = {
  low: 'border-l-green-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-red-500',
};

export default function TaskCard(props: UseTaskCardProps) {
  const { state, actions } = useTaskCard(props);
  const { attributes, listeners, setNodeRef, style, t, isMainTask } = state;
  const { markInProgress, markDone, getTagColor, deleteTask, toggleMainTask } =
    actions;
  const { task, mode } = props;
  const timer = useStore(state => state.timers[task.id]);
  const shouldForceShowTimer =
    mode === 'my-day' && task.dayStatus === 'doing' && Boolean(timer?.running);
  const [showTimer, setShowTimer] = useState(() => shouldForceShowTimer);
  const isTimerVisible = showTimer || shouldForceShowTimer;

  const priorityClass = priorityColors[task.priority];
  const cardClasses = [
    'group relative z-0 rounded border-l-4 p-4 cursor-grab focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-4 transition-colors duration-300 ease-out',
    priorityClass,
    isMainTask
      ? [
          'bg-white text-gray-900',
          'border border-amber-200 hover:border-amber-300',
          'dark:bg-gray-900 dark:text-amber-50',
          'dark:border-amber-300/70 dark:hover:border-amber-200/70',
        ].join(' ')
      : 'bg-gray-100 dark:bg-gray-800 hover:shadow-md',
  ]
    .filter(Boolean)
    .join(' ');

  const handleToggleMainTask = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    toggleMainTask();
  };

  const mainTaskLabel = isMainTask
    ? t('taskCard.unsetMainTask')
    : t('taskCard.setMainTask');

  useEffect(() => {
    if (shouldForceShowTimer) {
      setShowTimer(true);
    }
  }, [shouldForceShowTimer]);

  const handleToggleTimer = () => {
    if (shouldForceShowTimer) {
      return;
    }
    setShowTimer(s => !s);
  };

  return (
    <div
      ref={setNodeRef}
      style={style as any}
      {...attributes}
      {...listeners}
      className={cardClasses}
      data-main-task={isMainTask || undefined}
    >
      <div className="relative z-10">
        <div
          className={`flex justify-between ${
            mode === 'my-day' ? 'items-start' : 'items-center'
          }`}
        >
          <span className="mr-2 min-w-0 flex-1">
            <LinkifiedText text={task.title} />
          </span>
          <div
            className={
              mode === 'my-day'
                ? 'flex min-h-[4.5rem] flex-col items-end gap-2 pl-3'
                : 'flex items-center gap-2'
            }
          >
            {mode === 'my-day' ? (
              <>
                {task.dayStatus === 'todo' && (
                  <button
                    onClick={markInProgress}
                    aria-label={t('taskCard.markInProgress')}
                    title={t('taskCard.markInProgress')}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-blue-400 transition-colors duration-150 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                )}
                {task.dayStatus === 'doing' && (
                  <button
                    onClick={markDone}
                    aria-label={t('taskCard.markDone')}
                    title={t('taskCard.markDone')}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-green-400 transition-colors duration-150 hover:text-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300/60 focus-visible:ring-offset-2"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                {task.dayStatus === 'done' && (
                  <button
                    onClick={deleteTask}
                    aria-label={t('taskCard.deleteTask')}
                    title={t('taskCard.deleteTask')}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 transition-colors duration-150 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/60 focus-visible:ring-offset-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleToggleMainTask}
                  aria-pressed={isMainTask}
                  aria-label={mainTaskLabel}
                  title={t('taskCard.mainTaskTooltip')}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 ${
                    isMainTask
                      ? 'border border-amber-300 text-amber-700 hover:text-amber-600 dark:border-amber-200/70 dark:text-amber-100'
                      : 'border border-transparent text-gray-500 hover:border-amber-200 hover:text-amber-500 dark:text-gray-400 dark:hover:border-amber-300/60 dark:hover:text-amber-200'
                  }`}
                >
                  {isMainTask
                    ? t('taskCard.mainTaskTooltip')
                    : t('taskCard.setMainTask')}
                </button>
              </>
            ) : (
              task.dayStatus !== 'done' && (
                <button
                  onClick={markDone}
                  aria-label={t('taskCard.markDone')}
                  title={t('taskCard.markDone')}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-green-400 transition-colors duration-150 hover:text-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300/60 focus-visible:ring-offset-2"
                >
                  <Check className="h-4 w-4" />
                </button>
              )
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1">
          {task.tags?.map(tag => (
            <span
              key={tag}
              style={{ backgroundColor: getTagColor(tag) }}
              className="rounded-full px-2 py-1 text-xs text-white"
            >
              {tag}
            </span>
          ))}
        </div>
        {mode === 'my-day' && task.dayStatus === 'doing' && (
          <>
            <Link
              onClick={handleToggleTimer}
              aria-label={t('taskCard.showTimer')}
              title={t('taskCard.showTimer')}
              icon={Clock}
              className="mt-4"
              aria-expanded={isTimerVisible}
            >
              {t('taskCard.showTimer')}
            </Link>
            {isTimerVisible && <Timer taskId={task.id} />}
          </>
        )}
      </div>
    </div>
  );
}
