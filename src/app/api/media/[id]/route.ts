import { NextResponse } from 'next/server';
import {
  updatePersistedMedia,
  deletePersistedMedia,
} from '@/lib/admin-blob-store';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const updated = await updatePersistedMedia(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update media item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const deleted = await deletePersistedMedia(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete media item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
