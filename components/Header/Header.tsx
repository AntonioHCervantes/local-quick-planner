'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Download,
  Upload,
  Trash2,
  Sun,
  Moon,
  Settings,
  Bell,
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

  return (
    <>
      <header className="flex items-center justify-between bg-gray-100 px-4 py-2 dark:bg-gray-950">
        <div className="flex items-center gap-4">
          <Icon />
          <nav className="flex gap-4">
            <Link
              href="/my-day"
              className="flex items-center hover:underline focus:underline"
            >
              {t('nav.myDay')}
              <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-current dark:bg-[rgb(62,74,113)]">
                {myDayCount}
              </span>
            </Link>
            <Link
              href="/my-tasks"
              className="hover:underline focus:underline"
            >
              {t('nav.myTasks')}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
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
          <Link
            href="/notifications"
            aria-label={t('actions.notifications')}
            title={t('actions.notifications')}
            className="relative rounded p-2 hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
          >
            <Bell className="h-4 w-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -right-1 -top-1 min-w-[16px] rounded-full bg-red-500 px-1 text-center text-[10px] leading-4 text-white">
                {unreadNotifications}
              </span>
            )}
          </Link>
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
