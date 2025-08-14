'use client';
import { CalendarPlus, CalendarX, Trash2 } from 'lucide-react';
import { Priority } from '../../lib/types';
import { useI18n } from '../../lib/i18n';
import useTaskItem, { UseTaskItemProps } from './useTaskItem';

export default function TaskItem({ taskId }: UseTaskItemProps) {
  const { state, actions } = useTaskItem({ taskId });
  const { task, isEditing, title, allTags } = state;
  const {
    setTitle,
    handleTagInputChange,
    removeTag,
    getTagColor,
    startEditing,
    saveTitle,
    handleTitleKeyDown,
    updateTask,
    toggleMyDay,
    removeTask,
  } = actions as any; // when task undefined, actions is empty
  const { t } = useI18n();

  if (!task) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded bg-gray-100 p-2 dark:bg-gray-800">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={handleTitleKeyDown}
            className="flex-1 rounded bg-gray-200 p-1 text-sm focus:ring dark:bg-gray-700"
            autoFocus
          />
        ) : (
          <p
            className="flex-1"
            onClick={startEditing}
          >
            {task.title}
          </p>
        )}
        <select
          value={task.priority ?? ''}
          onChange={e =>
            updateTask(task.id, {
              priority: e.target.value as Priority,
            })
          }
          className="rounded bg-gray-200 p-1 text-sm focus:ring dark:bg-gray-700"
        >
          <option value="low">{t('priority.low')}</option>
          <option value="medium">{t('priority.medium')}</option>
          <option value="high">{t('priority.high')}</option>
        </select>
        <button
          onClick={() => toggleMyDay(task.id)}
          aria-label={
            task.plannedFor ? t('taskItem.removeMyDay') : t('taskItem.addMyDay')
          }
          className="rounded bg-blue-600 p-1 text-white hover:bg-blue-700 focus:ring"
        >
          {task.plannedFor ? (
            <CalendarX className="h-4 w-4" />
          ) : (
            <CalendarPlus className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => removeTask(task.id)}
          aria-label={t('taskItem.deleteTask')}
          className="rounded bg-red-600 p-1 text-white hover:bg-red-700 focus:ring"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-wrap gap-1">
          {task.tags.map(tag => (
            <span
              key={tag}
              style={{ backgroundColor: getTagColor(tag) }}
              className="text-xs px-2 py-1 rounded-full"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 text-red-500"
              >
                x
              </button>
            </span>
          ))}
        </div>
        <input
          onKeyDown={handleTagInputChange}
          className="flex-1 rounded bg-gray-200 p-1 text-sm focus:ring dark:bg-gray-700"
          placeholder={t('taskItem.tagPlaceholder')}
          list="existing-tags"
        />
        <datalist id="existing-tags">
          {allTags.map(tag => (
            <option
              key={tag.id}
              value={tag.label}
            />
          ))}
        </datalist>
      </div>
    </div>
  );
}
