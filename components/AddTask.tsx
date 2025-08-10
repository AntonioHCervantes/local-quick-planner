'use client';
import { useState } from 'react';
import { Plus, CalendarPlus } from 'lucide-react';
import { useStore } from '../lib/store';

export default function AddTask() {
  const { lists, addTask } = useStore();
  const [title, setTitle] = useState('');
  const [listId, setListId] = useState(lists[0]?.id ?? 'ideas');

  const today = new Date().toISOString().slice(0, 10);

  const handleAdd = (plan: boolean) => {
    if (!title.trim()) return;
    addTask({ title: title.trim(), listId, plannedFor: plan ? today : undefined });
    setTitle('');
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAdd(false);
      }}
      className="flex flex-wrap gap-2 p-4"
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
      <label htmlFor="task-list" className="sr-only">
        List
      </label>
      <select
        id="task-list"
        value={listId}
        onChange={(e) => setListId(e.target.value)}
        className="rounded bg-gray-800 p-2 text-sm focus:ring"
      >
        {lists.map((l) => (
          <option key={l.id} value={l.id}>
            {l.title}
          </option>
        ))}
      </select>
      <button type="submit" className="flex items-center gap-1 rounded bg-blue-600 px-3 py-2 text-sm hover:bg-blue-700 focus:ring">
        <Plus className="h-4 w-4" /> Add
      </button>
      <button
        type="button"
        onClick={() => handleAdd(true)}
        className="flex items-center gap-1 rounded bg-green-600 px-3 py-2 text-sm hover:bg-green-700 focus:ring"
      >
        <CalendarPlus className="h-4 w-4" /> + My Day
      </button>
    </form>
  );
}
