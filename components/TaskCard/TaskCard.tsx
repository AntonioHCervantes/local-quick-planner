'use client';
import { useEffect, useState, type MouseEvent } from 'react';
import { Check, Trash2, Play, Clock, Star } from 'lucide-react';
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
    'group rounded border-l-4 p-4 cursor-grab focus:outline-none focus:ring transition-all duration-200 ease-out',
    isMainTask
      ? 'border-l-amber-400 bg-gradient-to-r from-amber-100 via-yellow-50 to-white text-gray-900 shadow-xl ring-1 ring-amber-300/60 dark:from-amber-500/20 dark:via-amber-400/15 dark:to-gray-950 dark:text-amber-50 dark:ring-amber-500/40'
      : `${priorityClass} bg-gray-100 dark:bg-gray-800 hover:shadow-md`,
  ].join(' ');

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
      <div
        className={`flex justify-between ${
          mode === 'my-day' ? 'items-start' : 'items-center'
        }`}
      >
        <span className="mr-2 min-w-0 flex-1">
          <LinkifiedText text={task.title} />
        </span>
        <div
          className={`flex gap-2 ${
            mode === 'my-day' ? 'items-start' : 'items-center'
          }`}
        >
          {mode === 'my-day' ? (
            <>
              <button
                type="button"
                onClick={handleToggleMainTask}
                aria-pressed={isMainTask}
                aria-label={mainTaskLabel}
                title={t('taskCard.mainTaskTooltip')}
                className={`rounded-full p-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring focus-visible:ring-amber-400 ${
                  isMainTask
                    ? 'bg-amber-100/80 text-amber-600 hover:text-amber-500 dark:bg-amber-500/20 dark:text-amber-300'
                    : 'text-gray-400 hover:text-amber-400'
                }`}
              >
                <Star
                  className={`h-4 w-4 transition-transform ${
                    isMainTask ? 'scale-110' : ''
                  }`}
                  strokeWidth={isMainTask ? 1.5 : 2}
                  fill={isMainTask ? 'currentColor' : 'none'}
                />
              </button>
              {task.dayStatus === 'todo' && (
                <button
                  onClick={markInProgress}
                  aria-label={t('taskCard.markInProgress')}
                  title={t('taskCard.markInProgress')}
                  className="text-blue-400 hover:text-blue-500"
                >
                  <Play className="h-4 w-4" />
                </button>
              )}
              {task.dayStatus === 'doing' && (
                <button
                  onClick={markDone}
                  aria-label={t('taskCard.markDone')}
                  title={t('taskCard.markDone')}
                  className="text-green-400 hover:text-green-500"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
              {task.dayStatus === 'done' && (
                <button
                  onClick={deleteTask}
                  aria-label={t('taskCard.deleteTask')}
                  title={t('taskCard.deleteTask')}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </>
          ) : (
            task.dayStatus !== 'done' && (
              <button
                onClick={markDone}
                aria-label={t('taskCard.markDone')}
                title={t('taskCard.markDone')}
                className="text-green-400 hover:text-green-500"
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
  );
}
