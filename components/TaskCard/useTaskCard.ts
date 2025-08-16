'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../lib/types';
import { useStore } from '../../lib/store';
import { useI18n } from '../../lib/i18n';

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
  const { moveTask, removeTask, tags: allTags } = useStore();
  const { t } = useI18n();

  const markInProgress = () => {
    if (task.dayStatus !== 'doing') {
      moveTask(task.id, { dayStatus: 'doing' });
    }
  };

  const markDone = () => {
    if (task.dayStatus !== 'done') {
      moveTask(task.id, { dayStatus: 'done' });
    }
  };

  const deleteTask = () => {
    removeTask(task.id);
  };

  const getTagColor = (tagLabel: string) => {
    const tag = allTags.find(t => t.label === tagLabel);
    return tag ? tag.color : '#ccc';
  };

  return {
    state: { attributes, listeners, setNodeRef, style, t, allTags },
    actions: { markInProgress, markDone, getTagColor, deleteTask },
  } as const;
}
