import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

// Use /tmp on Vercel (ephemeral but works for MVP demo), or local data dir in dev
const DATA_DIR = process.env.NODE_ENV === 'production'
  ? path.join(os.tmpdir(), 'licensecraft')
  : path.join(process.cwd(), 'data');

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJSON<T>(filename: string, fallback: T): Promise<T> {
  await ensureDir();
  const filepath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJSON<T>(filename: string, data: T): Promise<void> {
  await ensureDir();
  const filepath = path.join(DATA_DIR, filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

// ── Transaction Records ──────────────────────────────────────────────

export interface TxRecord {
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

export async function getTxRecords(): Promise<TxRecord[]> {
  return readJSON<TxRecord[]>('transactions.json', []);
}

export async function addTxRecord(record: TxRecord): Promise<TxRecord> {
  const records = await getTxRecords();
  // Prevent duplicate hashes
  if (record.hash && records.some((r) => r.hash === record.hash)) {
    return record;
  }
  const updated = [record, ...records];
  await writeJSON('transactions.json', updated);
  return record;
}

export async function getTxByHash(hash: string): Promise<TxRecord | null> {
  const records = await getTxRecords();
  return records.find((r) => r.hash === hash) ?? null;
}

// ── License Records ──────────────────────────────────────────────────

export interface LicenseRecord {
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

export async function getLicenseRecords(): Promise<LicenseRecord[]> {
  return readJSON<LicenseRecord[]>('licenses.json', []);
}

export async function addLicenseRecord(record: LicenseRecord): Promise<LicenseRecord> {
  const records = await getLicenseRecords();
  const updated = [record, ...records];
  await writeJSON('licenses.json', updated);
  return record;
}

export async function updateLicenseRecord(id: string, updates: Partial<LicenseRecord>): Promise<LicenseRecord | null> {
  const records = await getLicenseRecords();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  records[idx] = { ...records[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJSON('licenses.json', records);
  return records[idx];
}
