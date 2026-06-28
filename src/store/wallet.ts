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

// Supports both window.freighter (older) and window.freighterApi (newer extension)
function getFreighterApi() {
  if (typeof window === 'undefined') return null;
  return window.freighter || (window as any).freighterApi || null;
}

function waitForFreighter(maxWait: number = 15000): Promise<NonNullable<ReturnType<typeof getFreighterApi>>> {
  return new Promise((resolve, reject) => {
    const api = getFreighterApi();
    if (api) {
      resolve(api);
      return;
    }

    const handleFreighterLoaded = () => {
      window.removeEventListener('freighter:loaded', handleFreighterLoaded);
      clearTimeout(timeout);
      const loaded = getFreighterApi();
      if (loaded) resolve(loaded);
      else reject(new Error('Freighter loaded event fired but API not found.'));
    };

    window.addEventListener('freighter:loaded', handleFreighterLoaded);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const api = getFreighterApi();
      if (api) {
        clearInterval(interval);
        clearTimeout(timeout);
        window.removeEventListener('freighter:loaded', handleFreighterLoaded);
        resolve(api);
      }
      if (Date.now() - startTime > maxWait) {
        clearInterval(interval);
      }
    }, 100);

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

          const freighter = await waitForFreighter(15000);

          // Request access if not already allowed
          const isAllowed = await freighter.isAllowed();
          if (!isAllowed) {
            await freighter.requestAccess();
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
);;