'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [myDayHelpTaskId, setMyDayHelpTaskId] = useState<string | null>(null);
  const [showMyDayHelp, setShowMyDayHelp] = useState(false);
  const showHelpDelayRef = useRef<number | null>(null);
  const previousLengthRef = useRef(tasks.length);
  const hasShownHelpRef = useRef(false);
  const hideMyDayHelp = useCallback(() => {
    if (showHelpDelayRef.current !== null) {
      window.clearTimeout(showHelpDelayRef.current);
      showHelpDelayRef.current = null;
    }
    setShowMyDayHelp(false);
    setMyDayHelpTaskId(null);
  }, []);

  useEffect(() => {
    const previousLength = previousLengthRef.current;
    if (
      !hasShownHelpRef.current &&
      tasks.length === 1 &&
      previousLength === 0
    ) {
      const [firstTask] = tasks;
      if (firstTask) {
        let shouldShowHelp = true;

        if (typeof window !== 'undefined') {
          try {
            const hasSeenTooltip = window.localStorage.getItem('myDayHelpSeen');
            if (hasSeenTooltip) {
              shouldShowHelp = false;
            } else {
              window.localStorage.setItem('myDayHelpSeen', 'true');
            }
          } catch {
            // Ignore storage access issues
          }
        }

        if (shouldShowHelp) {
          setMyDayHelpTaskId(firstTask.id);
          if (showHelpDelayRef.current !== null) {
            window.clearTimeout(showHelpDelayRef.current);
          }
          showHelpDelayRef.current = window.setTimeout(() => {
            setShowMyDayHelp(true);
            showHelpDelayRef.current = null;
          }, 3000);
        }

        hasShownHelpRef.current = true;
      }
    }

    if (tasks.length === 0) {
      hideMyDayHelp();
    }

    previousLengthRef.current = tasks.length;
  }, [tasks, hideMyDayHelp]);

  useEffect(() => {
    return () => {
      if (showHelpDelayRef.current !== null) {
        window.clearTimeout(showHelpDelayRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showMyDayHelp) {
      return;
    }

    const timeout = window.setTimeout(() => {
      hideMyDayHelp();
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [showMyDayHelp, hideMyDayHelp]);

  useEffect(() => {
    if (!showMyDayHelp || !myDayHelpTaskId) {
      return;
    }

    if (!tasks.some(task => task.id === myDayHelpTaskId)) {
      hideMyDayHelp();
    }
  }, [tasks, showMyDayHelp, myDayHelpTaskId, hideMyDayHelp]);

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
              showMyDayHelp={showMyDayHelp && task.id === myDayHelpTaskId}
              onCloseMyDayHelp={hideMyDayHelp}
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
