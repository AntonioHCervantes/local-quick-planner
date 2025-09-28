'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import AddTask from '../AddTask/AddTask';
import TaskList from '../TaskList/TaskList';
import TagFilter from '../TagFilter/TagFilter';
import useTasksView from './useTasksView';
import { useI18n } from '../../lib/i18n';

export default function TasksView() {
  const { state, actions } = useTasksView();
  const {
    tasks,
    tags,
    activeTags,
    tagToRemove,
    highlightedId,
    hasTasks,
    isFiltering,
  } = state;
  const {
    addTask,
    addTag,
    toggleTagFilter,
    resetTagFilter,
    removeTag,
    toggleFavoriteTag,
    confirmRemoveTag,
    cancelRemoveTag,
  } = actions;
  const { t } = useI18n();
  const [showMobileAddTask, setShowMobileAddTask] = useState(false);

  const toggleMobileAddTask = () => {
    setShowMobileAddTask(prev => !prev);
  };
  return (
    <main>
      <div className="sm:hidden">
        <button
          type="button"
          onClick={toggleMobileAddTask}
          className="mx-4 mt-4 flex items-center gap-2 rounded bg-[#57886C] px-4 py-2 text-sm text-white hover:brightness-110 focus:ring"
          aria-expanded={showMobileAddTask}
          aria-controls="tasks-view-add-task"
        >
          {showMobileAddTask ? (
            <X className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {showMobileAddTask
            ? t('tasksView.mobileAddTask.hide')
            : t('tasksView.mobileAddTask.show')}
        </button>
      </div>
      <div
        id="tasks-view-add-task"
        className={`${showMobileAddTask ? '' : 'hidden'} sm:block`}
      >
        <AddTask
          addTask={addTask}
          tags={tags}
          addTag={addTag}
        />
      </div>
      <TagFilter
        tags={tags}
        activeTags={activeTags}
        toggleTag={toggleTagFilter}
        showAll={resetTagFilter}
        removeTag={removeTag}
        toggleFavorite={toggleFavoriteTag}
      />
      <TaskList
        tasks={tasks}
        highlightedId={highlightedId}
        hasTasks={hasTasks}
        isFiltering={isFiltering}
      />
      {tagToRemove && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded bg-gray-900 p-6 text-center text-gray-100">
            <p className="mb-4">{t('tagFilter.confirmDelete')}</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={cancelRemoveTag}
                className="rounded bg-gray-700 px-3 py-1 hover:bg-gray-600 focus:bg-gray-600"
              >
                {t('confirmDelete.cancel')}
              </button>
              <button
                onClick={confirmRemoveTag}
                className="rounded bg-[rgb(184,75,79)] px-3 py-1 text-white hover:brightness-110 focus:brightness-110"
              >
                {t('confirmDelete.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
