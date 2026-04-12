import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getPersistedSettings,
  updatePersistedSettings,
} from '@/lib/admin-blob-store';

export async function GET() {
  try {
    const settings = await getPersistedSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = await updatePersistedSettings(body);
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
