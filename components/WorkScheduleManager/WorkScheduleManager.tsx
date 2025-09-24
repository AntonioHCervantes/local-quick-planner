'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useI18n } from '../../lib/i18n';
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

export default function WorkScheduleManager() {
  const { t } = useI18n();

  useEffect(() => {
    const interval = setInterval(() => {
      const state = useStore.getState();
      const reminder = state.workPreferences.planningReminder;
      if (!reminder.enabled) {
        return;
      }

      const today = new Date();
      const dayKey = getDayKey(today);
      const slots = state.workSchedule[dayKey];
      if (!slots || slots.length === 0) {
        return;
      }

      const window = getReminderWindow(today, slots, reminder.minutesBefore);
      if (!window) {
        return;
      }

      const { reminderAt, endAt } = window;
      const now = Date.now();

      if (now >= reminderAt && now < endAt) {
        const todayKey = today.toISOString().slice(0, 10);
        if (reminder.lastNotifiedDate === todayKey) {
          return;
        }

        state.setPlanningReminderLastNotified(todayKey);
        toast(t('workSchedulePage.reminder.toast'), { duration: 8000 });
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
    }, 30000);

    return () => clearInterval(interval);
  }, [t]);

  return null;
}
