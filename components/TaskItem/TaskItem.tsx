'use client';
import {
  CalendarPlus,
  CalendarX,
  Trash2,
  GripVertical,
  Plus,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Priority, Tag, Weekday, WEEKDAYS } from '../../lib/types';
import { useI18n } from '../../lib/i18n';
import { getDayStatusIcon } from '../../lib/dayStatus';
import useTaskItem, { UseTaskItemProps } from './useTaskItem';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LinkifiedText from '../LinkifiedText/LinkifiedText';
import Link from '../Link/Link';
import { useStore } from '../../lib/store';

const BASE_TOOLTIP_OFFSET = -72;

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
    setTaskRepeat,
    toggleMyDay,
    removeTask,
    toggleTagInput,
  } = actions as any; // when task undefined, actions is empty
  const { t } = useI18n();
  const [isPriorityEditing, setIsPriorityEditing] = useState(false);
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);
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

  useEffect(() => {
    if (!showRecurringOptions) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof Element) {
        if (event.target.closest('[data-repeat-actions="true"]')) {
          return;
        }
      }

      setShowRecurringOptions(false);
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRecurringOptions]);

  const priorityLabels: Record<Priority, string> = {
    low: t('priority.low'),
    medium: t('priority.medium'),
    high: t('priority.high'),
  };

  const workSchedule = useStore(state => state.workSchedule);
  const availableWeekdays = useMemo(() => {
    if (!workSchedule) {
      return WEEKDAYS;
    }
    const active = WEEKDAYS.filter(day => (workSchedule[day] ?? []).length > 0);
    return active.length > 0 ? active : WEEKDAYS;
  }, [workSchedule]);
  const showLimitedWeekdaysHint = availableWeekdays.length < WEEKDAYS.length;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: taskId, disabled: !task });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!task) {
    return null;
  }

  const isInMyDay = Boolean(task.plannedFor);
  const dayStatus = isInMyDay ? (task.dayStatus ?? 'todo') : undefined;
  const StatusIcon = getDayStatusIcon(dayStatus);
  const statusLabel = dayStatus ? t(`board.${dayStatus}`) : null;
  const weeklyRepeat = task.repeat?.frequency === 'weekly' ? task.repeat : null;
  const selectedDays: Weekday[] = weeklyRepeat ? weeklyRepeat.days : [];
  const repeatPanelId = `task-repeat-${task.id}`;
  const repeatButtonLabel = selectedDays.length
    ? t('taskItem.recurring.buttonWithDays').replace(
        '{days}',
        selectedDays
          .map(day => t(`taskItem.recurring.weekdaysShort.${day}`))
          .join(', ')
      )
    : t('taskItem.recurring.button');
  const handleToggleRepeatDay = (day: Weekday) => {
    const nextDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    setTaskRepeat(task.id, nextDays);
  };
  const handleClearRepeat = () => {
    setTaskRepeat(task.id, []);
  };

  const repeatStatusVisible = showRecurringOptions || selectedDays.length > 0;

  const Actions = ({ showHelp }: { showHelp?: boolean }) => (
    <div
      className="relative flex w-full flex-col gap-2"
      data-repeat-actions="true"
    >
      <div className="flex items-center justify-end gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRecurringOptions(prev => !prev)}
            aria-expanded={showRecurringOptions}
            aria-controls={repeatPanelId}
            aria-label={repeatButtonLabel}
            title={repeatButtonLabel}
            className={`rounded bg-transparent p-1 text-black focus-visible:ring dark:text-white ${
              showRecurringOptions || selectedDays.length > 0
                ? 'text-[#57886C]'
                : ''
            }`}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <div className="relative flex items-center">
          <button
            onClick={() => toggleMyDay(task.id)}
            aria-label={
              task.plannedFor
                ? t('taskItem.removeMyDay')
                : t('taskItem.addMyDay')
            }
            title={
              task.plannedFor
                ? t('taskItem.removeMyDay')
                : t('taskItem.addMyDay')
            }
            className={`rounded bg-transparent p-1 text-black focus:ring dark:text-white ${
              showHelp
                ? 'animate-pulse ring-2 ring-[#57886C] ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900'
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
              className="absolute left-1/2 top-full z-30 mt-3 w-72 max-w-xs rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-2xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95 dark:text-gray-100"
              style={{
                transform: `translateX(calc(-50% + ${tooltipShift + BASE_TOOLTIP_OFFSET}px))`,
              }}
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-[2px] h-5 w-5 flex-shrink-0 text-[#57886C]" />
                <span className="flex-1 leading-relaxed">
                  {t('taskItem.myDayHelp')}
                </span>
                <button
                  type="button"
                  onClick={() => onCloseMyDayHelp?.()}
                  aria-label={t('actions.close')}
                  className="ml-2 rounded-full bg-slate-100 p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57886C] dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  ×
                </button>
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 bottom-full"
                style={{
                  transform: `translateX(calc(-50% - ${tooltipShift + BASE_TOOLTIP_OFFSET}px)) translateY(50%)`,
                }}
              >
                <span className="block h-3 w-3 rotate-45 rounded-[2px] border border-slate-200 bg-white/95 shadow-[0_2px_8px_rgba(15,23,42,0.12)] dark:border-gray-700 dark:bg-gray-900/95" />
              </span>
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
      </div>
      {repeatStatusVisible && (
        <p className="text-right text-xs font-medium text-[#57886C]">
          {repeatButtonLabel}
        </p>
      )}
      {showRecurringOptions && (
        <div
          id={repeatPanelId}
          className="absolute right-0 top-full z-30 mt-2 w-64 space-y-3 rounded border border-gray-300 bg-white p-3 text-xs text-gray-700 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        >
          <div className="space-y-1">
            <p>{t('taskItem.recurring.description')}</p>
            {showLimitedWeekdaysHint && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {t('taskItem.recurring.limitedBySchedule')}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableWeekdays.map(day => {
              const checked = selectedDays.includes(day);
              return (
                <label
                  key={day}
                  className={`flex items-center gap-2 rounded border px-2 py-1 text-[11px] font-medium ${
                    checked
                      ? 'border-[#57886C] text-[#57886C] dark:border-[#78a48c]'
                      : 'border-gray-200 text-gray-700 dark:border-gray-600 dark:text-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleRepeatDay(day)}
                    className="h-3.5 w-3.5"
                  />
                  <span>{t(`workSchedulePage.week.${day}`)}</span>
                </label>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {t('taskItem.recurring.autoAddHint')}
          </p>
          {selectedDays.length > 0 && (
            <button
              type="button"
              onClick={handleClearRepeat}
              className="text-left text-xs text-red-600 transition hover:underline focus-visible:ring focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-red-400 dark:focus-visible:ring-offset-gray-900"
            >
              {t('taskItem.recurring.remove')}
            </button>
          )}
        </div>
      )}
    </div>
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
        className={`flex flex-1 min-w-0 rounded ${
          highlighted ? 'ring-2 ring-[#57886C]' : ''
        }`}
      >
        {isInMyDay && (
          <div
            className="flex w-12 flex-none items-center justify-center rounded-l bg-blue-100 text-blue-700 dark:bg-[rgb(62,74,113)] dark:text-white md:w-14"
            title={statusLabel ?? undefined}
          >
            {StatusIcon ? (
              <>
                <StatusIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
                {statusLabel ? (
                  <span className="sr-only">{statusLabel}</span>
                ) : null}
              </>
            ) : statusLabel ? (
              <span className="sr-only">{statusLabel}</span>
            ) : null}
          </div>
        )}
        <div
          className={`flex flex-col gap-2 p-4 flex-1 min-w-0 ${
            isInMyDay ? 'rounded-r' : 'rounded'
          } ${
            highlighted
              ? 'bg-[#57886C] text-white'
              : 'bg-gray-100 dark:bg-gray-800'
          }`}
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
            <div className="hidden md:flex md:flex-col md:items-stretch md:gap-2 md:self-start">
              <Actions showHelp={showMyDayHelp} />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
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
            <div className="ml-auto">
              {isPriorityEditing ? (
                <select
                  value={task.priority ?? ''}
                  onChange={e => {
                    updateTask(task.id, {
                      priority: e.target.value as Priority,
                    });
                    setIsPriorityEditing(false);
                  }}
                  onBlur={() => setIsPriorityEditing(false)}
                  className="rounded bg-gray-200 p-1 text-xs focus-visible:ring dark:bg-gray-700"
                  autoFocus
                >
                  <option value="high">{t('priority.high')}</option>
                  <option value="medium">{t('priority.medium')}</option>
                  <option value="low">{t('priority.low')}</option>
                </select>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPriorityEditing(true)}
                  onFocus={() => setIsPriorityEditing(true)}
                  className="rounded bg-transparent px-2 py-1 text-xs font-medium text-gray-700 transition hover:underline focus-visible:ring dark:text-gray-200"
                >
                  {priorityLabels[task.priority as Priority]}
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 md:hidden">
            <Actions showHelp={showMyDayHelp} />
          </div>
        </div>
      </div>
    </div>
  );
}
