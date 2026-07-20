import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { locales } from '@/i18n/config';
import { requireAdmin } from '@/lib/server-auth';
import {
  deletePersistedBlogPost,
  getPersistedBlogPosts,
  updatePersistedBlogPost,
} from '@/lib/admin-blob-store';

function revalidateBlog(slug: string) {
  for (const locale of locales) {
    revalidatePath(`/${locale}/blog`);
    revalidatePath(`/${locale}/blog/${slug}`);
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
    const updated = await updatePersistedBlogPost(params.id, {
      ...body,
      tags: Array.isArray(body?.tags) ? body.tags.map(String) : body?.tags,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    revalidateBlog(updated.slug);
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update blog post';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const posts = await getPersistedBlogPosts();
    const target = posts.find((post) => post.id === params.id);
    const deleted = await deletePersistedBlogPost(params.id);

    if (!deleted) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    if (target) {
      revalidateBlog(target.slug);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete blog post';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
