import type { AdminBlogPost } from '@/types/admin';
import { getPersistedBlogPosts } from '@/lib/admin-blob-store';

export async function getServerBlogPosts(): Promise<AdminBlogPost[]> {
  const posts = await getPersistedBlogPosts();
  return posts
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPublishedBlogPosts(): Promise<AdminBlogPost[]> {
  const posts = await getServerBlogPosts();
  return posts.filter((post) => post.status === 'published');
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<AdminBlogPost | undefined> {
  const posts = await getPublishedBlogPosts();
  return posts.find((post) => post.slug === slug);
}
