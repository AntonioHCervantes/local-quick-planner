'use client';
import type { ChangeEvent } from 'react';
import { Play, Pause } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useStore, DEFAULT_TIMER_DURATION } from '../../lib/store';

const options = [
  { label: '5m', value: 5 * 60 },
  { label: '15m', value: 15 * 60 },
  { label: '30m', value: 30 * 60 },
  { label: '1h', value: 60 * 60 },
];

interface TimerProps {
  taskId: string;
}

export default function Timer({ taskId }: TimerProps) {
  const timer = useStore(state => state.timers[taskId]);
  const setTimerDuration = useStore(state => state.setTimerDuration);
  const toggleTimer = useStore(state => state.toggleTimer);
  const { t } = useI18n();
  const duration = timer?.duration ?? DEFAULT_TIMER_DURATION;
  const timeLeft = timer?.remaining ?? duration;
  const running = timer?.running ?? false;

  const handleDurationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newDuration = Number(e.target.value);
    setTimerDuration(taskId, newDuration);
  };

  const toggle = () => {
    toggleTimer(taskId);
  };

  const progress = Math.min(
    100,
    Math.max(0, duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0)
  );

  return (
    <div className="mt-2 flex items-center gap-2">
      <select
        value={duration}
        onChange={handleDurationChange}
        className="rounded bg-gray-200 p-1 text-sm dark:bg-gray-700"
      >
        {options.map(o => (
          <option
            key={o.value}
            value={o.value}
          >
            {o.label}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-1">
        <button
          onClick={toggle}
          aria-label={running ? t('timer.pause') : t('timer.start')}
          title={running ? t('timer.pause') : t('timer.start')}
          className="rounded bg-blue-500 p-1 text-white hover:brightness-110 focus:ring"
        >
          {running ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>
        <span className="w-12 text-right text-xs">
          {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </span>
      </div>
      <div className="h-2 flex-1 rounded bg-gray-300 dark:bg-gray-700">
        <div
          className="h-2 rounded bg-blue-500 dark:bg-blue-400"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
