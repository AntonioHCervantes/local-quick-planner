import Footer from '../Footer';
import { render, screen } from '../../../test/test-utils';

describe('Footer', () => {
  it('renders navigation links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open source/i })).toHaveAttribute(
      'href',
      'https://github.com/AntonioHCervantes/checkplanner'
    );
  });
});
