import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import CollectionFilter from '@/components/CollectionFilter';
import { getServerModels } from '@/data/models';
import { getPersistedPages } from '@/lib/admin-blob-store';
import { getPageBySlug, getPageSectionContent } from '@/data/page-content';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  return {
    title: dict.collections.metaTitle,
    description: dict.collections.metaDescription,
  };
}

export default async function CollectionsPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const models = await getServerModels();
  const pages = await getPersistedPages();
  const collectionsPage = getPageBySlug(pages, 'collections');

  return (
    <>
      <Navbar locale={params.locale} dict={{ nav: dict.nav }} />
      <main>
        <PageHero
          title={getPageSectionContent(collectionsPage, 'hero_title', params.locale, dict.collections.heroTitle)}
          highlight={getPageSectionContent(collectionsPage, 'hero_highlight', params.locale, dict.collections.heroHighlight)}
          subtitle={getPageSectionContent(collectionsPage, 'hero_subtitle', params.locale, dict.collections.heroSubtitle)}
          breadcrumbs={[
            { label: dict.common.home, href: `/${params.locale}` },
            { label: dict.common.collections },
          ]}
        />

        <section className="section-padding bg-brand-cream">
          <div className="container-xl">
            <CollectionFilter models={models} dict={dict.collectionFilter} locale={params.locale} />
          </div>
        </section>
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
