import { render, screen, within } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import Header from '../Header';
import { useStore } from '../../../lib/store';

jest.mock('next/navigation', () => ({
  usePathname: () => '/my-day',
}));

const initialState = useStore.getState();

beforeEach(() => {
  const tasks = [
    {
      id: '1',
      title: 'Task',
      createdAt: new Date().toISOString(),
      listId: 'backlog',
      plannedFor: new Date().toISOString(),
      tags: [],
      priority: 'medium' as const,
    },
  ];
  const notifications = [
    {
      id: 'n1',
      type: 'info' as const,
      titleKey: 'notifications.welcome.title',
      descriptionKey: 'notifications.welcome.description',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ];
  useStore.setState({ tasks, notifications });
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

afterEach(() => {
  useStore.setState(initialState, true);
});

describe('Header', () => {
  it('shows My Day and unread notifications counts', () => {
    render(<Header />);

    const myDayLink = screen.getByRole('link', { name: /My Day/i });
    expect(within(myDayLink).getByText('1')).toBeInTheDocument();

    const notificationsLink = screen.getByLabelText(/Notifications/i);
    expect(within(notificationsLink).getByText('1')).toBeInTheDocument();
  });

  it('toggles theme when button clicked', async () => {
    localStorage.setItem('theme', 'light');
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole('button', { name: /Toggle theme/i });
    expect(document.documentElement).not.toHaveClass('dark');

    await user.click(toggle);

    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
