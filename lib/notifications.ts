import { Notification } from './types';

const ICON_COLOR_CLASSES: Record<Notification['type'], string> = {
  info: 'text-blue-600 dark:text-blue-300',
  tip: 'text-amber-500 dark:text-amber-300',
  alert: 'text-red-500 dark:text-red-300',
};

export function getNotificationIconClasses(
  type: Notification['type'] | undefined
) {
  if (!type) {
    return ICON_COLOR_CLASSES.info;
  }

  return ICON_COLOR_CLASSES[type];
}
