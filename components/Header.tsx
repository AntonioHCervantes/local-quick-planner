'use client';
import Link from 'next/link';
import { Download, Upload, Trash2, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { useI18n, Language } from '../lib/i18n';

export default function Header() {
  const { exportData, importData, clearAll } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const { t, language, setLanguage } = useI18n();
  const [showLang, setShowLang] = useState(false);

  const handleDelete = () => {
    clearAll();
    setShowConfirm(false);
  };
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      document.documentElement.classList.toggle('dark', stored === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        importData(data);
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <header className="flex items-center justify-between bg-gray-100 px-4 py-2 dark:bg-gray-950">
        <nav className="flex gap-4">
          <Link
            href="/my-day"
            className="hover:underline focus:underline"
          >
            {t('nav.myDay')}
          </Link>
          <Link
            href="/my-tasks"
            className="hover:underline focus:underline"
          >
            {t('nav.myTasks')}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={exportData}
            aria-label={t('actions.export')}
            className="rounded p-2 hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
          >
            <Download className="h-4 w-4" />
          </button>
          <label
            aria-label={t('actions.import')}
            className="cursor-pointer rounded p-2 hover:bg-gray-200 focus-within:bg-gray-200 dark:hover:bg-gray-800 dark:focus-within:bg-gray-800"
          >
            <Upload className="h-4 w-4" />
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="sr-only"
            />
          </label>
          <button
            onClick={() => setShowConfirm(true)}
            aria-label={t('actions.clearAll')}
            className="rounded p-2 hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={toggleTheme}
            aria-label={t('actions.toggleTheme')}
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
              className="rounded p-2 hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
            >
              {language.toUpperCase()}
            </button>
            {showLang && (
              <div className="absolute right-0 mt-2 rounded bg-gray-100 shadow dark:bg-gray-800">
                {(['en', 'es'] as Language[]).map(code => (
                  <button
                    key={code}
                    onClick={() => {
                      setLanguage(code);
                      setShowLang(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {code.toUpperCase()} - {t(`lang.${code}`)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
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
                className="rounded bg-red-600 px-3 py-1 hover:bg-red-500 focus:bg-red-500"
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
