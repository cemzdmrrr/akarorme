import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BrandStory from '@/components/BrandStory';
import FabricCards from '@/components/FabricCards';
import ModelGridClient from '@/components/ModelGridClient';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import { getServerFeaturedModels } from '@/data/models';
import { getPersistedPages } from '@/lib/admin-blob-store';
import { getPageBySlug, getPageSectionContent } from '@/data/page-content';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const featured = await getServerFeaturedModels();
  const pages = await getPersistedPages();
  const homePage = getPageBySlug(pages, 'home');

  return (
    <>
      <Navbar locale={params.locale} dict={{ nav: dict.nav }} />
      <main>
        <HeroSection
          locale={params.locale}
          dict={{
            ...dict.hero,
            label: getPageSectionContent(homePage, 'hero_label', params.locale, dict.hero.label),
            heading1: getPageSectionContent(homePage, 'hero_heading1', params.locale, dict.hero.heading1),
            heading2: getPageSectionContent(homePage, 'hero_heading2', params.locale, dict.hero.heading2),
            highlight: getPageSectionContent(homePage, 'hero_highlight', params.locale, dict.hero.highlight),
            description: getPageSectionContent(homePage, 'hero_description', params.locale, dict.hero.description),
            cta1: getPageSectionContent(homePage, 'hero_cta_primary', params.locale, dict.hero.cta1),
            cta2: getPageSectionContent(homePage, 'hero_cta_secondary', params.locale, dict.hero.cta2),
          }}
        />
        <BrandStory
          locale={params.locale}
          dict={{
            ...dict.brandStory,
            label: getPageSectionContent(homePage, 'brand_label', params.locale, dict.brandStory.label),
            heading: getPageSectionContent(homePage, 'brand_heading', params.locale, dict.brandStory.heading),
            highlight: getPageSectionContent(homePage, 'brand_highlight', params.locale, dict.brandStory.highlight),
            paragraph1: getPageSectionContent(homePage, 'brand_paragraph1', params.locale, dict.brandStory.paragraph1),
            paragraph2: getPageSectionContent(homePage, 'brand_paragraph2', params.locale, dict.brandStory.paragraph2),
            link: getPageSectionContent(homePage, 'brand_link_text', params.locale, dict.brandStory.link),
          }}
        />
        <FabricCards dict={dict.fabricCards} fabrics={dict.data.fabrics} />
        <ModelGridClient staticModels={featured} dict={dict.modelGrid} locale={params.locale} onlyFeatured />
        <CTASection
          locale={params.locale}
          dict={{
            ...dict.cta,
            label: getPageSectionContent(homePage, 'cta_label', params.locale, dict.cta.label),
            heading: getPageSectionContent(homePage, 'cta_heading', params.locale, dict.cta.heading),
            highlight: getPageSectionContent(homePage, 'cta_highlight', params.locale, dict.cta.highlight),
            description: getPageSectionContent(homePage, 'cta_description', params.locale, dict.cta.description),
            button1: getPageSectionContent(homePage, 'cta_button_primary', params.locale, dict.cta.button1),
            button2: getPageSectionContent(homePage, 'cta_button_secondary', params.locale, dict.cta.button2),
          }}
        />
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
