import { render, screen } from '../../../test/test-utils';
import Column from '../Column';
import useColumn from '../useColumn';

jest.mock('../useColumn');
jest.mock('../../TaskCard/TaskCard', () => ({
  __esModule: true,
  default: ({ task }: any) => <div>{task.title}</div>,
}));

const mockUseColumn = useColumn as jest.MockedFunction<typeof useColumn>;

describe('Column', () => {
  beforeEach(() => {
    mockUseColumn.mockReturnValue({
      state: { containerClasses: 'container', listClasses: 'list' },
      actions: { setNodeRef: jest.fn() },
    } as any);
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
});
