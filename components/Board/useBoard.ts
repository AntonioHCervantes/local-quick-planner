'use client';
import { useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { Task } from '../../lib/types';
import type { DayStatus } from '../../lib/dayStatus';
import { useStore } from '../../lib/store';
import { useI18n } from '../../lib/i18n';
import { playApplause } from '../../lib/sounds';
export interface UseBoardProps {
  mode: 'my-day' | 'kanban';
}

export default function useBoard({ mode }: UseBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const { tasks, lists, order, moveTask, reorderTask, mainMyDayTaskId } =
    useStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { t } = useI18n();
  const dragOriginRef = useRef<{ dayStatus?: DayStatus } | null>(null);

  const columns: Array<{ id: string; title: string; status?: DayStatus }> =
    mode === 'my-day'
      ? [
          { id: 'todo', title: t('board.todo'), status: 'todo' },
          { id: 'doing', title: t('board.doing'), status: 'doing' },
          { id: 'done', title: t('board.done'), status: 'done' },
        ]
      : [...lists]
          .sort((a, b) => a.order - b.order)
          .map(l => {
            const title = t(`lists.${l.id}`);
            return {
              id: l.id,
              title: title.startsWith('lists.') ? l.title : title,
            };
          });

  function getTasks(columnId: string): Task[] {
    const key = mode === 'my-day' ? `day-${columnId}` : `list-${columnId}`;
    const ids = order[key] || [];
    return ids
      .map(id => tasks.find(t => t.id === id))
      .filter((t): t is Task => !!t)
      .filter(t => (mode === 'my-day' ? t.plannedFor !== null : true));
  }

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    const task = tasks.find(t => t.id === id) || null;
    setActiveTask(task);
    dragOriginRef.current =
      mode === 'my-day'
        ? {
            dayStatus: task?.dayStatus,
          }
        : null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const activeContainer = active.data.current?.sortable.containerId as string;
    const overContainer =
      (over.data.current?.sortable?.containerId as string) ||
      (over.id as string);
    const overIndex =
      over.data.current?.sortable?.index ?? getTasks(overContainer).length;

    if (activeContainer !== overContainer) {
      if (mode === 'my-day') {
        moveTask(activeId, { dayStatus: overContainer as any });
      } else {
        moveTask(activeId, { listId: overContainer });
      }
    }
    reorderTask(activeId, overContainer, overIndex, mode);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    const origin = dragOriginRef.current;
    dragOriginRef.current = null;
    if (!over) return;
    const activeId = active.id as string;
    const activeContainer = active.data.current?.sortable.containerId as string;
    const overContainer =
      (over.data.current?.sortable?.containerId as string) ||
      (over.id as string);
    const overIndex =
      over.data.current?.sortable?.index ?? getTasks(overContainer).length;
    const startedInDone =
      mode === 'my-day'
        ? origin?.dayStatus === 'done'
        : activeContainer === 'done';

    if (overContainer === 'done' && startedInDone) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    if (mode === 'my-day' && overContainer === 'done' && !startedInDone) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (mainMyDayTaskId === activeId) {
        playApplause();
      }
    }

    reorderTask(activeId, overContainer, overIndex, mode);
  };

  return {
    state: { sensors, activeTask, columns },
    actions: { getTasks, handleDragStart, handleDragOver, handleDragEnd },
    helpers: { closestCorners },
  } as const;
}
