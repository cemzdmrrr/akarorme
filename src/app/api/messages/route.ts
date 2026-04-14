import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getPersistedMessages,
  createPersistedMessage,
} from '@/lib/admin-blob-store';
import { requireAdmin } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const messages = await getPersistedMessages();
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }
    const msg = await createPersistedMessage(body);
    revalidatePath('/');
    return NextResponse.json(msg, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create message';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
