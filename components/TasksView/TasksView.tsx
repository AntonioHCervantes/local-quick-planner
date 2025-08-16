'use client';
import AddTask from '../AddTask/AddTask';
import TaskList from '../TaskList/TaskList';
import TagFilter from '../TagFilter/TagFilter';
import useTasksView from './useTasksView';
import { useI18n } from '../../lib/i18n';

export default function TasksView() {
  const { state, actions } = useTasksView();
  const { tasks, tags, activeTags, tagToRemove, highlightedId } = state;
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
        removeTag={removeTag}
        toggleFavorite={toggleFavoriteTag}
      />
      <TaskList
        tasks={tasks}
        highlightedId={highlightedId}
      />
      {tagToRemove && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded bg-[hsl(var(--surface))] p-6 text-center text-[hsl(var(--text))]">
            <p className="mb-4">{t('tagFilter.confirmDelete')}</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={cancelRemoveTag}
                className="btn-secondary px-3 py-1"
              >
                {t('confirmDelete.cancel')}
              </button>
              <button
                onClick={confirmRemoveTag}
                className="btn-danger px-3 py-1"
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
