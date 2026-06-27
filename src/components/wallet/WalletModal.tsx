"use client";

import React, { useState } from 'react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletType: string) => void;
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 transition hover:text-white"
        >
          ✕
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
          <p className="mt-2 text-sm text-slate-400">Choose a wallet to connect to {network}</p>
        </div>

        {isConnecting && selectedWallet ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-600/30 border-t-brand-600" />
              </div>
              <p className="font-medium text-white">Connecting to {wallets.find(w => w.id === selectedWallet)?.name}</p>
              <p className="mt-2 text-sm text-slate-400">Sign the connection request in your wallet</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => {
                  setSelectedWallet(wallet.id);
                  setTimeout(() => onConnect(wallet.id), 500);
                }}
                className="group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-brand-500/50 hover:bg-brand-500/10"
              >
                <div className="text-2xl mb-2">{wallet.icon}</div>
                <p className="text-sm font-medium text-white">{wallet.name}</p>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-white">Network:</span> {network === 'testnet' ? 'Stellar Testnet' : 'Stellar Mainnet'}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            <span className="font-semibold text-white">Status:</span> No payment required. This is a read-only connection.
          </p>
        </div>
      </div>
    </div>
  );
}
