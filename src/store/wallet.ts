import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  address: string | null;
  walletType: string | null;
  network: 'testnet' | 'mainnet';
  connected: boolean;
  status: 'idle' | 'connecting' | 'connected';
  connect: (walletType: string, network?: 'testnet' | 'mainnet') => Promise<void>;
  disconnect: () => void;
  setNetwork: (network: 'testnet' | 'mainnet') => void;
  setStatus: (status: 'idle' | 'connecting' | 'connected') => void;
  signTransaction: (txXdr: string) => Promise<string>;
}

function getWalletNetwork(network: 'testnet' | 'mainnet') {
  return network === 'mainnet'
    ? 'Public Global Stellar Network ; September 2015'
    : 'Test SDF Network ; September 2015';
}

async function createWalletKit(network: 'testnet' | 'mainnet') {
  if (typeof window === 'undefined') {
    return null;
  }

  const kitModule = await import('@creit.tech/stellar-wallets-kit');
  const { StellarWalletsKit, WalletNetwork, FreighterModule, LobstrModule, AlbedoModule } = kitModule;

  return new StellarWalletsKit({
    network: network === 'mainnet' ? WalletNetwork.PUBLIC : WalletNetwork.TESTNET,
    modules: [new FreighterModule(), new LobstrModule(), new AlbedoModule()],
  });
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      address: null,
      walletType: null,
      network: 'testnet',
      connected: false,
      status: 'idle',

      connect: async (walletType: string, network = 'testnet') => {
        try {
          set({ status: 'connecting' });

          const kit = await createWalletKit(network);
          if (!kit) {
            throw new Error('Wallet connection is only available in the browser.');
          }

          await kit.setWallet(walletType);
          const { address } = await kit.getAddress();

          set({
            address,
            walletType,
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
        const walletStore = get();
        const kit = await createWalletKit(walletStore.network);
        if (!kit) {
          throw new Error('Wallet signing is only available in the browser.');
        }

        await kit.setWallet(walletStore.walletType ?? 'freighter');
        const { signedTxXdr } = await kit.signTransaction(txXdr, {
          address: walletStore.address ?? undefined,
          networkPassphrase: walletStore.network === 'mainnet'
            ? 'Public Global Stellar Network ; September 2015'
            : 'Test SDF Network ; September 2015',
        });

        return signedTxXdr;
      },

      disconnect: () => {
        set({ address: null, walletType: null, connected: false, status: 'idle' });
      },

      setNetwork: (network) => set({ network }),
      setStatus: (status) => set({ status }),
    }),
    { name: 'wallet-store', partialize: (state) => ({ address: state.address, walletType: state.walletType, network: state.network }) },
  ),
);