'use client';
import { Check, Trash2, Play } from 'lucide-react';
import Timer from './Timer';
import useTaskCard, { UseTaskCardProps } from './useTaskCard';
import LinkifiedText from '../LinkifiedText/LinkifiedText';

const priorityColors = {
  low: 'border-l-green-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-red-500',
};

export default function TaskCard(props: UseTaskCardProps) {
  const { state, actions } = useTaskCard(props);
  const { attributes, listeners, setNodeRef, style, t } = state;
  const { markInProgress, markDone, getTagColor, deleteTask } = actions;
  const { task, mode } = props;

  return (
    <div
      ref={setNodeRef}
      style={style as any}
      {...attributes}
      {...listeners}
      className={`rounded border-l-4 p-4 cursor-grab focus:outline-none focus:ring bg-gray-100 dark:bg-gray-800 ${priorityColors[task.priority]}`}
    >
      <div
        className={`flex justify-between ${
          mode === 'my-day' ? 'items-start' : 'items-center'
        }`}
      >
        <span className="flex-1 mr-2 min-w-0">
          <LinkifiedText text={task.title} />
        </span>
        <div
          className={`flex gap-2 ${
            mode === 'my-day' ? 'items-start' : 'items-center'
          }`}
        >
          {mode === 'my-day' ? (
            <>
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
      <div className="mt-2 flex flex-wrap gap-1">
        {task.tags?.map(tag => (
          <span
            key={tag}
            style={{ backgroundColor: getTagColor(tag) }}
            className="text-xs px-2 py-1 rounded-full text-white"
          >
            {tag}
          </span>
        ))}
      </div>
      {mode === 'my-day' && task.dayStatus === 'doing' && (
        <Timer taskTitle={task.title} />
      )}
    </div>
  );
}
