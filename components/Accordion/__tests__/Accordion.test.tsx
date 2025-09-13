import { render, screen, fireEvent } from '../../../test/test-utils';
import Accordion, { AccordionItem } from '../Accordion';

describe('Accordion', () => {
  const items: AccordionItem[] = [
    { question: 'Q1', answer: 'A1' },
    { question: 'Q2', answer: 'A2' },
  ];

  it('toggles answers', () => {
    render(<Accordion items={items} />);

    const firstQuestion = screen.getByRole('button', { name: 'Q1' });
    fireEvent.click(firstQuestion);
    expect(screen.getByText('A1')).toBeInTheDocument();

    fireEvent.click(firstQuestion);
    expect(screen.queryByText('A1')).not.toBeInTheDocument();
  });
});
