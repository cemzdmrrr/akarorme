import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import KnitwearViewer from '@/components/KnitwearViewer';
import { RevealOnScroll } from '@/components/Motion';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  return {
    title: dict.viewer.metaTitle,
    description: dict.viewer.metaDescription,
  };
}

export default async function ViewerPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.viewer;

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
            <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              <RevealOnScroll>
                <KnitwearViewer dict={dict.knitwearViewer} />
              </RevealOnScroll>

              <RevealOnScroll delay={0.15}>
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-brand-dark md:text-3xl">
                      {t.infoTitle} <span className="accent">{t.infoHighlight}</span>
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-brand-grey">
                      {t.infoDesc}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {t.features.map((f) => (
                      <div
                        key={f.title}
                        className="rounded-xl border border-brand-sand/60 bg-brand-cream p-4"
                      >
                        <h4 className="mb-1 text-xs font-semibold text-brand-dark">
                          {f.title}
                        </h4>
                        <p className="text-[11px] leading-relaxed text-brand-grey">
                          {f.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-brand-accent/10 bg-brand-accent/5 p-4">
                    <h4 className="mb-1 text-xs font-semibold text-brand-accent-dark">
                      {t.productionTitle}
                    </h4>
                    <p className="text-[11px] leading-relaxed text-brand-grey">
                      {t.productionDesc}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
