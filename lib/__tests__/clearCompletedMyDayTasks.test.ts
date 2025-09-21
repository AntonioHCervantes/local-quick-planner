import { useStore, DEFAULT_TIMER_DURATION } from '../store';

describe('clearCompletedMyDayTasks', () => {
  const resetState = () => {
    useStore.setState(state => ({
      ...state,
      tasks: [],
      order: {
        ...state.order,
        'day-todo': [],
        'day-doing': [],
        'day-done': [],
        'priority-high': [],
        'priority-medium': [],
        'priority-low': [],
      },
      timers: {},
      mainMyDayTaskId: null,
    }));
  };

  beforeEach(() => {
    resetState();
  });

  afterEach(() => {
    resetState();
  });

  it('removes non recurring completed tasks completely', () => {
    useStore.setState(state => ({
      ...state,
      tasks: [
        {
          id: 'task-1',
          title: 'Finish report',
          createdAt: '2024-06-01T08:00:00.000Z',
          listId: 'backlog',
          plannedFor: '2024-06-02',
          dayStatus: 'done',
          tags: [],
          priority: 'medium',
          repeat: null,
        },
      ],
      order: {
        ...state.order,
        'day-done': ['task-1'],
        'priority-medium': ['task-1'],
      },
      timers: {
        ...state.timers,
        'task-1': {
          duration: DEFAULT_TIMER_DURATION,
          remaining: DEFAULT_TIMER_DURATION,
          running: false,
          endsAt: null,
        },
      },
      mainMyDayTaskId: 'task-1',
    }));

    useStore.getState().clearCompletedMyDayTasks();

    const state = useStore.getState();
    expect(state.tasks.find(task => task.id === 'task-1')).toBeUndefined();
    expect(state.order['day-done']).not.toContain('task-1');
    expect(state.order['priority-medium']).not.toContain('task-1');
    expect(state.timers['task-1']).toBeUndefined();
    expect(state.mainMyDayTaskId).toBeNull();
  });

  it('removes recurring tasks only from My Day', () => {
    useStore.setState(state => ({
      ...state,
      tasks: [
        {
          id: 'task-2',
          title: 'Weekly planning',
          createdAt: '2024-06-01T08:00:00.000Z',
          listId: 'backlog',
          plannedFor: '2024-06-02',
          dayStatus: 'done',
          tags: [],
          priority: 'high',
          repeat: {
            frequency: 'weekly',
            days: ['monday'],
            autoAddToMyDay: true,
            lastOccurrenceDate: '2024-06-02',
          },
        },
      ],
      order: {
        ...state.order,
        'day-done': ['task-2'],
        'priority-high': ['task-2'],
      },
      timers: {
        ...state.timers,
        'task-2': {
          duration: DEFAULT_TIMER_DURATION,
          remaining: 120,
          running: true,
          endsAt: '2024-06-02T09:00:00.000Z',
        },
      },
      mainMyDayTaskId: 'task-2',
    }));

    useStore.getState().clearCompletedMyDayTasks();

    const state = useStore.getState();
    const task = state.tasks.find(t => t.id === 'task-2');
    expect(task).toBeDefined();
    expect(task?.plannedFor).toBeNull();
    expect(task?.dayStatus).toBeUndefined();
    expect(task?.repeat?.frequency).toBe('weekly');
    expect(state.order['day-done']).not.toContain('task-2');
    expect(state.order['priority-high']).toContain('task-2');
    expect(state.timers['task-2']).toBeUndefined();
    expect(state.mainMyDayTaskId).toBeNull();
  });

  it('ignores tasks that are not completed', () => {
    useStore.setState(state => ({
      ...state,
      tasks: [
        {
          id: 'task-3',
          title: 'Unfinished task',
          createdAt: '2024-06-01T08:00:00.000Z',
          listId: 'backlog',
          plannedFor: '2024-06-02',
          dayStatus: 'doing',
          tags: [],
          priority: 'low',
          repeat: null,
        },
      ],
      order: {
        ...state.order,
        'day-doing': ['task-3'],
        'priority-low': ['task-3'],
      },
    }));

    useStore.getState().clearCompletedMyDayTasks();

    const state = useStore.getState();
    expect(state.tasks.find(task => task.id === 'task-3')).toBeDefined();
    expect(state.order['day-doing']).toContain('task-3');
    expect(state.order['priority-low']).toContain('task-3');
  });
});
