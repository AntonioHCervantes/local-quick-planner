'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check } from 'lucide-react';
import { Task } from '../lib/types';
import { useStore } from '../lib/store';

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const { moveTask } = useStore();
  const markDone = () => {
    if (task.dayStatus !== 'done') {
      moveTask(task.id, { dayStatus: 'done' });
    }
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-800 rounded p-2 cursor-grab focus:outline-none focus:ring"
    >
      <div className="flex items-center justify-between">
        <span>{task.title}</span>
        {task.dayStatus !== 'done' && (
          <button onClick={markDone} aria-label="Mark as done" className="text-green-400 hover:text-green-500">
            <Check className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
