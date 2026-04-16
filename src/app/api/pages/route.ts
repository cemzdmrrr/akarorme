import { NextResponse } from 'next/server';
import {
  getPersistedPages,
} from '@/lib/admin-blob-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pages = await getPersistedPages();
    return NextResponse.json(pages);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}
