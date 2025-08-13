'use client';
import AddTask from '../../components/AddTask';
import TaskList from '../../components/TaskList';

export default function MyTasksPage() {
  return (
    <main>
      <AddTask />
      <TaskList />
    </main>
  );
}
