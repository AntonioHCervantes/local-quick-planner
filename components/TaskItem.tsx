'use client';
import { useState, useEffect } from 'react';
import { CalendarPlus, CalendarX } from 'lucide-react';
import { Task } from '../lib/types';
import { useStore } from '../lib/store';

interface Props {
  task: Task;
}

export default function TaskItem({ task }: Props) {
  const { updateTask, toggleMyDay } = useStore();
  const [title, setTitle] = useState(task.title);

  useEffect(() => {
    setTitle(task.title);
  }, [task.title]);

  const saveTitle = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== task.title) {
      updateTask(task.id, { title: trimmed });
    } else {
      setTitle(task.title);
    }
  };

  return (
    <div className="flex items-center gap-2 rounded bg-gray-800 p-2">
      <input
        className="flex-1 rounded bg-transparent px-1 focus:ring"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onBlur={saveTitle}
      />
      <select
        value={task.priority ?? ''}
        onChange={e =>
          updateTask(task.id, {
            priority: e.target.value as Task['priority'],
          })
        }
        className="rounded bg-gray-700 p-1 text-sm focus:ring"
      >
        <option value="">-</option>
        <option value="low">Low</option>
        <option value="med">Medium</option>
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
    </div>
  );
}
