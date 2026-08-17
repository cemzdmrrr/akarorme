import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
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
  const productionStages = params.locale === 'tr'
    ? [
        ['Model Geliştirme', 'Markanın koleksiyonuna ve teknik beklentilerine uygun ürün çalışması.'],
        ['Düz Triko Örme', 'Farklı iplik, desen ve incelik seçenekleriyle düz triko üretimi.'],
        ['Konfeksiyon', 'Örülen parçaların birleştirilmesi ve ürünün konfeksiyon işlemleri.'],
        ['Ütü ve Son İşlemler', 'Ürüne form kazandıran ütü ve gerekli son işlem uygulamaları.'],
        ['Kalite Kontrol', 'Ölçü, görünüm ve işçilik kontrollerinin titizlikle gerçekleştirilmesi.'],
        ['Paketleme', 'Onaylanan ürünlerin sevkiyata uygun biçimde hazırlanması.'],
      ]
    : [
        ['Product Development', 'Product development aligned with each brand’s collection and technical requirements.'],
        ['Flat Knitting', 'Flat-knit production with a range of yarns, gauges and stitch structures.'],
        ['Garment Assembly', 'Linking, sewing and garment construction processes.'],
        ['Pressing & Finishing', 'Pressing and finishing operations that give each garment its final form.'],
        ['Quality Control', 'Careful inspection of measurements, appearance and workmanship.'],
        ['Packing', 'Approved garments prepared for shipment.'],
      ];

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
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {productionStages.map(([title, description], index) => (
                  <article key={title} className="rounded-2xl border border-brand-sand/60 bg-white p-7 shadow-sm">
                    <span className="text-sm font-semibold text-brand-accent-dark">{String(index + 1).padStart(2, '0')}</span>
                    <h2 className="mt-3 font-display text-xl font-semibold text-brand-dark">{title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-brand-grey">{description}</p>
                  </article>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
