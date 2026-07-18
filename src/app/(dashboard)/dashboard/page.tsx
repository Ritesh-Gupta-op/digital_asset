"use client";

import { useMemo } from 'react';
import { useTransactionStore } from '@/store/transactions';
import { useWalletStore } from '@/store/wallet';

export default function DashboardPage() {
  const { items } = useTransactionStore();
  const { network } = useWalletStore();

  const stats = useMemo(() => {
    const confirmed = items.filter((item) => item.status === 'confirmed').length;
    const pending = items.filter((item) => item.status === 'pending').length;
    const processing = items.filter((item) => item.status === 'processing').length;
    const failed = items.filter((item) => item.status === 'failed').length;

    return {
      confirmed,
      pending,
      processing,
      failed,
      totalPayments: confirmed + pending + processing + failed,
      activeLicenses: 68 + confirmed * 3,
      revenueRunRate: 26000 + confirmed * 420,
    };
  }, [items]);

  const recentPayments = items.slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_120px_-80px_rgba(15,23,42,0.65)] transition dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-10 px-6 py-8 md:grid-cols-[1.8fr_1.2fr] md:px-10">
            <div className="space-y-4 transition duration-500 hover:-translate-y-1 hover:shadow-[0_35px_70px_-50px_rgba(15,23,42,0.15)]">
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Built on Stellar
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Digital asset licensing platform for creators and businesses.</h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                Automate NFT, token, and smart contract issuance with elegant workflows, live activity, and responsive dashboard interactions.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300">USDC</span>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">XLM</span>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Network</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{network}</p>
                </div>
                <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10">
                  {stats.totalPayments} payments
                </div>
              </div>
              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Confirmed</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{stats.confirmed}</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pending & processing</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{stats.pending + stats.processing}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Overview</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Payments & revenue snapshot</h2>
                </div>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300">Live</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Active licenses</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{stats.activeLicenses}</p>
                </div>
                <div className="rounded-[28px] bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Revenue run-rate</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">${stats.revenueRunRate.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Confirmed', value: stats.confirmed, tone: 'bg-emerald-500/10 text-emerald-500' },
                  { label: 'Pending', value: stats.pending, tone: 'bg-amber-500/10 text-amber-500' },
                  { label: 'Failed', value: stats.failed, tone: 'bg-rose-500/10 text-rose-500' },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800">
                    <p className={`text-sm font-semibold ${item.tone}`}>{item.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Recent history</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Recent payment activity</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {recentPayments.length ? (
                  recentPayments.map((item) => (
                    <div key={item.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-950 dark:text-white">{item.description}</p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.hash ? `Hash ${item.hash}` : 'Awaiting confirmation'}</p>
                        </div>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : item.status === 'failed'
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>{item.status}</span>
                      </div>
                      {item.explorerUrl ? (
                        <a
                          href={item.explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex text-sm font-semibold text-cyan-500 hover:text-cyan-400"
                        >
                          View on Stellar Expert →
                        </a>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                    No payment history yet. Submit a license purchase or XLM payment to see activity here.
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
