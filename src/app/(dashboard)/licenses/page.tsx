'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiGetLicenses, apiCreateLicense, ApiLicense } from '@/services/api';
import { useWalletStore } from '@/store/wallet';
import { Skeleton, TableRowSkeleton } from '@/components/ui/skeleton';
import { ErrorCard } from '@/components/ui/error-card';
import { Badge, licenseStatusVariant } from '@/components/ui/badge';
import { useLicenseSearch } from '@/hooks/useLicenseSearch';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['all', 'draft', 'active', 'revoked'] as const;

export default function LicensesPage() {
  const { address } = useWalletStore();
  const [licenses, setLicenses] = useState<ApiLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [terms, setTerms] = useState('');
  const [fee, setFee] = useState('10');
  const [submitting, setSubmitting] = useState(false);

  // ── Search / Filter ─────────────────────────────────────────────────
  const { query, setQuery, statusFilter, setStatusFilter, filtered, total } = useLicenseSearch({
    licenses,
  });

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
    <main className="min-h-screen bg-black text-white font-inter">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.25em] text-red-400 font-manrope">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ef233c]" />
              License Registry API
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-white font-manrope">
              Digital License Management
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Create, inspect, and manage digital asset licenses persisted on-chain and backend API.
            </p>
          </div>

          <button
            onClick={fetchLicenses}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.8fr]">
          {/* Create License Form */}
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white font-manrope">Issue New License</h2>
            <p className="mt-1 text-xs text-zinc-400">
              Draft license terms and register contract metadata.
            </p>

            <form onSubmit={handleCreateLicense} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  License Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. NFT Commercial Rights v1"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#ef233c] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Royalty / License Fee (XLM)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#ef233c] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Terms &amp; Conditions
                </label>
                <textarea
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Granted commercial usage rights, token ID metadata..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#ef233c] focus:outline-none resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-[#ef233c] hover:bg-red-700 py-3.5 text-xs font-bold text-white shadow-glow-sm transition-all disabled:opacity-50 font-manrope uppercase tracking-wider"
              >
                {submitting ? 'Creating License…' : 'Create License Draft'}
              </button>
            </form>
          </div>

          {/* Licenses List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-xl font-bold text-white font-manrope flex-1">
                Registered Licenses
                {!loading && (
                  <span className="ml-2 text-sm font-normal text-zinc-500">
                    ({total} of {licenses.length})
                  </span>
                )}
              </h2>
            </div>

            {/* Search + Status filter bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, terms, or contract…"
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#ef233c] focus:outline-none transition-colors"
              />
              <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-black/40 p-1">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s as typeof statusFilter)}
                    className={`rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                      statusFilter === s
                        ? 'bg-[#ef233c] text-white'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </div>
            ) : error ? (
              <ErrorCard message={error} retry={fetchLicenses} />
            ) : filtered.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">
                {licenses.length === 0
                  ? 'No licenses registered yet. Create your first license draft above.'
                  : 'No licenses match your search or filter.'}
              </div>
            ) : (
              filtered.map((lic) => (
                <div
                  key={lic.id}
                  className="rounded-[24px] border border-white/10 bg-zinc-900/50 p-5 shadow-sm transition hover:border-white/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white font-manrope">{lic.title}</span>
                        <Badge variant={licenseStatusVariant(lic.status)} dot>
                          {lic.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                        {lic.terms || 'Standard licensing terms apply.'}
                      </p>
                    </div>

                    {lic.amount && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-zinc-200 font-mono shrink-0">
                        {lic.amount} XLM
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-zinc-500 border-t border-white/5 pt-3 gap-2">
                    <span className="font-mono">Contract: {lic.contractId?.slice(0, 10)}...</span>
                    <div className="flex items-center gap-3">
                      <span>Created: {new Date(lic.createdAt).toLocaleDateString()}</span>
                      {lic.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          ✓ Funded
                        </span>
                      ) : (
                        <Link
                          href={`/transactions?licenseId=${lic.id}&title=${encodeURIComponent(lic.title)}&amount=${lic.amount || '10'}&owner=${encodeURIComponent(lic.ownerAddress || '')}&terms=${encodeURIComponent(lic.terms || '')}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#ef233c] hover:bg-red-700 px-3 py-1 rounded-full transition-all shadow-glow-sm font-manrope"
                        >
                          💳 Fund in Transactions →
                        </Link>
                      )}
                    </div>
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
