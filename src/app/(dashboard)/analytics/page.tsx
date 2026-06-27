"use client";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-semibold">Analytics</h2>
        <p className="mt-2 text-slate-300">
          Review licensing volume, active users, and revenue performance at a glance.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Active licenses</p>
          <p className="mt-2 text-3xl font-semibold">183</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Revenue run-rate</p>
          <p className="mt-2 text-3xl font-semibold">$48k</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Wallet actions</p>
          <p className="mt-2 text-3xl font-semibold">+12%</p>
        </div>
      </div>
    </div>
  );
}
