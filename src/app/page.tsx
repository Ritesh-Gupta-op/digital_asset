import React from 'react';
import Link from 'next/link';

const highlights = [
  { title: 'On-chain licensing', text: 'Create immutable agreements with wallet-signed approvals.', icon: '📋' },
  { title: 'Royalty insights', text: 'Track live revenue events and transfer activity in one place.', icon: '💰' },
  { title: 'Fast operations', text: 'Run pending, processing, confirmed, and failed flows with retries.', icon: '⚡' },
];

const stats = [
  { label: 'Active licenses', value: '1.2k', trend: '+24%' },
  { label: 'Daily volume', value: '$2.4M', trend: '+18%' },
  { label: 'Network uptime', value: '99.9%', trend: '✓' },
];

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(255,138,31,0.3),_transparent_50%),linear-gradient(135deg,_#020617_0%,_#111827_50%,_#0a0f1a_100%)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] opacity-20" />
      
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <div className="space-y-8">
              <div>
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
                  <span className="text-sm font-semibold text-brand-300">Stellar Blockchain Native</span>
                </div>
                <h1 className="mt-4 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-5xl font-black leading-[1.1] text-transparent sm:text-6xl lg:text-7xl">
                  Monetize and govern digital IP with transparent, live licensing.
                </h1>
              </div>

              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Launch licensing agreements, track royalty events, and manage wallet-connected operations from a premium workspace built for the Stellar network.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="group rounded-full bg-gradient-to-r from-brand-600 to-orange-600 px-8 py-3.5 font-bold text-white shadow-2xl shadow-brand-600/40 transition hover:shadow-brand-600/60 hover:scale-105 active:scale-[0.97]"
                >
                  Launch dashboard →
                </Link>
                <Link
                  href="/activity"
                  className="group rounded-full border-2 border-white/20 bg-white/5 px-8 py-3.5 font-bold text-slate-100 backdrop-blur transition hover:border-brand-500/50 hover:bg-brand-500/10 hover:scale-105 active:scale-[0.97]"
                >
                  View activity
                </Link>
              </div>

              <div className="grid gap-4 pt-8 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 backdrop-blur-sm">
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-400">{stat.trend}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="group relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950 p-8 shadow-2xl transition hover:border-brand-500/30">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 to-transparent opacity-0 transition group-hover:opacity-100" />
              
              <div className="relative space-y-6">
                <div>
                  <p className="text-sm font-semibold text-slate-400">Live License Vault</p>
                  <p className="mt-2 text-4xl font-black text-white">84</p>
                  <p className="mt-1 text-sm text-slate-400">active licensing deals</p>
                </div>

                <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Royalty flow rate</span>
                    <span className="font-bold text-emerald-400">Live</span>
                  </div>
                  <div className="mt-3 flex items-end gap-1.5">
                    {[40, 65, 55, 78, 85, 72, 90, 68].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-600 via-orange-500 to-orange-400 transition group-hover:opacity-80"
                        style={{
                          height: `${h}px`,
                          animation: `pulse 2s ease-in-out infinite`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {[
                    { label: 'License approvals', value: '24 pending', color: 'bg-yellow-500/20' },
                    { label: 'Transactions', value: '8 confirmed', color: 'bg-emerald-500/20' },
                    { label: 'Wallet sync', value: 'Connected', color: 'bg-brand-500/20' },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-xl border border-white/10 ${item.color} bg-white/5 px-4 py-2 backdrop-blur-sm flex items-center justify-between`}>
                      <span className="text-sm text-slate-300">{item.label}</span>
                      <span className="font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-gradient-to-r from-brand-600/20 to-orange-600/20 border border-brand-500/20 p-3 pt-2">
                  <p className="text-xs font-semibold text-brand-300">✓ No payment required</p>
                  <p className="text-xs text-slate-400 mt-1">Read-only wallet connection on Stellar testnet.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-20 grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm transition hover:border-brand-500/30 hover:bg-brand-500/10">
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="font-bold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
            </div>
          ))}
        </section>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </main>
  );
}
