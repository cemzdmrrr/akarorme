import type { KnitwearModel } from '@/types';
import type { AdminModel } from '@/types/admin';
import { getPersistedModels } from '@/lib/model-store';

const ADMIN_MODELS_STORAGE_KEY = 'admin_models';

function dedupeBySlug(models: KnitwearModel[]): KnitwearModel[] {
  const map = new Map<string, KnitwearModel>();

  for (const model of models) {
    if (!model?.slug) continue;
    map.set(model.slug, model);
  }

  return Array.from(map.values());
}

export function adminModelsToKnitwear(models: AdminModel[]): KnitwearModel[] {
  return models
    .filter((m) => m.status === 'published')
    .map((m) => ({
      slug: m.slug,
      name: m.name,
      tagline: m.tagline,
      description: m.description,
      tags: m.tags?.length ? m.tags : [],
      image: m.coverImage || m.images?.[0] || '',
      gallery: m.images || [],
      colors: (m.colors || []).map((c) => ({
        name: c.name,
        hex: c.hex,
        image: c.images?.[0] || c.image || '',
        images: c.images ?? (c.image ? [c.image] : []),
      })),
      specs: m.technicalDetails || [],
      featured: Boolean(m.featured),
    }));
}

/**
 * Statik yedek katalog.
 *
 * SSR/SSG güvenliği için tutulur; site bileşenleri mümkün olduğunda
 * admin tarafından eklenen modelleri de gösterebilmek için
 * `getHydratedModels()` / `useSiteModels()` üzerinden beslenmelidir.
 */
