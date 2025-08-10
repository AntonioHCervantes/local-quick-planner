'use client';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../lib/types';
import TaskCard from './TaskCard';

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

export default function Column({ id, title, tasks }: ColumnProps) {
  return (
    <div className="w-80 flex-shrink-0">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <SortableContext id={id} items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
