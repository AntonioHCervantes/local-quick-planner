'use client';
import { useEffect, useState } from 'react';
import { useStore } from '../../lib/store';
import { useI18n } from '../../lib/i18n';

export default function useHeader() {
  const { exportData, importData, clearAll } = useStore();
  const { t, language, setLanguage } = useI18n();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLang, setShowLang] = useState(false);
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

  const handleDelete = () => {
    clearAll();
    setShowConfirm(false);
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

  return {
    state: { showConfirm, showLang, theme, t, language },
    actions: {
      exportData,
      setShowConfirm,
      handleDelete,
      toggleTheme,
      setShowLang,
      setLanguage,
      handleImport,
    },
  } as const;
}
