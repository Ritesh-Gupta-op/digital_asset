import { useState, useEffect } from 'react';

/**
 * Debounces a value by the given delay (ms).
 * The returned value only updates once the input has been stable for `delay` ms.
 * Useful for avoiding excessive computation or API calls on fast-changing inputs
 * such as search fields.
 *
 * @param value  The value to debounce
 * @param delay  Debounce delay in milliseconds (default: 300)
 *
 * @example
 * const debouncedQuery = useDebounce(searchQuery, 400);
 * // Use debouncedQuery in API calls / filtering instead of searchQuery
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
