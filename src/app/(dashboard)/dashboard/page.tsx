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
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950 p-6 md:p-10 shadow-2xl">
          <div className="grid gap-10 md:grid-cols-[1.8fr_1.2fr]">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
                Stellar Level 4 Platform
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
                Digital Asset Licensing Operating Layer
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                Automate NFT, token, and smart contract issuance with live on-chain analytics, transaction persistence, and responsive API workflows.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/licenses"
                  className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-cyan-400"
                >
                  Manage Licenses →
                </Link>
                <Link
                  href="/transactions"
                  className="rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View Transactions
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Network</p>
                  <p className="mt-2 text-2xl font-semibold text-white capitalize">{network}</p>
                </div>
                <div className="rounded-3xl bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
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
                    <div className="rounded-3xl bg-slate-950 p-4 border border-slate-800">
                      <p className="text-xs text-slate-400">Confirmed On-Chain Transactions</p>
                      <p className="mt-1 text-3xl font-semibold text-white">
                        {analytics?.totals.confirmed ?? 0}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-950 p-4 border border-slate-800">
                      <p className="text-xs text-slate-400">Registered Digital Licenses</p>
                      <p className="mt-1 text-3xl font-semibold text-white">
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
            <section className="rounded-[32px] border border-slate-800 bg-slate-900/40 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Backend Analytics</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">Real-Time Metrics</h2>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
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
                  <div className="rounded-[28px] bg-slate-900 p-5 border border-slate-800">
                    <p className="text-xs text-slate-400">Total XLM Volume</p>
                    <p className="mt-2 text-3xl font-semibold text-cyan-400">
                      {analytics?.volume.xlm ?? '0.0000'} XLM
                    </p>
                  </div>
                  <div className="rounded-[28px] bg-slate-900 p-5 border border-slate-800">
                    <p className="text-xs text-slate-400">Active Licenses</p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {analytics?.totals.activeLicenses ?? 0}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Recent Payment History */}
            <section className="rounded-[32px] border border-slate-800 bg-slate-900/40 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Activity</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">Recent Transactions</h2>
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
                      className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{tx.description}</p>
                        <p className="text-xs text-slate-400">
                          {tx.hash ? `Hash: ${tx.hash.slice(0, 16)}...` : 'Processing'}
                        </p>
                      </div>
                      <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                        {tx.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-slate-800 p-6 text-center text-xs text-slate-500">
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
