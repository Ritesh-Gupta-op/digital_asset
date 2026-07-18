"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { submitLicenseDraft } from '@/services/contract';
import { useTransactionStore } from '@/store/transactions';
import { useWalletStore } from '@/store/wallet';

export default function TransactionsPage() {
  const { items, update } = useTransactionStore();
  const { connected, address, network } = useWalletStore();
  const [recipient, setRecipient] = useState(address ?? '');
  const [amount, setAmount] = useState('0.0001');
  const [licenseTitle, setLicenseTitle] = useState('Creator license purchase');
  const [licenseTerms, setLicenseTerms] = useState('Digital asset licensing rights');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!connected || !recipient) {
      setError('Connect your wallet and enter the issuer address to buy a license.');
      return;
    }

    setError(null);
    setSuccess(null);
    setExplorerUrl(null);
    setIsSending(true);

    try {
      const result = await submitLicenseDraft(
        { title: licenseTitle, terms: licenseTerms },
        recipient,
        amount,
      );
      const url = `https://stellar.expert/explorer/${network}/tx/${result.hash}`;
      setSuccess('License purchase confirmed. View the transaction on Stellar Expert.');
      setExplorerUrl(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'License purchase failed';
      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.4)] dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.4fr_0.9fr] lg:px-10">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-300">Transactions</p>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Send payments and mint on-chain license records.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                Keep all current wallet and transaction workflows, now surfaced in a cleaner payment page with a modern light/dark dashboard feel.
              </p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Network</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{network}</p>
                </div>
                <div className={`rounded-full px-4 py-2 text-sm font-semibold ${connected ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' : 'bg-amber-500/15 text-amber-600 dark:text-amber-300'}`}>
                  {connected ? 'Connected' : 'Disconnected'}
                </div>
              </div>
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Active wallet</p>
                  <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">{connected ? address : 'No wallet linked'}</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Last action</p>
                  <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">{isSending ? 'Submitting payment…' : 'Ready to send'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Create payment</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">License purchase form</h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Submit an XLM payment and record license metadata on-chain.</p>
              </div>

              <form className="grid gap-5" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="recipient-address">
                    Issuer wallet address
                  </label>
                  <input
                    id="recipient-address"
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="G..."
                    value={recipient}
                    onChange={(event) => setRecipient(event.target.value)}
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="license-title">
                      License title
                    </label>
                    <input
                      id="license-title"
                      className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="Creator license purchase"
                      value={licenseTitle}
                      onChange={(event) => setLicenseTitle(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="amount">
                      Amount (XLM)
                    </label>
                    <input
                      id="amount"
                      className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="0.0001"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="license-terms">
                    License terms
                  </label>
                  <textarea
                    id="license-terms"
                    className="min-h-[120px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Digital asset licensing rights"
                    value={licenseTerms}
                    onChange={(event) => setLicenseTerms(event.target.value)}
                  />
                </div>

                {error ? <p className="text-sm text-rose-500">{error}</p> : null}
                {success ? (
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    {success}{' '}
                    {explorerUrl ? (
                      <a href={explorerUrl} target="_blank" rel="noreferrer" className="font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-300">
                        View transaction
                      </a>
                    ) : null}
                  </p>
                ) : null}

                <Button type="submit" disabled={isSending}>
                  {isSending ? 'Sending…' : 'Purchase license'}
                </Button>
              </form>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Recent activity</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Historic payment log</h2>
                </div>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300">
                  Live
                </span>
              </div>
              <div className="space-y-4">
                {items.length ? (
                  items.map((item) => (
                    <div key={item.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-950 dark:text-white">{item.description}</p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.hash ? `Hash: ${item.hash.slice(0, 12)}...` : 'Awaiting confirmation'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                              : item.status === 'failed'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-300'
                          }`}>
                            {item.status}
                          </span>
                          {item.explorerUrl ? (
                            <a href={item.explorerUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-300">
                              View
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                    No transaction history yet. Submit a license purchase to see your recent activity.
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
