export type Priority = 'low' | 'medium' | 'high';

export type Tag = {
  id: string;
  label: string;
  color: string;
  favorite?: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  dueDate?: string | null;
  priority: Priority;
  tags: string[]; // store tag ids
  listId: string;
  plannedFor: string | null;
  dayStatus?: 'todo' | 'doing' | 'done';
};

export type List = { id: string; title: string; order: number };

export type PersistedState = {
  tasks: Task[];
  lists: List[];
  tags: Tag[];
  order: Record<string, string[]>;
  version: number;
};
