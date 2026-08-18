import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { getServerModelSlugs } from '@/data/models';
import { getPublishedBlogPosts } from '@/data/blog';

const baseUrl = 'https://www.akarorme.com';
const staticRoutes = [
  '',
  '/about',
  '/collections',
  '/technology',
  '/technology/viewer',
  '/technology/patterns',
  '/technology/dashboard',
  '/references',
  '/contact',
  '/blog',
];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [modelSlugs, posts] = await Promise.all([
    getServerModelSlugs(),
    getPublishedBlogPosts(),
  ]);

  const staticEntries = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '' ? 1 : route === '/collections' || route === '/contact' ? 0.8 : 0.7,
    })),
  );

  const modelEntries = locales.flatMap((locale) =>
    modelSlugs.map((slug) => ({
      url: `${baseUrl}/${locale}/models/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  );

  const blogEntries = locales.flatMap((locale) =>
    posts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  );

  return [...staticEntries, ...modelEntries, ...blogEntries];
}
