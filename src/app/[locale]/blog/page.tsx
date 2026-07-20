import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { getPublishedBlogPosts } from '@/data/blog';
import { getPageBySlug, getPageSectionContent } from '@/data/page-content';
import { getPersistedPages } from '@/lib/admin-blob-store';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  return {
    title: 'Blog',
    description: 'Akar Örme blog yazıları',
  };
}

export default async function BlogPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const posts = await getPublishedBlogPosts();
  const pages = await getPersistedPages();
  const blogPage = getPageBySlug(pages, 'blog');
  const featured = posts.find((post) => post.featured) || posts[0];
  const rest = featured ? posts.filter((post) => post.id !== featured.id) : [];
  const blogLabel = getPageSectionContent(getPageBySlug(pages, 'global'), 'nav_blog', params.locale, 'Blog');

  return (
    <>
      <Navbar locale={params.locale} dict={{ nav: dict.nav }} />
      <main>
        <PageHero
          title={getPageSectionContent(blogPage, 'hero_title', params.locale, 'Akar Örme')}
          highlight={getPageSectionContent(blogPage, 'hero_highlight', params.locale, 'Blog')}
          subtitle={getPageSectionContent(
            blogPage,
            'hero_subtitle',
            params.locale,
            'Üretim, iplik, koleksiyon geliştirme ve sektör içgörülerine dair yazılarımızı keşfedin.',
          )}
          breadcrumbs={[
            { label: dict.common.home, href: `/${params.locale}` },
            { label: blogLabel },
          ]}
        />

        <section className="section-padding bg-brand-cream">
          <div className="container-xl space-y-10">
            {featured ? (
              <Link
                href={`/${params.locale}/blog/${featured.slug}`}
                className="grid overflow-hidden rounded-3xl border border-brand-sand/60 bg-white transition-all hover:shadow-card-hover lg:grid-cols-[1.1fr_1fr]"
              >
                <div className="relative min-h-[280px] bg-brand-cream-dark">
                  {featured.coverImage ? (
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-brand-grey">
                      {featured.title}
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-10">
                  <span className="mb-3 inline-flex w-fit rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-accent-dark">
                    {getPageSectionContent(blogPage, 'featured_label', params.locale, 'Öne Çıkan Yazı')}
                  </span>
                  <h2 className="font-display text-3xl font-bold text-brand-dark">{featured.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-brand-grey">{featured.excerpt}</p>
                  <div className="mt-6 flex flex-wrap gap-3 text-xs text-brand-grey">
                    {featured.category && <span>{featured.category}</span>}
                    <span>{featured.author}</span>
                    <span>{new Date(featured.publishedAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-3xl border border-dashed border-brand-sand bg-white px-8 py-16 text-center">
                <h2 className="font-display text-3xl font-bold text-brand-dark">
                  {getPageSectionContent(blogPage, 'empty_title', params.locale, 'Henüz yayınlanmış yazı yok')}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-brand-grey">
                  {getPageSectionContent(
                    blogPage,
                    'empty_description',
                    params.locale,
                    'Yeni blog içerikleri eklendiğinde burada görünecek.',
                  )}
                </p>
              </div>
            )}

            {rest.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${params.locale}/blog/${post.slug}`}
                    className="overflow-hidden rounded-2xl border border-brand-sand/60 bg-white transition-all hover:shadow-card-hover"
                  >
                    <div className="relative aspect-[16/10] bg-brand-cream-dark">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-brand-grey">
                          {post.title}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex flex-wrap gap-3 text-[11px] uppercase tracking-wider text-brand-accent-dark">
                        {post.category && <span>{post.category}</span>}
                        <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <h3 className="font-display text-xl font-semibold text-brand-dark">{post.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-brand-grey">{post.excerpt}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-green">
                        {getPageSectionContent(blogPage, 'read_more', params.locale, 'Devamını Oku')}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
