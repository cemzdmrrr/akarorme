import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import FactoryDashboard from '@/components/FactoryDashboard';
import { RevealOnScroll } from '@/components/Motion';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  return {
    title: dict.dashboard.metaTitle,
    description: dict.dashboard.metaDescription,
  };
}

export default async function DashboardPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.dashboard;

  return (
    <>
      <Navbar locale={params.locale} dict={{ nav: dict.nav }} />
      <main>
        <PageHero
          title={t.heroTitle}
          highlight={t.heroHighlight}
          subtitle={t.heroSubtitle}
          breadcrumbs={[
            { label: dict.common.home, href: `/${params.locale}` },
            { label: dict.common.technology, href: `/${params.locale}/technology` },
            { label: t.breadcrumb },
          ]}
        />

        <section className="section-padding">
          <div className="container-xl">
            <RevealOnScroll>
              <FactoryDashboard dict={dict.factoryDashboard} />
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
