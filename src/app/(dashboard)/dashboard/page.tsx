'use client';

import React, { useEffect, useState } from 'react';
import { apiGetAnalytics, apiGetTransactions, AnalyticsData, ApiTransaction } from '@/services/api';
import { useWalletStore } from '@/store/wallet';
import { Skeleton, StatCardSkeleton, TableRowSkeleton } from '@/components/ui/skeleton';
import { ErrorCard } from '@/components/ui/error-card';
import Link from 'next/link';

export default function DashboardPage() {
  const { network } = useWalletStore();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [analyticsData, txData] = await Promise.all([
        apiGetAnalytics(),
        apiGetTransactions(),
      ]);
      setAnalytics(analyticsData);
      setTransactions(txData.transactions);
    } catch (err) {
      setError((err as Error).message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white font-inter">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black p-6 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-10 md:grid-cols-[1.8fr_1.2fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.25em] text-red-400 font-manrope">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ef233c] animate-pulse" />
                Stellar Level 4 Platform
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white font-manrope leading-[1.15]">
                Digital Asset Licensing <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-white/50">Operating Layer</span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-zinc-400">
                Automate NFT, token, and smart contract issuance with live on-chain analytics, transaction persistence, and responsive API workflows.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/licenses"
                  className="rounded-full bg-[#ef233c] hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-glow-sm transition-all font-manrope flex items-center gap-2"
                >
                  Manage Licenses →
                </Link>
                <Link
                  href="/transactions"
                  className="rounded-full border border-zinc-800 bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-300 transition-all hover:text-white hover:bg-zinc-800 font-manrope"
                >
                  View Transactions
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/60 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">Network</p>
                  <p className="mt-2 text-2xl font-bold text-white font-manrope capitalize">{network}</p>
                </div>
                <div className="rounded-full bg-[#ef233c]/10 px-4 py-1.5 text-xs font-bold text-red-400 border border-[#ef233c]/20 uppercase tracking-wider">
                  API Connected
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {loading ? (
                  <>
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl bg-zinc-900/60 p-4 border border-white/10">
                      <p className="text-xs text-zinc-400">Confirmed On-Chain Transactions</p>
                      <p className="mt-1 text-3xl font-bold text-white font-manrope">
                        {analytics?.totals.confirmed ?? 0}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-zinc-900/60 p-4 border border-white/10">
                      <p className="text-xs text-zinc-400">Registered Digital Licenses</p>
                      <p className="mt-1 text-3xl font-bold text-white font-manrope">
                        {analytics?.totals.licenses ?? 0}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr]">
            {/* Overview Stats */}
            <section className="rounded-[28px] border border-white/10 bg-black/40 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">Backend Analytics</p>
                  <h2 className="mt-1 text-xl font-bold text-white font-manrope">Real-Time Metrics</h2>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  Live API
                </span>
              </div>

              {loading ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </div>
              ) : error ? (
                <div className="mt-6">
                  <ErrorCard message={error} retry={fetchData} />
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] bg-zinc-900/50 p-5 border border-white/10">
                    <p className="text-xs text-zinc-400">Total XLM Volume</p>
                    <p className="mt-2 text-3xl font-bold text-[#ef233c] font-manrope">
                      {analytics?.volume.xlm ?? '0.0000'} XLM
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-zinc-900/50 p-5 border border-white/10">
                    <p className="text-xs text-zinc-400">Active Licenses</p>
                    <p className="mt-2 text-3xl font-bold text-white font-manrope">
                      {analytics?.totals.activeLicenses ?? 0}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Recent Payment History */}
            <section className="rounded-[28px] border border-white/10 bg-black/40 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">Activity</p>
                  <h2 className="mt-1 text-xl font-bold text-white font-manrope">Recent Transactions</h2>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {loading ? (
                  <>
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                  </>
                ) : transactions.length > 0 ? (
                  transactions.slice(0, 4).map((tx) => (
                    <div
                      key={tx.id}
                      className="rounded-[20px] border border-white/10 bg-zinc-900/60 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between hover:border-white/20 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white font-manrope">{tx.description}</p>
                        <p className="text-xs text-zinc-500 font-mono">
                          {tx.hash ? `Hash: ${tx.hash.slice(0, 16)}...` : 'Processing'}
                        </p>
                      </div>
                      <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        {tx.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[20px] border border-dashed border-white/10 p-6 text-center text-xs text-zinc-500">
                    No transactions recorded yet. Submit a license purchase to record transactions.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
