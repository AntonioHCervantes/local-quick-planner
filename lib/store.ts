import { create } from 'zustand';
import {
  PersistedState,
  Task,
  TaskRepeat,
  List,
  Tag,
  Priority,
  Notification,
  TaskTimer,
  WorkSchedule,
  WorkPreferences,
  Weekday,
  WEEKDAYS,
} from './types';
import { loadState, saveState } from './storage';

const defaultLists: List[] = [
  { id: 'ideas', title: 'Ideas', order: 0 },
  { id: 'backlog', title: 'Backlog', order: 1 },
  { id: 'inprogress', title: 'In Progress', order: 2 },
  { id: 'done', title: 'Done', order: 3 },
];

export const DEFAULT_TIMER_DURATION = 5 * 60;

const createEmptyWorkSchedule = (): WorkSchedule => ({
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
});

const defaultWorkPreferences: WorkPreferences = {
  planningReminder: {
    enabled: false,
    minutesBefore: 15,
    lastNotifiedDate: null,
  },
};

const sanitizeSlots = (slots: unknown): number[] => {
  if (!Array.isArray(slots)) {
    return [];
  }
  return Array.from(
    new Set(
      slots
        .map(slot =>
          typeof slot === 'number' ? slot : Number.parseInt(String(slot), 10)
        )
        .filter(slot => Number.isFinite(slot) && slot >= 0 && slot < 48)
    )
  ).sort((a, b) => a - b);
};

const sanitizeWorkSchedule = (input: unknown): WorkSchedule => {
  if (!input || typeof input !== 'object') {
    return createEmptyWorkSchedule();
  }
  const schedule = input as Partial<Record<Weekday, unknown>>;
  return {
    monday: sanitizeSlots(schedule.monday),
    tuesday: sanitizeSlots(schedule.tuesday),
    wednesday: sanitizeSlots(schedule.wednesday),
    thursday: sanitizeSlots(schedule.thursday),
    friday: sanitizeSlots(schedule.friday),
    saturday: sanitizeSlots(schedule.saturday),
    sunday: sanitizeSlots(schedule.sunday),
  };
};

const sanitizeWorkPreferences = (input: unknown): WorkPreferences => {
  const defaults = defaultWorkPreferences.planningReminder;
  if (!input || typeof input !== 'object') {
    return {
      planningReminder: { ...defaults },
    };
  }
  const preferences = input as Partial<WorkPreferences>;
  const reminder = preferences.planningReminder as
    | Partial<WorkPreferences['planningReminder']>
    | undefined;
  const minutesBefore =
    typeof reminder?.minutesBefore === 'number' && reminder.minutesBefore > 0
      ? reminder.minutesBefore
      : defaults.minutesBefore;
  const lastNotifiedDate =
    typeof reminder?.lastNotifiedDate === 'string'
      ? reminder.lastNotifiedDate
      : null;

  return {
    planningReminder: {
      enabled: Boolean(reminder?.enabled),
      minutesBefore,
      lastNotifiedDate,
    },
  };
};

const WEEKDAY_SET = new Set<Weekday>(WEEKDAYS);

const WEEKDAY_ORDER = WEEKDAYS.reduce(
  (acc, day, index) => {
    acc[day] = index;
    return acc;
  },
  {} as Record<Weekday, number>
);

const sanitizeTaskRepeat = (input: unknown): TaskRepeat | null => {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const repeat = input as Partial<TaskRepeat> & { days?: unknown };
  if (repeat.frequency !== 'weekly') {
    return null;
  }

  const days = Array.isArray(repeat.days)
    ? Array.from(
        new Set(
          repeat.days
            .map(day =>
              typeof day === 'string' && WEEKDAY_SET.has(day as Weekday)
                ? (day as Weekday)
                : null
            )
            .filter((day): day is Weekday => day !== null)
        )
      )
    : [];

  if (days.length === 0) {
    return null;
  }

  days.sort((a, b) => WEEKDAY_ORDER[a] - WEEKDAY_ORDER[b]);

  const lastOccurrenceDate =
    typeof repeat.lastOccurrenceDate === 'string'
      ? repeat.lastOccurrenceDate
      : null;

  return {
    frequency: 'weekly',
    days,
    autoAddToMyDay: true,
    lastOccurrenceDate,
  };
};

