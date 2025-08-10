import { PersistedState } from './types';

export const STORAGE_KEY = 'localquickplanner:v1';

export function saveState(state: PersistedState) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadState(): PersistedState | undefined {
  if (typeof localStorage === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return;
  }
}
