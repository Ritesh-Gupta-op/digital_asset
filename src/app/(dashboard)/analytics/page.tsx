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
    <main className="min-h-screen bg-black text-white font-inter">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black p-8 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.25em] text-red-400 font-manrope">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ef233c]" />
                Analytics Hub
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl font-manrope">
                Licensing Health & Growth Metrics
              </h1>
              <p className="max-w-2xl text-base leading-8 text-zinc-400">
                Understand your Stellar license performance with clean charts, revenue forecasts, and workflow status indicators.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-black/60 p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">Live Summary</p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl bg-zinc-900/60 p-4 border border-white/10">
                  <p className="text-xs text-zinc-400">Confirmed Transactions</p>
                  <p className="mt-2 text-3xl font-bold text-white font-manrope">{stats.confirmed}</p>
                </div>
                <div className="rounded-2xl bg-zinc-900/60 p-4 border border-white/10">
                  <p className="text-xs text-zinc-400">Revenue Forecast</p>
                  <p className="mt-2 text-3xl font-bold text-[#ef233c] font-manrope">${stats.revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-zinc-900/50 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Confirmed</p>
            <p className="mt-4 text-3xl font-bold text-white font-manrope">{stats.confirmed}</p>
            <p className="mt-2 text-xs text-zinc-400">Completed license payments</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-zinc-900/50 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Processing</p>
            <p className="mt-4 text-3xl font-bold text-amber-400 font-manrope">{stats.processing}</p>
            <p className="mt-2 text-xs text-zinc-400">Wallet approvals awaiting completion</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-zinc-900/50 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Failed</p>
            <p className="mt-4 text-3xl font-bold text-[#ef233c] font-manrope">{stats.failed}</p>
            <p className="mt-2 text-xs text-zinc-400">Troubleshoot payment or wallet errors</p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white font-manrope">License Adoption Trend</h2>
                <p className="mt-1 text-xs text-zinc-400">Weekly volume for approvals and payments.</p>
              </div>
              <span className="rounded-full bg-[#ef233c]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-red-400 border border-[#ef233c]/20">
                Trend
              </span>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-5">
              {[76, 84, 72, 91, 88].map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-3 text-zinc-400">
                  <div className="h-44 w-full overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/5 flex items-end p-1">
                    <div className="w-full rounded-xl bg-gradient-to-t from-[#ef233c] to-red-500 shadow-glow-sm" style={{ height: `${value}%` }} />
                  </div>
                  <span className="text-xs font-mono">W{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black p-8 shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white font-manrope">Operational Pulse</h2>
            <p className="mt-1 text-xs text-zinc-400">Snapshot of your license workflow performance.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-[24px] bg-zinc-900/60 border border-white/10 p-4">
                <p className="text-sm font-semibold text-white font-manrope">Revenue Outlook</p>
                <p className="mt-1 text-xs text-zinc-400">Projected based on confirmed transaction velocity.</p>
                <p className="mt-3 text-2xl font-bold text-[#ef233c] font-manrope">${stats.revenue.toLocaleString()}</p>
              </div>
              <div className="rounded-[24px] bg-zinc-900/60 border border-white/10 p-4">
                <p className="text-sm font-semibold text-white font-manrope">Wallet Readiness</p>
                <p className="mt-1 text-xs text-zinc-400">Ready for more Stellar license approvals.</p>
              </div>
              <div className="rounded-[24px] bg-zinc-900/60 border border-white/10 p-4">
                <p className="text-sm font-semibold text-white font-manrope">Failure Impact</p>
                <p className="mt-1 text-xs text-zinc-400">{stats.failed} unsuccessful attempts to monitor.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
