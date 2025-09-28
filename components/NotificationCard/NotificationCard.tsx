'use client';

import { Info, AlertTriangle, Lightbulb, X } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Notification } from '../../lib/types';
import { useStore } from '../../lib/store';
import { getNotificationIconClasses } from '../../lib/notifications';

interface Props {
  notification: Notification;
}

export default function NotificationCard({ notification }: Props) {
  const { t } = useI18n();
  const removeNotification = useStore(state => state.removeNotification);
  const Icon =
    notification.type === 'alert'
      ? AlertTriangle
      : notification.type === 'tip'
        ? Lightbulb
        : Info;
  const title = notification.title ?? t(notification.titleKey);
  const description =
    notification.description ?? t(notification.descriptionKey);
  const dismissLabel = t('notifications.dismiss');

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-700/60">
      <button
        type="button"
        aria-label={dismissLabel}
        title={dismissLabel}
        onClick={() => removeNotification(notification.id)}
        className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
      >
        <X
          className="h-4 w-4"
          aria-hidden="true"
        />
      </button>
      <div className="flex items-start gap-4">
        <Icon
          className={`mt-1 h-6 w-6 flex-shrink-0 ${getNotificationIconClasses(notification.type)}`}
          aria-hidden="true"
        />
        <div className="flex-1 space-y-3 pr-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <p className="text-base leading-relaxed text-gray-700 break-words dark:text-gray-200">
            {description}
          </p>
          {notification.actionUrl && notification.actionLabelKey && (
            <a
              href={notification.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full flex-wrap break-words rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              {t(notification.actionLabelKey)}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
