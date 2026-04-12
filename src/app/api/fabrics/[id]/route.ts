import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  updatePersistedFabric,
  deletePersistedFabric,
} from '@/lib/admin-blob-store';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const updated = await updatePersistedFabric(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Fabric not found' }, { status: 404 });
    }
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update fabric';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const deleted = await deletePersistedFabric(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Fabric not found' }, { status: 404 });
    }
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete fabric';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
