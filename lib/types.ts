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

export type TaskTimer = {
  duration: number;
  remaining: number;
  running: boolean;
  endsAt: string | null;
};

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type WorkSchedule = Record<Weekday, number[]>;

export type WorkPreferences = {
  planningReminder: {
    enabled: boolean;
    minutesBefore: number;
    lastNotifiedDate: string | null;
  };
};

export type PersistedState = {
  tasks: Task[];
  lists: List[];
  tags: Tag[];
  order: Record<string, string[]>;
  notifications: Notification[];
  timers: Record<string, TaskTimer>;
  mainMyDayTaskId: string | null;
  workSchedule: WorkSchedule;
  workPreferences: WorkPreferences;
  version: number;
};

export type Notification = {
  id: string;
  type: 'info' | 'tip' | 'alert';
  titleKey: string;
  descriptionKey: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabelKey?: string;
};
