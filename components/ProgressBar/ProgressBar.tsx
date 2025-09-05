'use client';

import { useI18n } from '../../lib/i18n';

interface ProgressBarProps {
  percent: number;
}

export default function ProgressBar({ percent }: ProgressBarProps) {
  const { t } = useI18n();

  let colorClass = 'bg-green-500';
  let message = t('myDayPage.progress.done');

  if (percent > 0 && percent <= 33) {
    message = t('myDayPage.progress.low');
  } else if (percent > 33 && percent <= 66) {
    colorClass = 'bg-yellow-500';
    message = t('myDayPage.progress.medium');
  } else if (percent > 66) {
    colorClass = 'bg-red-500';
    message = t('myDayPage.progress.full');
  }

  return (
    <div className="p-4">
      <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full rounded ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-center text-sm">{message}</p>
    </div>
  );
}
