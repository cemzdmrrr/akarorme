import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updatePersistedPage } from '@/lib/admin-blob-store';
import { requireAdmin } from '@/lib/server-auth';
import { locales } from '@/i18n/config';

function revalidateCmsPage(slug: string) {
  revalidatePath('/');

  for (const locale of locales) {
    revalidatePath(`/${locale}`);

    if (slug !== 'home' && slug !== 'footer') {
      revalidatePath(`/${locale}/${slug}`);
    }
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    const updated = await updatePersistedPage(params.id, body.sections);
    if (!updated) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    revalidateCmsPage(updated.slug);
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update page';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
