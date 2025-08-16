'use client';
import { useEffect, useState } from 'react';
import { Priority, Tag } from '../../lib/types';

export interface UseAddTaskProps {
  addTask: (input: {
    title: string;
    tags: string[];
    priority: Priority;
  }) => void;
  tags: Tag[];
  addTag: (tag: Tag) => void;
}

export default function useAddTask({
  addTask,
  tags: existingTags,
  addTag,
}: UseAddTaskProps) {
  const favoriteLabels = existingTags.filter(t => t.favorite).map(t => t.label);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>(favoriteLabels);
  const [priority, setPriority] = useState<Priority>('medium');

  useEffect(() => {
    const favs = existingTags.filter(t => t.favorite).map(t => t.label);
    setTags(prev => {
      const existingLabels = existingTags.map(t => t.label);
      const nonFavs = prev.filter(
        t => !favs.includes(t) && existingLabels.includes(t)
      );
      return [...favs, ...nonFavs];
    });
  }, [existingTags]);

  const handleAdd = () => {
    if (!title.trim()) return;
    const lastTag = tags[tags.length - 1];
    addTask({ title: title.trim(), tags, priority });
    setTitle('');
    const favs = existingTags.filter(t => t.favorite).map(t => t.label);
    const newTags =
      lastTag && !favs.includes(lastTag) ? [...favs, lastTag] : favs;
    setTags(newTags);
  };

  const handleTagInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        if (!existingTags.find(t => t.label === newTag)) {
          const color = `hsl(${Math.random() * 360}, 70%, 50%)`;
          addTag({
            id: crypto.randomUUID(),
            label: newTag,
            color,
            favorite: false,
          });
        }
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return {
    state: { title, tags, priority, existingTags },
    actions: {
      setTitle,
      setPriority,
      handleAdd,
      handleTagInputChange,
      removeTag,
    },
  } as const;
}
