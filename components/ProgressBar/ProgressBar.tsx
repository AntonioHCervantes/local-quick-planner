'use client';

import { useI18n } from '../../lib/i18n';

interface ProgressBarProps {
  percent: number;
  onClearCompleted?: () => void;
  clearCompletedLabel?: string;
}

export default function ProgressBar({
  percent,
  onClearCompleted,
  clearCompletedLabel,
}: ProgressBarProps) {
  const { t } = useI18n();

  let colorClass = 'bg-red-500';
  let message = t('myDayPage.progress.full');
  const showClearAction =
    percent >= 100 && onClearCompleted && clearCompletedLabel;

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
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>{message}</span>
        {showClearAction ? (
          <button
            type="button"
            onClick={onClearCompleted}
            className="rounded px-1 font-medium text-[#57886C] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57886C]"
          >
            {clearCompletedLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
