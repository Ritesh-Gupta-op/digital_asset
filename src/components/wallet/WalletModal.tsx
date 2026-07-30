"use client";

import React, { useState } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { useWalletStore } from '@/store/wallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletType: string) => Promise<void>;
  network: 'testnet' | 'mainnet';
  isConnecting: boolean;
}

const wallets = [
  { id: 'freighter', name: 'Freighter', icon: '🔐' },
  { id: 'lobstr', name: 'Lobstr', icon: '🌟' },
  { id: 'albedo', name: 'Albedo', icon: '⚡' },
  { id: 'ledger', name: 'Ledger', icon: '🔑' },
];

export function WalletModal({ isOpen, onClose, onConnect, network, isConnecting }: WalletModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signedXdr, setSignedXdr] = useState<string | null>(null);

  const { connected, address, signTransaction } = useWalletStore();

  if (!isOpen) return null;

  const handleConnectClick = async (walletId: string) => {
    try {
      setError(null);
      setSelectedWallet(walletId);
      await onConnect(walletId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setError(errorMessage);
      setSelectedWallet(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 transition hover:text-white"
        >
          ✕
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold font-manrope text-white">Connect Wallet</h2>
          <p className="mt-2 text-sm text-zinc-400">Choose a wallet to connect to {network}</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-[#ef233c]/30 bg-[#ef233c]/10 p-4">
            <p className="text-sm text-red-200 mb-3">{error}</p>
            <p className="text-xs text-red-300">
              <strong>Need help?</strong> Install <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Freighter Wallet</a> extension
            </p>
          </div>
        )}

        {isConnecting && selectedWallet ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ef233c]/30 border-t-[#ef233c]" />
              </div>
              <p className="font-medium text-white">Connecting to {wallets.find(w => w.id === selectedWallet)?.name}</p>
              <p className="mt-2 text-sm text-zinc-400">Check your wallet extension for a connection request</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleConnectClick(wallet.id)}
                disabled={isConnecting}
                className="group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-[#ef233c]/50 hover:bg-[#ef233c]/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-2xl mb-2">{wallet.icon}</div>
                <p className="text-sm font-medium text-white">{wallet.name}</p>
              </button>
            ))}
          </div>
        )}

        {connected && address && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-zinc-400">Connected as</p>
            <p className="font-mono mt-1 break-all text-sm text-white">{address}</p>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={async () => {
                  setError(null);
                  setSignedXdr(null);
                  try {
                    const networkPassphrase = network === 'mainnet'
                      ? 'Public Global Stellar Network ; September 2015'
                      : 'Test SDF Network ; September 2015';

                    const account = new StellarSdk.Account(address!, '0');
                    const tx = new StellarSdk.TransactionBuilder(account, {
                      fee: StellarSdk.BASE_FEE,
                      networkPassphrase,
                    })
                      .addOperation(StellarSdk.Operation.payment({
                        destination: address!,
                        asset: StellarSdk.Asset.native(),
                        amount: '0.000001',
                      }))
                      .setTimeout(30)
                      .build();

                    const unsignedXdr = tx.toEnvelope().toXDR('base64');
                    const signed = await signTransaction(unsignedXdr);
                    setSignedXdr(signed);
                  } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Signing failed';
                    setError(errorMessage);
                  }
                }}
                className="rounded-full bg-[#ef233c] hover:bg-red-700 px-4 py-2 text-xs font-bold text-white transition shadow-glow-sm uppercase tracking-wider"
              >
                Request Signature
              </button>

              <button
                onClick={() => {
                  setSignedXdr(null);
                }}
                className="rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            </div>

            {signedXdr && (
              <div className="mt-3 rounded-md bg-white/5 p-3 text-xs text-zinc-300">
                <p className="font-semibold text-white">Signed XDR</p>
                <pre className="mt-2 max-h-48 overflow-auto break-all whitespace-pre-wrap font-mono text-xs">{signedXdr}</pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-zinc-400">
            <span className="font-semibold text-white">Network:</span> {network === 'testnet' ? 'Stellar Testnet' : 'Stellar Mainnet'}
          </p>
          <p className="mt-2 text-xs text-zinc-400">
            <span className="font-semibold text-white">Status:</span> Real XLM transactions. You will spend actual XLM from your wallet.
          </p>
        </div>
      </div>
    </div>
  );
}
