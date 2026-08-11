import { NextRequest, NextResponse } from 'next/server';
import { getTxRecords, addTxRecord } from '@/lib/db';
import { CreateTransactionSchema } from '@/lib/validators';

/**
 * GET /api/transactions
 *
 * Query params:
 *   status  – filter by status: pending | processing | confirmed | failed
 *   limit   – max records to return (default: 50, max: 200)
 *   offset  – skip N records for pagination (default: 0)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status') ?? '';
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);
    const offset = Math.max(parseInt(searchParams.get('offset') ?? '0', 10), 0);

    let records = await getTxRecords();

    // Apply optional status filter
    if (['pending', 'processing', 'confirmed', 'failed'].includes(statusFilter)) {
      records = records.filter((r) => r.status === statusFilter);
    }

    const total = records.length;
    const paged = records.slice(offset, offset + limit);

    return NextResponse.json({
      transactions: paged,
      total,
      limit,
      offset,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

/**
 * POST /api/transactions
 * Record a new transaction. Body is validated with CreateTransactionSchema.
 */
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
