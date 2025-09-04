'use client';
import { useState } from 'react';
import { useStore } from '../../lib/store';
import { getNextTagColor } from '../../lib/tagColors';

export interface UseTaskItemProps {
  taskId: string;
}

export default function useTaskItem({ taskId }: UseTaskItemProps) {
  const {
    tasks,
    updateTask,
    tags: allTags,
    addTag,
    toggleMyDay,
    removeTask,
  } = useStore();
  const task = tasks.find(t => t.id === taskId);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task?.title ?? '');
  const [showTagInput, setShowTagInput] = useState(false);

  if (!task) {
    return {
      state: { task: undefined, isEditing: false, title: '', allTags: [] },
      actions: {},
    } as const;
  }

  const addTagFromValue = (value: string) => {
    const newTag = value.trim();
    if (newTag && !task.tags.includes(newTag)) {
      const newTags = [...task.tags, newTag];
      updateTask(task.id, { tags: newTags });
      if (!allTags.find(t => t.label === newTag)) {
        const color = getNextTagColor(allTags.map(t => t.color));
        addTag({
          id: crypto.randomUUID(),
          label: newTag,
          color,
          favorite: false,
        });
      }
      setShowTagInput(false);
    }
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
    if (allTags.some(tag => tag.label === value)) {
      addTagFromValue(value);
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = task.tags.filter(tag => tag !== tagToRemove);
    updateTask(task.id, { tags: newTags });
    if (newTags.length === 0) {
      setShowTagInput(false);
    }
  };

  const toggleTagInput = () => setShowTagInput(prev => !prev);

  const getTagColor = (tagLabel: string) => {
    const tag = allTags.find(t => t.label === tagLabel);
    return tag ? tag.color : '#ccc';
  };

  const startEditing = () => {
    setTitle(task.title);
    setIsEditing(true);
  };

  const saveTitle = () => {
    const newTitle = title.trim();
    if (newTitle && newTitle !== task.title) {
      updateTask(task.id, { title: newTitle });
    } else {
      setTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTitle();
    } else if (e.key === 'Escape') {
      setTitle(task.title);
      setIsEditing(false);
    }
  };

  return {
    state: { task, isEditing, title, allTags, showTagInput },
    actions: {
      setTitle,
      setIsEditing,
      handleTagInputChange,
      handleExistingTagSelect,
      removeTag,
      getTagColor,
      startEditing,
      saveTitle,
      handleTitleKeyDown,
      updateTask,
      toggleMyDay,
      removeTask,
      toggleTagInput,
    },
  } as const;
}
