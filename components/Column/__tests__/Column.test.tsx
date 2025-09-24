import { render, screen } from '../../../test/test-utils';
import Column from '../Column';
import useColumn from '../useColumn';
import { useStore } from '../../../lib/store';

jest.mock('../useColumn');
jest.mock('../../TaskCard/TaskCard', () => ({
  __esModule: true,
  default: ({ task }: any) => <div>{task.title}</div>,
}));

const mockUseColumn = useColumn as jest.MockedFunction<typeof useColumn>;

describe('Column', () => {
  const originalClearCompleted = useStore.getState().clearCompletedMyDayTasks;

  beforeEach(() => {
    mockUseColumn.mockReturnValue({
      state: { containerClasses: 'container', listClasses: 'list' },
      actions: { setNodeRef: jest.fn() },
    } as any);
    useStore.setState(
      { clearCompletedMyDayTasks: originalClearCompleted } as any,
      false
    );
  });

  afterAll(() => {
    useStore.setState(
      { clearCompletedMyDayTasks: originalClearCompleted } as any,
      false
    );
  });

  it('renders title and tasks', () => {
    const tasks = [
      {
        id: 't1',
        title: 'A',
        createdAt: '',
        listId: 'l1',
        tags: [],
        priority: 'low' as const,
        plannedFor: null,
      },
    ];

    render(
      <Column
        id="c1"
        title="Col"
        tasks={tasks}
        mode="my-day"
      />
    );

    expect(screen.getByText('Col')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('does not render clear action when fewer than two tasks are done', () => {
    const tasks = [
      {
        id: 't1',
        title: 'Only task',
        createdAt: '',
        listId: 'l1',
        tags: [],
        priority: 'medium' as const,
        plannedFor: null,
      },
    ];

    render(
      <Column
        id="done"
        title="Done"
        tasks={tasks}
        mode="my-day"
      />
    );

    expect(
      screen.queryByRole('button', { name: /remove completed tasks/i })
    ).not.toBeInTheDocument();
  });

  it('renders clear action and triggers handler for done column with multiple tasks', () => {
    const tasks = [
      {
        id: 't1',
        title: 'Task 1',
        createdAt: '',
        listId: 'l1',
        tags: [],
        priority: 'high' as const,
        plannedFor: null,
      },
      {
        id: 't2',
        title: 'Task 2',
        createdAt: '',
        listId: 'l1',
        tags: [],
        priority: 'low' as const,
        plannedFor: null,
      },
    ];
    const clearSpy = jest.fn();
    useStore.setState({ clearCompletedMyDayTasks: clearSpy } as any, false);

    render(
      <Column
        id="done"
        title="Done"
        tasks={tasks}
        mode="my-day"
      />
    );

    const button = screen.getByRole('button', {
      name: /remove completed tasks/i,
    });
    button.click();
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });
});
