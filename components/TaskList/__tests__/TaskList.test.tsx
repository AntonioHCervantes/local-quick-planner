import { render, screen } from '../../../test/test-utils';
import TaskList from '../TaskList';

jest.mock('../../TaskItem/TaskItem', () => ({
  __esModule: true,
  default: ({ taskId }: { taskId: string }) => (
    <div data-testid={`task-${taskId}`}></div>
  ),
}));

describe('TaskList', () => {
  const tasks = [
    {
      id: '1',
      title: 'Task 1',
      createdAt: new Date().toISOString(),
      listId: 'backlog',
      tags: [],
      priority: 'medium' as const,
      plannedFor: null,
    },
    {
      id: '2',
      title: 'Task 2',
      createdAt: new Date().toISOString(),
      listId: 'backlog',
      tags: [],
      priority: 'low' as const,
      plannedFor: null,
    },
  ];

  it('renders tasks', () => {
    render(<TaskList tasks={tasks} />);
    expect(screen.getByTestId('task-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-2')).toBeInTheDocument();
  });

  it('shows empty message', () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText('No tasks')).toBeInTheDocument();
  });
});
