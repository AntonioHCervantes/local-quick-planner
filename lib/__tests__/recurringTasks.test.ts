import { DEFAULT_TIMER_DURATION, useStore } from '../store';

describe('recurring tasks manager', () => {
  beforeEach(() => {
    useStore.setState(state => ({
      ...state,
      tasks: [],
      order: {
        ...state.order,
        'day-todo': [],
        'day-doing': [],
        'day-done': [],
      },
      timers: {},
      mainMyDayTaskId: null,
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
    useStore.setState(state => ({
      ...state,
      tasks: [],
      order: {
        ...state.order,
        'day-todo': [],
        'day-doing': [],
        'day-done': [],
      },
      timers: {},
      mainMyDayTaskId: null,
    }));
  });

  it('adds weekly tasks to My Day on the configured weekday', () => {
    jest.useFakeTimers({ now: new Date('2024-05-20T09:00:00.000Z') });
    const todayKey = '2024-05-20';

    useStore.setState(state => ({
      ...state,
      tasks: [
        {
          id: 'task-1',
          title: 'Weekly planning',
          createdAt: '2024-05-19T10:00:00.000Z',
          listId: 'backlog',
          plannedFor: null,
          tags: [],
          priority: 'medium',
          repeat: {
            frequency: 'weekly',
            days: ['monday'],
            autoAddToMyDay: true,
            lastOccurrenceDate: null,
          },
        },
      ],
      order: {
        ...state.order,
        'day-todo': [],
        'day-doing': [],
        'day-done': [],
      },
      timers: {},
    }));

    useStore.getState().applyRecurringTasksForToday();

    const state = useStore.getState();
    const task = state.tasks[0];

    expect(task.plannedFor).toBe(todayKey);
    expect(task.dayStatus).toBe('todo');
    expect(task.repeat?.lastOccurrenceDate).toBe(todayKey);
    expect(state.order['day-todo']).toEqual(['task-1']);
    expect(state.timers['task-1']).toMatchObject({
      duration: DEFAULT_TIMER_DURATION,
      remaining: DEFAULT_TIMER_DURATION,
      running: false,
    });
  });

  it('does not re-add a task that already ran for today', () => {
    jest.useFakeTimers({ now: new Date('2024-05-20T09:00:00.000Z') });
    const todayKey = '2024-05-20';

    useStore.setState(state => ({
      ...state,
      tasks: [
        {
          id: 'task-2',
          title: 'Weekly review',
          createdAt: '2024-05-18T10:00:00.000Z',
          listId: 'backlog',
          plannedFor: todayKey,
          dayStatus: 'todo',
          tags: [],
          priority: 'high',
          repeat: {
            frequency: 'weekly',
            days: ['monday'],
            autoAddToMyDay: true,
            lastOccurrenceDate: todayKey,
          },
        },
      ],
      order: {
        ...state.order,
        'day-todo': ['task-2'],
        'day-doing': [],
        'day-done': [],
      },
      timers: {},
    }));

    // simulate user removing it from My Day
    useStore.getState().toggleMyDay('task-2');

    const removedState = useStore.getState();
    expect(removedState.tasks[0].plannedFor).toBeNull();

    useStore.getState().applyRecurringTasksForToday();

    const state = useStore.getState();
    const task = state.tasks[0];

    expect(task.plannedFor).toBeNull();
    expect(task.repeat?.lastOccurrenceDate).toBe(todayKey);
    expect(state.order['day-todo']).not.toContain('task-2');
  });

  it('respects tasks already in My Day and only updates the last occurrence', () => {
    jest.useFakeTimers({ now: new Date('2024-05-20T09:00:00.000Z') });
    const todayKey = '2024-05-20';

    useStore.setState(state => ({
      ...state,
      tasks: [
        {
          id: 'task-3',
          title: 'Weekly sync',
          createdAt: '2024-05-18T10:00:00.000Z',
          listId: 'backlog',
          plannedFor: todayKey,
          dayStatus: 'doing',
          tags: [],
          priority: 'medium',
          repeat: {
            frequency: 'weekly',
            days: ['monday'],
            autoAddToMyDay: true,
            lastOccurrenceDate: null,
          },
        },
      ],
      order: {
        ...state.order,
        'day-todo': [],
        'day-doing': ['task-3'],
        'day-done': [],
      },
      timers: {},
    }));

    useStore.getState().applyRecurringTasksForToday();

    const state = useStore.getState();
    const task = state.tasks[0];

    expect(task.dayStatus).toBe('doing');
    expect(task.repeat?.lastOccurrenceDate).toBe(todayKey);
    expect(state.order['day-doing']).toEqual(['task-3']);
    expect(state.order['day-todo']).toEqual([]);
  });
});