export const models: KnitwearModel[] = [
  {
    slug: 'classic-polo',
    name: 'Klasik Polo',
    tagline: '%100 Pamuk Pike',
    description:
      'Premium uzun elyaflı pamuk pike ile üretilen zamansız polo silueti. İnce numara örgü yapısı, tekrarlı yıkamalarda formunu korurken yumuşak ve düzgün bir tuşe sunar.',
    tags: ['erkek', 'yaz', 'ince'],
    image: '/images/models/placeholder.svg',
    gallery: ['/images/models/placeholder.svg', '/images/models/placeholder.svg'],
    colors: [
      { name: 'Lacivert', hex: '#1e3a5f' },
      { name: 'Beyaz', hex: '#f5f5f0' },
      { name: 'Adaçayı', hex: '#7a9a7e' },
    ],
    specs: [
      { label: 'Numara', value: '14 GG' },
      { label: 'Ağırlık', value: '220 g/m²' },
      { label: 'Kompozisyon', value: '%100 Supima Pamuk' },
      { label: 'Apre', value: 'Biyo parlatma, enzim yıkama' },
    ],
    featured: true,
  },
  {
    slug: 'cable-knit-sweater',
    name: 'Saç Örgü Kazak',
    tagline: 'Merinos Yün Karışımı',
    description:
      'Premium merinos karışımlı iplikle örülen klasik saç örgü kazak. Karmaşık örgü deseni, Stoll CMS makinelerinde derinlik ve netlik korunarak mühendislik hassasiyetiyle üretilir.',
    tags: ['erkek', 'kış', 'kalın'],
    image: '/images/models/placeholder.svg',
    gallery: [],
    colors: [
      { name: 'Krem', hex: '#c5baa8' },
      { name: 'Antrasit', hex: '#3a3a42' },
    ],
    specs: [
      { label: 'Numara', value: '7 GG' },
      { label: 'Ağırlık', value: '380 g/m²' },
      { label: 'Kompozisyon', value: '%80 Merinos Yün / %20 Naylon' },
      { label: 'Apre', value: 'Fırçalı, keçeleştirilmiş' },
    ],
    featured: true,
  },
  {
    slug: 'premium-tee',
    name: 'Premium Tişört',
    tagline: 'Kompakt Jarse Örgü',
    description:
      'Kompakt eğrilmiş jarse kumaştan üretilen yüksek segment basic tişört. Ultra ince 30/1 iplik, tok ve opak bir yüzeyle birlikte dökümlü bir görünüm sağlar.',
    tags: ['erkek', 'kadın', 'yaz', 'ince'],
    image: '/images/models/placeholder.svg',
    gallery: [],
    colors: [
      { name: 'Siyah', hex: '#2a2a2a' },
      { name: 'Kırçıllı Gri', hex: '#8e8e96' },
      { name: 'Beyaz', hex: '#f0f0f2' },
    ],
    specs: [
      { label: 'Numara', value: '18 GG' },
      { label: 'Ağırlık', value: '180 g/m²' },
      { label: 'Kompozisyon', value: '%100 Kompakt Pamuk' },
      { label: 'Apre', value: 'Silikon yumuşatma' },
    ],
    featured: true,
  },
  {
    slug: 'crew-neck-sweater',
    name: 'Bisiklet Yaka Kazak',
    tagline: 'İnce Numara Triko',
    description:
      'İnce numara örme ile hazırlanan çok yönlü bisiklet yaka siluet. Fully fashioned yapısı sayesinde temiz dikiş hatları ve dengeli bir kalıp sunar.',
    tags: ['erkek', 'kadın', 'kış', 'ince'],
    image: '/images/models/placeholder.svg',
    gallery: [],
    colors: [
      { name: 'Altın', hex: '#C9A84C' },
      { name: 'Bordo', hex: '#6b2d3e' },
    ],
    specs: [
      { label: 'Numara', value: '12 GG' },
      { label: 'Ağırlık', value: '280 g/m²' },
      { label: 'Kompozisyon', value: '%50 Merinos / %50 Akrilik' },
      { label: 'Apre', value: 'Anti-pilling işlem' },
    ],
    featured: true,
  },
  {
    slug: 'zip-hoodie',
    name: 'Fermuarlı Hoodie',
    tagline: 'Kalın Fleeceli Triko',
    description:
      'Kalın gramajlı fleece triko ile üretilen çağdaş fermuarlı hoodie. Çift yüzlü yapısı sayesinde dış yüzey temiz görünürken iç taraf fırçalı sıcaklık sağlar.',
    tags: ['erkek', 'kış', 'kalın'],
    image: '/images/models/placeholder.svg',
    gallery: [],
    colors: [
      { name: 'Antrasit', hex: '#3a3a42' },
      { name: 'Lacivert', hex: '#1e3a5f' },
    ],
    specs: [
      { label: 'Numara', value: '7 GG' },
      { label: 'Ağırlık', value: '420 g/m²' },
      { label: 'Kompozisyon', value: '%80 Pamuk / %20 Polyester' },
      { label: 'Apre', value: 'İçi fırçalı, parça boyalı' },
    ],
    featured: true,
  },
  {
    slug: 'henley-shirt',
    name: 'Henley',
    tagline: 'Slub Jarse',
    description:
      'Dokulu slub jarse ile hazırlanan üç düğmeli rahat henley modeli. Düzensiz iplik yapısı, ürüne doğal ve kullanılmış hissi veren karakterli bir görünüm kazandırır.',
    tags: ['erkek', 'yaz', 'ince'],
    image: '/images/models/placeholder.svg',
    gallery: [],
    colors: [
      { name: 'Adaçayı', hex: '#7a9a7e' },
      { name: 'Kum', hex: '#c5baa8' },
    ],
    specs: [
      { label: 'Numara', value: '14 GG' },
      { label: 'Ağırlık', value: '200 g/m²' },
      { label: 'Kompozisyon', value: '%100 Slub Pamuk' },
      { label: 'Apre', value: 'Enzim yıkama, doğal kurutma' },
    ],
    featured: true,
  },
  {
    slug: 'v-neck-pullover',
    name: 'V Yaka Kazak',
    tagline: 'İpek-Kaşmir Karışımı',
    description:
      'Lüks ipek-kaşmir karışımlı iplikle örülen seçkin V yaka triko. Derin V yaka detayı, modele modern ve rafine bir çizgi kazandırır.',
    tags: ['erkek', 'kadın', 'kış', 'ince'],
    image: '/images/models/placeholder.svg',
    gallery: [],
    colors: [
      { name: 'Şarap', hex: '#6b2d3e' },
      { name: 'Gece Mavisi', hex: '#1e3a5f' },
    ],
    specs: [
      { label: 'Numara', value: '14 GG' },
      { label: 'Ağırlık', value: '240 g/m²' },
      { label: 'Kompozisyon', value: '%70 İpek / %30 Kaşmir' },
      { label: 'Apre', value: 'El işi etek ucu bitimi' },
    ],
    featured: true,
  },
  {
    slug: 'knit-cardigan',
    name: 'Triko Hırka',
    tagline: 'Kalın Mouliné İplik',
    description:
      'Kalın mouliné iplikle örülen, rahat kalıplı iddialı hırka modeli. Boynuz efektli düğmeler ve ribana bitişler ürüne zanaat hissi katar.',
    tags: ['kadın', 'kış', 'kalın'],
    image: '/images/models/placeholder.svg',
    gallery: [],
    colors: [
      { name: 'Mercan', hex: '#c47a6a' },
      { name: 'Yulaf', hex: '#c5baa8' },
    ],
    specs: [
      { label: 'Numara', value: '5 GG' },
      { label: 'Ağırlık', value: '450 g/m²' },
      { label: 'Kompozisyon', value: '%60 Yün / %40 Akrilik' },
      { label: 'Apre', value: 'Fırçalı, rahat tamburlama' },
    ],
    featured: true,
  },
  {
    slug: 'knit-wrap-dress',
    name: 'Kruvaze Triko Elbise',
    tagline: 'Viskon Ribana Örgü',
    description:
      'Akışkan viskon ribana ile hazırlanan zarif kruvaze elbise. Kendi kumaşından kemer detayı, bedene oturan ama rahat bir siluet oluşturur.',
    tags: ['kadın', 'yaz', 'ince'],
    image: '/images/models/placeholder.svg',
    gallery: [],
    colors: [
      { name: 'Adaçayı', hex: '#7a9a7e' },
      { name: 'Siyah', hex: '#2a2a2a' },
    ],
    specs: [
      { label: 'Numara', value: '14 GG' },
      { label: 'Ağırlık', value: '260 g/m²' },
      { label: 'Kompozisyon', value: '%95 Viskon / %5 Elastan' },
      { label: 'Apre', value: 'Kalender, antistatik' },
    ],
    featured: false,
  },
  {
    slug: 'turtleneck',
    name: 'Balıkçı Yaka',
    tagline: 'Ekstra İnce Merinos',
    description:
      '19.5 mikron ekstra ince merinos yün ile örülen modern balıkçı yaka model. Whole-garment üretim sayesinde yan dikiş olmadan yüksek konfor sunar.',
    tags: ['kadın', 'kış', 'kalın'],
    image: '/images/models/placeholder.svg',
    gallery: [],
    colors: [
      { name: 'Krem', hex: '#c5baa8' },
      { name: 'Siyah', hex: '#2a2a2a' },
    ],
    specs: [
      { label: 'Numara', value: '12 GG' },
      { label: 'Ağırlık', value: '300 g/m²' },
      { label: 'Kompozisyon', value: '%100 Ekstra İnce Merinos' },
      { label: 'Apre', value: 'EXP işlem, kaşmir hissi' },
    ],
    featured: false,
  },
  {
    slug: 'knit-crop-top',
    name: 'Triko Crop Top',
    tagline: 'Kompakt Rib',
    description:
      'Geniş elastik etek bandına sahip sportif crop siluet. Katmanlı kullanım için olduğu kadar yaz koleksiyonlarında tek başına kullanılabilecek güçlü bir parça sunar.',
    tags: ['kadın', 'yaz', 'ince'],
    image: '/images/models/placeholder.svg',
    gallery: [],
    colors: [
      { name: 'Mercan', hex: '#c47a6a' },
      { name: 'Beyaz', hex: '#f0f0f2' },
    ],
    specs: [
      { label: 'Numara', value: '14 GG' },
      { label: 'Ağırlık', value: '190 g/m²' },
      { label: 'Kompozisyon', value: '%92 Pamuk / %8 Elastan' },
      { label: 'Apre', value: 'Parça boyama, silikon yıkama' },
    ],
    featured: false,
  },
  {
    slug: 'oversized-sweater',
    name: 'Oversize Kazak',
    tagline: 'Buklet İplik',
    description:
      'Dokulu buklet iplikle örülen sıcak ve rahat oversize kazak modeli. Düşük omuz ve uzun manşet detayları ile modern gardıroba lüks bir rahatlık katar.',
    tags: ['kadın', 'kış', 'kalın'],
    image: '/images/models/placeholder.svg',
    gallery: [],
    colors: [
      { name: 'Şarap', hex: '#6b2d3e' },
      { name: 'Taş', hex: '#c5baa8' },
    ],
    specs: [
      { label: 'Numara', value: '5 GG' },
      { label: 'Ağırlık', value: '480 g/m²' },
      { label: 'Kompozisyon', value: '%45 Yün / %35 Mohair / %20 Naylon' },
      { label: 'Apre', value: 'Buhar bloklama, fırçalama' },
    ],
    featured: false,
  },
];

