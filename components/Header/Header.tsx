'use client';
import Link from 'next/link';
import { Download, Upload, Trash2, Sun, Moon } from 'lucide-react';
import { Language } from '../../lib/i18n';
import useHeader from './useHeader';

export default function Header() {
  const { state, actions } = useHeader();
  const { showConfirm, showLang, theme, t, language, myDayCount } = state;
  const {
    exportData,
    setShowConfirm,
    handleDelete,
    toggleTheme,
    setShowLang,
    setLanguage,
    handleImport,
  } = actions;

  return (
    <>
      <header className="flex items-center justify-between bg-[hsl(var(--surface-2))] px-4 py-2">
        <nav className="flex gap-4">
          <Link
            href="/my-day"
            className="flex items-center hover:underline focus:underline"
          >
            {t('nav.myDay')}
            <span className="ml-1 chip-warning px-2 py-0.5">{myDayCount}</span>
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
            title={t('actions.export')}
            className="btn-ghost"
          >
            <Download className="h-4 w-4" />
          </button>
          <label
            aria-label={t('actions.import')}
            title={t('actions.import')}
            className="cursor-pointer btn-ghost"
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
            title={t('actions.clearAll')}
            className="btn-ghost"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={toggleTheme}
            aria-label={t('actions.toggleTheme')}
            title={t('actions.toggleTheme')}
            className="btn-ghost"
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
              className="btn-ghost"
            >
              {language.toUpperCase()}
            </button>
            {showLang && (
              <div className="absolute right-0 mt-2 rounded bg-[hsl(var(--surface-2))] shadow">
                {(['en', 'es'] as Language[]).map(code => (
                  <button
                    key={code}
                    onClick={() => {
                      setLanguage(code);
                      setShowLang(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-[hsl(var(--surface-3))]"
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
          <div className="w-full max-w-sm rounded bg-[hsl(var(--surface))] p-6 text-center text-[hsl(var(--text))]">
            <p className="mb-4">{t('confirmDelete.message')}</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-secondary px-3 py-1"
              >
                {t('confirmDelete.cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger px-3 py-1"
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
