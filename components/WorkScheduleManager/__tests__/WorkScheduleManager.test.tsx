jest.mock('../../../lib/sounds', () => ({
  playReminderSound: jest.fn(),
}));

import { act, render, waitFor } from '@testing-library/react';
import WorkScheduleManager from '../WorkScheduleManager';
import { useStore } from '../../../lib/store';
import type { Task } from '../../../lib/types';

const initialState = useStore.getState();

const createTasks = (count: number): Task[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `task-${index + 1}`,
    title: `Task ${index + 1}`,
    createdAt: new Date(2024, 0, index + 1).toISOString(),
    listId: 'backlog',
    plannedFor: null,
    tags: [],
    priority: 'medium',
    repeat: null,
  }));

const findSuggestion = () =>
  useStore
    .getState()
    .notifications.find(n => n.id === 'work-schedule-suggestion');

describe('WorkScheduleManager', () => {
  beforeEach(() => {
    useStore.setState(initialState, true);
    localStorage.clear();
  });

  afterAll(() => {
    useStore.setState(initialState, true);
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<WorkScheduleManager />);
  });

  it('suggests setting a work schedule when there are at least three tasks', async () => {
    useStore.setState({ tasks: createTasks(3) });

    render(<WorkScheduleManager />);

    await waitFor(() => {
      expect(findSuggestion()).toBeDefined();
    });
  });

  it('removes the suggestion once the user adds work hours', async () => {
    useStore.setState({ tasks: createTasks(3) });

    render(<WorkScheduleManager />);

    await waitFor(() => {
      expect(findSuggestion()).toBeDefined();
    });

    act(() => {
      useStore.getState().toggleWorkScheduleSlot('monday', 10, 'add');
    });

    await waitFor(() => {
      expect(findSuggestion()).toBeUndefined();
    });
  });
});
