'use client';
import AddTask from '../../components/AddTask';
import Board from '../../components/Board';

export default function MyTasksPage() {
  return (
    <main>
      <AddTask />
      <Board mode="kanban" />
    </main>
  );
}
