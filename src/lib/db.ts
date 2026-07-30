import path from 'path';
import fs from 'fs';
import os from 'os';

const DATA_DIR = process.env.NODE_ENV === 'production'
  ? path.join(os.tmpdir(), 'licensecraft')
  : path.join(process.cwd(), 'data');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Failed to create DATA_DIR:', err);
  }
}

// ── Fallback In-Memory / File Store ─────────────────────────────────────
const memoryStore = {
  transactions: [] as TxRecord[],
  licenses: [] as LicenseRecord[],
};

function readJSONFallback<T>(filename: string, fallback: T): T {
  ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filepath)) {
      const raw = fs.readFileSync(filepath, 'utf-8');
      return JSON.parse(raw) as T;
    }
  } catch {}
  return fallback;
}

function writeJSONFallback<T>(filename: string, data: T): void {
  ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {}
}

// ── SQLite Engine Singleton ─────────────────────────────────────────────
let dbInstance: any = null;
let sqliteAvailable: boolean | null = null;

function getDb(): any {
  if (sqliteAvailable === false) return null;
  if (dbInstance) return dbInstance;

  try {
    ensureDataDir();
    const DB_PATH = path.join(DATA_DIR, 'licensecraft.db');
    // Dynamically require better-sqlite3 so serverless/Vercel environments without native C++ bindings don't crash at build/startup time
    const Database = require('better-sqlite3');
    const db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');

    db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        hash TEXT UNIQUE,
        status TEXT NOT NULL,
        description TEXT NOT NULL,
        contractId TEXT,
        explorerUrl TEXT,
        amount TEXT,
        from_address TEXT,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS licenses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        terms TEXT,
        status TEXT NOT NULL,
        contractId TEXT NOT NULL,
        ownerAddress TEXT,
        txHash TEXT,
        amount TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    dbInstance = db;
    sqliteAvailable = true;
    seedFromJSON(dbInstance);
    return dbInstance;
  } catch (err) {
    console.warn('SQLite unavailable, using fallback storage engine:', err);
    sqliteAvailable = false;
    dbInstance = null;
    return null;
  }
}

