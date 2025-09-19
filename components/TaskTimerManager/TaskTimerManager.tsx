'use client';

import { useEffect } from 'react';
import { useI18n } from '../../lib/i18n';
import { useStore } from '../../lib/store';

function playSound() {
  try {
    const AudioContextConstructor =
      window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextConstructor();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'triangle';
    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const start = ctx.currentTime;
    const notes = [
      { frequency: 523.25, duration: 0.35 },
      { frequency: 659.25, duration: 0.35 },
      { frequency: 783.99, duration: 0.45 },
    ];

    let current = start;
    notes.forEach(({ frequency, duration }) => {
      oscillator.frequency.setValueAtTime(frequency, current);
      current += duration;
    });

    const fadeInEnd = start + 0.05;
    const fadeOutStart = Math.max(start, current - 0.2);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.08, fadeInEnd);
    gain.gain.setValueAtTime(0.08, fadeOutStart);
    gain.gain.linearRampToValueAtTime(0, current);

    oscillator.start(start);
    oscillator.stop(current);
    oscillator.onended = () => {
      try {
        ctx.close();
      } catch (error) {
        // ignore
      }
    };
  } catch (error) {
    // ignore
  }
}

export default function TaskTimerManager() {
  const { t } = useI18n();

  useEffect(() => {
    const interval = setInterval(() => {
      const state = useStore.getState();
      const now = Date.now();

      Object.entries(state.timers).forEach(([taskId, timer]) => {
        if (!timer.running || !timer.endsAt) {
          return;
        }

        const endsAt = new Date(timer.endsAt).getTime();
        if (Number.isNaN(endsAt)) {
          state.completeTimer(taskId);
          return;
        }

        const remaining = Math.max(0, Math.ceil((endsAt - now) / 1000));

        if (remaining <= 0) {
          state.completeTimer(taskId);
          const task = state.tasks.find(t => t.id === taskId);
          const taskTitle = task?.title?.trim()
            ? task.title
            : t('notifications.timerFinished.untitledTask');
          const description = t('timer.finished').replace('{task}', taskTitle);
          const randomId =
            typeof globalThis.crypto?.randomUUID === 'function'
              ? globalThis.crypto.randomUUID()
              : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
          state.addNotification({
            id: `timer-finished-${taskId}-${randomId}`,
            type: 'alert',
            titleKey: 'notifications.timerFinished.title',
            descriptionKey: 'notifications.timerFinished.description',
            title: t('notifications.timerFinished.title'),
            description,
            read: false,
            createdAt: new Date().toISOString(),
          });
          playSound();
        } else if (remaining !== timer.remaining) {
          state.updateTimerRemaining(taskId, remaining);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [t]);

  return null;
}
