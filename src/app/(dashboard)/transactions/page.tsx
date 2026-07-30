"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { submitLicenseDraft } from '@/services/contract';
import { apiGetTransactions, apiGetLicenses, apiUpdateLicense, ApiTransaction, ApiLicense } from '@/services/api';
import { useWalletStore } from '@/store/wallet';
import { getSorobanConfig } from '@/lib/soroban';
import { Skeleton, TableRowSkeleton } from '@/components/ui/skeleton';
import { ErrorCard } from '@/components/ui/error-card';

export default function TransactionsPage() {
  const { connected, address, network } = useWalletStore();
  const sorobanConfig = getSorobanConfig(network);

  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [createdLicenses, setCreatedLicenses] = useState<ApiLicense[]>([]);
  const [selectedLicenseId, setSelectedLicenseId] = useState<string | null>(null);

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

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const [txRes, licRes] = await Promise.all([
        apiGetTransactions(),
        apiGetLicenses().catch(() => ({ licenses: [] })),
      ]);
      setTransactions(txRes.transactions);
      setCreatedLicenses(licRes.licenses);
    } catch (err) {
      setFetchError((err as Error).message || 'Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Check for query parameters passed from Licenses page
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const licId = params.get('licenseId');
      const titleParam = params.get('title');
      const amountParam = params.get('amount');
      const ownerParam = params.get('owner');
      const termsParam = params.get('terms');

      if (licId || titleParam) {
        if (licId) setSelectedLicenseId(licId);
        if (titleParam) setLicenseTitle(titleParam);
        if (amountParam) setAmount(amountParam);
        if (ownerParam && ownerParam !== 'undefined' && ownerParam !== 'null' && ownerParam !== '') {
          setRecipient(ownerParam);
        }
        if (termsParam) setLicenseTerms(termsParam);
      }
    }
  }, []);

  const handleSelectLicense = (licenseId: string) => {
    if (!licenseId) {
      setSelectedLicenseId(null);
      return;
    }
    const lic = createdLicenses.find((l) => l.id === licenseId);
    if (lic) {
      setSelectedLicenseId(lic.id);
      setLicenseTitle(lic.title);
      setAmount(lic.amount || '10');
      if (lic.terms) setLicenseTerms(lic.terms);
      if (lic.ownerAddress) setRecipient(lic.ownerAddress);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!connected || !recipient) {
      setError('Connect your wallet and enter the issuer address to buy/fund a license.');
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

      // If a created license was selected, mark it active in the backend
      if (selectedLicenseId) {
        await apiUpdateLicense(selectedLicenseId, {
          status: 'active',
          txHash: result.hash,
        }).catch(console.warn);
      }

      const url = `https://stellar.expert/explorer/${network}/tx/${result.hash}`;
      setSuccess(
        selectedLicenseId
          ? `License "${licenseTitle}" successfully funded and activated on-chain!`
          : 'License transaction confirmed. View the transaction on Stellar Expert.'
      );
      setExplorerUrl(url);

      // Refresh data
      await fetchAllData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'License purchase failed';
      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-inter">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Purchase / Funding Form */}
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.25em] text-red-400 font-manrope">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ef233c]" />
                  Soroban Contract Call
                </div>
                <h1 className="mt-2 text-3xl font-extrabold text-white font-manrope">License Funding & Purchase</h1>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                Mode: Live
              </span>
            </div>

            {/* Quick selector for created licenses */}
            {createdLicenses.length > 0 && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <label htmlFor="license-select" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-manrope">
                  💳 Select a Created License to Fund:
                </label>
                <select
                  id="license-select"
                  value={selectedLicenseId || ''}
                  onChange={(e) => handleSelectLicense(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-xs text-white focus:border-[#ef233c] focus:outline-none font-manrope cursor-pointer transition-colors"
                >
                  <option value="">-- Custom Transaction / New Purchase --</option>
                  {createdLicenses.map((lic) => (
                    <option key={lic.id} value={lic.id}>
                      {lic.title} ({lic.amount || '10'} XLM) — [{lic.status.toUpperCase()}]
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedLicenseId && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#ef233c]/10 border border-[#ef233c]/30 px-4 py-2.5 text-xs text-red-200">
                <span className="font-semibold font-manrope">
                  🎯 Funding Created License: <strong className="text-white">{licenseTitle}</strong> ({amount} XLM)
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedLicenseId(null)}
                  className="text-xs text-zinc-400 hover:text-white font-bold transition-colors ml-2"
                >
                  ✕ Clear
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="recipient-address" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Issuer Wallet Address
                </label>
                <input
                  id="recipient-address"
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="G..."
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#ef233c] focus:outline-none transition-colors font-mono text-xs"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="license-title" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    License Title
                  </label>
                  <input
                    id="license-title"
                    type="text"
                    value={licenseTitle}
                    onChange={(e) => setLicenseTitle(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-[#ef233c] focus:outline-none transition-colors font-manrope"
                  />
                </div>

                <div>
                  <label htmlFor="license-amount" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Amount (XLM)
                  </label>
                  <input
                    id="license-amount"
                    type="number"
                    step="0.0001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-[#ef233c] focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="license-terms" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  License Terms
                </label>
                <textarea
                  id="license-terms"
                  rows={3}
                  value={licenseTerms}
                  onChange={(e) => setLicenseTerms(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-[#ef233c] focus:outline-none resize-none transition-colors"
                />
              </div>

              {error && <div className="text-xs text-[#ef233c] font-semibold">{error}</div>}
              {success && <div className="text-xs text-emerald-400 font-semibold">{success}</div>}

              <button
                type="submit"
                disabled={isSending}
                className="w-full rounded-full bg-[#ef233c] hover:bg-red-700 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow-sm transition-all disabled:opacity-50 font-manrope"
              >
                {isSending
                  ? 'Submitting On-Chain Payment…'
                  : selectedLicenseId
                  ? `Fund License (${amount} XLM)`
                  : 'Submit On-Chain Transaction'}
              </button>
            </form>
          </div>

          {/* Persistent Transaction History */}
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black p-8 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                  Backend API Persistence
                </p>
                <h2 className="mt-1 text-2xl font-bold text-white font-manrope">Transaction Logs</h2>
              </div>
              <button
                onClick={fetchAllData}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
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
                <ErrorCard message={fetchError} retry={fetchAllData} />
              ) : transactions.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-white/10 p-8 text-center text-xs text-zinc-500">
                  No confirmed transactions recorded yet. Submit a transaction above.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="rounded-[24px] border border-white/10 bg-zinc-900/50 p-5 space-y-2 shadow-sm transition hover:border-white/20"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-white font-manrope">{tx.description}</p>
                      <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        {tx.status}
                      </span>
                    </div>

                    {tx.hash && (
                      <p className="text-xs text-zinc-400 font-mono">Hash: {tx.hash}</p>
                    )}

                    {tx.explorerUrl && (
                      <a
                        href={tx.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex text-xs font-bold text-[#ef233c] hover:text-red-400 transition-colors"
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
