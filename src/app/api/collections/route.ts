import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getPersistedCollections,
  createPersistedCollection,
} from '@/lib/admin-blob-store';
import { requireAdmin } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const collections = await getPersistedCollections();
    return NextResponse.json(collections);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
    }
    const collection = await createPersistedCollection(body);
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json(collection, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create collection';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
