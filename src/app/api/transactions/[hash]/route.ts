import { NextRequest, NextResponse } from 'next/server';
import { getTxByHash } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ hash: string }> },
) {
  try {
    const { hash } = await params;
    const record = await getTxByHash(hash);
    if (!record) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ transaction: record });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  }
}
