'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, KeyboardEvent, PointerEvent } from 'react';
import { toast } from 'react-hot-toast';
import { useStore } from '../../../lib/store';
import { useI18n } from '../../../lib/i18n';
import type { Weekday } from '../../../lib/types';

type DragMode = 'add' | 'remove';

const WEEK_DAYS: Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const SLOT_INDICES = Array.from({ length: 48 }, (_, index) => index);

const MINUTE_OPTIONS = [5, 15, 30, 60];

function formatSlotStart(slot: number) {
  const hours = Math.floor(slot / 2)
    .toString()
    .padStart(2, '0');
  const minutes = slot % 2 === 0 ? '00' : '30';
  return `${hours}:${minutes}`;
}

function formatSlotRange(slot: number) {
  const startHours = Math.floor(slot / 2)
    .toString()
    .padStart(2, '0');
  const startMinutes = slot % 2 === 0 ? '00' : '30';
  const endIndex = slot + 1;
  const rawEndHours = Math.floor(endIndex / 2);
  const endHours = Math.min(rawEndHours, 24).toString().padStart(2, '0');
  const endMinutes = endIndex % 2 === 0 ? '00' : '30';
  return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
}

type ToggleSwitchProps = {
  enabled: boolean;
  onToggle: () => void;
  disabled: boolean;
  label: string;
};

function ToggleSwitch({
  enabled,
  onToggle,
  disabled,
  label,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      aria-disabled={disabled}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
        enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
      } ${disabled ? 'opacity-60' : 'hover:bg-blue-500/80 dark:hover:bg-gray-600'} cursor-pointer`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
          enabled ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function WorkSchedulePage() {
  const { t } = useI18n();
  const {
    workSchedule,
    planningReminder,
    toggleWorkScheduleSlot,
    setPlanningReminderEnabled,
    setPlanningReminderMinutes,
  } = useStore(state => ({
    workSchedule: state.workSchedule,
    planningReminder: state.workPreferences.planningReminder,
    toggleWorkScheduleSlot: state.toggleWorkScheduleSlot,
    setPlanningReminderEnabled: state.setPlanningReminderEnabled,
    setPlanningReminderMinutes: state.setPlanningReminderMinutes,
  }));
  const [dragMode, setDragMode] = useState<DragMode | null>(null);

  useEffect(() => {
    const handlePointerEnd = () => setDragMode(null);
    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);
    return () => {
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
    };
  }, []);

  const selectedSlots = useMemo(() => {
    const map: Record<Weekday, Set<number>> = {
      monday: new Set(workSchedule.monday ?? []),
      tuesday: new Set(workSchedule.tuesday ?? []),
      wednesday: new Set(workSchedule.wednesday ?? []),
      thursday: new Set(workSchedule.thursday ?? []),
      friday: new Set(workSchedule.friday ?? []),
      saturday: new Set(workSchedule.saturday ?? []),
      sunday: new Set(workSchedule.sunday ?? []),
    };
    return map;
  }, [workSchedule]);

  const hasSchedule = useMemo(
    () => WEEK_DAYS.some(day => (workSchedule[day]?.length ?? 0) > 0),
    [workSchedule]
  );

  const handlePointerDown =
    (day: Weekday, slot: number) =>
    (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const applied = toggleWorkScheduleSlot(day, slot);
      setDragMode(applied);
    };

  const handlePointerEnter =
    (day: Weekday, slot: number) =>
    (event: PointerEvent<HTMLButtonElement>) => {
      if (!dragMode) return;
      event.preventDefault();
      toggleWorkScheduleSlot(day, slot, dragMode);
    };

  const handleKeyDown =
    (day: Weekday, slot: number) =>
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleWorkScheduleSlot(day, slot);
      }
    };

  const handleReminderToggle = () => {
    if (!hasSchedule && !planningReminder.enabled) {
      toast.error(
        t('workSchedulePage.actions.planningReminder.fillScheduleFirst')
      );
      return;
    }
    setPlanningReminderEnabled(!planningReminder.enabled);
  };

  const handleMinutesChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const minutes = Number.parseInt(event.target.value, 10);
    if (Number.isNaN(minutes)) {
      return;
    }
    setPlanningReminderMinutes(minutes);
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">{t('workSchedulePage.title')}</h1>
      <p>{t('workSchedulePage.intro')}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {t('workSchedulePage.helper')}
      </p>
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">
            {t('workSchedulePage.calendar.title')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('workSchedulePage.calendar.instructions')}
          </p>
        </div>
        <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="sticky left-0 top-0 z-10 border border-gray-200 px-2 py-2 text-left font-semibold dark:border-gray-700 dark:bg-gray-800">
                  {t('workSchedulePage.calendar.timeLabel')}
                </th>
                {WEEK_DAYS.map(day => (
                  <th
                    key={day}
                    className="min-w-[120px] border border-gray-200 px-2 py-2 text-left font-semibold capitalize dark:border-gray-700"
                  >
                    {t(`workSchedulePage.week.${day}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOT_INDICES.map(slot => (
                <tr key={slot}>
                  <th className="sticky left-0 border border-gray-200 bg-gray-50 px-2 py-2 text-left font-normal dark:border-gray-700 dark:bg-gray-800">
                    {formatSlotStart(slot)}
                  </th>
                  {WEEK_DAYS.map(day => {
                    const isSelected = selectedSlots[day].has(slot);
                    const rangeLabel = `${t(
                      `workSchedulePage.week.${day}`
                    )} ${formatSlotRange(slot)}`;
                    return (
                      <td
                        key={`${day}-${slot}`}
                        className="border border-gray-200 p-0 dark:border-gray-700"
                      >
                        <button
                          type="button"
                          aria-label={rangeLabel}
                          aria-pressed={isSelected}
                          onPointerDown={handlePointerDown(day, slot)}
                          onPointerEnter={handlePointerEnter(day, slot)}
                          onKeyDown={handleKeyDown(day, slot)}
                          className={`flex h-8 w-full items-center justify-center text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-white hover:bg-blue-50 dark:bg-gray-900 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span className="sr-only">{rangeLabel}</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          {t('workSchedulePage.actions.title')}
        </h2>
        <div className="flex flex-col gap-4 rounded border border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold">
              {t('workSchedulePage.actions.planningReminder.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('workSchedulePage.actions.planningReminder.description')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('workSchedulePage.actions.planningReminder.selectHelper')}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="planning-reminder-minutes"
                className="text-sm font-medium"
              >
                {t('workSchedulePage.actions.planningReminder.selectLabel')}
              </label>
              <select
                id="planning-reminder-minutes"
                value={planningReminder.minutesBefore}
                onChange={handleMinutesChange}
                disabled={!hasSchedule}
                className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {MINUTE_OPTIONS.map(option => (
                  <option
                    key={option}
                    value={option}
                  >
                    {t(
                      `workSchedulePage.actions.planningReminder.minutes.${option}`
                    )}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {t('workSchedulePage.actions.planningReminder.selectSuffix')}
              </span>
            </div>
            <ToggleSwitch
              enabled={planningReminder.enabled}
              onToggle={handleReminderToggle}
              disabled={!hasSchedule}
              label={t('workSchedulePage.actions.planningReminder.switchLabel')}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
