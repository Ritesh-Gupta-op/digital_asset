"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { submitLicenseDraft } from '@/services/contract';
import { apiGetTransactions, ApiTransaction } from '@/services/api';
import { useWalletStore } from '@/store/wallet';
import { getSorobanConfig } from '@/lib/soroban';
import { Skeleton, TableRowSkeleton } from '@/components/ui/skeleton';
import { ErrorCard } from '@/components/ui/error-card';

export default function TransactionsPage() {
  const { connected, address, network } = useWalletStore();
  const sorobanConfig = getSorobanConfig(network);

  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [recipient, setRecipient] = useState(address ?? '');
  const [amount, setAmount] = useState('0.0001');
  const [licenseTitle, setLicenseTitle] = useState('Creator license purchase');
  const [licenseTerms, setLicenseTerms] = useState('Digital asset licensing rights');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null);

  const fetchTxs = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await apiGetTransactions();
      setTransactions(res.transactions);
    } catch (err) {
      setFetchError((err as Error).message || 'Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTxs();
  }, []);

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

      // Refresh API transactions
      await fetchTxs();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'License purchase failed';
      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Purchase Form */}
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
                  Soroban Contract Call
                </p>
                <h1 className="mt-2 text-3xl font-extrabold text-white">License Purchase Form</h1>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                Mode: Live
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="recipient-address" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Issuer Wallet Address
                </label>
                <input
                  id="recipient-address"
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="G..."
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="license-title" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    License Title
                  </label>
                  <input
                    id="license-title"
                    type="text"
                    value={licenseTitle}
                    onChange={(e) => setLicenseTitle(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="license-amount" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Amount (XLM)
                  </label>
                  <input
                    id="license-amount"
                    type="number"
                    step="0.0001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="license-terms" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  License Terms
                </label>
                <textarea
                  id="license-terms"
                  rows={3}
                  value={licenseTerms}
                  onChange={(e) => setLicenseTerms(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              {error && <div className="text-xs text-rose-400">{error}</div>}
              {success && <div className="text-xs text-emerald-400">{success}</div>}

              <Button
                type="submit"
                disabled={isSending}
                className="w-full rounded-full bg-cyan-500 py-3 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-cyan-400 disabled:opacity-50"
              >
                {isSending ? 'Submitting to Soroban Contract…' : 'Submit On-Chain Transaction'}
              </Button>
            </form>
          </div>

          {/* Persistent Transaction History */}
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Backend API Persistence
                </p>
                <h2 className="mt-1 text-2xl font-bold text-white">Transaction Logs</h2>
              </div>
              <button
                onClick={fetchTxs}
                className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                🔄 Refresh
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </div>
              ) : fetchError ? (
                <ErrorCard message={fetchError} retry={fetchTxs} />
              ) : transactions.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-slate-800 p-8 text-center text-xs text-slate-500">
                  No confirmed transactions recorded yet. Submit a transaction above.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="rounded-[28px] border border-slate-800 bg-slate-950 p-5 space-y-2 shadow-sm transition hover:border-slate-700"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-white">{tx.description}</p>
                      <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                        {tx.status}
                      </span>
                    </div>

                    {tx.hash && (
                      <p className="text-xs text-slate-400 font-mono">Hash: {tx.hash}</p>
                    )}

                    {tx.explorerUrl && (
                      <a
                        href={tx.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                      >
                        View on Stellar Expert Explorer →
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
