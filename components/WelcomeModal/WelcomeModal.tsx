'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useI18n } from '../../lib/i18n';

const WELCOME_KEY = 'localquickplanner:welcome';

export default function WelcomeModal() {
  const { tasks } = useStore();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (tasks.length === 0 && typeof window !== 'undefined') {
      const seen = localStorage.getItem(WELCOME_KEY);
      if (!seen) {
        setShow(true);
      }
    }
  }, [tasks]);

  const close = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WELCOME_KEY, '1');
    }
    setShow(false);
    router.push('/my-tasks');
  };

  if (!show) return null;

  const items = [
    t('welcomeModal.item1'),
    t('welcomeModal.item2'),
    t('welcomeModal.item3'),
    t('welcomeModal.item4'),
    t('welcomeModal.item5'),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded bg-white p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="mb-4 text-center text-2xl font-bold">
          {t('welcomeModal.title')}
        </h2>
        <ul className="mb-6 space-y-2">
          {items.map(text => (
            <li
              key={text}
              className="flex items-start gap-2"
            >
              <Check className="mt-1 h-5 w-5 text-green-600" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <div className="text-center">
          <button
            onClick={close}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 focus:bg-blue-500"
          >
            {t('welcomeModal.cta')}
          </button>
        </div>
      </div>
    </div>
  );
}
