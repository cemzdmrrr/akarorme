import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import { RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/Motion';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  return {
    title: dict.technology.metaTitle,
    description: dict.technology.metaDescription,
  };
}

const moduleIcons = [
  (
    <svg key="viewer" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  (
    <svg key="patterns" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V2M2 12h20" />
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15 15 0 014 10 15 15 0 01-4 10" />
      <path d="M12 2a15 15 0 00-4 10 15 15 0 004 10" />
    </svg>
  ),
  (
    <svg key="dashboard" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
];

const moduleHrefs = ['viewer', 'patterns', 'dashboard'];

export default async function TechnologyPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.technology;

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
            { label: dict.common.technology },
          ]}
        />

        <section className="section-padding">
          <div className="container-xl">
            <RevealOnScroll>
              <div className="mx-auto mb-16 max-w-2xl text-center">
                <h2 className="font-display text-3xl font-bold text-brand-dark md:text-4xl">
                  {t.sectionTitle} <span className="accent">{t.sectionHighlight}</span>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-brand-grey">
                  {t.sectionDesc}
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid gap-6 md:grid-cols-3">
              {t.modules.map((m, i) => (
                <StaggerItem key={moduleHrefs[i]}>
                  <Link
                    href={`/${params.locale}/technology/${moduleHrefs[i]}`}
                    className="group flex h-full flex-col rounded-2xl border border-brand-sand/60 bg-white p-8 transition-all duration-300 hover:border-brand-accent/20 hover:shadow-card-hover"
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent-dark transition-all duration-300 group-hover:bg-brand-accent/20 group-hover:scale-110">
                      {moduleIcons[i]}
                    </div>
                    <h3 className="mb-2 font-display text-xl font-bold text-brand-dark">
                      {m.title}
                    </h3>
                    <p className="mb-5 flex-1 text-sm leading-relaxed text-brand-grey">
                      {m.description}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {m.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-brand-cream-dark px-2.5 py-0.5 text-[10px] font-medium text-brand-grey"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-brand-green transition-all group-hover:gap-3">
                      {t.launchModule}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
