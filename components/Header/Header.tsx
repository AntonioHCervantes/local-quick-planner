'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Download,
  Upload,
  Trash2,
  Sun,
  Moon,
  Settings,
  Bell,
  CalendarClock,
  AlertTriangle,
  Info,
  Lightbulb,
} from 'lucide-react';
import { Language, LANGUAGES } from '../../lib/i18n';
import Icon from '../Icon/Icon';
import useHeader from './useHeader';

export default function Header() {
  const { state, actions } = useHeader();
  const {
    showConfirm,
    showLang,
    theme,
    t,
    language,
    myDayCount,
    unreadNotifications,
    notifications,
  } = state;
  const {
    exportData,
    setShowConfirm,
    handleDelete,
    toggleTheme,
    setShowLang,
    setLanguage,
    handleImport,
  } = actions;
  const [showActions, setShowActions] = useState(false);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(
    null
  );
  const pathname = usePathname();
  const latestUnreadNotification = useMemo(() => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) {
      return null;
    }
    return unread.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [notifications]);
  const popoverTitle = useMemo(() => {
    if (!latestUnreadNotification) {
      return '';
    }
    return (
      latestUnreadNotification.title ?? t(latestUnreadNotification.titleKey)
    );
  }, [latestUnreadNotification, t]);
  const popoverDescription = useMemo(() => {
    if (!latestUnreadNotification) {
      return '';
    }
    const description =
      latestUnreadNotification.description ??
      t(latestUnreadNotification.descriptionKey);
    return description.length > 80
      ? `${description.slice(0, 77)}...`
      : description;
  }, [latestUnreadNotification, t]);
  const NotificationIcon =
    latestUnreadNotification?.type === 'alert'
      ? AlertTriangle
      : latestUnreadNotification?.type === 'tip'
        ? Lightbulb
        : Info;

  useEffect(() => {
    if (!latestUnreadNotification) {
      setShowNotificationPopover(false);
      return;
    }
    if (latestUnreadNotification.id !== lastNotificationId) {
      setLastNotificationId(latestUnreadNotification.id);
      setShowNotificationPopover(true);
    }
  }, [latestUnreadNotification, lastNotificationId]);

  useEffect(() => {
    if (!showNotificationPopover) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setShowNotificationPopover(false);
    }, 8000);
    return () => window.clearTimeout(timeout);
  }, [showNotificationPopover, lastNotificationId]);

  return (
    <>
      <header className="relative grid grid-cols-3 items-center bg-gray-100 px-2 py-2 dark:bg-gray-950 md:px-4 md:py-3 lg:py-4">
        <div className="flex items-center gap-2">
          <Icon />
          <span className="hidden text-lg font-semibold text-black dark:text-white sm:inline">
            Local Quick Planner
          </span>
        </div>
        <nav className="flex h-full items-center justify-center gap-4">
          <Link
            href="/my-day"
            className={`relative flex h-full min-w-[80px] items-center justify-center whitespace-nowrap no-underline hover:no-underline focus:no-underline ${
              pathname === '/my-day'
                ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black dark:after:bg-white'
                : ''
            }`}
          >
            {t('nav.myDay')}
            <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-current dark:bg-[rgb(62,74,113)]">
              {myDayCount}
            </span>
          </Link>
          <Link
            href="/my-tasks"
            className={`relative flex h-full min-w-[80px] items-center justify-center whitespace-nowrap no-underline hover:no-underline focus:no-underline ${
              pathname === '/my-tasks'
                ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black dark:after:bg-white'
                : ''
            }`}
          >
            {t('nav.myTasks')}
          </Link>
        </nav>
        <div className="flex items-center justify-self-end gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={toggleTheme}
              aria-label={t('actions.toggleTheme')}
              title={t('actions.toggleTheme')}
              className="rounded p-2 hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowLang(v => !v)}
                aria-label={t('actions.language')}
                title={t('actions.language')}
                className="rounded p-2 hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
              >
                {language.toUpperCase()}
              </button>
              {showLang && (
                <div className="absolute right-0 mt-2 w-48 rounded bg-gray-100 shadow dark:bg-gray-800">
                  {LANGUAGES.map(code => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                        setShowLang(false);
                      }}
                      className={`block w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700 ${
                        code === language
                          ? 'bg-gray-200 dark:bg-gray-700 font-semibold'
                          : ''
                      }`}
                    >
                      {code.toUpperCase()} - {t(`lang.${code}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <Link
              href="/notifications"
              aria-label={t('actions.notifications')}
              title={t('actions.notifications')}
              className="relative rounded p-2 hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
              onClick={() => setShowNotificationPopover(false)}
            >
              <span className="relative inline-flex">
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-[16px] rounded-full bg-red-500 px-1 text-center text-[10px] leading-4 text-white">
                    {unreadNotifications}
                  </span>
                )}
              </span>
            </Link>
            {showNotificationPopover && latestUnreadNotification && (
              <Link
                href="/notifications"
                onClick={() => setShowNotificationPopover(false)}
                className="absolute right-0 top-full z-20 w-64 border border-gray-200 bg-white px-4 py-3 shadow-lg transition-opacity hover:border-gray-300 focus:border-gray-300 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex items-start gap-3">
                  <NotificationIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold">{popoverTitle}</p>
                    <p className="mt-1 truncate text-sm text-gray-700 dark:text-gray-200">
                      {popoverDescription}
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </div>
          <button
            onClick={() => setShowActions(true)}
            aria-label={t('actions.settings')}
            title={t('actions.settings')}
            className="rounded p-2 hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>
      {showActions && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50"
          onClick={() => setShowActions(false)}
        >
          <div
            className="h-full w-64 bg-gray-100 p-4 dark:bg-gray-900"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  exportData();
                  setShowActions(false);
                }}
                className="flex items-center gap-2 rounded px-2 py-2 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <Download className="h-4 w-4" /> {t('actions.export')}
              </button>
              <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 hover:bg-gray-200 focus-within:bg-gray-200 dark:hover:bg-gray-800 dark:focus-within:bg-gray-800">
                <Upload className="h-4 w-4" /> {t('actions.import')}
                <input
                  type="file"
                  accept="application/json"
                  onChange={e => {
                    handleImport(e);
                    setShowActions(false);
                  }}
                  className="sr-only"
                />
              </label>
              <button
                onClick={() => {
                  setShowConfirm(true);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 rounded px-2 py-2 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <Trash2 className="h-4 w-4" /> {t('actions.clearAll')}
              </button>
              <button
                onClick={() => {
                  toggleTheme();
                  setShowActions(false);
                }}
                className="flex items-center gap-2 rounded px-2 py-2 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {t('actions.toggleTheme')}
              </button>
              <Link
                href="/settings/work-schedule"
                onClick={() => setShowActions(false)}
                className="flex items-center gap-2 rounded px-2 py-2 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <CalendarClock className="h-4 w-4" />{' '}
                {t('actions.workSchedule')}
              </Link>
              <div className="mt-2 border-t pt-2">
                <label
                  htmlFor="language-select"
                  className="mb-2 block text-sm"
                >
                  {t('actions.language')}
                </label>
                <select
                  id="language-select"
                  value={language}
                  onChange={e => {
                    setLanguage(e.target.value as Language);
                    setShowActions(false);
                  }}
                  className="w-full rounded px-2 py-2 bg-gray-200 dark:bg-gray-800"
                >
                  {LANGUAGES.map(code => (
                    <option
                      key={code}
                      value={code}
                    >
                      {code.toUpperCase()} - {t(`lang.${code}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded bg-gray-900 p-6 text-center text-gray-100">
            <p className="mb-4">{t('confirmDelete.message')}</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded bg-gray-700 px-3 py-1 hover:bg-gray-600 focus:bg-gray-600"
              >
                {t('confirmDelete.cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="rounded bg-[rgb(184,75,79)] px-3 py-1 text-white hover:brightness-110 focus:brightness-110"
              >
                {t('confirmDelete.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
