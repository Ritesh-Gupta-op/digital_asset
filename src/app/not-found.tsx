import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Glowing 404 */}
        <div className="relative inline-block mb-8">
          <span className="text-[10rem] font-extrabold font-manrope leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 bg-[#ef233c]/10 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.25em] text-red-400 font-manrope mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ef233c] animate-pulse" />
          Page Not Found
        </div>

        <h1 className="text-3xl font-bold font-manrope tracking-tight mb-3">
          This route doesn&apos;t exist
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          The page you&apos;re looking for has moved, been deleted, or never existed on this network.
          Double-check the URL or navigate back to the dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-full bg-[#ef233c] hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white transition-all font-manrope"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="rounded-full border border-zinc-800 bg-zinc-900 px-8 py-3 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all font-manrope"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
