import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  updatePersistedCollection,
  deletePersistedCollection,
} from '@/lib/admin-blob-store';
import { requireAdmin } from '@/lib/server-auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    const updated = await updatePersistedCollection(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update collection';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const deleted = await deletePersistedCollection(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete collection';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
