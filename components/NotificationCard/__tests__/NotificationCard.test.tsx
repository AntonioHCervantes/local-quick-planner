import { render, screen } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import NotificationCard from '../NotificationCard';
import { useStore } from '../../../lib/store';

const baseNotification = {
  id: 'n1',
  type: 'info' as const,
  titleKey: 'notifications.welcome.title',
  descriptionKey: 'notifications.welcome.description',
  read: false,
  createdAt: new Date().toISOString(),
};

const initialState = useStore.getState();
const removeNotificationMock = jest.fn();

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

    expect(
      screen.getByText('Welcome to Local Quick Planner')
    ).toBeInTheDocument();
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

  it('allows dismissing the notification', async () => {
    const user = userEvent.setup();
    render(<NotificationCard notification={baseNotification} />);

    const dismissButton = screen.getByRole('button', {
      name: /dismiss notification/i,
    });

    await user.click(dismissButton);

    expect(removeNotificationMock).toHaveBeenCalledWith('n1');
  });
});
