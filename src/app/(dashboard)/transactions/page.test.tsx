import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const submitLicenseDraftMock = vi.hoisted(() => vi.fn());

vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  StellarWalletsKit: class {
    setWallet = vi.fn();
    getAddress = vi.fn();
    signTransaction = vi.fn();
  },
  WalletNetwork: {
    TESTNET: 'testnet',
    PUBLIC: 'public',
  },
  FreighterModule: class {},
  LobstrModule: class {},
  AlbedoModule: class {},
}));

vi.mock('@/services/contract', () => ({
  submitLicenseDraft: submitLicenseDraftMock,
}));

import TransactionsPage from './page';
import { useWalletStore } from '@/store/wallet';

describe('TransactionsPage', () => {
  beforeEach(() => {
    useWalletStore.setState({
      address: 'GBTESTADDRESS',
      walletType: 'freighter',
      network: 'testnet',
      connected: true,
      status: 'connected',
    });
    submitLicenseDraftMock.mockReset();
    submitLicenseDraftMock.mockResolvedValue({ hash: 'abc123' });
  });

  it('submits a license purchase when the user triggers the transaction action', async () => {
    render(<TransactionsPage />);

    fireEvent.change(screen.getByLabelText(/issuer wallet address/i), {
      target: { value: 'GBTESTADDRESS' },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '0.0001' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit on-chain transaction/i }));

    expect(submitLicenseDraftMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.any(String), terms: expect.any(String) }),
      'GBTESTADDRESS',
      '0.0001',
    );
  });
});
