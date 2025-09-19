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
  const [isMainTaskEntering, setIsMainTaskEntering] = useState(false);
  const isTimerVisible = showTimer || shouldForceShowTimer;

  const priorityClass = priorityColors[task.priority];
  const cardClasses = [
    'group relative z-0 rounded border-l-4 p-4 cursor-grab focus:outline-none focus:ring transition-all duration-500 ease-out transform-gpu',
    priorityClass,
    isMainTask
      ? [
          'bg-amber-100 text-gray-900',
          'shadow-[0_18px_55px_-32px_rgba(217,119,6,0.55)] hover:shadow-[0_22px_60px_-34px_rgba(217,119,6,0.5)]',
          'ring-2 ring-amber-300/80',
          'dark:bg-amber-500/20 dark:text-amber-50',
          'dark:shadow-[0_18px_55px_-34px_rgba(253,230,138,0.45)] dark:hover:shadow-[0_22px_60px_-36px_rgba(253,230,138,0.4)]',
          'dark:ring-amber-400/60',
        ].join(' ')
      : 'bg-gray-100 dark:bg-gray-800 hover:shadow-md',
    isMainTaskEntering ? 'animate-main-task-wow' : '',
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

  useEffect(() => {
    if (!isMainTask) {
      setIsMainTaskEntering(false);
      return;
    }
    setIsMainTaskEntering(true);
    const timeoutId = window.setTimeout(() => {
      setIsMainTaskEntering(false);
    }, 800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isMainTask]);

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
      {isMainTask && (
        <span
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/35 blur-3xl ${
            isMainTaskEntering ? 'animate-main-task-ripple' : 'opacity-0'
          }`}
        />
      )}
      <div className="relative z-10">
        <div
          className={`flex justify-between ${
            mode === 'my-day' ? 'items-start' : 'items-center'
          }`}
        >
          <span className="mr-2 min-w-0 flex-1">
            <LinkifiedText text={task.title} />
          </span>
          <div className="flex items-center gap-2">
            {mode === 'my-day' ? (
              <>
                <button
                  type="button"
                  onClick={handleToggleMainTask}
                  aria-pressed={isMainTask}
                  aria-label={mainTaskLabel}
                  title={t('taskCard.mainTaskTooltip')}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 ${
                    isMainTask
                      ? 'bg-amber-200/70 text-amber-700 hover:text-amber-600 dark:bg-amber-400/20 dark:text-amber-200'
                      : 'text-gray-400 hover:text-amber-400 dark:text-gray-500 dark:hover:text-amber-300'
                  }`}
                >
                  <Star
                    className={`h-4 w-4 transition-transform duration-300 ease-out ${
                      isMainTask ? 'scale-[1.25] rotate-3 drop-shadow-sm' : ''
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
