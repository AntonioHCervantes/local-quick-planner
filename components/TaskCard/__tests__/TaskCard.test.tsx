import { render, screen } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import TaskCard from '../TaskCard';
import useTaskCard from '../useTaskCard';

jest.mock('../useTaskCard');

const mockUseTaskCard = useTaskCard as jest.MockedFunction<typeof useTaskCard>;

const baseTask = {
  id: 't1',
  title: 'Task',
  createdAt: '',
  listId: 'l1',
  tags: [],
  priority: 'low' as const,
  plannedFor: null,
  dayStatus: 'todo' as const,
};

describe('TaskCard', () => {
  beforeEach(() => {
    mockUseTaskCard.mockReturnValue({
      state: {
        attributes: {} as any,
        listeners: {} as any,
        setNodeRef: jest.fn(),
        style: {} as any,
        t: (k: string) => k,
        allTags: [],
      },
      actions: {
        markInProgress: jest.fn(),
        markDone: jest.fn(),
        getTagColor: () => '#fff',
        deleteTask: jest.fn(),
      },
    });
  });

  it('marks task in progress', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={baseTask}
        mode="my-day"
      />
    );
    await user.click(
      screen.getByRole('button', { name: 'taskCard.markInProgress' })
    );
    const { markInProgress } = mockUseTaskCard.mock.results[0].value
      .actions as any;
    expect(markInProgress).toHaveBeenCalled();
  });

  it('marks task done', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={baseTask}
        mode="kanban"
      />
    );
    await user.click(screen.getByRole('button', { name: 'taskCard.markDone' }));
    const { markDone } = mockUseTaskCard.mock.results[1].value.actions as any;
    expect(markDone).toHaveBeenCalled();
  });
});
