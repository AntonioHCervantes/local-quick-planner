'use client';

import { useI18n } from '../../lib/i18n';

interface ProgressBarProps {
  percent: number;
}

export default function ProgressBar({ percent }: ProgressBarProps) {
  const { t } = useI18n();

  let colorClass = 'bg-red-500';
  let message = t('myDayPage.progress.full');

  if (percent >= 100) {
    colorClass = 'bg-green-500';
    message = t('myDayPage.progress.done');
  } else if (percent >= 67) {
    colorClass = 'bg-green-500';
    message = t('myDayPage.progress.low');
  } else if (percent >= 33) {
    colorClass = 'bg-yellow-500';
    message = t('myDayPage.progress.medium');
  }

  return (
    <div className="p-4">
      <div className="h-[3px] w-full rounded bg-gray-200 opacity-30 dark:bg-gray-700">
        <div
          className={`h-full rounded ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        {message}
      </p>
    </div>
  );
}
