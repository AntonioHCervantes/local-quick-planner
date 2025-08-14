'use client';
import TaskItem from '../TaskItem';
import { useI18n } from '../../lib/i18n';
import useTaskList, { UseTaskListProps } from './useTaskList';

export default function TaskList(props: UseTaskListProps) {
  const { state } = useTaskList(props);
  const { sorted } = state;
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
