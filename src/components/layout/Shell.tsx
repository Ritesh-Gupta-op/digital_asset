"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWalletStore } from '@/store/wallet';
import { useTheme } from '@/components/ThemeProvider';
import { WalletModal } from '@/components/wallet/WalletModal';

const nav = [
  { href: '/dashboard' as const, label: 'Dashboard' },
  { href: '/licenses' as const, label: 'Licenses' },
  { href: '/transactions' as const, label: 'Transactions' },
  { href: '/analytics' as const, label: 'Analytics' },
  { href: '/activity' as const, label: 'Activity' },
  { href: '/settings' as const, label: 'Settings' },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { connected, address, disconnect, network, setNetwork, status, connect } = useWalletStore();

  const handleConnectWallet = async (walletType: string) => {
    try {
      await connect(walletType, network);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 shadow-glow">
                <span className="text-lg font-bold text-white">L</span>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.4em] text-white">LicenseCraft</p>
                <p className="text-xs text-slate-400">License OS</p>
              </div>
            </div>

            <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-slate-900/70 p-1 md:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-slate-900/70 p-1 sm:flex">
                <button
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    network === 'testnet'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800/70'
                  }`}
                  onClick={() => setNetwork('testnet')}
                >
                  Testnet
                </button>
                <button
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    network === 'mainnet'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800/70'
                  }`}
                  onClick={() => setNetwork('mainnet')}
                >
                  Mainnet
                </button>
              </div>

              <button
                onClick={toggleTheme}
                className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 hover:border-white/20 sm:inline-flex items-center gap-2 active:scale-[0.95]"
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <>
                    <span>☀️</span>
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <span>🌙</span>
                    <span>Dark</span>
                  </>
                )}
              </button>

              {connected ? (
                <div className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-sm font-semibold text-white">{address?.slice(0, 8)}</span>
                  <button
                    className="ml-1 rounded-full border border-white/10 bg-slate-900 px-2 py-1 text-xs text-slate-100 transition hover:bg-slate-800"
                    onClick={disconnect}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setWalletModalOpen(true)}
                  className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-cyan-400 active:scale-[0.97]"
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
