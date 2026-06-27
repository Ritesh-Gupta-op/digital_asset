import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  address: string | null;
  network: 'testnet' | 'mainnet';
  connected: boolean;
  status: 'idle' | 'connecting' | 'connected';
  connect: (walletType: string, network?: 'testnet' | 'mainnet') => Promise<void>;
  disconnect: () => void;
  setNetwork: (network: 'testnet' | 'mainnet') => void;
  setStatus: (status: 'idle' | 'connecting' | 'connected') => void;
  signTransaction: (txXdr: string) => Promise<string>;
}

// Wait for Freighter to be available (extension injects window.freighter)
function waitForFreighter(maxWait: number = 15000): Promise<typeof window.freighter> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not available'));
      return;
    }

    // If already available, resolve immediately
    if (window.freighter) {
      resolve(window.freighter);
      return;
    }

    // Wait for freighter:loaded event
    const handleFreighterLoaded = () => {
      window.removeEventListener('freighter:loaded', handleFreighterLoaded);
      clearTimeout(timeout);
      resolve(window.freighter);
    };

    window.addEventListener('freighter:loaded', handleFreighterLoaded);

    // Fallback: check periodically
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (window.freighter) {
        clearInterval(interval);
        clearTimeout(timeout);
        window.removeEventListener('freighter:loaded', handleFreighterLoaded);
        resolve(window.freighter);
      }
      if (Date.now() - startTime > maxWait) {
        clearInterval(interval);
      }
    }, 100);

    // Timeout
    const timeout = setTimeout(() => {
      clearInterval(interval);
      window.removeEventListener('freighter:loaded', handleFreighterLoaded);
      reject(new Error('Freighter wallet failed to load. Please install the Freighter extension.'));
    }, maxWait);
  });
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      address: null,
      network: 'testnet',
      connected: false,
      status: 'idle',
      
      connect: async (walletType: string, network = 'testnet') => {
        try {
          set({ status: 'connecting' });
          
          // Wait for Freighter to load (15 seconds to account for CDN latency)
          const freighter = await waitForFreighter(15000);

          // Check if Freighter is allowed
          const isAllowed = await freighter.isAllowed();
          if (!isAllowed) {
            throw new Error('Freighter wallet is not allowed. Please enable it in your browser extension settings.');
          }

          // Get user's public key
          const address = await freighter.getPublicKey();
          
          set({
            address,
            connected: true,
            network,
            status: 'connected',
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
          console.error('Wallet connection failed:', errorMessage);
          set({ status: 'idle', connected: false });
          throw new Error(errorMessage);
        }
      },

      signTransaction: async (txXdr: string) => {
        const freighter = await waitForFreighter();
        const signedXdr = await freighter.signTransaction(txXdr);
        return signedXdr;
      },
      
      disconnect: () => {
        set({ address: null, connected: false, status: 'idle' });
      },
      
      setNetwork: (network) => set({ network }),
      setStatus: (status) => set({ status }),
    }),
    { name: 'wallet-store', partialize: (state) => ({ address: state.address, network: state.network }) },
  ),
);
