import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import type { PageContent, PageSection } from '@/types/admin';

export const DEFAULT_PAGE_CONTENT: PageContent[] = [
  {
    id: 'p1',
    slug: 'home',
    title: 'Ana Sayfa',
    sections: [
      { id: 'home_1', key: 'hero_label', label: 'Hero üst etiket', type: 'text', content: 'Premium Triko Üretimi', visible: true, order: 0 },
      { id: 'home_2', key: 'hero_heading1', label: 'Hero başlık 1', type: 'text', content: 'Her İlmekte', visible: true, order: 1 },
      { id: 'home_3', key: 'hero_heading2', label: 'Hero başlık 2', type: 'text', content: 'Aynı', visible: true, order: 2 },
      { id: 'home_4', key: 'hero_highlight', label: 'Hero vurgu kelimesi', type: 'text', content: 'Kalite', visible: true, order: 3 },
      { id: 'home_5', key: 'hero_description', label: 'Hero açıklama', type: 'textarea', content: 'Tekstildeki onlarca yıllık uzmanlığımızı her metre kumaşa işliyoruz. Premium iplikten bitmiş ürüne kadar, dünyanın önde gelen moda markaları için yüksek standartta üretim yapıyoruz.', visible: true, order: 4 },
      { id: 'home_6', key: 'hero_cta_primary', label: 'Hero birincil buton', type: 'text', content: 'Koleksiyonları İncele', visible: true, order: 5 },
      { id: 'home_7', key: 'hero_cta_secondary', label: 'Hero ikincil buton', type: 'text', content: 'Numune Talep Et', visible: true, order: 6 },
      { id: 'home_8', key: 'brand_label', label: 'Marka hikayesi üst etiket', type: 'text', content: '2000\'den Beri', visible: true, order: 7 },
      { id: 'home_9', key: 'brand_heading', label: 'Marka hikayesi başlık', type: 'text', content: 'Mükemmelliği', visible: true, order: 8 },
      { id: 'home_10', key: 'brand_highlight', label: 'Marka hikayesi vurgu', type: 'text', content: 'İlmek İlmek', visible: true, order: 9 },
      { id: 'home_11', key: 'brand_paragraph1', label: 'Marka hikayesi paragraf 1', type: 'textarea', content: 'Yirmi yılı aşkın süredir Akar Örme, dünyanın seçkin triko markaları için güvenilir üretim partneri olarak çalışıyor.', visible: true, order: 10 },
      { id: 'home_12', key: 'brand_paragraph2', label: 'Marka hikayesi paragraf 2', type: 'textarea', content: 'Sadece kumaş üretmiyoruz; iplik seçiminden son kalite kontrole kadar her markanın vizyonuna uygun tekstil çözümleri geliştiriyoruz.', visible: true, order: 11 },
      { id: 'home_13', key: 'brand_link_text', label: 'Marka hikayesi link metni', type: 'text', content: 'Hikayemizi Keşfedin', visible: true, order: 12 },
      { id: 'home_14', key: 'cta_label', label: 'Alt CTA üst etiket', type: 'text', content: 'Projenizi Başlatın', visible: true, order: 13 },
      { id: 'home_15', key: 'cta_heading', label: 'Alt CTA başlık', type: 'text', content: 'Markanızın', visible: true, order: 14 },
      { id: 'home_16', key: 'cta_highlight', label: 'Alt CTA vurgu', type: 'text', content: 'Vizyonunu Hayata Geçirelim', visible: true, order: 15 },
      { id: 'home_17', key: 'cta_description', label: 'Alt CTA açıklama', type: 'textarea', content: '500 metre de isteseniz, 50.000 metre de; ekibimiz markanıza en uygun triko çözümünü birlikte geliştirmeye hazır.', visible: true, order: 16 },
      { id: 'home_18', key: 'cta_button_primary', label: 'Alt CTA birincil buton', type: 'text', content: 'İletişime Geçin', visible: true, order: 17 },
      { id: 'home_19', key: 'cta_button_secondary', label: 'Alt CTA ikincil buton', type: 'text', content: 'Referanslarımızı Görün', visible: true, order: 18 },
    ],
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'p2',
    slug: 'about',
    title: 'Hakkımızda',
    sections: [
      { id: 'about_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'Hakkımızda', visible: true, order: 0 },
      { id: 'about_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'Akar Örme', visible: true, order: 1 },
      { id: 'about_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: '25 yılı aşkın hassas triko üretimi tecrübesiyle, 12 makinelik bir atölyeden dünya standartlarında bir üretim tesisine dönüştük.', visible: true, order: 2 },
      { id: 'about_4', key: 'philosophy_label', label: 'Felsefe üst etiket', type: 'text', content: 'Bizi Harekete Geçiren', visible: true, order: 3 },
      { id: 'about_5', key: 'philosophy_title', label: 'Felsefe başlık', type: 'text', content: 'Üretim', visible: true, order: 4 },
      { id: 'about_6', key: 'philosophy_highlight', label: 'Felsefe vurgu', type: 'text', content: 'Anlayışımız', visible: true, order: 5 },
      { id: 'about_7', key: 'value_1_title', label: 'Değer 1 başlık', type: 'text', content: 'Hassasiyet', visible: true, order: 6 },
      { id: 'about_8', key: 'value_1_description', label: 'Değer 1 açıklama', type: 'textarea', content: 'Her ilmek hesaplanır, her tansiyon dikkatle ayarlanır. Triko üretimini yüksek hassasiyet gerektiren bir uzmanlık alanı olarak görüyoruz.', visible: true, order: 7 },
      { id: 'about_9', key: 'value_2_title', label: 'Değer 2 başlık', type: 'text', content: 'Yenilik', visible: true, order: 8 },
      { id: 'about_10', key: 'value_2_description', label: 'Değer 2 açıklama', type: 'textarea', content: 'Ar-Ge ve yeni nesil örme teknolojilerine yaptığımız sürekli yatırımlar sayesinde tekstil üretiminde öncü kalıyoruz.', visible: true, order: 9 },
      { id: 'about_11', key: 'value_3_title', label: 'Değer 3 başlık', type: 'text', content: 'Sürdürülebilirlik', visible: true, order: 10 },
      { id: 'about_12', key: 'value_3_description', label: 'Değer 3 açıklama', type: 'textarea', content: 'Düşük kaynak tüketimli üretim yaklaşımlarından sorumlu operasyon modeline kadar, sürdürülebilirliği işimizin merkezine yerleştiriyoruz.', visible: true, order: 11 },
      { id: 'about_13', key: 'mission_title', label: 'Misyon başlık', type: 'text', content: 'Misyonumuz', visible: true, order: 12 },
      { id: 'about_14', key: 'mission_text', label: 'Misyon metni', type: 'textarea', content: 'İleri teknoloji, sıkı kalite kontrol ve güçlü iş birliği anlayışıyla; iş ortaklarımızın beklentilerini aşan premium triko kumaşlar ve bitmiş ürünler sunmak.', visible: true, order: 13 },
      { id: 'about_15', key: 'vision_title', label: 'Vizyon başlık', type: 'text', content: 'Vizyonumuz', visible: true, order: 14 },
      { id: 'about_16', key: 'vision_text', label: 'Vizyon metni', type: 'textarea', content: 'İleri teknoloji, sorumlu üretim uygulamaları ve ustalığa bağlılığımızla sürdürülebilir triko üretiminin geleceğine yön vermek.', visible: true, order: 15 },
      { id: 'about_17', key: 'factory_title', label: 'Fabrika başlık', type: 'text', content: 'Üretim', visible: true, order: 16 },
      { id: 'about_18', key: 'factory_highlight', label: 'Fabrika vurgu', type: 'text', content: 'Tesisimiz', visible: true, order: 17 },
      { id: 'about_19', key: 'factory_description', label: 'Fabrika açıklama', type: 'textarea', content: 'İstanbul’daki 15.000 m² üretim tesisimize yakından bakın.', visible: true, order: 18 },
    ],
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'p3',
    slug: 'contact',
    title: 'İletişim',
    sections: [
      { id: 'contact_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'İletişime', visible: true, order: 0 },
      { id: 'contact_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'Geçin', visible: true, order: 1 },
      { id: 'contact_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: 'Yeni triko projenizi başlatmaya hazır mısınız? Ekibimize ulaşın; sizi dinlemekten memnuniyet duyarız.', visible: true, order: 2 },
      { id: 'contact_4', key: 'form_heading', label: 'Form başlığı', type: 'text', content: 'Bize Mesaj Gönderin', visible: true, order: 3 },
      { id: 'contact_5', key: 'form_subheading', label: 'Form açıklaması', type: 'textarea', content: 'Aşağıdaki formu doldurun, ekibimiz size 24 saat içinde dönüş yapsın.', visible: true, order: 4 },
    ],
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'p4',
    slug: 'collections',
    title: 'Koleksiyonlar',
    sections: [
      { id: 'collections_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'Triko', visible: true, order: 0 },
      { id: 'collections_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'Koleksiyonlarımız', visible: true, order: 1 },
      { id: 'collections_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: 'Dünya moda markaları için yüksek hassasiyetle geliştirdiğimiz triko modellerin tamamını keşfedin.', visible: true, order: 2 },
    ],
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'p5',
    slug: 'references',
    title: 'Referanslar',
    sections: [
      { id: 'references_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'Bize Güvenen', visible: true, order: 0 },
      { id: 'references_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'Markalar', visible: true, order: 1 },
      { id: 'references_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: '30’dan fazla ülkede 500’ün üzerinde markayla, kalite ve güvenilirlik odaklı uzun vadeli iş ortaklıkları kuruyoruz.', visible: true, order: 2 },
      { id: 'references_4', key: 'logos_heading', label: 'Logo alanı başlık', type: 'text', content: 'Güvenilir', visible: true, order: 3 },
      { id: 'references_5', key: 'logos_highlight', label: 'Logo alanı vurgu', type: 'text', content: 'İş Ortaklarımız', visible: true, order: 4 },
      { id: 'references_6', key: 'logos_description', label: 'Logo alanı açıklama', type: 'textarea', content: 'Dünya genelinde önde gelen moda markalarına, perakendecilere ve private label markalara hizmet veriyoruz.', visible: true, order: 5 },
    ],
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'p6',
    slug: 'footer',
    title: 'Footer',
    sections: [
      { id: 'footer_1', key: 'copyright', label: 'Telif metni', type: 'text', content: '© {year} Akar Örme. Tüm hakları saklıdır.', visible: true, order: 0 },
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
    translations: section.translations ? { ...section.translations } : undefined,
  };
}

export function mergePagesWithDefaults(pages: PageContent[]): PageContent[] {
  const pagesBySlug = new Map(pages.map((page) => [page.slug, page]));

  const mergedDefaults = DEFAULT_PAGE_CONTENT.map((defaultPage) => {
    const existingPage = pagesBySlug.get(defaultPage.slug);
    if (!existingPage) {
      return defaultPage;
    }

    const existingSectionsByKey = new Map(existingPage.sections.map((section) => [section.key, section]));

    const mergedSections = defaultPage.sections.map((defaultSection) => {
      const existingSection = existingSectionsByKey.get(defaultSection.key);
      return existingSection
        ? normalizeSection({ ...defaultSection, ...existingSection })
        : normalizeSection(defaultSection);
    });

    const extraSections = existingPage.sections
      .filter((section) => !defaultPage.sections.some((defaultSection) => defaultSection.key === section.key))
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

export function getSectionLocaleValue(section: PageSection, locale: Locale): string {
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
