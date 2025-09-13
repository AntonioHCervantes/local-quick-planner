import { render, screen } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { Plus } from 'lucide-react';
import Link from '../Link';

describe('Link', () => {
  it('renders children and handles click', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Link
        onClick={handleClick}
        icon={Plus}
      >
        Action
      </Link>
    );

    const button = screen.getByRole('button', { name: /Action/i });
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toBeInTheDocument();

    await user.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});
