import { NextRequest, NextResponse } from 'next/server';
import { getLicenseRecords, addLicenseRecord } from '@/lib/db';
import { CreateLicenseSchema } from '@/lib/validators';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const licenses = await getLicenseRecords();
    return NextResponse.json({ licenses, total: licenses.length });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch licenses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateLicenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const contractId =
      process.env.NEXT_PUBLIC_CONTRACT_REGISTRY ??
      'CDBHJ72ROMTWZC6OIL6TDCUFH6VJOB4CSODT5H6S6DJCQQAJQHBHY6R7';

    const now = new Date().toISOString();
    const record = await addLicenseRecord({
      id: randomUUID(),
      title: parsed.data.title,
      terms: parsed.data.terms,
      status: 'draft',
      contractId,
      ownerAddress: parsed.data.ownerAddress,
      amount: parsed.data.amount,
      txHash: parsed.data.txHash,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ license: record }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create license' }, { status: 500 });
  }
}
