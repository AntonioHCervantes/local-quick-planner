'use client';
import { Check, Trash2 } from 'lucide-react';
import useTaskCard, { UseTaskCardProps } from './useTaskCard';

const priorityColors = {
  low: 'border-l-green-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-red-500',
};

export default function TaskCard(props: UseTaskCardProps) {
  const { state, actions } = useTaskCard(props);
  const { attributes, listeners, setNodeRef, style, t } = state;
  const { markDone, getTagColor, deleteTask } = actions;
  const { task, mode } = props;

  return (
    <div
      ref={setNodeRef}
      style={style as any}
      {...attributes}
      {...listeners}
      className={`rounded border-l-4 p-4 cursor-grab focus:outline-none focus:ring bg-gray-100 dark:bg-gray-800 ${priorityColors[task.priority]}`}
    >
      <div className="flex items-center justify-between">
        <span>{task.title}</span>
        <div className="flex items-center gap-2">
          {task.dayStatus !== 'done' && (
            <button
              onClick={markDone}
              aria-label={t('taskCard.markDone')}
              className="text-green-400 hover:text-green-500"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          {mode === 'my-day' && task.dayStatus === 'done' && (
            <button
              onClick={deleteTask}
              aria-label={t('taskCard.deleteTask')}
              className="text-red-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {task.tags?.map(tag => (
          <span
            key={tag}
            style={{ backgroundColor: getTagColor(tag) }}
            className="text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
