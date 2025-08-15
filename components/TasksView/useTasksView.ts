'use client';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../../lib/store';
import { loadState } from '../../lib/storage';

export default function useTasksView() {
  const store = useStore();
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    if (store.tags.length === 0) {
      const persisted = loadState();
      persisted?.tags?.forEach(tag => store.addTag(tag));
    }
  }, [store]);

  useEffect(() => {
    setActiveTags(prev => {
      const labels = store.tags.map(t => t.label);
      const newTags = labels.filter(l => !prev.includes(l));
      return [...prev, ...newTags];
    });
  }, [store.tags]);

  const toggleTagFilter = (label: string) => {
    setActiveTags(prev =>
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    );
  };

  const resetTagFilter = () => {
    setActiveTags(store.tags.map(t => t.label));
  };

  const filteredTasks = useMemo(() => {
    return store.tasks.filter(task => {
      if (task.tags.length === 0) return true;
      return task.tags.some(tag => activeTags.includes(tag));
    });
  }, [store.tasks, activeTags]);

  return {
    state: { tasks: filteredTasks, tags: store.tags, activeTags },
    actions: {
      addTask: store.addTask,
      addTag: store.addTag,
      toggleTagFilter,
      resetTagFilter,
    },
  } as const;
}
