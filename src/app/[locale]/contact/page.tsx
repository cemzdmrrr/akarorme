import type { Metadata } from 'next';
import { locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import { getPersistedPages, getPersistedSettings } from '@/lib/admin-blob-store';
import { getPageBySlug, getPageSectionContent } from '@/data/page-content';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  return {
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
    alternates: {
      canonical: `https://www.akarorme.com/${params.locale}/contact`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `https://www.akarorme.com/${locale}/contact`]),
      ),
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const pages = await getPersistedPages();
  const settings = await getPersistedSettings();
  const contactPage = getPageBySlug(pages, 'contact');

  return (
    <>
      <Navbar locale={params.locale} dict={{ nav: dict.nav }} />
      <main>
        <PageHero
          title={getPageSectionContent(contactPage, 'hero_title', params.locale, dict.contact.heroTitle)}
          highlight={getPageSectionContent(contactPage, 'hero_highlight', params.locale, dict.contact.heroHighlight)}
          subtitle={getPageSectionContent(contactPage, 'hero_subtitle', params.locale, dict.contact.heroSubtitle)}
          image={getPageSectionContent(contactPage, 'hero_image', params.locale, '')}
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
                subjects: {
                  placeholder: getPageSectionContent(
                    contactPage,
                    'subject_placeholder',
                    params.locale,
                    dict.contactForm.subjects.placeholder,
                  ),
                  manufacturing: getPageSectionContent(
                    contactPage,
                    'subject_manufacturing',
                    params.locale,
                    dict.contactForm.subjects.manufacturing,
                  ),
                  partnership: getPageSectionContent(
                    contactPage,
                    'subject_partnership',
                    params.locale,
                    dict.contactForm.subjects.partnership,
                  ),
                  sampling: getPageSectionContent(
                    contactPage,
                    'subject_sampling',
                    params.locale,
                    dict.contactForm.subjects.sampling,
                  ),
                  visit: getPageSectionContent(
                    contactPage,
                    'subject_visit',
                    params.locale,
                    dict.contactForm.subjects.visit,
                  ),
                  other: getPageSectionContent(
                    contactPage,
                    'subject_other',
                    params.locale,
                    dict.contactForm.subjects.other,
                  ),
                },
                fields: {
                  fullName: getPageSectionContent(
                    contactPage,
                    'field_full_name',
                    params.locale,
                    dict.contactForm.fields.fullName,
                  ),
                  email: getPageSectionContent(contactPage, 'field_email', params.locale, dict.contactForm.fields.email),
                  company: getPageSectionContent(
                    contactPage,
                    'field_company',
                    params.locale,
                    dict.contactForm.fields.company,
                  ),
                  phone: getPageSectionContent(contactPage, 'field_phone', params.locale, dict.contactForm.fields.phone),
                  subject: getPageSectionContent(
                    contactPage,
                    'field_subject',
                    params.locale,
                    dict.contactForm.fields.subject,
                  ),
                  message: getPageSectionContent(
                    contactPage,
                    'field_message',
                    params.locale,
                    dict.contactForm.fields.message,
                  ),
                },
                placeholders: {
                  name: getPageSectionContent(contactPage, 'placeholder_name', params.locale, dict.contactForm.placeholders.name),
                  email: getPageSectionContent(
                    contactPage,
                    'placeholder_email',
                    params.locale,
                    dict.contactForm.placeholders.email,
                  ),
                  company: getPageSectionContent(
                    contactPage,
                    'placeholder_company',
                    params.locale,
                    dict.contactForm.placeholders.company,
                  ),
                  phone: getPageSectionContent(
                    contactPage,
                    'placeholder_phone',
                    params.locale,
                    dict.contactForm.placeholders.phone,
                  ),
                  message: getPageSectionContent(
                    contactPage,
                    'placeholder_message',
                    params.locale,
                    dict.contactForm.placeholders.message,
                  ),
                },
                sendButton: getPageSectionContent(contactPage, 'send_button', params.locale, dict.contactForm.sendButton),
                sending: getPageSectionContent(contactPage, 'sending_text', params.locale, dict.contactForm.sending),
                sent: getPageSectionContent(contactPage, 'sent_text', params.locale, dict.contactForm.sent),
                error: getPageSectionContent(contactPage, 'error_text', params.locale, dict.contactForm.error),
                mapUrl: getPageSectionContent(
                  contactPage,
                  'map_embed_url',
                  params.locale,
                  'https://www.google.com/maps?q=2VCH%2BQG+G%C3%BCng%C3%B6ren,+%C4%B0stanbul&output=embed',
                ),
                infoCards: {
                  address: getPageSectionContent(contactPage, 'info_address_title', params.locale, dict.contactForm.infoCards.address),
                  addressLines: settings.address
                    ? settings.address.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
                    : dict.contactForm.infoCards.addressLines,
                  email: getPageSectionContent(contactPage, 'info_email_title', params.locale, dict.contactForm.infoCards.email),
                  emailLines: [settings.contactEmail || 'bilgi@akarorme.com'].filter(Boolean),
                  phone: getPageSectionContent(contactPage, 'info_phone_title', params.locale, dict.contactForm.infoCards.phone),
                  phoneLines: [settings.contactPhone || ''].filter(Boolean),
                  hours: getPageSectionContent(contactPage, 'info_hours_title', params.locale, dict.contactForm.infoCards.hours),
                  hourLines: [
                    getPageSectionContent(
                      contactPage,
                      'info_hours_line_1',
                      params.locale,
                      dict.contactForm.infoCards.hourLines[0] ?? '',
                    ),
                    getPageSectionContent(
                      contactPage,
                      'info_hours_line_2',
                      params.locale,
                      dict.contactForm.infoCards.hourLines[1] ?? '',
                    ),
                  ].filter(Boolean),
                },
              }}
            />
          </div>
        </section>
      </main>
      <Footer locale={params.locale} dict={{ nav: dict.nav, footer: dict.footer }} />
    </>
  );
}
