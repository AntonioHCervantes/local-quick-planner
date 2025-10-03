'use client';

import { useEffect } from 'react';
import { useStore } from '../../lib/store';
import type { Weekday } from '../../lib/types';
import { playReminderSound } from '../../lib/sounds';

const DAY_FROM_INDEX: Record<number, Weekday> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

function getDayKey(date: Date): Weekday {
  return DAY_FROM_INDEX[date.getDay()];
}

const SLOT_DURATION_MINUTES = 30;

function getSlotStartTimestamp(baseDate: Date, slot: number): number {
  const start = new Date(baseDate);
  const hours = Math.floor(slot / 2);
  const minutes = slot % 2 === 0 ? 0 : SLOT_DURATION_MINUTES;
  start.setHours(hours, minutes, 0, 0);
  return start.getTime();
}

function getSlotEndTimestamp(baseDate: Date, slot: number): number {
  return (
    getSlotStartTimestamp(baseDate, slot) + SLOT_DURATION_MINUTES * 60 * 1000
  );
}

function coerceReminderMinutes(input: number): number | null {
  const parsed = Number(input);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  const floored = Math.floor(parsed);
  if (floored <= 0) {
    return null;
  }

  return floored;
}

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getReminderWindow(
  baseDate: Date,
  slots: number[],
  minutesBefore: number
): { reminderAt: number; endAt: number } | null {
  if (!slots || slots.length === 0) {
    return null;
  }

  const safeMinutes = coerceReminderMinutes(minutesBefore);
  if (!safeMinutes) {
    return null;
  }

  const sortedSlots = Array.from(new Set(slots)).sort((a, b) => a - b);
  const lastSlot = sortedSlots[sortedSlots.length - 1];

  if (typeof lastSlot !== 'number' || Number.isNaN(lastSlot)) {
    return null;
  }

  const endAt = getSlotEndTimestamp(baseDate, lastSlot);
  const reminderAt = endAt - safeMinutes * 60 * 1000;

  return { reminderAt, endAt };
}

function findNextReminderWindow(
  fromDate: Date,
  schedule: Record<Weekday, number[]>,
  minutesBefore: number
): { reminderAt: number; endAt: number } | null {
  for (let offset = 1; offset <= 7; offset += 1) {
    const candidate = new Date(fromDate);
    candidate.setDate(candidate.getDate() + offset);
    const dayKey = getDayKey(candidate);
    const slots = schedule[dayKey];
    if (!slots || slots.length === 0) {
      continue;
    }

    const window = getReminderWindow(candidate, slots, minutesBefore);
    if (!window) {
      continue;
    }

    if (window.reminderAt > fromDate.getTime()) {
      return window;
    }
  }

  return null;
}

export default function WorkScheduleManager() {
  useEffect(() => {
    const SUGGESTION_NOTIFICATION_ID = 'work-schedule-suggestion';

    const hasWorkSchedule = (schedule: Record<Weekday, number[]>): boolean => {
      return Object.values(schedule ?? {}).some(
        slots => Array.isArray(slots) && slots.length > 0
      );
    };

    const ensureSuggestionVisibility = () => {
      const state = useStore.getState();
      const shouldSuggest =
        state.tasks.length >= 3 && !hasWorkSchedule(state.workSchedule);
      const existing = state.notifications.find(
        notification => notification.id === SUGGESTION_NOTIFICATION_ID
      );

      if (shouldSuggest) {
        if (!existing) {
          state.addNotification({
            id: SUGGESTION_NOTIFICATION_ID,
            type: 'tip',
            titleKey: 'notifications.workScheduleSuggestion.title',
            descriptionKey: 'notifications.workScheduleSuggestion.description',
            actionUrl: '/settings/work-schedule',
            actionLabelKey: 'notifications.workScheduleSuggestion.cta',
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
        return;
      }

      if (existing) {
        state.removeNotification(SUGGESTION_NOTIFICATION_ID);
      }
    };

    ensureSuggestionVisibility();

    const unsubscribe = useStore.subscribe((state, previousState) => {
      const tasksChanged = state.tasks !== previousState.tasks;
      const scheduleChanged = state.workSchedule !== previousState.workSchedule;

      if (tasksChanged || scheduleChanged) {
        ensureSuggestionVisibility();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let destroyed = false;

    const scheduleCheck = (delay: number) => {
      if (destroyed) {
        return;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const normalizedDelay = Number.isFinite(delay) ? Math.floor(delay) : 0;
      const safeDelay = Math.min(
        2_147_483_647,
        Math.max(1000, normalizedDelay)
      );
      timeoutId = setTimeout(runCheck, safeDelay);
    };

    const runCheck = () => {
      if (destroyed) {
        return;
      }

      const state = useStore.getState();
      const reminder = state.workPreferences.planningReminder;
      if (!reminder.enabled) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        return;
      }

      const now = new Date();
      const nowTimestamp = now.getTime();
      const dayKey = getDayKey(now);
      const slots = state.workSchedule[dayKey];
      const window = slots
        ? getReminderWindow(now, slots, reminder.minutesBefore)
        : null;

      if (window) {
        const { reminderAt, endAt } = window;

        if (nowTimestamp >= reminderAt && nowTimestamp < endAt) {
          const todayKey = getLocalDateKey(now);
          if (reminder.lastNotifiedDate !== todayKey) {
            state.setPlanningReminderLastNotified(todayKey);
            playReminderSound();
            const randomId =
              typeof globalThis.crypto?.randomUUID === 'function'
                ? globalThis.crypto.randomUUID()
                : `${Date.now().toString(36)}`;
            state.addNotification({
              id: `work-reminder-${todayKey}-${randomId}`,
              type: 'tip',
              titleKey: 'notifications.workReminder.title',
              descriptionKey: 'notifications.workReminder.description',
              read: false,
              createdAt: new Date().toISOString(),
            });
          }

          scheduleCheck(Math.max(1000, endAt - nowTimestamp));
          return;
        }

        if (nowTimestamp < reminderAt) {
          scheduleCheck(reminderAt - nowTimestamp);
          return;
        }
      }

      const nextWindow = findNextReminderWindow(
        now,
        state.workSchedule,
        reminder.minutesBefore
      );

      if (nextWindow) {
        scheduleCheck(nextWindow.reminderAt - nowTimestamp);
      } else {
        scheduleCheck(6 * 60 * 60 * 1000);
      }
    };

    runCheck();

    const unsubscribe = useStore.subscribe((state, previousState) => {
      const planningChanged =
        state.workPreferences.planningReminder !==
        previousState.workPreferences.planningReminder;
      const scheduleChanged = state.workSchedule !== previousState.workSchedule;

      if (planningChanged || scheduleChanged) {
        runCheck();
      }
    });

    return () => {
      destroyed = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      unsubscribe();
    };
  }, []);

  return null;
}
