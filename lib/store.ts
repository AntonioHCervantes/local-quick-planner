import { create } from 'zustand';
import { PersistedState, Task, List, Tag, Priority } from './types';
import { loadState, saveState } from './storage';

const defaultLists: List[] = [
  { id: 'ideas', title: 'Ideas', order: 0 },
  { id: 'backlog', title: 'Backlog', order: 1 },
  { id: 'inprogress', title: 'In Progress', order: 2 },
  { id: 'done', title: 'Done', order: 3 },
];

const defaultState: PersistedState = {
  tasks: [],
  lists: defaultLists,
  tags: [],
  order: {
    'list-ideas': [],
    'list-backlog': [],
    'list-inprogress': [],
    'list-done': [],
    'day-todo': [],
    'day-doing': [],
    'day-done': [],
  },
  version: 2,
};

type Store = PersistedState & {
  addTask: (input: {
    title: string;
    tags: string[];
    priority: Priority;
  }) => void;
  addTag: (tag: Tag) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
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
  toggleMyDay: (id: string) => void;
  exportData: () => void;
  importData: (data: PersistedState) => void;
  clearAll: () => void;
};

const persisted = loadState();

if (persisted) {
  if (!persisted.tags) {
    persisted.tags = [];
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
      return { tasks: [...state.tasks, task], order: newOrder };
    });
    saveState(get());
  },
  addTag: tag => {
    set(state => {
      if (state.tags.find(t => t.label === tag.label)) {
        return state;
      }
      return { tags: [...state.tags, tag] };
    });
    saveState(get());
  },
  updateTask: (id, patch) => {
    set(state => ({
      tasks: state.tasks.map(t => (t.id === id ? { ...t, ...patch } : t)),
    }));
    saveState(get());
  },
  removeTask: id => {
    set(state => {
      const newOrder = { ...state.order };
      for (const key in newOrder) {
        newOrder[key] = newOrder[key].filter(tid => tid !== id);
      }
      const tasks = state.tasks.filter(t => t.id !== id);
      const persisted = {
        tasks,
        lists: state.lists,
        tags: state.tags,
        order: newOrder,
        version: state.version,
      };
      saveState(persisted);
      return { tasks, order: newOrder };
    });
  },
  moveTask: (id, update) => {
    set(state => {
      const task = state.tasks.find(t => t.id === id);
      if (!task) return {};
      const newOrder = { ...state.order };
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
      }
      return {
        tasks: state.tasks.map(t => (t.id === id ? task : t)),
        order: newOrder,
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
  toggleMyDay: id => {
    set(state => {
      const task = state.tasks.find(t => t.id === id);
      if (!task) return {};
      const newOrder = { ...state.order };
      if (task.plannedFor) {
        // remove from My Day
        if (task.dayStatus) {
          const key = `day-${task.dayStatus}`;
          newOrder[key] = newOrder[key].filter(tid => tid !== id);
        }
        task.plannedFor = null;
        task.dayStatus = undefined;
      } else {
        // add to My Day as todo
        const today = new Date().toISOString().slice(0, 10);
        task.plannedFor = today;
        task.dayStatus = 'todo';
        const key = 'day-todo';
        newOrder[key] = [...(newOrder[key] || []), id];
      }
      return {
        tasks: state.tasks.map(t => (t.id === id ? task : t)),
        order: newOrder,
      };
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
    set(() => data);
    saveState(data);
  },
  clearAll: () => {
    set(() => defaultState);
    saveState(defaultState);
  },
}));