function parseAdminModelsFromStorage(raw: string | null): KnitwearModel[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as AdminModel[];
    if (!Array.isArray(parsed)) return [];
    return adminModelsToKnitwear(parsed);
  } catch {
    return [];
  }
}

export function getStaticModels(): KnitwearModel[] {
  return [...models];
}

/**
 * SSR/SSG-safe fallback.
 * Existing server code can keep using this.
 */
export function useSiteModels(): KnitwearModel[] {
  return getStaticModels();
}

/**
 * Client-side hydrated source.
 * Merges admin-created published models with static catalogue.
 * Admin models win on slug collision.
 */
export function getHydratedModels(): KnitwearModel[] {
  if (typeof window === 'undefined') {
    return getStaticModels();
  }

  const adminModels = parseAdminModelsFromStorage(
    window.localStorage.getItem(ADMIN_MODELS_STORAGE_KEY),
  );

  return dedupeBySlug([...getStaticModels(), ...adminModels]);
}

export function getFeaturedModels(): KnitwearModel[] {
  return getStaticModels().filter((m) => m.featured);
}

export function getHydratedFeaturedModels(): KnitwearModel[] {
  return getHydratedModels().filter((m) => m.featured);
}

export function getModelBySlug(slug: string): KnitwearModel | undefined {
  return getStaticModels().find((m) => m.slug === slug);
}

