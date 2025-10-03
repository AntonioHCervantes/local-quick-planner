import { render, screen } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import NotificationCard from '../NotificationCard';
import { useStore } from '../../../lib/store';

const baseNotification = {
  id: 'welcome',
  type: 'info' as const,
  titleKey: 'notifications.welcome.title',
  descriptionKey: 'notifications.welcome.description',
  read: false,
  createdAt: new Date().toISOString(),
};

const initialState = useStore.getState();
const removeNotificationMock = jest.fn();
const dismissibleNotification = {
  ...baseNotification,
  id: 'other-notification',
};

beforeEach(() => {
  removeNotificationMock.mockReset();
  useStore.setState({ removeNotification: removeNotificationMock });
});

afterEach(() => {
  useStore.setState(initialState, true);
});

describe('NotificationCard', () => {
  it('renders title and description', () => {
    render(<NotificationCard notification={baseNotification} />);

    expect(screen.getByText('Welcome to CheckPlanner')).toBeInTheDocument();
    expect(screen.getByText(/Use the "My Tasks" board/i)).toBeInTheDocument();
  });

  it('renders action link when provided', () => {
    render(
      <NotificationCard
        notification={{
          ...baseNotification,
          actionUrl: 'https://example.com',
          actionLabelKey: 'actions.more',
        }}
      />
    );

    const link = screen.getByRole('link', { name: /more actions/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders internal action with primary styling in the same tab', () => {
    render(
      <NotificationCard
        notification={{
          ...dismissibleNotification,
          actionUrl: '/settings/work-schedule',
          actionLabelKey: 'notifications.workScheduleSuggestion.cta',
        }}
      />
    );

    const link = screen.getByRole('link', { name: /set work schedule/i });
    expect(link).toHaveAttribute('href', '/settings/work-schedule');
    expect(link).not.toHaveAttribute('target');
    expect(link).toHaveClass('bg-[#57886C]', { exact: false });
  });

  it('shows welcome quick actions', () => {
    render(<NotificationCard notification={baseNotification} />);

    expect(screen.getByRole('button', { name: /install app/i })).toBeDisabled();
    expect(
      screen.getByRole('link', { name: /explore demo templates/i })
    ).toHaveAttribute('href', '/demo-templates');
  });

  it('keeps the welcome notification fixed', () => {
    render(<NotificationCard notification={baseNotification} />);

    expect(
      screen.queryByRole('button', {
        name: /dismiss notification/i,
      })
    ).not.toBeInTheDocument();
  });

  it('allows dismissing other notifications', async () => {
    const user = userEvent.setup();
    render(<NotificationCard notification={dismissibleNotification} />);

    const dismissButton = screen.getByRole('button', {
      name: /dismiss notification/i,
    });

    await user.click(dismissButton);

    expect(removeNotificationMock).toHaveBeenCalledWith('other-notification');
  });
});
