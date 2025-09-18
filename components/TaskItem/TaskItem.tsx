'use client';
import {
  CalendarPlus,
  CalendarX,
  Trash2,
  GripVertical,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Priority, Tag } from '../../lib/types';
import { useI18n } from '../../lib/i18n';
import useTaskItem, { UseTaskItemProps } from './useTaskItem';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LinkifiedText from '../LinkifiedText/LinkifiedText';
import Link from '../Link/Link';

interface TaskItemProps extends UseTaskItemProps {
  highlighted?: boolean;
  showMyDayHelp?: boolean;
  onCloseMyDayHelp?: () => void;
}

export default function TaskItem({
  taskId,
  highlighted,
  showMyDayHelp = false,
  onCloseMyDayHelp,
}: TaskItemProps) {
  const { state, actions } = useTaskItem({ taskId });
  const { task, isEditing, title, allTags, showTagInput } = state as any;
  const {
    setTitle,
    handleTagInputChange,
    handleExistingTagSelect,
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
  const [isPriorityEditing, setIsPriorityEditing] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipShift, setTooltipShift] = useState(0);

  useEffect(() => {
    if (!showMyDayHelp) {
      setTooltipShift(0);
      return;
    }

    const adjustTooltipPosition = () => {
      const element = tooltipRef.current;
      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const padding = 12;
      let shift = 0;

      if (rect.left < padding) {
        shift = padding - rect.left;
      } else if (rect.right > window.innerWidth - padding) {
        shift = -(rect.right - (window.innerWidth - padding));
      }

      setTooltipShift(shift);
    };

    const frame = window.requestAnimationFrame(adjustTooltipPosition);
    window.addEventListener('resize', adjustTooltipPosition);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', adjustTooltipPosition);
    };
  }, [showMyDayHelp]);

  const priorityLabels: Record<Priority, string> = {
    low: t('priority.low'),
    medium: t('priority.medium'),
    high: t('priority.high'),
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: taskId, disabled: !task });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!task) {
    return null;
  }

  const Actions = ({ showHelp }: { showHelp?: boolean }) => (
    <>
      {isPriorityEditing ? (
        <select
          value={task.priority ?? ''}
          onChange={e => {
            updateTask(task.id, { priority: e.target.value as Priority });
            setIsPriorityEditing(false);
          }}
          onBlur={() => setIsPriorityEditing(false)}
          className="rounded bg-gray-200 p-1 text-sm focus:ring dark:bg-gray-700 flex-1 md:flex-none"
          autoFocus
        >
          <option value="low">{t('priority.low')}</option>
          <option value="medium">{t('priority.medium')}</option>
          <option value="high">{t('priority.high')}</option>
        </select>
      ) : (
        <button
          type="button"
          onClick={() => setIsPriorityEditing(true)}
          onFocus={() => setIsPriorityEditing(true)}
          className="flex items-center rounded bg-transparent p-1 text-sm focus:ring dark:text-white cursor-pointer flex-1 md:flex-none"
        >
          <span>{priorityLabels[task.priority as Priority]}</span>
        </button>
      )}
      <div className="relative flex items-center">
        <button
          onClick={() => toggleMyDay(task.id)}
          aria-label={
            task.plannedFor ? t('taskItem.removeMyDay') : t('taskItem.addMyDay')
          }
          title={
            task.plannedFor ? t('taskItem.removeMyDay') : t('taskItem.addMyDay')
          }
          className={`rounded bg-transparent p-1 text-black focus:ring dark:text-white ${
            showHelp
              ? 'ring-2 ring-[#57886C] ring-offset-2 ring-offset-gray-100 animate-pulse dark:ring-offset-gray-900'
              : ''
          }`}
        >
          {task.plannedFor ? (
            <CalendarX className="h-4 w-4" />
          ) : (
            <CalendarPlus className="h-4 w-4" />
          )}
        </button>
        {showHelp && (
          <div
            ref={tooltipRef}
            className="absolute top-full left-1/2 z-30 mt-3 w-64 rounded-lg border border-white bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
            style={{
              transform: `translateX(calc(-50% + ${tooltipShift}px))`,
            }}
          >
            <div className="flex items-start gap-2">
              <HelpCircle className="mt-[2px] h-4 w-4 flex-shrink-0" />
              <span className="flex-1 leading-snug">
                {t('taskItem.myDayHelp')}
              </span>
              <button
                type="button"
                onClick={() => onCloseMyDayHelp?.()}
                aria-label={t('actions.close')}
                className="ml-2 text-white transition hover:opacity-80"
              >
                ×
              </button>
            </div>
            <span
              aria-hidden="true"
              className="absolute left-1/2 bottom-full border-[6px] border-transparent border-b-gray-900"
              style={{
                transform: `translateX(calc(-50% - ${tooltipShift}px))`,
              }}
            />
          </div>
        )}
      </div>
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
      className="flex w-full"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center pr-2 cursor-grab"
        style={{ touchAction: 'none' }}
      >
        <GripVertical className="h-4 w-4 text-gray-500" />
      </div>
      <div
        className={`flex flex-col gap-2 rounded p-2 flex-1 min-w-0 bg-gray-100 dark:bg-gray-800 ${
          task.plannedFor
            ? 'pl-4 md:pl-5 border-l-[8px] md:border-l-[16px] border-blue-100 dark:border-[rgb(62,74,113)]'
            : ''
        } ${highlighted ? 'ring-2 ring-[#57886C] bg-[#57886C] text-white' : ''}`}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
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
              className="w-full md:flex-1 min-w-0"
              onClick={startEditing}
            >
              <LinkifiedText text={task.title} />
            </p>
          )}
          <div className="hidden md:flex items-center gap-2 md:self-start">
            <Actions showHelp={showMyDayHelp} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              {task.tags.map((tag: string) => (
                <span
                  key={tag}
                  style={{ backgroundColor: getTagColor(tag) }}
                  className="flex items-center rounded-full pl-2 pr-1 py-1 text-xs text-white"
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
              <button
                onClick={toggleTagInput}
                aria-label={t('actions.addTag')}
                title={t('actions.addTag')}
                className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/20 text-black dark:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
          {showTagInput && (
            <>
              <input
                onKeyDown={handleTagInputChange}
                onChange={handleExistingTagSelect}
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
          {!showTagInput && task.tags.length === 0 && (
            <Link
              onClick={toggleTagInput}
              aria-label={t('actions.addTag')}
              title={t('actions.addTag')}
              icon={Plus}
              className="text-xs text-white"
            >
              {t('actions.addTag')}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <Actions showHelp={showMyDayHelp} />
        </div>
      </div>
    </div>
  );
}
