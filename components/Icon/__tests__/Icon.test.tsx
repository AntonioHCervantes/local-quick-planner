import { render, screen } from '../../../test/test-utils';
import Icon from '../Icon';

describe('Icon', () => {
  it('renders svg with label', () => {
    render(<Icon />);
    const img = screen.getByRole('img', { name: /Local Quick Planner/i });
    expect(img).toBeInTheDocument();
  });
});
