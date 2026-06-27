import { create } from 'zustand';

export interface TransactionRecord {
  id: string;
  status: 'pending' | 'processing' | 'confirmed' | 'failed';
  hash?: string;
  explorerUrl?: string;
  description: string;
}

interface TransactionState {
  items: TransactionRecord[];
  add: (item: TransactionRecord) => void;
  update: (id: string, updates: Partial<TransactionRecord>) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  items: [
    {
      id: 'tx-1',
      status: 'confirmed',
      hash: 'abc123',
      explorerUrl: 'https://stellar.expert/explorer/testnet/tx/abc123',
      description: 'Created a new license draft',
    },
  ],
  add: (item) => set((state) => ({ items: [item, ...state.items] })),
  update: (id, updates) => set((state) => ({ items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)) })),
}));
