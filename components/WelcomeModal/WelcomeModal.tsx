'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useStore } from '../../lib/store';

const WELCOME_KEY = 'localquickplanner:welcome';

export default function WelcomeModal() {
  const { tasks } = useStore();
  const router = useRouter();
  const [show, setShow] = useState(false);

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
    'Mejora tu productividad, planificaca tus tareas y organiza tu trabajo diario.',
    'Tus datos se almacenan en local, no se envían a ningún servidor.',
    'Exporta tus datos para hacer copias de seguridad en local cada cierto tiempo.',
    'Diseñado para uso personal, no para equipos.',
    '100% gratis e ilimitado, open source.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded bg-white p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="mb-4 text-center text-2xl font-bold">
          Local Quick Planner
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
            Let&apos;s go!
          </button>
        </div>
      </div>
    </div>
  );
}
