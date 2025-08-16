'use client';
import { Check, Trash2, Play } from 'lucide-react';
import useTaskCard, { UseTaskCardProps } from './useTaskCard';

const priorityColors = {
  low: 'border-l-[hsl(var(--success))]',
  medium: 'border-l-[hsl(var(--warning))]',
  high: 'border-l-[hsl(var(--danger))]',
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
      className={`rounded border-l-4 p-4 cursor-grab focus:outline-none focus:ring bg-[hsl(var(--surface-2))] ${priorityColors[task.priority]}`}
    >
      <div
        className={`flex justify-between ${
          mode === 'my-day' ? 'items-start' : 'items-center'
        }`}
      >
        <span className="flex-1 mr-2">{task.title}</span>
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
                  className="text-[hsl(var(--info))] hover:opacity-80"
                >
                  <Play className="h-4 w-4" />
                </button>
              )}
              {task.dayStatus === 'doing' && (
                <button
                  onClick={markDone}
                  aria-label={t('taskCard.markDone')}
                  title={t('taskCard.markDone')}
                  className="text-[hsl(var(--success))] hover:opacity-80"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
              {task.dayStatus === 'done' && (
                <button
                  onClick={deleteTask}
                  aria-label={t('taskCard.deleteTask')}
                  title={t('taskCard.deleteTask')}
                  className="text-[hsl(var(--danger))] hover:opacity-80"
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
                className="text-[hsl(var(--success))] hover:opacity-80"
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
            className="text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
