'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { useI18n } from '../../lib/i18n';

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const tasks = useStore(state => state.tasks);
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    const seen = localStorage.getItem('welcomeSeen');
    if (!seen && tasks.length === 0) {
      setOpen(true);
    }
  }, [tasks]);

  const handleClose = () => {
    localStorage.setItem('welcomeSeen', '1');
    setOpen(false);
    router.push('/my-tasks');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-gray-900 shadow-lg dark:bg-gray-800 dark:text-gray-100">
        <h2 className="mb-4 text-2xl font-bold">{t('welcomeModal.title')}</h2>
        <ul className="mb-6 space-y-2">
          {[1, 2, 3, 4, 5].map(n => (
            <li
              key={n}
              className="flex items-start gap-2"
            >
              <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
              <span>{t(`welcomeModal.p${n}`)}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={handleClose}
          className="w-full rounded bg-[#57886C] px-4 py-2 text-white hover:brightness-110 focus:ring"
        >
          {t('welcomeModal.cta')}
        </button>
      </div>
    </div>
  );
}
