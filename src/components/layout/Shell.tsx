"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWalletStore } from '@/store/wallet';
import { WalletModal } from '@/components/wallet/WalletModal';

const nav = [
  { href: '/dashboard' as const, label: 'Dashboard' },
  { href: '/activity' as const, label: 'Activity' },
  { href: '/transactions' as const, label: 'Transactions' },
  { href: '/settings' as const, label: 'Settings' },
  { href: '/analytics' as const, label: 'Analytics' },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const { connected, address, disconnect, network, setNetwork, status, connect } = useWalletStore();

  const handleConnectWallet = async (walletType: string) => {
    try {
      await connect(walletType, network);
      setWalletModalOpen(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[linear-gradient(135deg,_#020617_0%,_#111827_50%,_#0a0f1a_100%)] text-slate-100">
        <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-orange-600">
                <span className="text-lg font-bold text-white">🌟</span>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.4em] text-white">Stellar</p>
                <p className="text-xs text-slate-500">License OS</p>
              </div>
            </div>

            <nav className="hidden gap-1 rounded-full border border-white/5 bg-white/5 p-1 md:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-brand-600 to-orange-600 text-white shadow-lg shadow-brand-600/30'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 sm:flex">
                <button
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    network === 'testnet' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-white/10'
                  }`}
                  onClick={() => setNetwork('testnet')}
                >
                  Testnet
                </button>
                <button
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    network === 'mainnet' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-white/10'
                  }`}
                  onClick={() => setNetwork('mainnet')}
                >
                  Mainnet
                </button>
              </div>

              {connected ? (
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-300">
                    {address?.slice(0, 8)}
                  </span>
                  <button
                    className="ml-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs transition hover:bg-white/10"
                    onClick={disconnect}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setWalletModalOpen(true)}
                  className="rounded-full bg-gradient-to-r from-brand-600 to-orange-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition hover:shadow-brand-600/50 active:scale-[0.97]"
                >
                  {status === 'connecting' ? 'Connecting…' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onConnect={handleConnectWallet}
        network={network}
        isConnecting={status === 'connecting'}
      />
    </>
  );
}
