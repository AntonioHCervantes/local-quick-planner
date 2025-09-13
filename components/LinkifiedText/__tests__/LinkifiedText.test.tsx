import { render, screen } from '../../../test/test-utils';
import LinkifiedText from '../LinkifiedText';

describe('LinkifiedText', () => {
  it('renders links that open in a new tab', () => {
    render(<LinkifiedText text="Revisar PR https://example.com" />);
    const link = screen.getByRole('link', { name: 'https://example.com' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
