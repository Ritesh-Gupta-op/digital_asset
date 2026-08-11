import { useState, useEffect, useCallback, useRef } from 'react';
import { apiGetAnalytics, AnalyticsData } from '@/services/api';

interface UseAnalyticsPollOptions {
  /** Poll interval in milliseconds. Defaults to 30 000 ms (30 s). */
  intervalMs?: number;
  /** Start polling immediately on mount. Defaults to true. */
  autoStart?: boolean;
}

interface UseAnalyticsPollResult {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

/**
 * Polls the /api/analytics endpoint on a configurable interval.
 * Cleans up automatically on unmount to prevent memory leaks.
 *
 * @example
 * const { data, loading, lastUpdated, refresh } = useAnalyticsPoller({ intervalMs: 15_000 });
 */
export function useAnalyticsPoller({
  intervalMs = 30_000,
  autoStart = true,
}: UseAnalyticsPollOptions = {}): UseAnalyticsPollResult {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(autoStart);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiGetAnalytics();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError((err as Error).message ?? 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoStart) return;

    // Fetch immediately, then schedule recurring polls.
    refresh();
    timerRef.current = setInterval(refresh, intervalMs);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [refresh, intervalMs, autoStart]);

  return { data, loading, error, lastUpdated, refresh };
}
