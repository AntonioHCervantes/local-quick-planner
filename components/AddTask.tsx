'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Priority, Tag } from '../lib/types';

export default function AddTask({ addTask, tags: existingTags, addTag }: { addTask: (input: { title: string; tags: string[]; priority: Priority; }) => void; tags: Tag[]; addTag: (tag: Tag) => void; }) {
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
          // A simple way to generate a random color
          const color = `hsl(${Math.random() * 360}, 70%, 50%)`;
          addTag({ id: crypto.randomUUID(), label: newTag, color });
        }
      }
      e.currentTarget.value = '';
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAdd();
      }}
      className="flex flex-wrap items-center gap-2 p-4"
    >
      <label htmlFor="task-title" className="sr-only">
        Title
      </label>
      <input
        id="task-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 rounded bg-gray-800 p-2 text-sm focus:ring"
        placeholder="New task"
      />
      <div className="flex items-center gap-2">
        <label htmlFor="task-tags" className="sr-only">
          Tags
        </label>
        <input
          id="task-tags"
          onKeyDown={handleTagInputChange}
          className="rounded bg-gray-800 p-2 text-sm focus:ring"
          placeholder="Add tags (press Enter)"
          list="existing-tags"
        />
        <datalist id="existing-tags">
          {existingTags.map(tag => (
            <option key={tag.id} value={tag.label} />
          ))}
        </datalist>
        <div className="flex gap-1">
          {tags.map(tag => (
            <span key={tag} className="bg-gray-700 text-xs p-1 rounded">
              {tag}
              <button onClick={() => setTags(tags.filter(t => t !== tag))} className="ml-1 text-red-500">x</button>
            </span>
          ))}
        </div>
      </div>
      <label htmlFor="task-priority" className="sr-only">
        Priority
      </label>
      <select
        id="task-priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className="rounded bg-gray-800 p-2 text-sm focus:ring"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit" className="flex items-center gap-1 rounded bg-blue-600 px-3 py-2 text-sm hover:bg-blue-700 focus:ring">
        <Plus className="h-4 w-4" /> Add
      </button>
    </form>
  );
}
