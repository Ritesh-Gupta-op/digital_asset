import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  address: string | null;
  network: 'testnet' | 'mainnet';
  connected: boolean;
  status: 'idle' | 'connecting' | 'connected';
  connect: (address: string, network?: 'testnet' | 'mainnet') => void;
  disconnect: () => void;
  setNetwork: (network: 'testnet' | 'mainnet') => void;
  setStatus: (status: 'idle' | 'connecting' | 'connected') => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      network: 'testnet',
      connected: false,
      status: 'idle',
      connect: (address, network = 'testnet') => set({ address, connected: true, network, status: 'connected' }),
      disconnect: () => set({ address: null, connected: false, status: 'idle' }),
      setNetwork: (network) => set({ network }),
      setStatus: (status) => set({ status }),
    }),
    { name: 'wallet-store' },
  ),
);
