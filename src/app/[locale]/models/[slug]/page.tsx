import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ModelDetail from '@/components/ModelDetail';
import { getModelBySlug, getAllModelSlugs } from '@/data/models';

export function generateStaticParams() {
  const slugs = getAllModelSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const model = getModelBySlug(params.slug);
  if (!model) return {};
  return {
    title: model.name,
    description: `${model.name} — ${model.tagline}. ${model.description.slice(0, 120)}…`,
  };
}

export default async function ModelPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const model = getModelBySlug(params.slug);
  if (!model) notFound();

  const dict = await getDictionary(params.locale);

  return (
    <>
      <Navbar locale={params.locale} dict={{ nav: dict.nav }} />
      <main>
        <ModelDetail model={model} dict={dict.modelDetail} locale={params.locale} />
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
