import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import { getPersistedPages } from '@/lib/admin-blob-store';
import { getPageBySlug, getPageSectionContent } from '@/data/page-content';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  return {
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
  };
}

export default async function ContactPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const pages = await getPersistedPages();
  const contactPage = getPageBySlug(pages, 'contact');

  return (
    <>
      <Navbar locale={params.locale} dict={{ nav: dict.nav }} />
      <main>
        <PageHero
          title={getPageSectionContent(contactPage, 'hero_title', params.locale, dict.contact.heroTitle)}
          highlight={getPageSectionContent(contactPage, 'hero_highlight', params.locale, dict.contact.heroHighlight)}
          subtitle={getPageSectionContent(contactPage, 'hero_subtitle', params.locale, dict.contact.heroSubtitle)}
          breadcrumbs={[
            { label: dict.common.home, href: `/${params.locale}` },
            { label: dict.common.contact },
          ]}
        />

        <section className="section-padding bg-brand-cream">
          <div className="container-xl">
            <ContactForm
              dict={{
                ...dict.contactForm,
                heading: getPageSectionContent(contactPage, 'form_heading', params.locale, dict.contactForm.heading),
                subheading: getPageSectionContent(contactPage, 'form_subheading', params.locale, dict.contactForm.subheading),
              }}
            />
          </div>
        </section>
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
