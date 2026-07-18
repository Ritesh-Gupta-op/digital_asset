export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-300">Settings</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">Manage wallet and transaction preferences</h1>
            </div>
            <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
              Adjust the way your Stellar license workflow behaves without changing core transaction capabilities.
            </p>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-2">
            <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Wallet preferences</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose which wallet type and network style you want to use for transactions.</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Preferred wallet</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Freighter, Lobstr, or Albedo are available through the Stellar wallet kit.</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Network selection</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Switch between testnet and mainnet to control where payments are submitted.</p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">UI and experience</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Fine-tune how your dashboard looks and feels while keeping current workflows intact.</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Theme mode</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Toggle between light and dark modes across the dashboard.</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">History display</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your payment history is shown with status badges and explorer links for each completed transaction.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
