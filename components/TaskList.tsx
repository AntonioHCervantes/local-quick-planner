'use client';
import TaskItem from './TaskItem';
import { useStore } from '../lib/store';

export default function TaskList() {
  const { tasks } = useStore();
  const sorted = [...tasks].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return (
    <div className="space-y-2 p-4">
      {sorted.map(task => (
        <TaskItem
          key={task.id}
          task={task}
        />
      ))}
      {sorted.length === 0 && (
        <p className="text-center text-sm text-gray-400">No tasks</p>
      )}
    </div>
  );
}
