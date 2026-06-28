'use client';

import { useEffect, useState } from 'react';

export function useFreighter() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFreighter = () => {
      // Newer Freighter uses window.freighterApi, older uses window.freighter
      return (
        (typeof window !== 'undefined' && !!window.freighter) ||
        (typeof window !== 'undefined' && !!(window as any).freighterApi)
      );
    };

    if (checkFreighter()) {
      setIsAvailable(true);
      setIsLoading(false);
      return;
    }

    const handleFreighterLoaded = () => {
      setIsAvailable(true);
      setIsLoading(false);
    };
    window.addEventListener('freighter:loaded', handleFreighterLoaded);

    // Check every 100ms for up to 15 seconds
    const interval = setInterval(() => {
      if (checkFreighter()) {
        setIsAvailable(true);
        setIsLoading(false);
        clearInterval(interval);
        clearTimeout(timeout);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener('freighter:loaded', handleFreighterLoaded);
    };
  }, []);

  return { isAvailable, isLoading };
}
