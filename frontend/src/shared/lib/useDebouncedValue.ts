import { useEffect, useState } from 'react';

/**
 * Returns `value` after it has stayed unchanged for `delay` ms.
 * Use case: debounced search inputs feeding RTK Query hooks.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
