'use client';
import { useState } from 'react';
import { CalendarPlus, CalendarX, Trash2 } from 'lucide-react';
import { useStore } from '../lib/store';
import { Priority } from '../lib/types';

interface Props {
  taskId: string;
}

export default function TaskItem({ taskId }: Props) {
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

  if (!task) {
    return null;
  }

  const handleTagInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag && !task.tags.includes(newTag)) {
        const newTags = [...task.tags, newTag];
        updateTask(task.id, { tags: newTags });
        if (!allTags.find(t => t.label === newTag)) {
          const color = `hsl(${Math.random() * 360}, 70%, 50%)`;
          addTag({ id: crypto.randomUUID(), label: newTag, color });
        }
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = task.tags.filter(tag => tag !== tagToRemove);
    updateTask(task.id, { tags: newTags });
  };

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

  return (
    <div className="flex flex-col gap-2 rounded bg-gray-800 p-2">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={handleTitleKeyDown}
            className="flex-1 rounded bg-gray-700 p-1 text-sm focus:ring"
            autoFocus
          />
        ) : (
          <p
            className="flex-1"
            onClick={startEditing}
          >
            {task.title}
          </p>
        )}
        <select
          value={task.priority ?? ''}
          onChange={e =>
            updateTask(task.id, {
              priority: e.target.value as Priority,
            })
          }
          className="rounded bg-gray-700 p-1 text-sm focus:ring"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={() => toggleMyDay(task.id)}
          aria-label={task.plannedFor ? 'Remove from My Day' : 'Add to My Day'}
          className="rounded bg-blue-600 p-1 text-white hover:bg-blue-700 focus:ring"
        >
          {task.plannedFor ? (
            <CalendarX className="h-4 w-4" />
          ) : (
            <CalendarPlus className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => removeTask(task.id)}
          aria-label="Delete task"
          className="rounded bg-red-600 p-1 text-white hover:bg-red-700 focus:ring"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-wrap gap-1">
          {task.tags.map(tag => (
            <span
              key={tag}
              style={{ backgroundColor: getTagColor(tag) }}
              className="text-xs px-2 py-1 rounded-full"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 text-red-500"
              >
                x
              </button>
            </span>
          ))}
        </div>
        <input
          onKeyDown={handleTagInputChange}
          className="flex-1 rounded bg-gray-700 p-1 text-sm focus:ring"
          placeholder="Add tag"
          list="existing-tags"
        />
        <datalist id="existing-tags">
          {allTags.map(tag => (
            <option
              key={tag.id}
              value={tag.label}
            />
          ))}
        </datalist>
      </div>
    </div>
  );
}
