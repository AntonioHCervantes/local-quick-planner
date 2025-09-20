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
  const recurringTriggerRef = useRef<HTMLButtonElement | null>(null);
  const recurringPanelRef = useRef<HTMLDivElement | null>(null);
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
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (
        recurringPanelRef.current?.contains(target) ||
        recurringTriggerRef.current?.contains(target)
      ) {
        return;
      }

      setShowRecurringOptions(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
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
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
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
            <div className="flex flex-col items-end gap-1 md:self-start">
              <div className="flex items-start gap-2">
                <div className="relative">
                  <button
                    ref={recurringTriggerRef}
                    type="button"
                    onClick={() => setShowRecurringOptions(prev => !prev)}
                    aria-expanded={showRecurringOptions}
                    aria-controls={repeatPanelId}
                    title={repeatButtonLabel}
                    aria-label={repeatButtonLabel}
                    className="rounded bg-transparent p-1 text-black focus:ring dark:text-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  {showRecurringOptions && (
                    <div
                      ref={recurringPanelRef}
                      id={repeatPanelId}
                      className="absolute left-1/2 top-full z-30 mt-6 w-64 -translate-x-1/2 space-y-3 rounded border border-gray-300 bg-white p-3 text-xs text-gray-700 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
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
                <div className="relative flex items-center">
                  <button
                    type="button"
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
                      showMyDayHelp
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
                  {showMyDayHelp && (
                    <div
                      ref={tooltipRef}
                      className="absolute top-full left-1/2 z-30 mt-3 w-64 rounded-lg border border-white bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
                      style={{
                        transform: `translateX(calc(-50% + ${tooltipShift + BASE_TOOLTIP_OFFSET}px))`,
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
                          transform: `translateX(calc(-50% - ${tooltipShift + BASE_TOOLTIP_OFFSET}px))`,
                        }}
                      />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  aria-label={t('taskItem.deleteTask')}
                  title={t('taskItem.deleteTask')}
                  className="rounded bg-transparent p-1 text-black focus:ring dark:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {(showRecurringOptions || selectedDays.length > 0) && (
                <span className="text-[11px] font-medium text-[#57886C]">
                  {repeatButtonLabel}
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex flex-wrap items-start gap-2">
              {task.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
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
              <div className="ml-auto flex items-center">
                {isPriorityEditing ? (
                  <select
                    value={(task.priority ?? 'medium') as Priority}
                    onChange={e => {
                      updateTask(task.id, {
                        priority: e.target.value as Priority,
                      });
                      setIsPriorityEditing(false);
                    }}
                    onBlur={() => setIsPriorityEditing(false)}
                    className="rounded bg-gray-200 p-1 text-sm focus:ring dark:bg-gray-700"
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
                    className="cursor-pointer rounded bg-transparent p-1 text-sm focus:ring dark:text-white"
                  >
                    <span>
                      {priorityLabels[(task.priority ?? 'medium') as Priority]}
                    </span>
                  </button>
                )}
              </div>
            </div>
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
        </div>
      </div>
    </div>
  );
}
