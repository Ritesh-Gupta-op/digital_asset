import { NextRequest, NextResponse } from 'next/server';
import { getTxRecords, addTxRecord } from '@/lib/db';
import { CreateTransactionSchema } from '@/lib/validators';

export async function GET() {
  try {
    const records = await getTxRecords();
    return NextResponse.json({ transactions: records, total: records.length });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateTransactionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const record = await addTxRecord({
      ...parsed.data,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ transaction: record }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to record transaction' }, { status: 500 });
  }
}
