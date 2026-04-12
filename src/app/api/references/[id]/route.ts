import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  updatePersistedReference,
  deletePersistedReference,
} from '@/lib/admin-blob-store';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const updated = await updatePersistedReference(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Reference not found' }, { status: 404 });
    }
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update reference';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const deleted = await deletePersistedReference(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Reference not found' }, { status: 404 });
    }
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete reference';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
