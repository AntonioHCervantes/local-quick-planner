'use client';
import TaskItem from './TaskItem';
import { Task } from '../lib/types';
import { useI18n } from '../lib/i18n';

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const sorted = [...tasks].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const { t } = useI18n();
  return (
    <div className="space-y-2 p-4">
      {sorted.map(task => (
        <TaskItem
          key={task.id}
          taskId={task.id}
        />
      ))}
      {sorted.length === 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t('taskList.noTasks')}
        </p>
      )}
    </div>
  );
}
