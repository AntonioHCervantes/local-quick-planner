'use client';
import { useMemo } from 'react';
import { Task } from '../../lib/types';

export interface UseTaskListProps {
  tasks: Task[];
}

export default function useTaskList({ tasks }: UseTaskListProps) {
  const sorted = useMemo(() => {
    const priorityOrder: Record<Task['priority'], number> = {
      low: 0,
      medium: 1,
      high: 2,
    };
    return [...tasks].sort((a, b) => {
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [tasks]);

  return {
    state: { sorted },
    actions: {},
  } as const;
}
