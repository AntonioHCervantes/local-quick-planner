import { render, screen } from '../../../test/test-utils';
import NotificationCard from '../NotificationCard';

const baseNotification = {
  id: 'n1',
  type: 'info' as const,
  titleKey: 'notifications.welcome.title',
  descriptionKey: 'notifications.welcome.description',
  read: false,
  createdAt: new Date().toISOString(),
};

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
});
