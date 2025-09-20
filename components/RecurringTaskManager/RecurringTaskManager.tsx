'use client';

import { useEffect } from 'react';
import { useStore } from '../../lib/store';

const CHECK_INTERVAL = 15 * 60 * 1000;

export default function RecurringTaskManager() {
  useEffect(() => {
    const apply = () => {
      useStore.getState().applyRecurringTasksForToday();
    };

    apply();

    const interval = window.setInterval(apply, CHECK_INTERVAL);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        apply();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return null;
}
