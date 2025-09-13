import { render, screen, fireEvent } from '../../../test/test-utils';
import TagFilter from '../TagFilter';

describe('TagFilter', () => {
  const tags = [
    { id: '1', label: 'work', color: '#f00', favorite: false },
    { id: '2', label: 'home', color: '#0f0', favorite: true },
  ];

  it('returns null when no tags', () => {
    const { container } = render(
      <TagFilter
        tags={[]}
        toggleTag={jest.fn()}
        showAll={jest.fn()}
        removeTag={jest.fn()}
        toggleFavorite={jest.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('calls callbacks on interactions', () => {
    const toggleTag = jest.fn();
    const showAll = jest.fn();
    const removeTag = jest.fn();
    const toggleFavorite = jest.fn();

    render(
      <TagFilter
        tags={tags}
        toggleTag={toggleTag}
        showAll={showAll}
        removeTag={removeTag}
        toggleFavorite={toggleFavorite}
      />
    );

    fireEvent.click(screen.getByText('work'));
    expect(toggleTag).toHaveBeenCalledWith('work');

    fireEvent.click(screen.getAllByLabelText('Remove tag')[0]);
    expect(removeTag).toHaveBeenCalledWith('work');

    fireEvent.click(screen.getByLabelText('Add tag to favorites'));
    expect(toggleFavorite).toHaveBeenCalledWith('work');

    fireEvent.click(screen.getByRole('button', { name: /Show all/i }));
    expect(showAll).toHaveBeenCalled();
  });
});
