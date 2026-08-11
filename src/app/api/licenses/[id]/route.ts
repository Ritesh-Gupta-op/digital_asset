import { NextRequest, NextResponse } from 'next/server';
import { getLicenseRecords, updateLicenseRecord } from '@/lib/db';
import { UpdateLicenseSchema } from '@/lib/validators';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/licenses/[id]
 * Fetch a single license by ID.
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const licenses = await getLicenseRecords();
    const license = licenses.find((l) => l.id === id);
    if (!license) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }
    return NextResponse.json({ license });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch license' }, { status: 500 });
  }
}

/**
 * PATCH /api/licenses/[id]
 * Partially update a license (title, terms, status, amount, txHash, ownerAddress).
 * Body is validated with UpdateLicenseSchema before writing to the database.
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = UpdateLicenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const updated = await updateLicenseRecord(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    return NextResponse.json({ license: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update license' }, { status: 500 });
  }
}
