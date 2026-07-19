'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <main className={`min-h-screen transition-colors duration-500 ease-out ${isDarkMode ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-950'}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-md" style={{
              backgroundColor: isDarkMode ? '#e2e8f0' : '#0f172a',
              color: isDarkMode ? '#0f172a' : '#ffffff'
            }}>
              <span className="text-lg font-bold">L</span>
            </div>
            <div>
              <div className="text-lg font-semibold">LicenseCraft</div>
              <div className={`text-xs uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>License OS</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 hover:dark:bg-slate-800 active:scale-[0.95] inline-flex items-center gap-2"
            >
              {isDarkMode ? (
                <>
                  <span>☀️</span>
                  <span>Light</span>
                </>
              ) : (
                <>
                  <span>🌙</span>
                  <span>Dark</span>
                </>
              )}
            </button>

            <Link
              href="/dashboard"
              className="rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-500"
            >
              Get Started
            </Link>
          </div>
        </header>

        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl space-y-8">
            <div className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
              Built on Stellar
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
                Your one-click digital license generator for NFTs, smart contracts, and tokens.
              </h1>
              <p className={`max-w-xl text-lg leading-8 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                A digital asset licensing platform for creators and businesses with smart workflow automation and live payment insights.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-full bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Get Started
              </Link>
              <Link
                href="#"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className={`rounded-[32px] border p-8 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.15)] transition duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_35px_90px_-45px_rgba(15,23,42,0.2)] ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-sm uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Balance</p>
                <p className="mt-3 text-4xl font-semibold">$12,450.82</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <span className="rounded-full bg-slate-200 px-2 py-1 text-slate-800 dark:bg-slate-700 dark:text-slate-100">USDC</span>
                <span className="rounded-full bg-slate-200 px-2 py-1 text-slate-800 dark:bg-slate-700 dark:text-slate-100">XLM</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
