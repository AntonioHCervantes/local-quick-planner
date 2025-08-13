'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check } from 'lucide-react';
import { Task } from '../lib/types';
import { useStore } from '../lib/store';

interface Props {
  task: Task;
  dragOverlay?: boolean;
}

const priorityColors = {
  low: 'border-l-green-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-red-500',
};

export default function TaskCard({ task, dragOverlay = false }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      disabled: dragOverlay,
    });
  const style = dragOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
      };
  const { moveTask, tags: allTags } = useStore();
  const markDone = () => {
    if (task.dayStatus !== 'done') {
      moveTask(task.id, { dayStatus: 'done' });
    }
  };

  const getTagColor = (tagLabel: string) => {
    const tag = allTags.find(t => t.label === tagLabel);
    return tag ? tag.color : '#ccc';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-gray-800 rounded p-2 cursor-grab focus:outline-none focus:ring border-l-4 ${priorityColors[task.priority]}`}
    >
      <div className="flex items-center justify-between">
        <span>{task.title}</span>
        <div className="flex items-center gap-2">
          {task.dayStatus !== 'done' && (
            <button
              onClick={markDone}
              aria-label="Mark as done"
              className="text-green-400 hover:text-green-500"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {task.tags?.map(tag => (
          <span
            key={tag}
            style={{ backgroundColor: getTagColor(tag) }}
            className="text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
