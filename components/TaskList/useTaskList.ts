'use client';
import { useMemo } from 'react';
import { Task } from '../../lib/types';

export interface UseTaskListProps {
  tasks: Task[];
}

export default function useTaskList({ tasks }: UseTaskListProps) {
  const sorted = useMemo(
    () =>
      [...tasks].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [tasks]
  );

  return {
    state: { sorted },
    actions: {},
  } as const;
}
