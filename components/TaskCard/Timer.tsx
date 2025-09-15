'use client';
import { useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useI18n } from '../../lib/i18n';

const options = [
  { label: '5m', value: 5 * 60 },
  { label: '15m', value: 15 * 60 },
  { label: '30m', value: 30 * 60 },
  { label: '1h', value: 60 * 60 },
];

interface TimerProps {
  taskTitle: string;
}

export default function Timer({ taskTitle }: TimerProps) {
  const [duration, setDuration] = useState(options[0].value);
  const [timeLeft, setTimeLeft] = useState(options[0].value);
  const [running, setRunning] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (running && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (running && timeLeft === 0) {
      setRunning(false);
      toast(t('timer.finished').replace('{task}', taskTitle));
      playSound();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running, timeLeft, taskTitle, t]);

  const playSound = () => {
    try {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // ignore
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDuration = Number(e.target.value);
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setRunning(false);
  };

  const toggle = () => {
    if (timeLeft === 0) setTimeLeft(duration);
    setRunning(r => !r);
  };

  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;

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
