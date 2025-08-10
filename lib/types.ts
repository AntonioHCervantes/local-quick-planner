export type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  dueDate?: string | null;
  priority?: 'low' | 'med' | 'high';
  tags?: string[];
  listId: string;
  plannedFor: string | null;
  dayStatus?: 'todo' | 'doing' | 'done';
};

export type List = { id: string; title: string; order: number };

export type PersistedState = {
  tasks: Task[];
  lists: List[];
  order: Record<string, string[]>;
  version: number;
};