function seedFromJSON(db: any) {
  try {
    const txJsonPath = path.join(DATA_DIR, 'transactions.json');
    if (fs.existsSync(txJsonPath)) {
      const txCount = (db.prepare('SELECT COUNT(*) as count FROM transactions').get() as { count: number }).count;
      if (txCount === 0) {
        const raw = fs.readFileSync(txJsonPath, 'utf-8');
        const items = JSON.parse(raw) as TxRecord[];
        const stmt = db.prepare(`
          INSERT OR IGNORE INTO transactions (id, hash, status, description, contractId, explorerUrl, amount, from_address, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const item of items) {
          stmt.run(
            item.id,
            item.hash || null,
            item.status,
            item.description,
            item.contractId || null,
            item.explorerUrl || null,
            item.amount || null,
            item.from || null,
            item.createdAt
          );
        }
      }
    }

    const licJsonPath = path.join(DATA_DIR, 'licenses.json');
    if (fs.existsSync(licJsonPath)) {
      const licCount = (db.prepare('SELECT COUNT(*) as count FROM licenses').get() as { count: number }).count;
      if (licCount === 0) {
        const raw = fs.readFileSync(licJsonPath, 'utf-8');
        const items = JSON.parse(raw) as LicenseRecord[];
        const stmt = db.prepare(`
          INSERT OR IGNORE INTO licenses (id, title, terms, status, contractId, ownerAddress, txHash, amount, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const item of items) {
          stmt.run(
            item.id,
            item.title,
            item.terms || null,
            item.status,
            item.contractId,
            item.ownerAddress || null,
            item.txHash || null,
            item.amount || null,
            item.createdAt,
            item.updatedAt
          );
        }
      }
    }
  } catch (err) {
    console.warn('DB seed notice:', err);
  }
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
  const db = getDb();
  if (db) {
    try {
      const rows = db.prepare('SELECT * FROM transactions ORDER BY createdAt DESC').all() as any[];
      return rows.map((row) => ({
        id: row.id,
        hash: row.hash || undefined,
        status: row.status,
        description: row.description,
        contractId: row.contractId || undefined,
        explorerUrl: row.explorerUrl || undefined,
        amount: row.amount || undefined,
        from: row.from_address || undefined,
        createdAt: row.createdAt,
      }));
    } catch {}
  }
  return readJSONFallback<TxRecord[]>('transactions.json', memoryStore.transactions);
}

export async function addTxRecord(record: TxRecord): Promise<TxRecord> {
  const db = getDb();
  if (db) {
    try {
      if (record.hash) {
        const existing = db.prepare('SELECT id FROM transactions WHERE hash = ?').get(record.hash);
        if (existing) return record;
      }

      const stmt = db.prepare(`
        INSERT INTO transactions (id, hash, status, description, contractId, explorerUrl, amount, from_address, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        record.id,
        record.hash || null,
        record.status,
        record.description,
        record.contractId || null,
        record.explorerUrl || null,
        record.amount || null,
        record.from || null,
        record.createdAt
      );

      return record;
    } catch {}
  }

  const records = readJSONFallback<TxRecord[]>('transactions.json', memoryStore.transactions);
  if (record.hash && records.some((r) => r.hash === record.hash)) {
    return record;
  }
  const updated = [record, ...records];
  memoryStore.transactions = updated;
  writeJSONFallback('transactions.json', updated);
  return record;
}

export async function getTxByHash(hash: string): Promise<TxRecord | null> {
  const db = getDb();
  if (db) {
    try {
      const row = db.prepare('SELECT * FROM transactions WHERE hash = ?').get(hash) as any;
      if (row) {
        return {
          id: row.id,
          hash: row.hash || undefined,
          status: row.status,
          description: row.description,
          contractId: row.contractId || undefined,
          explorerUrl: row.explorerUrl || undefined,
          amount: row.amount || undefined,
          from: row.from_address || undefined,
          createdAt: row.createdAt,
        };
      }
    } catch {}
  }
  const records = readJSONFallback<TxRecord[]>('transactions.json', memoryStore.transactions);
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
  const db = getDb();
  if (db) {
    try {
      const rows = db.prepare('SELECT * FROM licenses ORDER BY createdAt DESC').all() as any[];
      return rows.map((row) => ({
        id: row.id,
        title: row.title,
        terms: row.terms || undefined,
        status: row.status,
        contractId: row.contractId,
        ownerAddress: row.ownerAddress || undefined,
        txHash: row.txHash || undefined,
        amount: row.amount || undefined,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));
    } catch {}
  }
  return readJSONFallback<LicenseRecord[]>('licenses.json', memoryStore.licenses);
}

export async function addLicenseRecord(record: LicenseRecord): Promise<LicenseRecord> {
  const db = getDb();
  if (db) {
    try {
      const stmt = db.prepare(`
        INSERT INTO licenses (id, title, terms, status, contractId, ownerAddress, txHash, amount, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        record.id,
        record.title,
        record.terms || null,
        record.status,
        record.contractId,
        record.ownerAddress || null,
        record.txHash || null,
        record.amount || null,
        record.createdAt,
        record.updatedAt
      );

      return record;
    } catch {}
  }

  const records = readJSONFallback<LicenseRecord[]>('licenses.json', memoryStore.licenses);
  const updated = [record, ...records];
  memoryStore.licenses = updated;
  writeJSONFallback('licenses.json', updated);
  return record;
}

export async function updateLicenseRecord(id: string, updates: Partial<LicenseRecord>): Promise<LicenseRecord | null> {
  const db = getDb();
  if (db) {
    try {
      const existing = db.prepare('SELECT * FROM licenses WHERE id = ?').get(id) as any;
      if (existing) {
        const updated: LicenseRecord = {
          id: existing.id,
          title: updates.title ?? existing.title,
          terms: updates.terms !== undefined ? updates.terms : existing.terms,
          status: updates.status ?? existing.status,
          contractId: updates.contractId ?? existing.contractId,
          ownerAddress: updates.ownerAddress !== undefined ? updates.ownerAddress : existing.ownerAddress,
          txHash: updates.txHash !== undefined ? updates.txHash : existing.txHash,
          amount: updates.amount !== undefined ? updates.amount : existing.amount,
          createdAt: existing.createdAt,
          updatedAt: new Date().toISOString(),
        };

        const stmt = db.prepare(`
          UPDATE licenses
          SET title = ?, terms = ?, status = ?, contractId = ?, ownerAddress = ?, txHash = ?, amount = ?, updatedAt = ?
          WHERE id = ?
        `);

        stmt.run(
          updated.title,
          updated.terms || null,
          updated.status,
          updated.contractId,
          updated.ownerAddress || null,
          updated.txHash || null,
          updated.amount || null,
          updated.updatedAt,
          id
        );

        return updated;
      }
    } catch {}
  }

  const records = readJSONFallback<LicenseRecord[]>('licenses.json', memoryStore.licenses);
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  records[idx] = { ...records[idx], ...updates, updatedAt: new Date().toISOString() };
  memoryStore.licenses = records;
  writeJSONFallback('licenses.json', records);
  return records[idx];
}
