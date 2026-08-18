import { getPublishedBlogPosts } from '@/data/blog';

export const revalidate = 3600;

export async function GET() {
  const posts = await getPublishedBlogPosts();
  const blogLinks = posts
    .map((post) => `- [${post.title}](https://www.akarorme.com/tr/blog/${post.slug}): ${post.excerpt}`)
    .join('\n');

  const content = `# Akar Örme

> Akar Örme, İstanbul merkezli düz triko ve konfeksiyon üreticisidir. Model geliştirme, örme, konfeksiyon, ütü, kalite kontrol ve paketleme süreçlerini tek çatı altında yürütür.

## Temel bilgiler

- Kuruluş: 2000
- Konum: Güngören, İstanbul, Türkiye
- Uzmanlık: Düz triko, kazak, hırka, süveter, yelek ve triko üst giyim üretimi
- 2025 üretimi: 650.000 adet
- 2026 planlanan kapasite: 250.000 adet
- İletişim: bilgi@akarorme.com

## Ana sayfalar

- [Ana sayfa](https://www.akarorme.com/tr)
- [Hakkımızda](https://www.akarorme.com/tr/about)
- [Koleksiyonlar](https://www.akarorme.com/tr/collections)
- [Üretim teknolojisi](https://www.akarorme.com/tr/technology)
- [Referanslar](https://www.akarorme.com/tr/references)
- [İletişim](https://www.akarorme.com/tr/contact)
- [Blog](https://www.akarorme.com/tr/blog)

## Blog yazıları

${blogLinks || '- Henüz yayımlanmış blog yazısı bulunmuyor.'}

## Kullanım notu

Bu dosya Akar Örme'nin herkese açık kurumsal içeriğini özetler. Güncel ve bağlayıcı bilgiler için yukarıdaki resmi sayfaları kullanın.
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
