'use client';
import { useCallback } from 'react';
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task } from '../../lib/types';
import { useStore } from '../../lib/store';

export interface UseTaskListProps {
  tasks: Task[];
}

export default function useTaskList({ tasks }: UseTaskListProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const { reorderMyTasks } = useStore();

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;
      if (active.id === over.id) return;
      const overIndex = tasks.findIndex(t => t.id === over.id);
      reorderMyTasks(active.id as string, overIndex);
    },
    [tasks, reorderMyTasks]
  );

  return { state: { sensors }, actions: { handleDragEnd } } as const;
}
