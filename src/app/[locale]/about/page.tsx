import type { Metadata } from 'next';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import Timeline from '@/components/Timeline';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  return {
    title: dict.about.metaTitle,
    description: dict.about.metaDescription,
  };
}

export default async function AboutPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.about;

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
            { label: dict.common.about },
          ]}
        />

        <Timeline dict={dict.timeline} events={dict.data.timeline} />

        {/* Philosophy */}
        <section className="section-padding bg-brand-cream">
          <div className="container-xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-brand-accent-dark">
              {t.philosophyLabel}
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-brand-dark md:text-5xl">
              {t.philosophyTitle} <span className="accent">{t.philosophyHighlight}</span>
            </h2>

            <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-3">
              {t.values.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-brand-sand/60 bg-white p-8 text-left transition-all hover:border-brand-accent/20 hover:shadow-card-hover"
                >
                  <h3 className="font-display text-lg font-semibold text-brand-dark">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-grey">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-white">
          <div className="container-xl grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-brand-sand/60 bg-brand-cream p-10">
              <h3 className="mb-4 font-display text-xl font-bold text-brand-dark">
                {t.missionTitle}
              </h3>
              <p className="text-sm leading-relaxed text-brand-grey">
                {t.missionText}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-sand/60 bg-brand-cream p-10">
              <h3 className="mb-4 font-display text-xl font-bold text-brand-dark">
                {t.visionTitle}
              </h3>
              <p className="text-sm leading-relaxed text-brand-grey">
                {t.visionText}
              </p>
            </div>
          </div>
        </section>

        {/* Factory Photos */}
        <section className="section-padding bg-brand-cream">
          <div className="container-xl">
            <h2 className="mb-4 text-center font-display text-4xl font-bold tracking-tight text-brand-dark md:text-5xl">
              {t.factoryTitle} <span className="accent">{t.factoryHighlight}</span>
            </h2>
            <p className="mx-auto mb-12 max-w-lg text-center text-brand-grey">
              {t.factoryDesc}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.factoryLabels.map((label, i) => {
                const photos = [
                  '/images/factory/knitting-hall.jpg',
                  '/images/factory/yarn-warehouse.jpg',
                  '/images/factory/quality-lab.jpg',
                  '/images/factory/dyeing.jpg',
                  '/images/factory/finishing.jpg',
                ];
                return (
                  <div key={label} className="group relative overflow-hidden rounded-2xl">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={photos[i % photos.length]}
                        alt={label}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                    <span className="absolute bottom-4 left-4 rounded-full bg-white/80 px-4 py-1.5 text-xs font-medium text-brand-dark backdrop-blur">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
