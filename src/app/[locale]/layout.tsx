import type { Metadata } from 'next';
import { locales, type Locale, rtlLocales } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

const baseUrl = 'https://www.akarorme.com';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  const canonical = `${baseUrl}/${params.locale}`;
  return {
    title: {
      template: dict.metadata.titleTemplate,
      default: dict.metadata.defaultTitle,
    },
    description: dict.metadata.description,
    keywords: dict.metadata.keywords,
    openGraph: {
      type: 'website',
      locale: params.locale,
      siteName: 'AKAR ÖRME',
      url: canonical,
      title: dict.metadata.defaultTitle,
      description: dict.metadata.description,
      images: [
        {
          url: '/images/hero/hero-showcase.jpg',
          width: 1200,
          height: 630,
          alt: 'Akar Örme düz triko üretimi',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.metadata.defaultTitle,
      description: dict.metadata.description,
      images: ['/images/hero/hero-showcase.jpg'],
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const dir = rtlLocales.includes(params.locale) ? 'rtl' : 'ltr';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Akar Örme',
        url: baseUrl,
        logo: `${baseUrl}/images/logo-full.png`,
        email: 'bilgi@akarorme.com',
        foundingDate: '2000',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Merkez Mah. Papatya Sok. No:4 Kat:4',
          addressLocality: 'Güngören',
          addressRegion: 'İstanbul',
          addressCountry: 'TR',
        },
        knowsAbout: [
          'Düz triko üretimi',
          'Triko konfeksiyon',
          'Kazak üretimi',
          'Hırka üretimi',
          'Fully fashioned üretim',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Akar Örme',
        publisher: { '@id': `${baseUrl}/#organization` },
        inLanguage: params.locale,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div lang={params.locale} dir={dir}>
        {children}
      </div>
    </>
  );
}