export function getHydratedModelBySlug(slug: string): KnitwearModel | undefined {
  return getHydratedModels().find((m) => m.slug === slug);
}

export function useSiteModelslugs(): string[] {
  return useSiteModels().map((m) => m.slug);
}

export function getHydratedModelSlugs(): string[] {
  return getHydratedModels().map((m) => m.slug);
}

/**
 * Admin panel kaydı güncellendiğinde site tarafında aynı sekmede de canlı yenileme alınsın.
 * Admin kaydet/sil işleminden sonra şunu çağır:
 *   window.dispatchEvent(new Event('admin-models-updated'))
 */
export const ADMIN_MODELS_UPDATED_EVENT = 'admin-models-updated';
export const ADMIN_MODELS_STORAGE = ADMIN_MODELS_STORAGE_KEY;

// Server-side async functions (use Vercel Blob)

/**
 * Fetch all models from persistent storage.
 * If blob has data, use only blob models (admin is source of truth).
 * If blob is empty, fall back to static catalogue so the site is never empty.
 */
export async function getServerModels(): Promise<KnitwearModel[]> {
  const adminModels = await getPersistedModels();
  const converted = adminModelsToKnitwear(adminModels);
  return converted.length > 0 ? converted : getStaticModels();
}

export async function getServerFeaturedModels(): Promise<KnitwearModel[]> {
  const all = await getServerModels();
  return all.filter((m) => m.featured);
}

export async function getServerModelBySlug(slug: string): Promise<KnitwearModel | undefined> {
  const all = await getServerModels();
  return all.find((m) => m.slug === slug);
}

export async function getServerModelSlugs(): Promise<string[]> {
  const all = await getServerModels();
  return all.map((m) => m.slug);
}
