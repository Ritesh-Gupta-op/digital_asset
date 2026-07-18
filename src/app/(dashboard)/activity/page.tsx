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
    <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100 px-6 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-500">Payment history</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                A clean record of your Stellar payments and license purchases.
              </h1>
            </div>
            <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
              This page surfaces your actual transaction history with status badges, explorer links, and payment details.
            </p>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">History table</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Sorted by newest payments first.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                All status
              </button>
              <button className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-400">
                Newest first
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800">
            <table className="min-w-full border-collapse bg-white text-left text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-100">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Hash</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.length ? (
                  history.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">{item.description}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.detail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : item.status === 'failed'
                              ? 'bg-rose-500/10 text-rose-500'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.hash ? <span className="text-sm text-slate-600 dark:text-slate-400">{item.hash.slice(0, 12)}...</span> : <span className="text-sm text-slate-400">N/A</span>}
                      </td>
                      <td className="px-6 py-4">
                        {item.explorerUrl ? (
                          <a
                            href={item.explorerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-400"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">No link</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-16 text-center text-slate-500 dark:text-slate-400" colSpan={4}>
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
