import { beforeEach, describe, expect, it, vi } from 'vitest';

const setWalletMock = vi.fn();
const getAddressMock = vi.fn();
const signTransactionMock = vi.fn();

vi.mock('@creit.tech/stellar-wallets-kit', () => {
  return {
    StellarWalletsKit: class {
      constructor() {}
      async setWallet(walletId: string) {
        setWalletMock(walletId);
      }
      async getAddress() {
        return getAddressMock();
      }
      async signTransaction(xdr: string) {
        return signTransactionMock(xdr);
      }
    },
    WalletNetwork: {
      TESTNET: 'testnet',
      PUBLIC: 'public',
    },
    FreighterModule: class {},
    LobstrModule: class {},
    AlbedoModule: class {},
    LedgerModule: class {},
  };
});

import { useWalletStore } from './wallet';

describe('useWalletStore', () => {
  beforeEach(() => {
    useWalletStore.setState({
      address: null,
      network: 'testnet',
      connected: false,
      status: 'idle',
    });
    setWalletMock.mockReset();
    getAddressMock.mockReset();
    signTransactionMock.mockReset();
  });

  it('connects through the wallet kit using the selected wallet', async () => {
    getAddressMock.mockResolvedValue({ address: 'GBTESTADDRESS' });

    await useWalletStore.getState().connect('freighter', 'testnet');

    expect(setWalletMock).toHaveBeenCalledWith('freighter');
    expect(useWalletStore.getState().address).toBe('GBTESTADDRESS');
    expect(useWalletStore.getState().connected).toBe(true);
  });
});
