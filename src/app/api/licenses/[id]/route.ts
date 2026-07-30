import { NextRequest, NextResponse } from 'next/server';
import { updateLicenseRecord } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await updateLicenseRecord(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }
    return NextResponse.json({ license: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update license' }, { status: 500 });
  }
}
