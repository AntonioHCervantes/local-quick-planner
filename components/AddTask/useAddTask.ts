'use client';
import { useState } from 'react';
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
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [priority, setPriority] = useState<Priority>('medium');

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask({ title: title.trim(), tags, priority });
    setTitle('');
    setTags([]);
  };

  const handleTagInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        if (!existingTags.find(t => t.label === newTag)) {
          const color = `hsl(${Math.random() * 360}, 70%, 50%)`;
          addTag({ id: crypto.randomUUID(), label: newTag, color });
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