const DAY_FROM_INDEX: Record<number, Weekday> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

const defaultState: PersistedState = {
  tasks: [],
  lists: defaultLists,
  tags: [],
  order: {
    'priority-high': [],
    'priority-medium': [],
    'priority-low': [],
    'list-ideas': [],
    'list-backlog': [],
    'list-inprogress': [],
    'list-done': [],
    'day-todo': [],
    'day-doing': [],
    'day-done': [],
  },
  notifications: [
    {
      id: 'welcome',
      type: 'info',
      titleKey: 'notifications.welcome.title',
      descriptionKey: 'notifications.welcome.description',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ],
  timers: {},
  mainMyDayTaskId: null,
  workSchedule: createEmptyWorkSchedule(),
  workPreferences: defaultWorkPreferences,
  version: 10,
};

type Store = PersistedState & {
  addTask: (input: {
    title: string;
    tags: string[];
    priority: Priority;
  }) => string;
  addTag: (tag: Tag) => void;
  removeTag: (label: string) => void;
  toggleFavoriteTag: (label: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  setTaskRepeat: (id: string, days: Weekday[]) => void;
  removeTask: (id: string) => void;
  moveTask: (
    id: string,
    update: { listId?: string; dayStatus?: 'todo' | 'doing' | 'done' }
  ) => void;
  reorderTask: (
    id: string,
    columnId: string,
    newIndex: number,
    scope: 'my-day' | 'kanban'
  ) => void;
  reorderMyTasks: (id: string, newIndex: number) => void;
  toggleMyDay: (id: string) => void;
  setTimerDuration: (id: string, duration: number) => void;
  toggleTimer: (id: string) => void;
  updateTimerRemaining: (id: string, remaining: number) => void;
  completeTimer: (id: string) => void;
  clearTimer: (id: string) => void;
  setMainMyDayTask: (id: string | null) => void;
  exportData: () => void;
  importData: (data: PersistedState) => void;
  clearAll: () => void;
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setWorkScheduleDay: (day: Weekday, slots: number[]) => void;
  toggleWorkScheduleSlot: (
    day: Weekday,
    slot: number,
    mode?: 'add' | 'remove'
  ) => 'add' | 'remove';
  setPlanningReminderEnabled: (enabled: boolean) => void;
  setPlanningReminderMinutes: (minutes: number) => void;
  setPlanningReminderLastNotified: (date: string | null) => void;
  applyRecurringTasksForToday: () => void;
};

const persisted = loadState();

if (persisted) {
  if (!persisted.tags) {
    persisted.tags = [];
  }
  if (!persisted.timers) {
    persisted.timers = {};
  }
  if (persisted.mainMyDayTaskId === undefined) {
    persisted.mainMyDayTaskId = null;
  }
  if (persisted.version < 3) {
    persisted.tasks.forEach(task => {
      if (!task.tags) {
        task.tags = [];
      }
      if (!task.priority) {
        (task as any).priority = 'medium';
      }
    });
    persisted.version = 3;
  }
  if (persisted.version < 4) {
    persisted.tags.forEach(tag => {
      if (tag.favorite === undefined) {
        tag.favorite = false;
      }
    });
    persisted.version = 4;
  }
  if (persisted.version < 5) {
    const newOrder = { ...persisted.order };
    (['high', 'medium', 'low'] as Priority[]).forEach(p => {
      const key = `priority-${p}`;
      if (!newOrder[key]) {
        newOrder[key] = persisted.tasks
          .filter(t => t.priority === p)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
          .map(t => t.id);
      }
    });
    persisted.order = newOrder;
    persisted.version = 5;
  }
  if (persisted.version < 6) {
    persisted.notifications = [
      {
        id: 'welcome',
        type: 'info',
        titleKey: 'notifications.welcome.title',
        descriptionKey: 'notifications.welcome.description',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ];
    persisted.version = 6;
  }
  if (persisted.version < 7) {
    persisted.timers = {};
    persisted.version = 7;
  }
  persisted.workSchedule = sanitizeWorkSchedule(persisted.workSchedule);
  persisted.workPreferences = sanitizeWorkPreferences(
    persisted.workPreferences
  );
  if (persisted.version < 8) {
    persisted.version = 8;
  }
  if (persisted.version < 9) {
    persisted.version = 9;
  }
  if (persisted.version < 10) {
    persisted.version = 10;
  }
  persisted.tasks = persisted.tasks.map(task => {
    const sanitizedRepeat = sanitizeTaskRepeat((task as any).repeat);
    return {
      ...task,
      repeat: sanitizedRepeat,
    };
  });
}

export const useStore = create<Store>((set, get) => ({
  ...(persisted ?? defaultState),
  addTask: ({ title, tags, priority }) => {
    const id = crypto.randomUUID();
    const task: Task = {
      id,
      title,
      createdAt: new Date().toISOString(),
      listId: 'backlog',
      plannedFor: null,
      tags,
      priority,
      repeat: null,
    };
    set(state => {
      const newOrder = { ...state.order };
      const listKey = `list-backlog`;
      const ids = newOrder[listKey] || [];
      const priorityOrder: Record<Priority, number> = {
        low: 0,
        medium: 1,
        high: 2,
      };
      let insertIndex = ids.findIndex(tid => {
        const t = state.tasks.find(task => task.id === tid);
        return t && priorityOrder[t.priority] < priorityOrder[priority];
      });
      if (insertIndex === -1) insertIndex = ids.length;
      newOrder[listKey] = [
        ...ids.slice(0, insertIndex),
        id,
        ...ids.slice(insertIndex),
      ];
      const priorityKey = `priority-${priority}`;
      newOrder[priorityKey] = [...(newOrder[priorityKey] || []), id];
      const lastTag = tags[tags.length - 1];
      const updatedTags = state.tags.map(t =>
        t.label === lastTag ? { ...t, favorite: true } : t
      );
      return {
        tasks: [...state.tasks, task],
        order: newOrder,
        tags: updatedTags,
      };
    });
    saveState(get());
    return id;
  },
  addTag: tag => {
    set(state => {
      if (state.tags.find(t => t.label === tag.label)) {
        return state;
      }
      return {
        tags: [...state.tags, { ...tag, favorite: tag.favorite ?? false }],
      };
    });
    saveState(get());
  },
  removeTag: label => {
    set(state => ({
      tags: state.tags.filter(t => t.label !== label),
      tasks: state.tasks.map(task => ({
        ...task,
        tags: task.tags.filter(t => t !== label),
      })),
    }));
    saveState(get());
  },
  toggleFavoriteTag: label => {
    set(state => ({
      tags: state.tags.map(t =>
        t.label === label ? { ...t, favorite: !t.favorite } : t
      ),
    }));
    saveState(get());
  },
  updateTask: (id, patch) => {
    set(state => {
      const tasks = state.tasks.map(t =>
        t.id === id ? { ...t, ...patch } : t
      );
      let newOrder = state.order;
      if (patch.priority) {
        const oldTask = state.tasks.find(t => t.id === id);
        if (oldTask && oldTask.priority !== patch.priority) {
          const oldKey = `priority-${oldTask.priority}`;
          const newKey = `priority-${patch.priority}`;
          const orderCopy = { ...state.order };
          orderCopy[oldKey] = (orderCopy[oldKey] || []).filter(
            tid => tid !== id
          );
          orderCopy[newKey] = [...(orderCopy[newKey] || []), id];
          newOrder = orderCopy;
        }
      }
      return { tasks, order: newOrder };
    });
    saveState(get());
  },
  setTaskRepeat: (id: string, days: Weekday[]) => {
    const normalizedDays: Weekday[] = Array.from(new Set(days)).sort(
      (a, b) => WEEKDAY_ORDER[a] - WEEKDAY_ORDER[b]
    );
    set(state => {
      let changed = false;
      const tasks = state.tasks.map(task => {
        if (task.id !== id) {
          return task;
        }
        if (normalizedDays.length === 0) {
          if (!task.repeat) {
            return task;
          }
          changed = true;
          return { ...task, repeat: null };
        }
        const current: TaskRepeat | null =
          task.repeat?.frequency === 'weekly' ? task.repeat : null;
        const currentDays = current
          ? [...current.days].sort(
              (a, b) => WEEKDAY_ORDER[a] - WEEKDAY_ORDER[b]
            )
          : [];
        const isSameDays =
          currentDays.length === normalizedDays.length &&
          currentDays.every((day, index) => day === normalizedDays[index]);
        if (isSameDays && current?.autoAddToMyDay) {
          return task;
        }
        changed = true;
        const lastOccurrenceDate =
          isSameDays && current ? (current.lastOccurrenceDate ?? null) : null;
        const nextRepeat: TaskRepeat = {
          frequency: 'weekly',
          days: [...normalizedDays],
          autoAddToMyDay: true,
          lastOccurrenceDate,
        };
        return {
          ...task,
          repeat: nextRepeat,
        };
      });
      if (!changed) {
        return {};
      }
      return { tasks };
    });
    saveState(get());
    if (normalizedDays.length > 0) {
      get().applyRecurringTasksForToday();
    }
  },
  removeTask: id => {
    set(state => {
      const newOrder = { ...state.order };
      for (const key in newOrder) {
        newOrder[key] = newOrder[key].filter(tid => tid !== id);
      }
      const tasks = state.tasks.filter(t => t.id !== id);
      const timers = { ...state.timers };
      delete timers[id];
      const mainMyDayTaskId =
        state.mainMyDayTaskId === id ? null : state.mainMyDayTaskId;
      const persisted = {
        tasks,
        lists: state.lists,
        tags: state.tags,
        order: newOrder,
        notifications: state.notifications,
        timers,
        mainMyDayTaskId,
        workSchedule: state.workSchedule,
        workPreferences: state.workPreferences,
        version: state.version,
      };
      saveState(persisted);
      return { tasks, order: newOrder, timers, mainMyDayTaskId };
    });
  },
  moveTask: (id, update) => {
    set(state => {
      const task = state.tasks.find(t => t.id === id);
      if (!task) return {};
      const newOrder = { ...state.order };
      const timers: Record<string, TaskTimer> = { ...state.timers };
      if (update.listId && update.listId !== task.listId) {
        const fromKey = `list-${task.listId}`;
        const toKey = `list-${update.listId}`;
        newOrder[fromKey] = newOrder[fromKey].filter(tid => tid !== id);
        newOrder[toKey] = [...(newOrder[toKey] || []), id];
        task.listId = update.listId;
      }
      if (update.dayStatus && update.dayStatus !== task.dayStatus) {
        const fromKey = task.dayStatus ? `day-${task.dayStatus}` : null;
        const toKey = `day-${update.dayStatus}`;
        if (fromKey)
          newOrder[fromKey] = newOrder[fromKey].filter(tid => tid !== id);
        newOrder[toKey] = [...(newOrder[toKey] || []), id];
        task.dayStatus = update.dayStatus;
        task.plannedFor = new Date().toISOString().slice(0, 10);
        const existingTimer = timers[id];
        if (update.dayStatus === 'doing') {
          if (existingTimer) {
            timers[id] = {
              ...existingTimer,
              running: existingTimer.running,
              remaining:
                existingTimer.running && existingTimer.endsAt
                  ? Math.max(
                      0,
                      Math.ceil(
                        (new Date(existingTimer.endsAt).getTime() -
                          Date.now()) /
                          1000
                      )
                    )
                  : existingTimer.remaining || existingTimer.duration,
            };
          } else {
            timers[id] = {
              duration: DEFAULT_TIMER_DURATION,
              remaining: DEFAULT_TIMER_DURATION,
              running: false,
              endsAt: null,
            };
          }
        } else if (existingTimer) {
          timers[id] = {
            ...existingTimer,
            running: false,
            remaining: existingTimer.duration,
            endsAt: null,
          };
        }
      }
      return {
        tasks: state.tasks.map(t => (t.id === id ? task : t)),
        order: newOrder,
        timers,
      };
    });
    saveState(get());
  },
  reorderTask: (id, columnId, newIndex, scope) => {
    const key = scope === 'kanban' ? `list-${columnId}` : `day-${columnId}`;
    set(state => {
      const items = Array.from(state.order[key] || []);
      const oldIndex = items.indexOf(id);
      if (oldIndex === -1) return {};
      items.splice(oldIndex, 1);
      items.splice(newIndex, 0, id);
      return { order: { ...state.order, [key]: items } };
    });
    saveState(get());
  },
  reorderMyTasks: (id, newIndex) => {
    set(state => {
      const high = Array.from(state.order['priority-high'] || []);
      const medium = Array.from(state.order['priority-medium'] || []);
      const low = Array.from(state.order['priority-low'] || []);
      [high, medium, low].forEach(arr => {
        const idx = arr.indexOf(id);
        if (idx !== -1) arr.splice(idx, 1);
      });
      const highCount = high.length;
      const mediumCount = medium.length;
      let priority: Priority;
      if (newIndex < highCount) {
        priority = 'high';
        high.splice(newIndex, 0, id);
      } else if (newIndex < highCount + mediumCount) {
        priority = 'medium';
        medium.splice(newIndex - highCount, 0, id);
      } else {
        priority = 'low';
        low.splice(newIndex - highCount - mediumCount, 0, id);
      }
      return {
        tasks: state.tasks.map(t => (t.id === id ? { ...t, priority } : t)),
        order: {
          ...state.order,
          'priority-high': high,
          'priority-medium': medium,
          'priority-low': low,
        },
      };
    });
    saveState(get());
  },
  toggleMyDay: id => {
    set(state => {
      const task = state.tasks.find(t => t.id === id);
      if (!task) return {};
      const newOrder = { ...state.order };
      const timers: Record<string, TaskTimer> = { ...state.timers };
      let mainMyDayTaskId = state.mainMyDayTaskId;
      if (task.plannedFor) {
        // remove from My Day
        if (task.dayStatus) {
          const key = `day-${task.dayStatus}`;
          newOrder[key] = newOrder[key].filter(tid => tid !== id);
        }
        task.plannedFor = null;
        task.dayStatus = undefined;
        delete timers[id];
        if (mainMyDayTaskId === id) {
          mainMyDayTaskId = null;
        }
      } else {
        // add to My Day as todo
        const today = new Date().toISOString().slice(0, 10);
        task.plannedFor = today;
        task.dayStatus = 'todo';
        const key = 'day-todo';
        const priorityOrder: Record<Priority, number> = {
          high: 0,
          medium: 1,
          low: 2,
        };
        const todoOrder = (newOrder[key] || []).filter(tid => tid !== id);
        const newTaskPriority = task.priority;
        const insertIndex = todoOrder.findIndex(tid => {
          const existingTask =
            tid === id ? task : state.tasks.find(t => t.id === tid);
          if (!existingTask) {
            return false;
          }
          const existingPriority =
            priorityOrder[existingTask.priority] ?? priorityOrder.medium;
          return existingPriority > priorityOrder[newTaskPriority];
        });
        newOrder[key] =
          insertIndex === -1
            ? [...todoOrder, id]
            : [
                ...todoOrder.slice(0, insertIndex),
                id,
                ...todoOrder.slice(insertIndex),
              ];
        const existingTimer = timers[id];
        timers[id] = existingTimer
          ? {
              ...existingTimer,
              running: false,
              remaining: existingTimer.duration,
              endsAt: null,
            }
          : {
              duration: DEFAULT_TIMER_DURATION,
              remaining: DEFAULT_TIMER_DURATION,
              running: false,
              endsAt: null,
            };
      }
      return {
        tasks: state.tasks.map(t => (t.id === id ? task : t)),
        order: newOrder,
        timers,
        mainMyDayTaskId,
      };
    });
    saveState(get());
  },
  setMainMyDayTask: id => {
    set(state => {
      if (!id) {
        return { mainMyDayTaskId: null };
      }
      const task = state.tasks.find(t => t.id === id);
      if (!task || !task.plannedFor) {
        return { mainMyDayTaskId: null };
      }
      return { mainMyDayTaskId: id };
    });
    saveState(get());
  },
  setTimerDuration: (id, duration) => {
    set(state => {
      const timers = {
        ...state.timers,
        [id]: {
          duration,
          remaining: duration,
          running: false,
          endsAt: null,
        },
      };
      return { timers };
    });
    saveState(get());
  },
  toggleTimer: id => {
    set(state => {
      const timers = { ...state.timers };
      const now = Date.now();
      const existing = timers[id];
      if (!existing) {
        const duration = DEFAULT_TIMER_DURATION;
        timers[id] = {
          duration,
          remaining: duration,
          running: true,
          endsAt: new Date(now + duration * 1000).toISOString(),
        };
      } else if (existing.running) {
        const endsAt = existing.endsAt
          ? new Date(existing.endsAt).getTime()
          : now;
        const remaining = Math.max(0, Math.ceil((endsAt - now) / 1000));
        timers[id] = {
          ...existing,
          running: false,
          remaining,
          endsAt: null,
        };
      } else {
        const remaining =
          existing.remaining > 0 ? existing.remaining : existing.duration;
        timers[id] = {
          ...existing,
          running: true,
          remaining,
          endsAt: new Date(now + remaining * 1000).toISOString(),
        };
      }
      return { timers };
    });
    saveState(get());
  },
  updateTimerRemaining: (id, remaining) => {
    set(state => {
      const timer = state.timers[id];
      if (!timer || timer.remaining === remaining) {
        return {};
      }
      return {
        timers: {
          ...state.timers,
          [id]: {
            ...timer,
            remaining,
          },
        },
      };
    });
  },
  completeTimer: id => {
    set(state => {
      const timer = state.timers[id];
      if (!timer) return {};
      return {
        timers: {
          ...state.timers,
          [id]: {
            ...timer,
            running: false,
            remaining: 0,
            endsAt: null,
          },
        },
      };
    });
    saveState(get());
  },
  clearTimer: id => {
    set(state => {
      if (!state.timers[id]) return {};
      const timers = { ...state.timers };
      delete timers[id];
      return { timers };
    });
    saveState(get());
  },
  exportData: () => {
    const data = JSON.stringify(get(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'localquickplanner.json';
    a.click();
    URL.revokeObjectURL(url);
  },
  importData: data => {
    const sanitized: PersistedState = {
      ...defaultState,
      ...data,
      timers: data.timers ?? {},
      mainMyDayTaskId: data.mainMyDayTaskId ?? null,
      workSchedule: sanitizeWorkSchedule(data.workSchedule),
      workPreferences: sanitizeWorkPreferences(data.workPreferences),
      version: defaultState.version,
    };
    set(() => sanitized);
    saveState(sanitized);
  },
  clearAll: () => {
    set(() => defaultState);
    saveState(defaultState);
  },
  addNotification: n => {
    set(state => ({ notifications: [n, ...state.notifications] }));
    saveState(get());
  },
  markNotificationRead: id => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
    saveState(get());
  },
  markAllNotificationsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    }));
    saveState(get());
  },
  setWorkScheduleDay: (day, slots) => {
    const sanitized = sanitizeSlots(slots);
    set(state => ({
      workSchedule: {
        ...(state.workSchedule ?? createEmptyWorkSchedule()),
        [day]: sanitized,
      },
    }));
    saveState(get());
  },
  toggleWorkScheduleSlot: (day, slot, mode) => {
    if (slot < 0 || slot >= 48) {
      return mode ?? 'add';
    }
    let applied: 'add' | 'remove' = mode ?? 'add';
    set(state => {
      const schedule = state.workSchedule ?? createEmptyWorkSchedule();
      const current = new Set(schedule[day] ?? []);
      if (!mode) {
        applied = current.has(slot) ? 'remove' : 'add';
      } else {
        applied = mode;
      }
      if (applied === 'add') {
        current.add(slot);
      } else {
        current.delete(slot);
      }
      return {
        workSchedule: {
          ...schedule,
          [day]: Array.from(current).sort((a, b) => a - b),
        },
      };
    });
    saveState(get());
    return applied;
  },
  setPlanningReminderEnabled: enabled => {
    set(state => {
      const current =
        state.workPreferences?.planningReminder ??
        defaultWorkPreferences.planningReminder;
      return {
        workPreferences: {
          planningReminder: {
            ...current,
            enabled,
          },
        },
      };
    });
    saveState(get());
  },
  setPlanningReminderMinutes: minutes => {
    const safeMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : 15;
    set(state => {
      const current =
        state.workPreferences?.planningReminder ??
        defaultWorkPreferences.planningReminder;
      return {
        workPreferences: {
          planningReminder: {
            ...current,
            minutesBefore: safeMinutes,
          },
        },
      };
    });
    saveState(get());
  },
  setPlanningReminderLastNotified: date => {
    set(state => {
      const current =
        state.workPreferences?.planningReminder ??
        defaultWorkPreferences.planningReminder;
      return {
        workPreferences: {
          planningReminder: {
            ...current,
            lastNotifiedDate: date,
          },
        },
      };
    });
    saveState(get());
  },
  applyRecurringTasksForToday: () => {
    const today = new Date();
    const weekday = DAY_FROM_INDEX[today.getDay()];
    if (!weekday) {
      return;
    }
    const todayKey = today.toISOString().slice(0, 10);
    let shouldSave = false;
    set(state => {
      let changed = false;
      let order = state.order;
      let timers = state.timers;
      const priorityOrder: Record<Priority, number> = {
        high: 0,
        medium: 1,
        low: 2,
      };
      const tasks = state.tasks.map(task => {
        const repeat: TaskRepeat | null =
          task.repeat?.frequency === 'weekly' ? task.repeat : null;
        if (!repeat || !repeat.days.includes(weekday)) {
          return task;
        }

        let updatedRepeat: TaskRepeat = repeat.autoAddToMyDay
          ? repeat
          : { ...repeat, autoAddToMyDay: true };

        const alreadyAppliedToday =
          updatedRepeat.lastOccurrenceDate === todayKey;

        if (alreadyAppliedToday) {
          if (updatedRepeat !== repeat) {
            changed = true;
            const updatedTask: Task = { ...task, repeat: updatedRepeat };
            return updatedTask;
          }
          return task;
        }

        updatedRepeat = {
          ...updatedRepeat,
          lastOccurrenceDate: todayKey,
        };

        if (task.plannedFor === todayKey) {
          changed = true;
          const updatedTask: Task = {
            ...task,
            repeat: updatedRepeat,
          };
          return updatedTask;
        }

        changed = true;
        if (order === state.order) {
          order = { ...state.order };
        }
        if (timers === state.timers) {
          timers = { ...state.timers };
        }

        if (task.dayStatus) {
          const fromKey = `day-${task.dayStatus}`;
          if (order[fromKey]) {
            order[fromKey] = order[fromKey].filter(tid => tid !== task.id);
          }
        }

        const todoKey = 'day-todo';
        const existingOrder = (order[todoKey] || []).filter(
          tid => tid !== task.id
        );
        const insertIndex = existingOrder.findIndex(tid => {
          const existingTask = state.tasks.find(t => t.id === tid);
          if (!existingTask) {
            return false;
          }
          return (
            priorityOrder[existingTask.priority] > priorityOrder[task.priority]
          );
        });
        order[todoKey] =
          insertIndex === -1
            ? [...existingOrder, task.id]
            : [
                ...existingOrder.slice(0, insertIndex),
                task.id,
                ...existingOrder.slice(insertIndex),
              ];

        const existingTimer = timers[task.id];
        timers[task.id] = existingTimer
          ? {
              ...existingTimer,
              running: false,
              remaining: existingTimer.duration,
              endsAt: null,
            }
          : {
              duration: DEFAULT_TIMER_DURATION,
              remaining: DEFAULT_TIMER_DURATION,
              running: false,
              endsAt: null,
            };

        const updatedTask: Task = {
          ...task,
          plannedFor: todayKey,
          dayStatus: 'todo',
          repeat: updatedRepeat,
        };
        return updatedTask;
      });

      if (!changed) {
        return {};
      }

      shouldSave = true;
      return { tasks, order, timers };
    });
    if (shouldSave) {
      saveState(get());
    }
  },
}));
