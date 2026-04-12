import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getPersistedPages,
} from '@/lib/admin-blob-store';

export async function GET() {
  try {
    const pages = await getPersistedPages();
    return NextResponse.json(pages);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}
