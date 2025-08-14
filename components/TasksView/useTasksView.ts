'use client';
import { useStore } from '../../lib/store';

export default function useTasksView() {
  const store = useStore();
  return {
    state: { tasks: store.tasks, tags: store.tags },
    actions: { addTask: store.addTask, addTag: store.addTag },
  } as const;
}
