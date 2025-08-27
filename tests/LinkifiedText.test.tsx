import { render, screen } from '@testing-library/react';
import LinkifiedText from '../components/LinkifiedText/LinkifiedText';

describe('LinkifiedText', () => {
  it('renders links that open in a new tab', () => {
    render(<LinkifiedText text="Revisar PR https://example.com" />);
    const link = screen.getByRole('link', { name: 'https://example.com' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
