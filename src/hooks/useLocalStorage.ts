import { useState, useEffect, useCallback } from 'react';

/**
 * Persists state to localStorage, keeping it in sync across tabs via the
 * `storage` event. Falls back gracefully if localStorage is unavailable
 * (e.g., SSR, private browsing mode with storage disabled).
 *
 * @param key       localStorage key
 * @param initial   Initial value (or factory function) used when no persisted value exists
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'dark');
 */
export function useLocalStorage<T>(
  key: string,
  initial: T | (() => T),
): [T, (value: T | ((prev: T) => T)) => void] {
  const getInitial = (): T => (typeof initial === 'function' ? (initial as () => T)() : initial);

  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return getInitial();
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : getInitial();
    } catch {
      return getInitial();
    }
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage quota exceeded or private mode — silently ignore
    }
  }, [key, state]);

  // Sync state when another tab writes the same key
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        if (e.newValue === null) {
          setState(getInitial());
        } else {
          setState(JSON.parse(e.newValue) as T);
        }
      } catch {
        // Ignore parse errors from other tabs
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
        return next;
      });
    },
    [],
  );

  return [state, set];
}
