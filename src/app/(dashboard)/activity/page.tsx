"use client";

import { useMemo } from 'react';
import { useTransactionStore } from '@/store/transactions';

export default function ActivityPage() {
  const { items } = useTransactionStore();

  const history = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        detail:
          item.status === 'confirmed'
            ? 'Transaction completed and confirmed on the Stellar network.'
            : item.status === 'processing'
            ? 'Waiting for wallet approval and network confirmation.'
            : item.status === 'failed'
            ? 'Transaction failed. Check the wallet and balance, then retry.'
            : 'Pending transaction created and awaiting user action.',
      })),
    [items],
  );

  return (
    <main className="min-h-screen bg-black text-white font-inter px-6 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.25em] text-red-400 font-manrope">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ef233c]" />
                Payment History
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white font-manrope sm:text-4xl">
                A clean record of your Stellar payments and license purchases.
              </h1>
            </div>
            <p className="max-w-xl text-sm text-zinc-400">
              This page surfaces your actual transaction history with status badges, explorer links, and payment details.
            </p>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500 font-manrope">History Table</p>
              <p className="mt-1 text-xs text-zinc-400">Sorted by newest payments first.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white">
                All status
              </button>
              <button className="rounded-full bg-[#ef233c] hover:bg-red-700 px-4 py-2 text-xs font-bold text-white shadow-glow-sm transition-all font-manrope uppercase tracking-wider">
                Newest first
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-white/10">
            <table className="min-w-full border-collapse bg-black text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/80 text-xs uppercase tracking-[0.16em] text-zinc-400 border-b border-white/10 font-manrope">
                <tr>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Hash</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.length ? (
                  history.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white font-manrope">{item.description}</p>
                        <p className="mt-1 text-xs text-zinc-400">{item.detail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${
                            item.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : item.status === 'failed'
                              ? 'bg-[#ef233c]/10 text-red-400 border-[#ef233c]/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.hash ? <span className="text-xs text-zinc-400 font-mono">{item.hash.slice(0, 12)}...</span> : <span className="text-xs text-zinc-500">N/A</span>}
                      </td>
                      <td className="px-6 py-4">
                        {item.explorerUrl ? (
                          <a
                            href={item.explorerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-[#ef233c] hover:bg-red-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-glow-sm transition-all uppercase tracking-wider inline-block font-manrope"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-xs text-zinc-500">No link</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-16 text-center text-zinc-500" colSpan={4}>
                      No payment history yet. Create a license purchase to populate this table.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
