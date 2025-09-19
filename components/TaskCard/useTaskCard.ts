'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../lib/types';
import { useStore } from '../../lib/store';
import { useI18n } from '../../lib/i18n';
import confetti from 'canvas-confetti';
import { playApplause } from '../../lib/sounds';

export interface UseTaskCardProps {
  task: Task;
  dragOverlay?: boolean;
  mode?: 'my-day' | 'kanban';
}

export default function useTaskCard({
  task,
  dragOverlay = false,
}: UseTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      disabled: dragOverlay,
    });
  const style = dragOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
      };
  const {
    moveTask,
    removeTask,
    tags: allTags,
    mainMyDayTaskId,
    setMainMyDayTask,
  } = useStore(state => ({
    moveTask: state.moveTask,
    removeTask: state.removeTask,
    tags: state.tags,
    mainMyDayTaskId: state.mainMyDayTaskId,
    setMainMyDayTask: state.setMainMyDayTask,
  }));
  const { t } = useI18n();

  const markInProgress = () => {
    if (task.dayStatus !== 'doing') {
      moveTask(task.id, { dayStatus: 'doing' });
    }
  };

  const markDone = () => {
    if (task.dayStatus !== 'done') {
      moveTask(task.id, { dayStatus: 'done' });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (mainMyDayTaskId === task.id) {
        playApplause();
      }
    }
  };

  const deleteTask = () => {
    removeTask(task.id);
  };

  const getTagColor = (tagLabel: string) => {
    const tag = allTags.find(t => t.label === tagLabel);
    return tag ? tag.color : '#ccc';
  };

  const toggleMainTask = () => {
    if (!task.plannedFor) {
      return;
    }
    setMainMyDayTask(mainMyDayTaskId === task.id ? null : task.id);
  };

  return {
    state: {
      attributes,
      listeners,
      setNodeRef,
      style,
      t,
      allTags,
      isMainTask: mainMyDayTaskId === task.id,
    },
    actions: {
      markInProgress,
      markDone,
      getTagColor,
      deleteTask,
      toggleMainTask,
    },
  } as const;
}
