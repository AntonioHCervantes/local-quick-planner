'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
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
          toast.success(
            t('timer.finished').replace('{task}', task?.title ?? ''),
            {
              duration: 10000,
            }
          );
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
