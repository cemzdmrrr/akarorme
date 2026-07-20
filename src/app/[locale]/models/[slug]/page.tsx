import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ModelDetail from '@/components/ModelDetail';
import { getServerModelBySlug, getServerModelSlugs } from '@/data/models';
import { getPersistedPages } from '@/lib/admin-blob-store';
import { getPageBySlug, getPageSectionContent } from '@/data/page-content';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getServerModelSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
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
        locales.map((locale) => [locale, `https://akarorme.com/${locale}/models/${params.slug}`]),
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
      ...(model.specs?.find((spec) => spec.label === 'Composition')
        ? { 'product:material': model.specs.find((spec) => spec.label === 'Composition')!.value }
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
  const pages = await getPersistedPages();
  const modelDetailPage = getPageBySlug(pages, 'model-detail');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: model.name,
    description: model.description,
    brand: { '@type': 'Brand', name: 'AKAR ÖRME' },
    ...(model.image ? { image: model.image } : {}),
    ...(model.specs?.length
      ? {
          additionalProperty: model.specs.map((spec) => ({
            '@type': 'PropertyValue',
            name: spec.label,
            value: spec.value,
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
        <ModelDetail
          model={model}
          locale={params.locale}
          dict={{
            ...dict.modelDetail,
            backToCollections: getPageSectionContent(
              modelDetailPage,
              'back_to_collections',
              params.locale,
              dict.modelDetail.backToCollections,
            ),
            availableColours: getPageSectionContent(
              modelDetailPage,
              'available_colours',
              params.locale,
              dict.modelDetail.availableColours,
            ),
            requestProduction: getPageSectionContent(
              modelDetailPage,
              'request_production',
              params.locale,
              dict.modelDetail.requestProduction,
            ),
            orderSample: getPageSectionContent(
              modelDetailPage,
              'order_sample',
              params.locale,
              dict.modelDetail.orderSample,
            ),
            tabs: {
              overview: getPageSectionContent(
                modelDetailPage,
                'tab_overview',
                params.locale,
                dict.modelDetail.tabs.overview,
              ),
              technical: getPageSectionContent(
                modelDetailPage,
                'tab_technical',
                params.locale,
                dict.modelDetail.tabs.technical,
              ),
              gallery: getPageSectionContent(
                modelDetailPage,
                'tab_gallery',
                params.locale,
                dict.modelDetail.tabs.gallery,
              ),
            },
            overviewExtra: getPageSectionContent(
              modelDetailPage,
              'overview_extra',
              params.locale,
              dict.modelDetail.overviewExtra,
            ),
            technicalEmpty: getPageSectionContent(
              modelDetailPage,
              'technical_empty',
              params.locale,
              'Teknik bilgi henüz eklenmemiş.',
            ),
          }}
        />
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
