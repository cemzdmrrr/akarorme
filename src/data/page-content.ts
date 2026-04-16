import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import type { PageContent, PageSection } from '@/types/admin';

export const DEFAULT_PAGE_CONTENT: PageContent[] = [
  {
    id: 'p1',
    slug: 'home',
    title: 'Ana Sayfa',
    sections: [
      { id: 'home_1', key: 'hero_label', label: 'Hero üst etiket', type: 'text', content: 'Premium Knitwear Manufacturing', visible: true, order: 0 },
      { id: 'home_2', key: 'hero_heading1', label: 'Hero başlık 1', type: 'text', content: 'Precision in', visible: true, order: 1 },
      { id: 'home_3', key: 'hero_heading2', label: 'Hero başlık 2', type: 'text', content: 'Every', visible: true, order: 2 },
      { id: 'home_4', key: 'hero_highlight', label: 'Hero vurgu kelimesi', type: 'text', content: 'Thread', visible: true, order: 3 },
      { id: 'home_5', key: 'hero_description', label: 'Hero açıklama', type: 'textarea', content: 'Decades of textile expertise woven into every metre. From premium yarn to finished fabric — engineered for the world\'s leading fashion houses.', visible: true, order: 4 },
      { id: 'home_6', key: 'hero_cta_primary', label: 'Hero birincil buton', type: 'text', content: 'Explore Collections', visible: true, order: 5 },
      { id: 'home_7', key: 'hero_cta_secondary', label: 'Hero ikincil buton', type: 'text', content: 'Request a Sample', visible: true, order: 6 },
      { id: 'home_8', key: 'brand_label', label: 'Marka hikayesi üst etiket', type: 'text', content: 'Since 2000', visible: true, order: 7 },
      { id: 'home_9', key: 'brand_heading', label: 'Marka hikayesi başlık', type: 'text', content: 'Crafting Excellence,', visible: true, order: 8 },
      { id: 'home_10', key: 'brand_highlight', label: 'Marka hikayesi vurgu', type: 'text', content: 'Thread by Thread', visible: true, order: 9 },
      { id: 'home_11', key: 'brand_paragraph1', label: 'Marka hikayesi paragraf 1', type: 'textarea', content: 'For over two decades, Akar Örme has been the trusted production partner behind some of the world\'s finest knitwear labels.', visible: true, order: 10 },
      { id: 'home_12', key: 'brand_paragraph2', label: 'Marka hikayesi paragraf 2', type: 'textarea', content: 'We do not just manufacture fabric — we engineer textile solutions tailored to each brand\'s vision, from yarn selection to final inspection.', visible: true, order: 11 },
      { id: 'home_13', key: 'brand_link_text', label: 'Marka hikayesi link metni', type: 'text', content: 'Read Our Full Story', visible: true, order: 12 },
      { id: 'home_14', key: 'cta_label', label: 'Alt CTA üst etiket', type: 'text', content: 'Start Your Project', visible: true, order: 13 },
      { id: 'home_15', key: 'cta_heading', label: 'Alt CTA başlık', type: 'text', content: 'Ready to Bring Your', visible: true, order: 14 },
      { id: 'home_16', key: 'cta_highlight', label: 'Alt CTA vurgu', type: 'text', content: 'Vision to Life?', visible: true, order: 15 },
      { id: 'home_17', key: 'cta_description', label: 'Alt CTA açıklama', type: 'textarea', content: 'Whether you need 500 metres or 50,000 — our team is ready to engineer the perfect knitwear solution for your brand.', visible: true, order: 16 },
      { id: 'home_18', key: 'cta_button_primary', label: 'Alt CTA birincil buton', type: 'text', content: 'Get In Touch', visible: true, order: 17 },
      { id: 'home_19', key: 'cta_button_secondary', label: 'Alt CTA ikincil buton', type: 'text', content: 'View Our References', visible: true, order: 18 },
    ],
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'p2',
    slug: 'about',
    title: 'Hakkımızda',
    sections: [
      { id: 'about_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'About', visible: true, order: 0 },
      { id: 'about_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'Us', visible: true, order: 1 },
      { id: 'about_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: '25+ years of precision knitwear manufacturing — from a 12-machine workshop to a world-class production facility.', visible: true, order: 2 },
      { id: 'about_4', key: 'philosophy_label', label: 'Felsefe üst etiket', type: 'text', content: 'What Drives Us', visible: true, order: 3 },
      { id: 'about_5', key: 'philosophy_title', label: 'Felsefe başlık', type: 'text', content: 'Our', visible: true, order: 4 },
      { id: 'about_6', key: 'philosophy_highlight', label: 'Felsefe vurgu', type: 'text', content: 'Philosophy', visible: true, order: 5 },
      { id: 'about_7', key: 'value_1_title', label: 'Değer 1 başlık', type: 'text', content: 'Precision', visible: true, order: 6 },
      { id: 'about_8', key: 'value_1_description', label: 'Değer 1 açıklama', type: 'textarea', content: 'Every stitch is calibrated, every tension measured. We treat knitwear manufacturing as an exact science.', visible: true, order: 7 },
      { id: 'about_9', key: 'value_2_title', label: 'Değer 2 başlık', type: 'text', content: 'Innovation', visible: true, order: 8 },
      { id: 'about_10', key: 'value_2_description', label: 'Değer 2 açıklama', type: 'textarea', content: 'Continuous investment in R&D and next-gen knitting technology keeps us at the leading edge of textile production.', visible: true, order: 9 },
      { id: 'about_11', key: 'value_3_title', label: 'Değer 3 başlık', type: 'text', content: 'Sustainability', visible: true, order: 10 },
      { id: 'about_12', key: 'value_3_description', label: 'Değer 3 açıklama', type: 'textarea', content: 'From waterless dyeing pilots to solar-powered operations — responsible production is woven into our DNA.', visible: true, order: 11 },
      { id: 'about_13', key: 'mission_title', label: 'Misyon başlık', type: 'text', content: 'Our Mission', visible: true, order: 12 },
      { id: 'about_14', key: 'mission_text', label: 'Misyon metni', type: 'textarea', content: 'To deliver premium knitwear fabrics and finished garments that exceed our partners\' expectations — through cutting-edge technology, rigorous quality control, and a deeply collaborative approach to manufacturing.', visible: true, order: 13 },
      { id: 'about_15', key: 'vision_title', label: 'Vizyon başlık', type: 'text', content: 'Our Vision', visible: true, order: 14 },
      { id: 'about_16', key: 'vision_text', label: 'Vizyon metni', type: 'textarea', content: 'To lead the future of sustainable knitwear manufacturing through cutting-edge technology, responsible practices, and unwavering commitment to craftsmanship.', visible: true, order: 15 },
      { id: 'about_17', key: 'factory_title', label: 'Fabrika başlık', type: 'text', content: 'Inside Our', visible: true, order: 16 },
      { id: 'about_18', key: 'factory_highlight', label: 'Fabrika vurgu', type: 'text', content: 'Factory', visible: true, order: 17 },
      { id: 'about_19', key: 'factory_description', label: 'Fabrika açıklama', type: 'textarea', content: 'A glimpse into our 15,000 m² production facility in İstanbul.', visible: true, order: 18 },
    ],
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'p3',
    slug: 'contact',
    title: 'İletişim',
    sections: [
      { id: 'contact_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'Get In', visible: true, order: 0 },
      { id: 'contact_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'Touch', visible: true, order: 1 },
      { id: 'contact_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: 'Ready to start your next knitwear project? Reach out to our team — we\'d love to hear from you.', visible: true, order: 2 },
      { id: 'contact_4', key: 'form_heading', label: 'Form başlığı', type: 'text', content: 'Send Us a Message', visible: true, order: 3 },
      { id: 'contact_5', key: 'form_subheading', label: 'Form açıklaması', type: 'textarea', content: 'Fill in the form below and our team will get back to you within 24 hours.', visible: true, order: 4 },
    ],
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'p4',
    slug: 'collections',
    title: 'Koleksiyonlar',
    sections: [
      { id: 'collections_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'Our', visible: true, order: 0 },
      { id: 'collections_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'Collections', visible: true, order: 1 },
      { id: 'collections_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: 'Browse our full catalogue of knitwear models — each precision-engineered for the world\'s leading fashion brands.', visible: true, order: 2 },
    ],
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'p5',
    slug: 'references',
    title: 'Referanslar',
    sections: [
      { id: 'references_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'Our', visible: true, order: 0 },
      { id: 'references_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'References', visible: true, order: 1 },
      { id: 'references_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: 'Trusted by 500+ brands across 30+ countries — building long-term partnerships through quality and reliability.', visible: true, order: 2 },
      { id: 'references_4', key: 'logos_heading', label: 'Logo alanı başlık', type: 'text', content: 'Trusted', visible: true, order: 3 },
      { id: 'references_5', key: 'logos_highlight', label: 'Logo alanı vurgu', type: 'text', content: 'Partners', visible: true, order: 4 },
      { id: 'references_6', key: 'logos_description', label: 'Logo alanı açıklama', type: 'textarea', content: 'We proudly serve leading fashion houses, retailers, and private-label brands worldwide.', visible: true, order: 5 },
    ],
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'p6',
    slug: 'footer',
    title: 'Footer',
    sections: [
      { id: 'footer_1', key: 'copyright', label: 'Telif metni', type: 'text', content: '© {year} Akar Örme. All rights reserved.', visible: true, order: 0 },
    ],
    updatedAt: '2025-01-01T10:00:00Z',
  },
];

function sortSections(sections: PageSection[]): PageSection[] {
  return [...sections].sort((a, b) => a.order - b.order);
}

function normalizeSection(section: PageSection): PageSection {
  if (section.type === 'image') {
    return section;
  }

  return {
    ...section,
    translations: section.translations
      ? { ...section.translations }
      : undefined,
  };
}

export function mergePagesWithDefaults(pages: PageContent[]): PageContent[] {
  const pagesBySlug = new Map(pages.map((page) => [page.slug, page]));

  const mergedDefaults = DEFAULT_PAGE_CONTENT.map((defaultPage) => {
    const existingPage = pagesBySlug.get(defaultPage.slug);
    if (!existingPage) {
      return defaultPage;
    }

    const existingSectionsByKey = new Map(
      existingPage.sections.map((section) => [section.key, section]),
    );

    const mergedSections = defaultPage.sections.map((defaultSection) => {
      const existingSection = existingSectionsByKey.get(defaultSection.key);
      return existingSection
        ? normalizeSection({ ...defaultSection, ...existingSection })
        : normalizeSection(defaultSection);
    });

    const extraSections = existingPage.sections
      .filter(
        (section) =>
          !defaultPage.sections.some((defaultSection) => defaultSection.key === section.key),
      )
      .map((section, index) => ({
        ...normalizeSection(section),
        order: defaultPage.sections.length + index,
      }));

    return {
      ...defaultPage,
      ...existingPage,
      sections: sortSections([...mergedSections, ...extraSections]),
    };
  });

  const extraPages = pages.filter(
    (page) => !DEFAULT_PAGE_CONTENT.some((defaultPage) => defaultPage.slug === page.slug),
  );

  return [...mergedDefaults, ...extraPages];
}

export function getPageBySlug(pages: PageContent[], slug: string): PageContent | null {
  return pages.find((page) => page.slug === slug) ?? null;
}

export function getPageSectionContent(
  page: PageContent | null | undefined,
  key: string,
  locale: Locale,
  fallback: string,
): string {
  const section = page?.sections.find((item) => item.key === key && item.visible);
  if (!section) return fallback;

  if (section.type === 'image') {
    const value = section.content?.trim();
    return value ? value : fallback;
  }

  if (!section.translations) {
    const legacyValue = section.content?.trim();
    return legacyValue ? legacyValue : fallback;
  }

  const localizedValue = section.translations[locale]?.trim();
  if (localizedValue) return localizedValue;

  if (locale === 'tr') {
    const trValue = section.translations.tr?.trim() || section.content?.trim();
    return trValue || fallback;
  }

  return fallback;
}

export function getSectionLocaleValue(
  section: PageSection,
  locale: Locale,
): string {
  if (section.type === 'image') {
    return section.content ?? '';
  }

  if (section.translations) {
    return section.translations[locale] ?? '';
  }

  return locale === 'tr' ? section.content ?? '' : '';
}

export function setSectionLocaleValue(
  section: PageSection,
  locale: Locale,
  value: string,
): PageSection {
  if (section.type === 'image') {
    return { ...section, content: value };
  }

  const nextTranslations: Partial<Record<Locale, string>> = {};
  for (const item of locales) {
    nextTranslations[item] = section.translations?.[item] ?? (item === 'tr' ? section.content ?? '' : '');
  }
  nextTranslations[locale] = value;

  return {
    ...section,
    content: locale === 'tr' ? value : (nextTranslations.tr ?? section.content ?? ''),
    translations: nextTranslations,
  };
}
