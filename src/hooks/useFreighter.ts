'use client';

import { useEffect, useState } from 'react';

export function useFreighter() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if Freighter is already available
    if (typeof window !== 'undefined' && window.freighter) {
      setIsAvailable(true);
      setIsLoading(false);
      return;
    }

    // Wait for Freighter to be injected
    const checkFreighter = () => {
      if (typeof window !== 'undefined' && window.freighter) {
        setIsAvailable(true);
        setIsLoading(false);
      }
    };

    // Check immediately
    checkFreighter();

    // Set up periodic check for first 5 seconds
    const interval = setInterval(checkFreighter, 100);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
    }, 5000);

    // Listen for the freighter:loaded event if available
    if (typeof window !== 'undefined') {
      const handleFreighterLoaded = () => {
        setIsAvailable(true);
        setIsLoading(false);
      };
      window.addEventListener('freighter:loaded', handleFreighterLoaded);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
        window.removeEventListener('freighter:loaded', handleFreighterLoaded);
      };
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return { isAvailable, isLoading };
}
