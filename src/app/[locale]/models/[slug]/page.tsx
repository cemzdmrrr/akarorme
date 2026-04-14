import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ModelDetail from '@/components/ModelDetail';
import { getServerModelBySlug, getServerModelSlugs, useSiteModelslugs } from '@/data/models';

export const revalidate = 60;
export const dynamicParams = true; // Allow slugs not in generateStaticParams

export function generateStaticParams() {
  // Use static slugs for build-time generation
  const slugs = useSiteModelslugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const model = await getServerModelBySlug(params.slug);
  if (!model) return {};

  const title = `${model.name} — AKAR ÖRME`;
  const description = `${model.name} — ${model.tagline}. ${model.description.slice(0, 150)}`;
  const url = `https://akarorme.com/${params.locale}/models/${params.slug}`;
  const image = model.image || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        locales.map((l) => [l, `https://akarorme.com/${l}/models/${params.slug}`]),
      ),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'AKAR ÖRME',
      type: 'website',
      locale: params.locale,
      ...(image ? { images: [{ url: image, width: 800, height: 600, alt: model.name }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    other: {
      'product:brand': 'AKAR ÖRME',
      ...(model.specs?.find((s) => s.label === 'Composition')
        ? { 'product:material': model.specs.find((s) => s.label === 'Composition')!.value }
        : {}),
    },
  };
}

export default async function ModelPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const model = await getServerModelBySlug(params.slug);
  if (!model) notFound();

  const dict = await getDictionary(params.locale);

  // JSON-LD structured data for product
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: model.name,
    description: model.description,
    brand: { '@type': 'Brand', name: 'AKAR ÖRME' },
    ...(model.image ? { image: model.image } : {}),
    ...(model.specs?.length
      ? {
          additionalProperty: model.specs.map((s) => ({
            '@type': 'PropertyValue',
            name: s.label,
            value: s.value,
          })),
        }
      : {}),
    manufacturer: {
      '@type': 'Organization',
      name: 'AKAR ÖRME',
      url: 'https://akarorme.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar locale={params.locale} dict={{ nav: dict.nav }} />
      <main>
        <ModelDetail model={model} dict={dict.modelDetail} locale={params.locale} />
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
