'use client';
import AddTask from '../AddTask/AddTask';
import TaskList from '../TaskList/TaskList';
import TagFilter from '../TagFilter/TagFilter';
import useTasksView from './useTasksView';

export default function TasksView() {
  const { state, actions } = useTasksView();
  const { tasks, tags, activeTags } = state;
  const { addTask, addTag, toggleTagFilter, resetTagFilter } = actions;
  return (
    <main>
      <AddTask
        addTask={addTask}
        tags={tags}
        addTag={addTag}
      />
      <TagFilter
        tags={tags}
        activeTags={activeTags}
        toggleTag={toggleTagFilter}
        showAll={resetTagFilter}
      />
      <TaskList tasks={tasks} />
    </main>
  );
}
