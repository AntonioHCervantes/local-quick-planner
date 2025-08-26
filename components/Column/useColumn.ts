'use client';
import { useDroppable } from '@dnd-kit/core';

export interface UseColumnProps {
  id: string;
  mode: 'my-day' | 'kanban';
}

export default function useColumn({ id, mode }: UseColumnProps) {
  const { setNodeRef } = useDroppable({ id });
  const containerClasses =
    mode === 'my-day'
      ? 'flex-1 flex-shrink-0 min-w-[18rem] snap-start'
      : 'w-80 flex-shrink-0';
  const listClasses =
    mode === 'my-day' ? 'space-y-4 min-h-4' : 'space-y-2 min-h-4';

  return {
    state: { containerClasses, listClasses },
    actions: { setNodeRef },
  } as const;
}
