'use client';
import {
  CalendarPlus,
  CalendarX,
  Trash2,
  GripVertical,
  Plus,
} from 'lucide-react';
import { Priority, Tag } from '../../lib/types';
import { useI18n } from '../../lib/i18n';
import useTaskItem, { UseTaskItemProps } from './useTaskItem';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskItemProps extends UseTaskItemProps {
  highlighted?: boolean;
}

export default function TaskItem({ taskId, highlighted }: TaskItemProps) {
  const { state, actions } = useTaskItem({ taskId });
  const { task, isEditing, title, allTags, showTagInput } = state as any;
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
    toggleTagInput,
  } = actions as any; // when task undefined, actions is empty
  const { t } = useI18n();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: taskId, disabled: !task });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!task) {
    return null;
  }

  const Actions = () => (
    <>
      <select
        value={task.priority ?? ''}
        onChange={e =>
          updateTask(task.id, {
            priority: e.target.value as Priority,
          })
        }
        className="rounded bg-gray-200 p-1 text-sm focus:ring dark:bg-gray-700 flex-1 md:flex-none"
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
        title={
          task.plannedFor ? t('taskItem.removeMyDay') : t('taskItem.addMyDay')
        }
        className="rounded bg-transparent p-1 text-black focus:ring dark:text-white"
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
        title={t('taskItem.deleteTask')}
        className="rounded bg-transparent p-1 text-black focus:ring dark:text-white"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center pr-2 cursor-grab"
      >
        <GripVertical className="h-4 w-4 text-gray-500" />
      </div>
      <div
        className={`flex flex-col gap-2 rounded p-2 flex-1 ${
          task.plannedFor
            ? 'bg-blue-100 dark:bg-[rgb(62,74,113)]'
            : 'bg-gray-100 dark:bg-gray-800'
        } ${highlighted ? 'ring-2 ring-[#57886C] bg-[#57886C] text-white' : ''}`}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          {isEditing ? (
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={handleTitleKeyDown}
              className="w-full md:flex-1 rounded bg-gray-200 p-1 text-sm focus:ring dark:bg-gray-700"
              autoFocus
            />
          ) : (
            <p
              className="w-full md:flex-1"
              onClick={startEditing}
            >
              {task.title}
            </p>
          )}
          <div className="hidden md:flex items-center gap-2">
            <Actions />
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-1 items-center">
            {task.tags.map((tag: string) => (
              <span
                key={tag}
                style={{ backgroundColor: getTagColor(tag) }}
                className="flex items-center rounded-full pl-2 pr-1 py-1 text-xs"
              >
                <span className="mr-1 select-none">{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  aria-label={t('actions.removeTag')}
                  title={t('actions.removeTag')}
                  className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/20"
                >
                  ×
                </button>
              </span>
            ))}
            {task.tags.length > 0 && (
              <button
                onClick={toggleTagInput}
                aria-label={t('actions.addTag')}
                title={t('actions.addTag')}
                className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/20 text-black dark:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
          {(showTagInput || task.tags.length === 0) && (
            <>
              <input
                onKeyDown={handleTagInputChange}
                className="w-full md:w-[200px] rounded bg-gray-200 p-1 text-sm focus:ring dark:bg-gray-700"
                placeholder={t('taskItem.tagPlaceholder')}
                list="existing-tags"
                autoFocus={task.tags.length > 0}
              />
              <datalist id="existing-tags">
                {allTags.map((tag: Tag) => (
                  <option
                    key={tag.id}
                    value={tag.label}
                  />
                ))}
              </datalist>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <Actions />
        </div>
      </div>
    </div>
  );
}
