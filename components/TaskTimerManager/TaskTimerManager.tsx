'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useI18n } from '../../lib/i18n';
import { useStore } from '../../lib/store';

function playSound() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
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
          toast(t('timer.finished').replace('{task}', task?.title ?? ''));
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
