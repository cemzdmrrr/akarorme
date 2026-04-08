import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import ReferenceLogos from '@/components/ReferenceLogos';
import ExportMap from '@/components/ExportMap';

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

  return (
    <>
      <Navbar locale={params.locale} dict={{ nav: dict.nav }} />
      <main>
        <PageHero
          title={dict.references.heroTitle}
          highlight={dict.references.heroHighlight}
          subtitle={dict.references.heroSubtitle}
          breadcrumbs={[
            { label: dict.common.home, href: `/${params.locale}` },
            { label: dict.common.references },
          ]}
        />

        <ReferenceLogos dict={dict.referenceLogos} statsData={dict.data.stats} />

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
