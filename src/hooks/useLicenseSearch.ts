import { useMemo, useState } from 'react';
import type { ApiLicense } from '@/services/api';

type LicenseStatusFilter = 'all' | 'draft' | 'active' | 'revoked';

interface UseLicenseSearchOptions {
  licenses: ApiLicense[];
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
 * Client-side hook that provides text search and status filtering
 * over a list of ApiLicense objects. The filtering is applied with
 * useMemo so it re-runs only when the source data or filter values change.
 */
export function useLicenseSearch({ licenses }: UseLicenseSearchOptions): UseLicenseSearchResult {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LicenseStatusFilter>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return licenses.filter((lic) => {
      const matchesQuery =
        !q ||
        lic.title.toLowerCase().includes(q) ||
        (lic.terms ?? '').toLowerCase().includes(q) ||
        lic.contractId.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || lic.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [licenses, query, statusFilter]);

  return {
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    filtered,
    total: filtered.length,
  };
}
