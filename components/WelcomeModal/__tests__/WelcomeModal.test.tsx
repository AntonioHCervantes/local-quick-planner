import { render, screen } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import WelcomeModal from '../WelcomeModal';
import { useStore } from '../../../lib/store';

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

describe('WelcomeModal', () => {
  const initialState = useStore.getState();

  beforeEach(() => {
    useStore.setState(initialState, true);
    localStorage.clear();
  });

  it('shows modal when no tasks and not seen', async () => {
    render(<WelcomeModal />);
    expect(
      await screen.findByRole('heading', { name: /CheckPlanner/i })
    ).toBeInTheDocument();
  });

  it('closes and redirects on click', async () => {
    render(<WelcomeModal />);
    const user = userEvent.setup();
    const btn = await screen.findByRole('button', { name: /Let's go!/i });
    await user.click(btn);
    expect(localStorage.getItem('welcomeSeen')).toBe('1');
    expect(push).toHaveBeenCalledWith('/my-tasks');
  });

  it('does not render when already seen', () => {
    localStorage.setItem('welcomeSeen', '1');
    const { container } = render(<WelcomeModal />);
    expect(container.firstChild).toBeNull();
  });
});
