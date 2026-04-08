import type { Metadata } from 'next';
import { locales, type Locale, rtlLocales } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
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

  return (
    <div lang={params.locale} dir={dir}>
      {children}
    </div>
  );
}
