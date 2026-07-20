import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { createPersistedBlogPost, getPersistedBlogPosts } from '@/lib/admin-blob-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await getPersistedBlogPosts();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    if (!body?.title || !body?.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const post = await createPersistedBlogPost({
      title: String(body.title),
      excerpt: String(body.excerpt || ''),
      content: String(body.content),
      coverImage: String(body.coverImage || ''),
      category: String(body.category || ''),
      author: String(body.author || 'Akar Örme'),
      seoDescription: String(body.seoDescription || body.excerpt || ''),
      tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
      status: body.status === 'draft' ? 'draft' : 'published',
      featured: Boolean(body.featured),
      publishedAt: String(body.publishedAt || new Date().toISOString()),
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create blog post';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
