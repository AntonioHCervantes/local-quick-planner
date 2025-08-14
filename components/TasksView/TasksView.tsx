'use client';
import AddTask from '../AddTask/AddTask';
import TaskList from '../TaskList/TaskList';
import useTasksView from './useTasksView';

export default function TasksView() {
  const { state, actions } = useTasksView();
  const { tasks, tags } = state;
  const { addTask, addTag } = actions;
  return (
    <main>
      <AddTask
        addTask={addTask}
        tags={tags}
        addTag={addTag}
      />
      <TaskList tasks={tasks} />
    </main>
  );
}
