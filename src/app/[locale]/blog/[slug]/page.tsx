import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { getPublishedBlogPostBySlug, getPublishedBlogPosts } from '@/data/blog';
import { getPageBySlug, getPageSectionContent } from '@/data/page-content';
import { getPersistedPages } from '@/lib/admin-blob-store';

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const post = await getPublishedBlogPostBySlug(params.slug);
  if (!post) {
    return { title: 'Blog' };
  }

  return {
    title: post.title,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const dict = await getDictionary(params.locale);
  const post = await getPublishedBlogPostBySlug(params.slug);
  const pages = await getPersistedPages();

  if (!post) {
    notFound();
  }

  const blogPage = getPageBySlug(pages, 'blog');
  const blogLabel = getPageSectionContent(getPageBySlug(pages, 'global'), 'nav_blog', params.locale, 'Blog');
  const paragraphs = post.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <>
      <Navbar locale={params.locale} dict={{ nav: dict.nav }} />
      <main>
        <PageHero
          title={blogLabel}
          highlight={post.title}
          subtitle={post.excerpt}
          breadcrumbs={[
            { label: dict.common.home, href: `/${params.locale}` },
            { label: blogLabel, href: `/${params.locale}/blog` },
            { label: post.title },
          ]}
        />

        <article className="section-padding bg-brand-cream">
          <div className="container-xl">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-brand-sand/60 bg-white">
              {post.coverImage && (
                <div className="relative aspect-[16/8] bg-brand-cream-dark">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 960px, 100vw"
                  />
                </div>
              )}

              <div className="p-8 md:p-12">
                <div className="mb-6 flex flex-wrap gap-3 text-xs uppercase tracking-wider text-brand-accent-dark">
                  {post.category && <span>{post.category}</span>}
                  <span>{post.author}</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
                </div>

                <h1 className="font-display text-4xl font-bold text-brand-dark md:text-5xl">
                  {post.title}
                </h1>

                <div className="mt-8 space-y-5 text-base leading-8 text-brand-grey">
                  {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {post.tags.length > 0 && (
                  <div className="mt-10 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-brand-cream-dark px-3 py-1 text-xs text-brand-dark-4"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <a
                  href={`/${params.locale}/blog`}
                  className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-brand-green"
                >
                  {getPageSectionContent(blogPage, 'back_to_list', params.locale, 'Blog listesine dön')}
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
