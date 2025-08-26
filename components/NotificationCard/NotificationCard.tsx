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

  return (
    <div className="rounded border border-gray-200 p-4 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <Icon className="mt-1 h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          <h2 className="font-semibold">{t(notification.titleKey)}</h2>
          <p className="text-sm">{t(notification.descriptionKey)}</p>
          {notification.actionUrl && notification.actionLabelKey && (
            <a
              href={notification.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-500"
            >
              {t(notification.actionLabelKey)}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
