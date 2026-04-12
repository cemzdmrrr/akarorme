import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getPersistedReferences,
  createPersistedReference,
} from '@/lib/admin-blob-store';

export async function GET() {
  try {
    const refs = await getPersistedReferences();
    return NextResponse.json(refs);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch references' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Reference name is required' }, { status: 400 });
    }
    const ref = await createPersistedReference(body);
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json(ref, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create reference';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
