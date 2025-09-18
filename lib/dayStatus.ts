import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import type { Task } from './types';

export type DayStatus = NonNullable<Task['dayStatus']>;

export const DAY_STATUS_ICONS: Record<DayStatus, LucideIcon> = {
  todo: Circle,
  doing: Loader2,
  done: CheckCircle2,
};

export function getDayStatusIcon(
  status?: Task['dayStatus']
): LucideIcon | null {
  if (!status) {
    return null;
  }

  return DAY_STATUS_ICONS[status];
}
