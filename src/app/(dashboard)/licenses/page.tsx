'use client';

import React, { useState, useEffect } from 'react';
import { apiGetLicenses, apiCreateLicense, ApiLicense } from '@/services/api';
import { useWalletStore } from '@/store/wallet';
import { Skeleton, TableRowSkeleton } from '@/components/ui/skeleton';
import { ErrorCard } from '@/components/ui/error-card';
import { toast } from 'sonner';

export default function LicensesPage() {
  const { address } = useWalletStore();
  const [licenses, setLicenses] = useState<ApiLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [terms, setTerms] = useState('');
  const [fee, setFee] = useState('10');
  const [submitting, setSubmitting] = useState(false);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGetLicenses();
      setLicenses(res.licenses);
    } catch (err) {
      setError((err as Error).message || 'Failed to load licenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleCreateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      const res = await apiCreateLicense({
        title,
        terms,
        ownerAddress: address ?? undefined,
        amount: fee,
      });

      setLicenses((prev) => [res.license, ...prev]);
      setTitle('');
      setTerms('');
      toast.success('License draft created successfully');
    } catch (err) {
      toast.error((err as Error).message || 'Failed to create license');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
              License Registry API
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Digital License Management
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Create, inspect, and manage digital asset licenses persisted on-chain and backend API.
            </p>
          </div>

          <button
            onClick={fetchLicenses}
            className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.8fr]">
          {/* Create License Form */}
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white">Issue New License</h2>
            <p className="mt-1 text-xs text-slate-400">
              Draft license terms and register contract metadata.
            </p>

            <form onSubmit={handleCreateLicense} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  License Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. NFT Commercial Rights v1"
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Royalty / License Fee (XLM)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Granted commercial usage rights, token ID metadata..."
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-cyan-500 py-3 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-cyan-400 disabled:opacity-50"
              >
                {submitting ? 'Creating License…' : 'Create License Draft'}
              </button>
            </form>
          </div>

          {/* Licenses List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Registered Licenses</h2>

            {loading ? (
              <div className="space-y-3">
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </div>
            ) : error ? (
              <ErrorCard message={error} retry={fetchLicenses} />
            ) : licenses.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
                No licenses registered yet. Create your first license draft above.
              </div>
            ) : (
              licenses.map((lic) => (
                <div
                  key={lic.id}
                  className="rounded-[28px] border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{lic.title}</span>
                        <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                          {lic.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                        {lic.terms || 'Standard licensing terms apply.'}
                      </p>
                    </div>

                    {lic.amount && (
                      <span className="rounded-2xl bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">
                        {lic.amount} XLM
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-3">
                    <span>Contract: {lic.contractId?.slice(0, 10)}...</span>
                    <span>Created: {new Date(lic.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
