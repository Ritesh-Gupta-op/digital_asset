import React from 'react';

export function ErrorCard({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="rounded-[24px] border border-rose-500/20 bg-rose-500/5 p-6 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10">
        <span className="text-rose-400 text-lg">⚠</span>
      </div>
      <p className="text-sm font-semibold text-rose-400">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="mt-4 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20"
        >
          Retry
        </button>
      )}
    </div>
  );
}
