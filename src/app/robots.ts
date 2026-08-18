import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/portal/'],
    },
    sitemap: 'https://www.akarorme.com/sitemap.xml',
    host: 'https://www.akarorme.com',
  };
}
