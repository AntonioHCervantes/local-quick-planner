'use client';
import { DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskItem from '../TaskItem/TaskItem';
import { useI18n } from '../../lib/i18n';
import useTaskList, { UseTaskListProps } from './useTaskList';
import NoTasksIllustration from './NoTasksIllustration';

interface TaskListProps extends UseTaskListProps {
  highlightedId?: string | null;
}

export default function TaskList({ tasks, highlightedId }: TaskListProps) {
  const { state, actions } = useTaskList({ tasks });
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
              highlighted={task.id === highlightedId}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex flex-col items-center">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {t('taskList.noTasks')}
              </p>
              <NoTasksIllustration className="mt-4 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
