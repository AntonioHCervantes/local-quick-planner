'use client';
import { useEffect, useState } from 'react';
import { Priority, Tag } from '../../lib/types';
import { getNextTagColor } from '../../lib/tagColors';

export interface UseAddTaskProps {
  addTask: (input: {
    title: string;
    tags: string[];
    priority: Priority;
  }) => string;
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
    setTags(prev => {
      const existingLabels = existingTags.map(t => t.label);
      return prev.filter(t => existingLabels.includes(t));
    });
  }, [existingTags]);

  const handleAdd = (pendingTag?: string) => {
    if (!title.trim()) return;
    let currentTags = tags;
    if (pendingTag?.trim()) {
      currentTags = addTagFromValue(pendingTag);
    }
    const lastTag = currentTags[currentTags.length - 1];
    addTask({ title: title.trim(), tags: currentTags, priority });
    setTitle('');
    const favs = existingTags.filter(t => t.favorite).map(t => t.label);
    const newTags =
      lastTag && !favs.includes(lastTag) ? [...favs, lastTag] : favs;
    setTags(newTags);
  };

  const addTagFromValue = (value: string) => {
    const newTag = value.trim();
    if (newTag && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      if (!existingTags.find(t => t.label === newTag)) {
        const color = getNextTagColor(existingTags.map(t => t.color));
        addTag({
          id: crypto.randomUUID(),
          label: newTag,
          color,
          favorite: false,
        });
      }
      setTags(updatedTags);
      return updatedTags;
    }
    return tags;
  };

  const handleTagInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTagFromValue(e.currentTarget.value);
      e.currentTarget.value = '';
    }
  };

  const handleExistingTagSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (existingTags.some(tag => tag.label === value)) {
      addTagFromValue(value);
      e.target.value = '';
    }
  };

  const handleTagInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (!value) return;
    const next = e.relatedTarget as HTMLElement | null;
    if (next instanceof HTMLButtonElement && next.type === 'submit') {
      return;
    }
    addTagFromValue(value);
    e.target.value = '';
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
      handleExistingTagSelect,
      handleTagInputBlur,
      removeTag,
    },
  } as const;
}
