'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useI18n } from '../../lib/i18n';
import { useStore } from '../../lib/store';
import type { Weekday } from '../../lib/types';

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

function getSlotEndTimestamp(baseDate: Date, slot: number): number {
  const end = new Date(baseDate);
  const endIndex = slot + 1;
  const hours = Math.floor(endIndex / 2);
  const minutes = endIndex % 2 === 0 ? 0 : 30;
  end.setHours(hours, minutes, 0, 0);
  return end.getTime();
}

function getReminderTimestamp(
  baseDate: Date,
  slot: number,
  minutesBefore: number
) {
  return getSlotEndTimestamp(baseDate, slot) - minutesBefore * 60 * 1000;
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

      const sortedSlots = [...slots].sort((a, b) => a - b);
      const lastSlot = sortedSlots[sortedSlots.length - 1];
      const reminderAt = getReminderTimestamp(
        today,
        lastSlot,
        reminder.minutesBefore
      );
      const endAt = getSlotEndTimestamp(today, lastSlot);
      const now = Date.now();

      if (now >= reminderAt && now < endAt) {
        const todayKey = today.toISOString().slice(0, 10);
        if (reminder.lastNotifiedDate === todayKey) {
          return;
        }

        state.setPlanningReminderLastNotified(todayKey);
        toast(t('workSchedulePage.reminder.toast'), { duration: 8000 });
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
