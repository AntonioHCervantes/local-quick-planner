'use client';
import AddTask from '../../components/AddTask';
import Board from '../../components/Board';

export default function MyDayPage() {
  return (
    <main>
      <AddTask />
      <Board mode="my-day" />
    </main>
  );
}
