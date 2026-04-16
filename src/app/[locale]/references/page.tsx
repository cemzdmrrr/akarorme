import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import ReferenceLogos from '@/components/ReferenceLogos';
import ExportMap from '@/components/ExportMap';
import { getPersistedPages } from '@/lib/admin-blob-store';
import { getPageBySlug, getPageSectionContent } from '@/data/page-content';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  return {
    title: dict.references.metaTitle,
    description: dict.references.metaDescription,
  };
}

export default async function ReferencesPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const pages = await getPersistedPages();
  const referencesPage = getPageBySlug(pages, 'references');

  return (
    <>
      <Navbar locale={params.locale} dict={{ nav: dict.nav }} />
      <main>
        <PageHero
          title={getPageSectionContent(referencesPage, 'hero_title', params.locale, dict.references.heroTitle)}
          highlight={getPageSectionContent(referencesPage, 'hero_highlight', params.locale, dict.references.heroHighlight)}
          subtitle={getPageSectionContent(referencesPage, 'hero_subtitle', params.locale, dict.references.heroSubtitle)}
          breadcrumbs={[
            { label: dict.common.home, href: `/${params.locale}` },
            { label: dict.common.references },
          ]}
        />

        <ReferenceLogos
          dict={{
            ...dict.referenceLogos,
            heading: getPageSectionContent(referencesPage, 'logos_heading', params.locale, dict.referenceLogos.heading),
            highlight: getPageSectionContent(referencesPage, 'logos_highlight', params.locale, dict.referenceLogos.highlight),
            description: getPageSectionContent(referencesPage, 'logos_description', params.locale, dict.referenceLogos.description),
          }}
          statsData={dict.data.stats}
        />

        <section className="bg-brand-cream pb-32">
          <div className="container-xl">
            <ExportMap dict={dict.exportMap} />
          </div>
        </section>
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
