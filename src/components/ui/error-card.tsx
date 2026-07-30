import React from 'react';

export function ErrorCard({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="rounded-[24px] border border-[#ef233c]/30 bg-[#ef233c]/10 p-6 text-center backdrop-blur-md">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#ef233c]/20">
        <span className="text-[#ef233c] text-lg font-bold">⚠</span>
      </div>
      <p className="text-sm font-semibold text-red-200 font-manrope">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="mt-4 rounded-full border border-[#ef233c]/40 bg-[#ef233c]/20 px-5 py-1.5 text-xs font-bold text-white transition hover:bg-[#ef233c]/40 uppercase tracking-wider"
        >
          Retry
        </button>
      )}
    </div>
  );
}
