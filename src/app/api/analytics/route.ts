import { NextResponse } from 'next/server';
import { getTxRecords, getLicenseRecords } from '@/lib/db';

export async function GET() {
  try {
    const [transactions, licenses] = await Promise.all([
      getTxRecords(),
      getLicenseRecords(),
    ]);

    const confirmed = transactions.filter((t) => t.status === 'confirmed');
    const pending = transactions.filter((t) => t.status === 'pending' || t.status === 'processing');
    const failed = transactions.filter((t) => t.status === 'failed');
    const activeLicenses = licenses.filter((l) => l.status === 'active');

    // Compute daily breakdown for the last 7 days
    const days: { date: string; confirmed: number; failed: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      days.push({
        date: dateStr,
        confirmed: confirmed.filter((t) => t.createdAt?.startsWith(dateStr)).length,
        failed: failed.filter((t) => t.createdAt?.startsWith(dateStr)).length,
      });
    }

    // Total XLM volume from confirmed transactions
    const totalVolumeXLM = confirmed
      .filter((t) => t.amount)
      .reduce((sum, t) => sum + parseFloat(t.amount ?? '0'), 0);

    return NextResponse.json({
      totals: {
        transactions: transactions.length,
        confirmed: confirmed.length,
        pending: pending.length,
        failed: failed.length,
        licenses: licenses.length,
        activeLicenses: activeLicenses.length,
      },
      volume: {
        xlm: totalVolumeXLM.toFixed(4),
      },
      daily: days,
      contractId:
        process.env.NEXT_PUBLIC_CONTRACT_REGISTRY ??
        'CDBHJ72ROMTWZC6OIL6TDCUFH6VJOB4CSODT5H6S6DJCQQAJQHBHY6R7',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to compute analytics' }, { status: 500 });
  }
}
