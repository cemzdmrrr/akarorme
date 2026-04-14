import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getPersistedMedia,
  createPersistedMedia,
} from '@/lib/admin-blob-store';
import { requireAdmin } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await getPersistedMedia();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    if (!body.name || !body.url) {
      return NextResponse.json({ error: 'Name and url are required' }, { status: 400 });
    }
    const item = await createPersistedMedia(body);
    revalidatePath('/');
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create media item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
