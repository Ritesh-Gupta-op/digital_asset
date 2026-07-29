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

// ── Health ─────────────────────────────────────────────────────────────

export function apiHealth() {
  return apiFetch<HealthData>('/api/health');
}

// ── Transactions ───────────────────────────────────────────────────────

export function apiGetTransactions() {
  return apiFetch<{ transactions: ApiTransaction[]; total: number }>('/api/transactions');
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

// ── Licenses ───────────────────────────────────────────────────────────

export function apiGetLicenses() {
  return apiFetch<{ licenses: ApiLicense[]; total: number }>('/api/licenses');
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

// ── Analytics ──────────────────────────────────────────────────────────

export function apiGetAnalytics() {
  return apiFetch<AnalyticsData>('/api/analytics');
}

// ── Contract Config ────────────────────────────────────────────────────

export function apiGetContractConfig() {
  return apiFetch<{
    network: string;
    horizonUrl: string;
    registryContractId: string;
    routerContractId: string;
    explorerBase: string;
    mode: string;
  }>('/api/contracts/config');
}
