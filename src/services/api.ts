/**
 * Typed API client for LicenseCraft backend.
 * All browser code should use these functions instead of calling Stellar SDK directly.
 */

export interface ApiTransaction {
  id: string;
  hash?: string;
  status: 'pending' | 'processing' | 'confirmed' | 'failed';
  description: string;
  contractId?: string;
  explorerUrl?: string;
  amount?: string;
  from?: string;
  createdAt: string;
}

export interface ApiLicense {
  id: string;
  title: string;
  terms?: string;
  status: 'draft' | 'active' | 'revoked';
  contractId: string;
  ownerAddress?: string;
  txHash?: string;
  amount?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  totals: {
    transactions: number;
    confirmed: number;
    pending: number;
    failed: number;
    licenses: number;
    activeLicenses: number;
  };
  volume: { xlm: string };
  daily: { date: string; confirmed: number; failed: number }[];
  contractId: string;
}

export interface HealthData {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  contracts: { registry: string; router: string };
  network: string;
}

export interface ContractConfig {
  network: string;
  horizonUrl: string;
  registryContractId: string;
  routerContractId: string;
  explorerBase: string;
  mode: 'live' | 'preview';
  isConfigured: boolean;
}

// ── Core fetch helper ────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Health ────────────────────────────────────────────────────────────────────

export function apiHealth() {
  return apiFetch<HealthData>('/api/health');
}

// ── Transactions ──────────────────────────────────────────────────────────────

export function apiGetTransactions(params?: {
  status?: ApiTransaction['status'];
  limit?: number;
  offset?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  if (params?.offset !== undefined) qs.set('offset', String(params.offset));
  const query = qs.toString() ? `?${qs}` : '';
  return apiFetch<{ transactions: ApiTransaction[]; total: number; limit: number; offset: number }>(
    `/api/transactions${query}`,
  );
}

export function apiGetTransaction(hash: string) {
  return apiFetch<{ transaction: ApiTransaction }>(`/api/transactions/${hash}`);
}

export function apiRecordTransaction(data: Omit<ApiTransaction, 'createdAt'>) {
  return apiFetch<{ transaction: ApiTransaction }>('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Licenses ──────────────────────────────────────────────────────────────────

export function apiGetLicenses() {
  return apiFetch<{ licenses: ApiLicense[]; total: number }>('/api/licenses');
}

/** Fetch a single license by ID. */
export function apiGetLicense(id: string) {
  return apiFetch<{ license: ApiLicense }>(`/api/licenses/${id}`);
}

export function apiCreateLicense(data: {
  title: string;
  terms?: string;
  ownerAddress?: string;
  amount?: string;
  txHash?: string;
}) {
  return apiFetch<{ license: ApiLicense }>('/api/licenses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function apiUpdateLicense(id: string, updates: Partial<ApiLicense>) {
  return apiFetch<{ license: ApiLicense }>(`/api/licenses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export function apiGetAnalytics() {
  return apiFetch<AnalyticsData>('/api/analytics');
}

// ── Contract Config ───────────────────────────────────────────────────────────

export function apiGetContractConfig() {
  return apiFetch<ContractConfig>('/api/contracts/config');
}
