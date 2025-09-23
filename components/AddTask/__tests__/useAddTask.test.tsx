import { useEffect } from 'react';
import { render, waitFor } from '../../../test/test-utils';
import useAddTask from '../useAddTask';
import { Priority, Tag } from '../../../lib/types';

type AddTaskInput = {
  title: string;
  tags: string[];
  priority: Priority;
};

const noopAddTask = (_input: AddTaskInput) => 'new-task';
const noopAddTag = () => {};

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
  });

  useEffect(() => {
    onTagsChange(state.tags);
  }, [onTagsChange, state.tags]);

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
});
