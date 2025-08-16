'use client';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../../lib/store';
import { loadState } from '../../lib/storage';
import { Priority } from '../../lib/types';

export default function useTasksView() {
  const store = useStore();
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [tagToRemove, setTagToRemove] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    if (store.tags.length === 0) {
      const persisted = loadState();
      persisted?.tags?.forEach(tag => store.addTag(tag));
    }
  }, [store]);

  useEffect(() => {
    setActiveTags(prev => {
      const labels = store.tags.map(t => t.label);
      const existing = prev.filter(l => labels.includes(l));
      const newTags = labels.filter(l => !prev.includes(l));
      return [...existing, ...newTags];
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

  const removeTag = (label: string) => {
    const isUsed = store.tasks.some(task => task.tags.includes(label));
    if (isUsed) {
      setTagToRemove(label);
      return;
    }
    store.removeTag(label);
    setActiveTags(prev => prev.filter(tg => tg !== label));
  };

  const confirmRemoveTag = () => {
    if (!tagToRemove) return;
    store.removeTag(tagToRemove);
    setActiveTags(prev => prev.filter(tg => tg !== tagToRemove));
    setTagToRemove(null);
  };

  const cancelRemoveTag = () => setTagToRemove(null);

  const filteredTasks = useMemo(() => {
    return store.tasks.filter(task => {
      if (task.tags.length === 0) return true;
      return task.tags.some(tag => activeTags.includes(tag));
    });
  }, [store.tasks, activeTags]);

  const orderedTasks = useMemo(() => {
    const ids = [
      ...(store.order['priority-high'] || []),
      ...(store.order['priority-medium'] || []),
      ...(store.order['priority-low'] || []),
    ];
    const map = new Map(filteredTasks.map(t => [t.id, t]));
    const list = ids
      .map(id => map.get(id))
      .filter((t): t is (typeof filteredTasks)[number] => !!t);
    const remaining = filteredTasks.filter(t => !ids.includes(t.id));
    return [...list, ...remaining];
  }, [filteredTasks, store.order]);

  return {
    state: {
      tasks: orderedTasks,
      tags: store.tags,
      activeTags,
      tagToRemove,
      highlightedId,
    },
    actions: {
      addTask: (input: {
        title: string;
        tags: string[];
        priority: Priority;
      }) => {
        const id = store.addTask(input);
        setHighlightedId(id);
        setTimeout(() => setHighlightedId(null), 3000);
        return id;
      },
      addTag: store.addTag,
      toggleTagFilter,
      resetTagFilter,
      removeTag,
      toggleFavoriteTag: store.toggleFavoriteTag,
      confirmRemoveTag,
      cancelRemoveTag,
    },
  } as const;
}
