import { useMemo, useState } from 'react';
import type { ApiLicense } from '@/services/api';
import { useDebounce } from './useDebounce';

type LicenseStatusFilter = 'all' | 'draft' | 'active' | 'revoked';

interface UseLicenseSearchOptions {
  licenses: ApiLicense[];
  /** Debounce delay for text query in ms (default: 250). */
  debounceMs?: number;
}

interface UseLicenseSearchResult {
  query: string;
  setQuery: (q: string) => void;
  statusFilter: LicenseStatusFilter;
  setStatusFilter: (f: LicenseStatusFilter) => void;
  filtered: ApiLicense[];
  total: number;
}

/**
 * Client-side hook that provides debounced text search and status filtering
 * over a list of ApiLicense objects. The filtering is applied with useMemo so
 * it re-runs only when the debounced query, status filter, or source data change.
 */
export function useLicenseSearch({
  licenses,
  debounceMs = 250,
}: UseLicenseSearchOptions): UseLicenseSearchResult {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LicenseStatusFilter>('all');

  const debouncedQuery = useDebounce(query, debounceMs);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return licenses.filter((lic) => {
      const matchesQuery =
        !q ||
        lic.title.toLowerCase().includes(q) ||
        (lic.terms ?? '').toLowerCase().includes(q) ||
        lic.contractId.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || lic.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [licenses, debouncedQuery, statusFilter]);

  return {
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    filtered,
    total: filtered.length,
  };
}
