import { render, screen } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import TaskItem from '../TaskItem';
import useTaskItem from '../useTaskItem';

jest.mock('../useTaskItem');

const mockUseTaskItem = useTaskItem as jest.MockedFunction<typeof useTaskItem>;

describe('TaskItem', () => {
  it('renders null when task missing', () => {
    mockUseTaskItem.mockReturnValue({
      state: { task: null },
      actions: {},
    } as any);
    const { container } = render(<TaskItem taskId="1" />);
    expect(container.firstChild).toBeNull();
  });

  it('starts editing on click', async () => {
    const user = userEvent.setup();
    const startEditing = jest.fn();
    mockUseTaskItem.mockReturnValue({
      state: {
        task: {
          id: '1',
          title: 'Task',
          createdAt: '',
          listId: 'l1',
          tags: [],
          priority: 'low',
          plannedFor: null,
        },
        isEditing: false,
        title: 'Task',
        allTags: [],
        showTagInput: false,
      },
      actions: {
        startEditing,
        setTaskRepeat: jest.fn(),
      },
    } as any);
    render(<TaskItem taskId="1" />);
    await user.click(screen.getByText('Task'));
    expect(startEditing).toHaveBeenCalled();
  });
});
