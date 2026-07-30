"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWalletStore } from '@/store/wallet';
import { WalletModal } from '@/components/wallet/WalletModal';

const nav = [
  { href: '/dashboard',     label: 'Dashboard' },
  { href: '/licenses',      label: 'Licenses' },
  { href: '/transactions',  label: 'Transactions' },
  { href: '/analytics',     label: 'Analytics' },
  { href: '/activity',      label: 'Activity' },
  { href: '/settings',      label: 'Settings' },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
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
      {/* Global Red Noir background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#110202] to-black" />
        <div className="absolute top-0 left-0 w-px h-px bg-transparent stars-1" />
        <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent stars-2" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-900/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 grid-overlay opacity-50" />
      </div>

      <div className="gradient-blur" />

      <div className="relative z-10 min-h-screen text-white">
        {/* ── Top Nav ──────────────────────────────────── */}
        <header className="fixed top-0 left-0 w-full z-50 pt-4 px-4">
          <nav className="max-w-7xl mx-auto flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 shadow-2xl">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-5 h-5 bg-[#ef233c] rounded-sm rotate-45 shadow-glow-sm" />
              <div>
                <p className="text-sm font-bold font-manrope tracking-tight text-white">LicenseCraft</p>
                <p className="text-[10px] text-zinc-500 leading-none">License OS</p>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-0.5 rounded-full border border-white/10 bg-black/40 p-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    pathname === item.href
                      ? 'bg-[#ef233c] text-white shadow-glow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Network Toggle */}
              <div className="hidden sm:flex items-center gap-0.5 rounded-full border border-white/10 bg-black/40 p-1">
                {(['testnet', 'mainnet'] as const).map((net) => (
                  <button
                    key={net}
                    onClick={() => setNetwork(net)}
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                      network === net
                        ? 'bg-white/10 text-white'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>

              {/* Wallet */}
              {connected ? (
                <div className="flex items-center gap-2 rounded-full border border-[#ef233c]/30 bg-[#ef233c]/10 px-4 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ef233c] animate-pulse" />
                  <span className="text-xs font-bold text-white font-manrope">{address?.slice(0, 8)}…</span>
                  <button
                    onClick={disconnect}
                    className="ml-1 rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] text-zinc-300 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setWalletModalOpen(true)}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2 transition-transform active:scale-95"
                >
                  <span className="absolute inset-0 border border-white/10 rounded-full" />
                  <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#ef233c_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute inset-[1px] rounded-full bg-black" />
                  <span className="relative z-10 text-[10px] font-bold uppercase tracking-wider text-white">
                    {status === 'connecting' ? 'Connecting…' : 'Connect Wallet'}
                  </span>
                </button>
              )}
            </div>
          </nav>
        </header>

        {/* ── Page Content ─────────────────────────────── */}
        <main className="pt-20">{children}</main>
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
