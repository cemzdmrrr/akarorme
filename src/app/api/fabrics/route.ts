import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getPersistedFabrics,
  createPersistedFabric,
} from '@/lib/admin-blob-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const fabrics = await getPersistedFabrics();
    return NextResponse.json(fabrics);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch fabrics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Fabric name is required' }, { status: 400 });
    }
    const fabric = await createPersistedFabric(body);
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json(fabric, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create fabric';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
