"use client";

import { useMemo } from 'react';
import { useTransactionStore } from '@/store/transactions';

export default function AnalyticsPage() {
  const { items } = useTransactionStore();

  const stats = useMemo(() => {
    const confirmed = items.filter((item) => item.status === 'confirmed').length;
    const failed = items.filter((item) => item.status === 'failed').length;
    const processing = items.filter((item) => item.status === 'processing').length;
    const revenue = 42000 + confirmed * 630;

    return { confirmed, failed, processing, revenue };
  }, [items]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-300">Analytics hub</p>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">Licensing health and growth metrics</h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                Understand your Stellar license performance with clean charts, revenue forecasts, and workflow status indicators.
              </p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Live summary</p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Confirmed transactions</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{stats.confirmed}</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Revenue forecast</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">${stats.revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Confirmed</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{stats.confirmed}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Completed license payments</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Processing</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{stats.processing}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Wallet approvals awaiting completion</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Failed</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{stats.failed}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Troubleshoot payment or wallet errors</p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">License adoption trend</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Weekly volume for approvals and payments.</p>
              </div>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300">
                Trend
              </span>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-5">
              {[76, 84, 72, 91, 88].map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
                  <div className="h-44 w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900">
                    <div className="h-full w-full rounded-3xl bg-gradient-to-t from-cyan-500 to-sky-300" style={{ height: `${value}%` }} />
                  </div>
                  <span className="text-xs">W{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Operational pulse</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Snapshot of your license workflow performance.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-[28px] bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">Revenue outlook</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Projected based on confirmed transaction velocity.</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">${stats.revenue.toLocaleString()}</p>
              </div>
              <div className="rounded-[28px] bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">Wallet readiness</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Ready for more Stellar license approvals.</p>
              </div>
              <div className="rounded-[28px] bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">Failure impact</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{stats.failed} unsuccessful attempts to monitor.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
