'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white font-inter relative overflow-x-hidden">
      {/* ── Global Background ─────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] to-black" />
        <div className="absolute top-0 left-0 w-px h-px bg-transparent stars-1" />
        <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent stars-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 grid-overlay" />
      </div>

      <div className="gradient-blur" />

      {/* ── Navbar ────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 pt-6 px-4">
        <nav className="max-w-5xl mx-auto flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#ef233c] rounded-sm rotate-45 shadow-glow-sm" />
            <span className="text-lg font-bold font-manrope tracking-tight">LicenseCraft</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {(['Features','How It Works','Pricing','Docs'] as const).map((label) => (
              <a key={label} href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/5 px-6 py-2 transition-transform active:scale-95"
            >
              <span className="absolute inset-0 border border-white/10 rounded-full" />
              <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#ef233c_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-[1px] rounded-full bg-black" />
              <span className="relative z-10 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                Launch App →
              </span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* ── Hero ──────────────────────────────────────── */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6">
          <div className="text-center max-w-5xl mx-auto">

            {/* Announcement badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef233c]" />
              </span>
              <span className="text-xs font-medium text-red-100/90 tracking-wide font-manrope">
                Now live on Stellar Testnet — Soroban Smart Contracts
              </span>
              <span className="text-red-400 text-xs">→</span>
            </div>

            {/* Hero heading */}
            <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter font-manrope leading-[1.05] mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                Digital License
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                OS for the{' '}
                <span className="text-[#ef233c] relative inline-block">
                  Blockchain
                  <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#ef233c] opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Automate NFT licensing, smart contract issuance, and digital asset royalties on Stellar's Soroban platform — with live analytics and one-click deployment.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/dashboard">
                <button className="shiny-cta group">
                  <span className="relative z-10 flex items-center gap-2 text-white font-semibold font-manrope text-sm">
                    Start Building
                    <span className="transition-transform group-hover:translate-x-1 inline-block">→</span>
                  </span>
                </button>
              </Link>

              <Link
                href="/transactions"
                className="px-8 py-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-2 text-sm"
              >
                View Live Transactions
              </Link>
            </div>
          </div>

          {/* Logo Strip */}
          <div className="w-full mt-28 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm py-8 opacity-60 hover:opacity-100 transition-opacity">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase shrink-0">Built on:</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-14 items-center w-full">
                {['Stellar', 'Soroban', 'Horizon API', 'Freighter', 'Vercel'].map((name) => (
                  <div key={name} className="flex items-center gap-2 font-manrope font-semibold text-sm text-zinc-300">
                    <div className="w-5 h-5 bg-white/20 rounded-full" />
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Features Bento Grid ────────────────────────── */}
        <section className="py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight font-manrope mb-5">
                The Operating System for{' '}
                <span className="text-[#ef233c]">Digital Asset Teams</span>
              </h2>
              <p className="text-lg text-zinc-400 font-light">
                Replace fragmented blockchain tools with one cohesive platform driven by Soroban smart contracts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:h-[680px]">
              {/* Main Feature */}
              <div className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden p-8 border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black hover:border-white/20 transition-all rounded-2xl">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="mb-6 inline-flex p-3 rounded-xl bg-white/5 border border-white/10 text-[#ef233c] w-fit">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h3 className="text-3xl font-semibold text-white font-manrope mb-4 tracking-tight">Soroban Smart License Registry</h3>
                  <p className="text-zinc-400 text-lg leading-relaxed">Deploy digital asset licenses directly to Stellar's Soroban VM. Each license is cryptographically registered, immutable, and verifiable on-chain with full metadata and royalty enforcement.</p>
                  <div className="mt-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <span className="text-xs font-mono text-[#ef233c] tracking-widest">EXPLORE FEATURE</span>
                    <span className="text-[#ef233c]">→</span>
                  </div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" style={{ background: 'radial-gradient(circle at top right, #ef233c, transparent 70%)' }} />
              </div>

              {/* Feature 2 */}
              <div className="lg:col-span-2 group relative overflow-hidden p-7 border border-white/10 bg-black hover:border-white/20 transition-all rounded-2xl">
                <div className="mb-4 inline-flex p-3 rounded-xl bg-white/5 border border-white/10 text-blue-400 w-fit">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-2xl font-semibold text-white font-manrope mb-2">Live On-Chain Transactions</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Every XLM payment and contract call is broadcast to Horizon and persisted via the backend API — full transaction history, Stellar Explorer links, and real-time status.</p>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" style={{ background: 'radial-gradient(circle at top right, #3b82f6, transparent 70%)' }} />
              </div>

              {/* Feature 3 */}
              <div className="group relative overflow-hidden p-7 border border-white/10 bg-black hover:border-white/20 transition-all rounded-2xl">
                <div className="mb-4 inline-flex p-3 rounded-xl bg-white/5 border border-white/10 text-yellow-400 w-fit">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl font-semibold text-white font-manrope mb-2">Analytics API</h3>
                <p className="text-sm text-zinc-400">Server-side aggregated XLM volume, daily breakdowns, and license metrics from the backend analytics endpoint.</p>
              </div>

              {/* Feature 4 */}
              <div className="group relative overflow-hidden p-7 border border-white/10 bg-black hover:border-white/20 transition-all rounded-2xl">
                <div className="mb-4 inline-flex p-3 rounded-xl bg-white/5 border border-white/10 text-purple-400 w-fit">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl font-semibold text-white font-manrope mb-2">Wallet-Native Auth</h3>
                <p className="text-sm text-zinc-400">Freighter, Lobstr, and Albedo wallet support. No passwords — sign with your Stellar keypair.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Red Testimonial Banner ────────────────────── */}
        <div className="w-full bg-[#ef233c] py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-1 text-black mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ))}
            </div>
            <h3 className="text-3xl md:text-5xl font-bold text-black font-manrope leading-tight mb-8">
              "LicenseCraft transformed how we manage creator royalties. What used to require custom dev work is now a single transaction."
            </h3>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center font-bold text-black text-lg">R</div>
              <div className="text-left">
                <div className="text-black font-bold text-lg font-manrope">Ritesh Gupta</div>
                <div className="text-black/70 font-medium text-sm">Founder, LicenseCraft</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Pricing ───────────────────────────────────── */}
        <section className="py-28 px-6 bg-black relative border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold text-white font-manrope mb-4">Simple, Transparent Pricing</h2>
              <p className="text-zinc-400">Start free on Stellar testnet, scale as you grow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter */}
              <div className="p-8 border border-zinc-800 bg-black hover:border-zinc-700 transition-all rounded-2xl flex flex-col">
                <h3 className="text-xl font-bold font-manrope mb-2">Testnet</h3>
                <p className="text-zinc-500 text-sm mb-8 min-h-[2.5rem]">For developers exploring Soroban contract licensing.</p>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-zinc-500">$</span>
                  <span className="text-5xl font-bold text-white">0</span>
                  <span className="text-zinc-500 text-sm">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1 text-sm text-zinc-300">
                  {['Testnet Contract Deployment','Unlimited Transactions','Wallet Connect','Community Support'].map(f => (
                    <li key={f} className="flex items-center gap-3"><span className="text-[#ef233c]">✓</span> {f}</li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm font-bold uppercase tracking-wider transition-all">
                    Start Free
                  </button>
                </Link>
              </div>

              {/* Pro */}
              <div className="relative p-8 border border-[#ef233c] bg-zinc-900/40 shadow-glow rounded-2xl flex flex-col scale-105 z-10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ef233c] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Mainnet Ready
                </div>
                <h3 className="text-xl font-bold font-manrope mb-2">Production</h3>
                <p className="text-zinc-400 text-sm mb-8 min-h-[2.5rem]">For creators and businesses deploying real contracts.</p>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-zinc-500">$</span>
                  <span className="text-5xl font-bold text-white">49</span>
                  <span className="text-zinc-500 text-sm">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1 text-sm text-zinc-300">
                  {['Mainnet Contract Deployment','Advanced Analytics API','License Registry Access','Priority Support','Vercel Edge Deployment'].map(f => (
                    <li key={f} className="flex items-center gap-3"><span className="text-[#ef233c]">✓</span> {f}</li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <button className="w-full py-3 px-4 bg-[#ef233c] hover:bg-red-700 text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-all">
                    Deploy Now
                  </button>
                </Link>
              </div>

              {/* Enterprise */}
              <div className="p-8 border border-zinc-800 bg-black hover:border-zinc-700 transition-all rounded-2xl flex flex-col">
                <h3 className="text-xl font-bold font-manrope mb-2">Enterprise</h3>
                <p className="text-zinc-500 text-sm mb-8 min-h-[2.5rem]">For agencies and DAOs managing asset portfolios at scale.</p>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-zinc-500">$</span>
                  <span className="text-5xl font-bold text-white">199</span>
                  <span className="text-zinc-500 text-sm">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1 text-sm text-zinc-300">
                  {['Custom Contract Templates','Multi-Wallet Team Support','API Access & SSO','Dedicated SLA'].map(f => (
                    <li key={f} className="flex items-center gap-3"><span className="text-[#ef233c]">✓</span> {f}</li>
                  ))}
                </ul>
                <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm font-bold uppercase tracking-wider transition-all">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Waitlist ──────────────────────────────── */}
        <section className="py-28 px-6 text-center bg-zinc-950/40 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold font-manrope mb-6 tracking-tighter">
              Ready to <span className="text-[#ef233c]">Build?</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-10">
              Join the waitlist for mainnet access and enterprise contract support.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="noir-input flex-1"
              />
              <button type="submit" className="bg-[#ef233c] hover:bg-red-700 text-white font-bold rounded-full px-8 py-3.5 transition-all text-sm uppercase tracking-wider shrink-0">
                Join Now
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="bg-black border-t border-zinc-900 pt-20 pb-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 relative z-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 bg-[#ef233c] rounded-sm rotate-45" />
              <span className="text-2xl font-bold font-manrope tracking-tight">LicenseCraft</span>
            </div>
            <p className="text-zinc-500 max-w-xs leading-relaxed text-sm">
              The production-grade digital asset licensing operating system built on Stellar Soroban smart contracts.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#ef233c] uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4 text-zinc-400 text-sm">
              {['Dashboard','Licenses','Transactions','Analytics'].map(item => (
                <li key={item}><Link href={`/${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#ef233c] uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-4 text-zinc-400 text-sm">
              {['Documentation','GitHub','Stellar Explorer','API Reference'].map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Big ghost text */}
        <div className="flex justify-center items-center py-8 opacity-[0.06] pointer-events-none select-none overflow-hidden">
          <span className="text-[15vw] leading-none font-bold font-manrope tracking-tighter text-stroke">LICENSECRAFT</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between text-zinc-600 text-[10px] uppercase tracking-widest">
          <p>© 2024 LicenseCraft. Built on Stellar. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="https://github.com/Ritesh-Gupta-op/digital_asset" target="_blank" rel="noreferrer" className="hover:text-zinc-400 transition-colors">GitHub</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
