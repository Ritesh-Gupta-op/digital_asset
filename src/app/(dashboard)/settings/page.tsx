export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-black text-white font-inter">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.25em] text-red-400 font-manrope">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ef233c]" />
                Settings
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white font-manrope sm:text-4xl">
                Manage Wallet & Transaction Preferences
              </h1>
            </div>
            <p className="max-w-xl text-sm text-zinc-400">
              Adjust the way your Stellar license workflow behaves without changing core transaction capabilities.
            </p>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-2">
            <section className="rounded-[28px] border border-white/10 bg-zinc-900/50 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-white font-manrope">Wallet Preferences</h2>
              <p className="mt-1 text-xs text-zinc-400">Choose which wallet type and network style you want to use for transactions.</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
                  <p className="text-sm font-semibold text-white font-manrope">Preferred Wallet</p>
                  <p className="mt-1 text-xs text-zinc-400">Freighter, Lobstr, or Albedo are available through the Stellar wallet kit.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
                  <p className="text-sm font-semibold text-white font-manrope">Network Selection</p>
                  <p className="mt-1 text-xs text-zinc-400">Switch between testnet and mainnet to control where payments are submitted.</p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-zinc-900/50 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-white font-manrope">UI & Experience</h2>
              <p className="mt-1 text-xs text-zinc-400">Fine-tune how your dashboard looks and feels while keeping current workflows intact.</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
                  <p className="text-sm font-semibold text-white font-manrope">Theme Mode</p>
                  <p className="mt-1 text-xs text-zinc-400">Red Noir high-contrast dark theme with glowing accents enabled by default.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
                  <p className="text-sm font-semibold text-white font-manrope">History Display</p>
                  <p className="mt-1 text-xs text-zinc-400">Your payment history is shown with status badges and explorer links for each completed transaction.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
