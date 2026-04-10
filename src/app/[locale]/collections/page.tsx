import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import CollectionFilter from '@/components/CollectionFilter';
import { getServerModels } from '@/data/models';

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

  return (
    <>
      <Navbar locale={params.locale} dict={{ nav: dict.nav }} />
      <main>
        <PageHero
          title={dict.collections.heroTitle}
          highlight={dict.collections.heroHighlight}
          subtitle={dict.collections.heroSubtitle}
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
