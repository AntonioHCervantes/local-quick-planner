'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Info,
  AlertTriangle,
  Lightbulb,
  MonitorSmartphone,
  LayoutTemplate,
  X,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Notification } from '../../lib/types';
import { useStore } from '../../lib/store';
import { getNotificationIconClasses } from '../../lib/notifications';
import { usePwaInstallPrompt } from '../../lib/usePwaInstallPrompt';

interface Props {
  notification: Notification;
}

export default function NotificationCard({ notification }: Props) {
  const { t } = useI18n();
  const removeNotification = useStore(state => state.removeNotification);
  const { canInstall, isInstalled, promptInstall } = usePwaInstallPrompt();
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
  const actions: { key: string; node: ReactNode }[] = [];
  const installDisabled = isInstalled || !canInstall;
  const installTitle = isInstalled
    ? t('notifications.welcome.installInstalled')
    : !canInstall
      ? t('notifications.welcome.installUnavailable')
      : undefined;

  if (notification.id === 'welcome') {
    actions.push({
      key: 'install',
      node: (
        <button
          type="button"
          onClick={() => {
            if (!installDisabled) {
              void promptInstall();
            }
          }}
          disabled={installDisabled}
          title={installTitle}
          className={`inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
            installDisabled
              ? 'cursor-not-allowed opacity-60 hover:bg-emerald-600'
              : 'hover:bg-emerald-500'
          }`}
        >
          <MonitorSmartphone
            className="h-4 w-4"
            aria-hidden="true"
          />
          {t('notifications.welcome.installCta')}
        </button>
      ),
    });

    actions.push({
      key: 'demo',
      node: (
        <Link
          href="/demo-templates"
          className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-4 py-1.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus-visible:outline-gray-600"
        >
          <LayoutTemplate
            className="h-4 w-4"
            aria-hidden="true"
          />
          {t('notifications.welcome.demoCta')}
        </Link>
      ),
    });
  }

  if (notification.actionUrl && notification.actionLabelKey) {
    actions.push({
      key: 'action',
      node: (
        <a
          href={notification.actionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-full flex-wrap break-words rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          {t(notification.actionLabelKey)}
        </a>
      ),
    });
  }

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
          {actions.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2">
              {actions.map(action => (
                <span
                  key={action.key}
                  className="inline-flex"
                >
                  {action.node}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
