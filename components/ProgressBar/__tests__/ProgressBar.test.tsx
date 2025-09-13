import { render, screen } from '../../../test/test-utils';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('shows medium progress message and yellow bar', () => {
    const { container } = render(<ProgressBar percent={50} />);
    expect(screen.getByText(/keep going/i)).toBeInTheDocument();
    const bar = container.querySelector('div[style]') as HTMLElement;
    expect(bar).toHaveClass('bg-yellow-500');
    expect(bar).toHaveStyle({ width: '50%' });
  });

  it('shows completion message when percent is 100', () => {
    const { container } = render(<ProgressBar percent={100} />);
    expect(screen.getByText(/all tasks completed/i)).toBeInTheDocument();
    const bar = container.querySelector('div[style]') as HTMLElement;
    expect(bar).toHaveClass('bg-green-500');
    expect(bar).toHaveStyle({ width: '100%' });
  });
});
