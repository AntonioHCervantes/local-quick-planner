'use client';

import { Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Notification } from '../../lib/types';

interface Props {
  notification: Notification;
}

export default function NotificationCard({ notification }: Props) {
  const { t } = useI18n();
  const Icon =
    notification.type === 'alert'
      ? AlertTriangle
      : notification.type === 'tip'
        ? Lightbulb
        : Info;
  const title = notification.title ?? t(notification.titleKey);
  const description =
    notification.description ?? t(notification.descriptionKey);

  return (
    <div className="rounded border border-gray-200 p-6 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <Icon className="mt-1 h-6 w-6 flex-shrink-0" />
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 w-full text-base">{description}</p>
          {notification.actionUrl && notification.actionLabelKey && (
            <a
              href={notification.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-500"
            >
              {t(notification.actionLabelKey)}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
