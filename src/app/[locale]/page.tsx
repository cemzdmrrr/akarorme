import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BrandStory from '@/components/BrandStory';
import FabricCards from '@/components/FabricCards';
import ModelGrid from '@/components/ModelGrid';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import { getFeaturedModels } from '@/data/models';

export default async function HomePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const featured = getFeaturedModels();

  return (
    <>
      <Navbar locale={params.locale} dict={{ nav: dict.nav }} />
      <main>
        <HeroSection dict={dict.hero} locale={params.locale} />
        <BrandStory dict={dict.brandStory} locale={params.locale} />
        <FabricCards dict={dict.fabricCards} fabrics={dict.data.fabrics} />
        <ModelGrid models={featured} dict={dict.modelGrid} locale={params.locale} />
        <CTASection dict={dict.cta} locale={params.locale} />
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
