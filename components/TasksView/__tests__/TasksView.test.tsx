import { render, screen } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import TasksView from '../TasksView';
import useTasksView from '../useTasksView';

jest.mock('../useTasksView');
jest.mock(
  '../../AddTask/AddTask',
  () =>
    function AddTask() {
      return <div>AddTask</div>;
    }
);
jest.mock(
  '../../TagFilter/TagFilter',
  () =>
    function TagFilter() {
      return <div>TagFilter</div>;
    }
);
jest.mock(
  '../../TaskList/TaskList',
  () =>
    function TaskList() {
      return <div>TaskList</div>;
    }
);

describe('TasksView', () => {
  it('confirms and cancels tag removal', async () => {
    const confirmRemoveTag = jest.fn();
    const cancelRemoveTag = jest.fn();
    (useTasksView as jest.Mock).mockReturnValue({
      state: {
        tasks: [],
        tags: [],
        activeTags: [],
        tagToRemove: { label: 'work' },
        highlightedId: null,
      },
      actions: {
        addTask: jest.fn(),
        addTag: jest.fn(),
        toggleTagFilter: jest.fn(),
        resetTagFilter: jest.fn(),
        removeTag: jest.fn(),
        toggleFavoriteTag: jest.fn(),
        confirmRemoveTag,
        cancelRemoveTag,
      },
    });

    const user = userEvent.setup();
    const { unmount } = render(<TasksView />);

    await user.click(screen.getByRole('button', { name: /Delete/ }));
    expect(confirmRemoveTag).toHaveBeenCalled();

    unmount();
    (useTasksView as jest.Mock).mockReturnValue({
      state: {
        tasks: [],
        tags: [],
        activeTags: [],
        tagToRemove: { label: 'work' },
        highlightedId: null,
      },
      actions: {
        addTask: jest.fn(),
        addTag: jest.fn(),
        toggleTagFilter: jest.fn(),
        resetTagFilter: jest.fn(),
        removeTag: jest.fn(),
        toggleFavoriteTag: jest.fn(),
        confirmRemoveTag,
        cancelRemoveTag,
      },
    });
    render(<TasksView />);
    await user.click(screen.getByRole('button', { name: /Cancel/ }));
    expect(cancelRemoveTag).toHaveBeenCalled();
  });
});
