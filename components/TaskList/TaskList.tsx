'use client';
import { DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskItem from '../TaskItem/TaskItem';
import { useI18n } from '../../lib/i18n';
import useTaskList, { UseTaskListProps } from './useTaskList';

export default function TaskList(props: UseTaskListProps) {
  const { tasks } = props;
  const { state, actions } = useTaskList(props);
  const { sensors } = state;
  const { handleDragEnd } = actions;
  const { t } = useI18n();
  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 p-4">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              taskId={task.id}
            />
          ))}
          {tasks.length === 0 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t('taskList.noTasks')}
            </p>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
