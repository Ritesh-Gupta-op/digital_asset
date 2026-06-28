"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { sendXLMPayment } from '@/services/contract';
import { useTransactionStore } from '@/store/transactions';
import { useWalletStore } from '@/store/wallet';

export default function TransactionsPage() {
  const { items, update } = useTransactionStore();
  const { connected, address, network } = useWalletStore();
  const [recipient, setRecipient] = useState(address ?? '');
  const [amount, setAmount] = useState('0.0001');
  const [description, setDescription] = useState('Manual test payment');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!connected || !recipient) {
      setError('Connect your wallet and enter a recipient address to send a real XLM payment.');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSending(true);

    try {
      const result = await sendXLMPayment(recipient, amount, description || 'Manual test payment');
      setSuccess(`Payment submitted. Hash: ${result.hash}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Transaction center</h2>
            <p className="mt-2 text-slate-300">
              Send a real XLM payment from the connected wallet and track the transaction lifecycle here.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Network: <span className="font-medium text-white">{network}</span>
            </p>
          </div>
          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {connected ? 'Wallet connected' : 'Wallet disconnected'}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="recipient-address">
              Recipient address
            </label>
            <input
              id="recipient-address"
              className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none ring-0"
              placeholder="G..."
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="amount">
              Amount
            </label>
            <input
              id="amount"
              className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none ring-0"
              placeholder="0.0001"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="description">
              Description
            </label>
            <input
              id="description"
              className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none ring-0"
              placeholder="Manual test payment"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

          <Button type="submit" disabled={isSending}>
            {isSending ? 'Sending…' : 'Send test payment'}
          </Button>
        </form>
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
