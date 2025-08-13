'use client';
import AddTask from './AddTask';
import TaskList from './TaskList';
import { useStore } from '../lib/store';

export default function TasksView() {
  const store = useStore();
  return (
    <main>
      <AddTask addTask={store.addTask} tags={store.tags} addTag={store.addTag} />
      <TaskList tasks={store.tasks} />
    </main>
  );
}

