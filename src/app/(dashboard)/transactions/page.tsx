"use client";

import { Button } from '@/components/ui/button';
import { useTransactionStore } from '@/store/transactions';

export default function TransactionsPage() {
  const { items, update } = useTransactionStore();

  return (
    <div className="space-y-6 p-8">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Transaction center</h2>
            <p className="mt-2 text-slate-300">
              Pending, processing, confirmed, and failed transactions appear here with explorer links and retry flows.
            </p>
          </div>
          <Button variant="outline">Retry last</Button>
        </div>
      </div>
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="mt-1 text-sm text-slate-400">{item.status}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => update(item.id, { status: 'processing' })}>
                Retry
              </Button>
            </div>
            {item.hash ? <p className="mt-3 text-sm text-slate-400">Hash: {item.hash}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
