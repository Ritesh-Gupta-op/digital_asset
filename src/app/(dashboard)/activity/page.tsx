"use client";

const feed = [
  { id: 1, title: 'Royalty routed', detail: 'A new royalty event was emitted from the router contract.' },
  { id: 2, title: 'License activated', detail: 'The creator activated a production license for a new partner.' },
  { id: 3, title: 'Transaction confirmed', detail: 'The latest contract call reached the confirmed state.' },
];

export default function ActivityPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-semibold">Live activity feed</h2>
        <p className="mt-2 text-slate-300">
          Contract events and transaction lifecycle updates will stream here in real time.
        </p>
      </div>
      <div className="space-y-3">
        {feed.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
