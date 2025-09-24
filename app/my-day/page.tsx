'use client';
import Link from 'next/link';
import Board from '../../components/Board/Board';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { useStore } from '../../lib/store';
import { useI18n } from '../../lib/i18n';

export default function MyDayPage() {
  const { t } = useI18n();
  const tasks = useStore(state => state.tasks);
  const plannedTasks = tasks.filter(task => task.plannedFor !== null);
  const remainingTasks = plannedTasks.filter(task => task.dayStatus !== 'done');
  const progressPercent = plannedTasks.length
    ? Math.round(
        ((plannedTasks.length - remainingTasks.length) / plannedTasks.length) *
          100
      )
    : 0;
  const hasMyDayTasks = plannedTasks.length > 0;

  return (
    <main
      className={
        hasMyDayTasks
          ? undefined
          : 'flex flex-col items-center justify-center px-4 py-16 text-center'
      }
    >
      {hasMyDayTasks ? (
        <>
          <ProgressBar percent={progressPercent} />
          <Board mode="my-day" />
        </>
      ) : (
        <>
          <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
            {t('myDayPage.empty')}
          </p>
          <Link
            href="/my-tasks"
            className="rounded bg-[#57886C] px-4 py-2 text-white hover:brightness-110 focus:ring"
          >
            {t('myDayPage.goToMyTasks')}
          </Link>
        </>
      )}
    </main>
  );
}
