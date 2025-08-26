'use client';

import { useEffect } from 'react';
import NotificationCard from '../../components/NotificationCard/NotificationCard';
import { useStore } from '../../lib/store';
import { useI18n } from '../../lib/i18n';

export default function NotificationsPage() {
  const notifications = useStore(state => state.notifications);
  const markAllNotificationsRead = useStore(
    state => state.markAllNotificationsRead
  );
  const { t } = useI18n();

  useEffect(() => {
    markAllNotificationsRead();
  }, [markAllNotificationsRead]);

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="text-2xl font-bold">{t('notifications.title')}</h1>
      {sorted.length === 0 ? (
        <p>{t('notifications.empty')}</p>
      ) : (
        <div className="space-y-4">
          {sorted.map(n => (
            <NotificationCard
              key={n.id}
              notification={n}
            />
          ))}
        </div>
      )}
    </main>
  );
}
