import { useEffect } from 'react';
import { act, render, waitFor } from '../../../test/test-utils';
import useAddTask from '../useAddTask';
import { Priority, Tag } from '../../../lib/types';

type AddTaskInput = {
  title: string;
  tags: string[];
  priority: Priority;
};

const noopAddTask = (_input: AddTaskInput) => 'new-task';
const noopAddTag = () => {};
const noopToggleFavoriteTag = () => {};

function UseAddTaskTest({
  tags,
  onTagsChange,
}: {
  tags: Tag[];
  onTagsChange: (value: string[]) => void;
}) {
  const { state } = useAddTask({
    addTask: noopAddTask,
    tags,
    addTag: noopAddTag,
    toggleFavoriteTag: noopToggleFavoriteTag,
  });

  useEffect(() => {
    onTagsChange(state.tags);
  }, [onTagsChange, state.tags]);

  return null;
}

function RemoveTagTest({
  tags,
  toggleFavoriteTag,
  onReady,
}: {
  tags: Tag[];
  toggleFavoriteTag: (label: string) => void;
  onReady: (actions: ReturnType<typeof useAddTask>['actions']) => void;
}) {
  const { actions } = useAddTask({
    addTask: noopAddTask,
    tags,
    addTag: noopAddTag,
    toggleFavoriteTag,
  });

  useEffect(() => {
    onReady(actions);
  }, [actions, onReady]);

  return null;
}

describe('useAddTask', () => {
  it('adds newly favorited tags to the selected tags list', async () => {
    const initialTags: Tag[] = [
      { id: '1', label: 'work', color: '#f00', favorite: true },
      { id: '2', label: 'home', color: '#0f0', favorite: false },
    ];
    let latestTags: string[] = [];

    const { rerender } = render(
      <UseAddTaskTest
        tags={initialTags}
        onTagsChange={value => {
          latestTags = value;
        }}
      />
    );

    await waitFor(() => {
      expect(latestTags).toEqual(['work']);
    });

    const updatedTags: Tag[] = [
      { id: '1', label: 'work', color: '#f00', favorite: true },
      { id: '2', label: 'home', color: '#0f0', favorite: true },
    ];

    rerender(
      <UseAddTaskTest
        tags={updatedTags}
        onTagsChange={value => {
          latestTags = value;
        }}
      />
    );

    await waitFor(() => {
      expect(latestTags).toEqual(['work', 'home']);
    });
  });

  it('unfavorites tags when they are removed from the form', async () => {
    const initialTags: Tag[] = [
      { id: '1', label: 'work', color: '#f00', favorite: true },
      { id: '2', label: 'home', color: '#0f0', favorite: false },
    ];
    const toggleFavoriteTag = jest.fn();
    let actions: ReturnType<typeof useAddTask>['actions'] | null = null;

    render(
      <RemoveTagTest
        tags={initialTags}
        toggleFavoriteTag={toggleFavoriteTag}
        onReady={value => {
          actions = value;
        }}
      />
    );

    await waitFor(() => {
      expect(actions).not.toBeNull();
    });

    act(() => {
      actions?.removeTag('work');
    });

    expect(toggleFavoriteTag).toHaveBeenCalledWith('work');
  });
});
