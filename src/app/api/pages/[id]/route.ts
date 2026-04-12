import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updatePersistedPage } from '@/lib/admin-blob-store';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const updated = await updatePersistedPage(params.id, body.sections);
    if (!updated) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update page';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
