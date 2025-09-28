import { useStore } from '../store';

describe('addTask favorite tags behavior', () => {
  beforeEach(() => {
    useStore.getState().clearAll();
  });

  it('marks the last tag as favorite when there are no other favorites', () => {
    useStore.getState().addTag({
      id: 'tag-1',
      label: 'work',
      color: '#f00',
      favorite: false,
    });

    useStore.getState().addTask({
      title: 'Task with first tag',
      tags: ['work'],
      priority: 'medium',
    });

    const tags = useStore.getState().tags;
    const workTag = tags.find(tag => tag.label === 'work');
    expect(workTag?.favorite).toBe(true);
  });

  it('keeps the new tag unfavorited when another favorite already exists', () => {
    useStore.getState().addTag({
      id: 'tag-favorite',
      label: 'favorite',
      color: '#0f0',
      favorite: true,
    });

    useStore.getState().addTag({
      id: 'tag-new',
      label: 'new',
      color: '#00f',
      favorite: false,
    });

    useStore.getState().addTask({
      title: 'Task with new tag',
      tags: ['new'],
      priority: 'medium',
    });

    const tags = useStore.getState().tags;
    const newTag = tags.find(tag => tag.label === 'new');
    expect(newTag?.favorite).toBe(false);
    const favoriteTag = tags.find(tag => tag.label === 'favorite');
    expect(favoriteTag?.favorite).toBe(true);
  });
});
