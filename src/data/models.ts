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
      tags: m.tags?.length ? m.tags : (m as any).category ? [(m as any).category] : [],
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
 * Static fallback catalogue.
 *
 * This stays as a safe SSR/SSG fallback, but site components should prefer
 * `getHydratedModels()` / `useSiteModels()` so admin-created models are also shown.
 */
export const models: KnitwearModel[] = [
  {
    slug: 'classic-polo',
    name: 'Classic Polo',
    tagline: '100% Cotton Piqué',
    description:
      'A timeless polo silhouette crafted from premium long-staple cotton piqué. Fine-gauge knitting ensures a smooth hand-feel while maintaining excellent shape retention through repeated washes.',
    tags: ['men', 'summer', 'fine'],
    image: '/images/models/polo.jpg',
    gallery: ['/images/models/polo-1.jpg', '/images/models/polo-2.jpg'],
    colors: [
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'White', hex: '#f5f5f0' },
      { name: 'Sage', hex: '#7a9a7e' },
    ],
    specs: [
      { label: 'Gauge', value: '14 GG' },
      { label: 'Weight', value: '220 g/m²' },
      { label: 'Composition', value: '100% Supima Cotton' },
      { label: 'Finish', value: 'Bio-polished, enzyme wash' },
    ],
    featured: true,
  },
  {
    slug: 'cable-knit-sweater',
    name: 'Cable Knit Sweater',
    tagline: 'Merino Wool Blend',
    description:
      'A heritage cable-knit sweater knitted from premium merino-blend yarn. The intricate cable pattern is engineered on Stoll CMS machines for consistent depth and definition.',
    tags: ['men', 'winter', 'heavy'],
    image: '/images/models/cable-knit.jpg',
    gallery: [],
    colors: [
      { name: 'Cream', hex: '#c5baa8' },
      { name: 'Charcoal', hex: '#3a3a42' },
    ],
    specs: [
      { label: 'Gauge', value: '7 GG' },
      { label: 'Weight', value: '380 g/m²' },
      { label: 'Composition', value: '80% Merino Wool / 20% Nylon' },
      { label: 'Finish', value: 'Felted, brushed' },
    ],
    featured: true,
  },
  {
    slug: 'premium-tee',
    name: 'Premium Tee',
    tagline: 'Compact Jersey Knit',
    description:
      'An elevated basic T-shirt in compact-spun jersey. Ultra-fine 30/1 yarn delivers a dense, opaque fabric with a luxurious drape.',
    tags: ['men', 'women', 'summer', 'fine'],
    image: '/images/models/tshirt.jpg',
    gallery: [],
    colors: [
      { name: 'Black', hex: '#2a2a2a' },
      { name: 'Grey Marl', hex: '#8e8e96' },
      { name: 'White', hex: '#f0f0f2' },
    ],
    specs: [
      { label: 'Gauge', value: '18 GG' },
      { label: 'Weight', value: '180 g/m²' },
      { label: 'Composition', value: '100% Compact Cotton' },
      { label: 'Finish', value: 'Silicone softener' },
    ],
    featured: true,
  },
  {
    slug: 'crew-neck-sweater',
    name: 'Crew Neck Sweater',
    tagline: 'Fine Gauge Knit',
    description:
      'A versatile crew-neck silhouette in fine-gauge knit. Fully fashioned construction ensures clean seams and a tailored fit.',
    tags: ['men', 'women', 'winter', 'fine'],
    image: '/images/models/crew-neck.jpg',
    gallery: [],
    colors: [
      { name: 'Gold', hex: '#C9A84C' },
      { name: 'Burgundy', hex: '#6b2d3e' },
    ],
    specs: [
      { label: 'Gauge', value: '12 GG' },
      { label: 'Weight', value: '280 g/m²' },
      { label: 'Composition', value: '50% Merino / 50% Acrylic' },
      { label: 'Finish', value: 'Anti-pilling treatment' },
    ],
    featured: true,
  },
  {
    slug: 'zip-hoodie',
    name: 'Zip Hoodie',
    tagline: 'Heavy Fleece Knit',
    description:
      'A contemporary zip-through hoodie in heavyweight fleece knit. Double-face construction with a smooth exterior and brushed interior for warmth.',
    tags: ['men', 'winter', 'heavy'],
    image: '/images/models/hoodie.jpg',
    gallery: [],
    colors: [
      { name: 'Anthracite', hex: '#3a3a42' },
      { name: 'Navy', hex: '#1e3a5f' },
    ],
    specs: [
      { label: 'Gauge', value: '7 GG' },
      { label: 'Weight', value: '420 g/m²' },
      { label: 'Composition', value: '80% Cotton / 20% Polyester' },
      { label: 'Finish', value: 'Brushed back, garment-dyed' },
    ],
    featured: true,
  },
  {
    slug: 'henley-shirt',
    name: 'Henley',
    tagline: 'Slub Jersey',
    description:
      'A relaxed henley with a three-button placket in textured slub jersey. Irregular yarn creates a natural, lived-in character.',
    tags: ['men', 'summer', 'fine'],
    image: '/images/models/henley.jpg',
    gallery: [],
    colors: [
      { name: 'Sage', hex: '#7a9a7e' },
      { name: 'Sand', hex: '#c5baa8' },
    ],
    specs: [
      { label: 'Gauge', value: '14 GG' },
      { label: 'Weight', value: '200 g/m²' },
      { label: 'Composition', value: '100% Slub Cotton' },
      { label: 'Finish', value: 'Enzyme wash, air-dry' },
    ],
    featured: true,
  },
  {
    slug: 'v-neck-pullover',
    name: 'V-Neck Pullover',
    tagline: 'Silk-Cashmere Blend',
    description:
      'An elevated V-neck pullover knitted from a luxurious silk-cashmere blend. The deep V-neckline adds modern sophistication.',
    tags: ['men', 'women', 'winter', 'fine'],
    image: '/images/models/v-neck.jpg',
    gallery: [],
    colors: [
      { name: 'Wine', hex: '#6b2d3e' },
      { name: 'Midnight', hex: '#1e3a5f' },
    ],
    specs: [
      { label: 'Gauge', value: '14 GG' },
      { label: 'Weight', value: '240 g/m²' },
      { label: 'Composition', value: '70% Silk / 30% Cashmere' },
      { label: 'Finish', value: 'Hand-finished hems' },
    ],
    featured: true,
  },
  {
    slug: 'knit-cardigan',
    name: 'Knit Cardigan',
    tagline: 'Chunky Mouliné',
    description:
      'A statement cardigan in chunky mouliné yarn with a relaxed silhouette. Horn-effect buttons and ribbed trims complete the artisan look.',
    tags: ['women', 'winter', 'heavy'],
    image: '/images/models/cardigan.jpg',
    gallery: [],
    colors: [
      { name: 'Coral', hex: '#c47a6a' },
      { name: 'Oatmeal', hex: '#c5baa8' },
    ],
    specs: [
      { label: 'Gauge', value: '5 GG' },
      { label: 'Weight', value: '450 g/m²' },
      { label: 'Composition', value: '60% Wool / 40% Acrylic' },
      { label: 'Finish', value: 'Brushed, relaxed tumble' },
    ],
    featured: true,
  },
  {
    slug: 'knit-wrap-dress',
    name: 'Knit Wrap Dress',
    tagline: 'Viscose Rib Knit',
    description:
      'An elegant wrap-front dress in fluid viscose rib knit. The self-tie waist creates a flattering silhouette with effortless movement.',
    tags: ['women', 'summer', 'fine'],
    image: '/images/models/dress.jpg',
    gallery: [],
    colors: [
      { name: 'Sage', hex: '#7a9a7e' },
      { name: 'Black', hex: '#2a2a2a' },
    ],
    specs: [
      { label: 'Gauge', value: '14 GG' },
      { label: 'Weight', value: '260 g/m²' },
      { label: 'Composition', value: '95% Viscose / 5% Elastane' },
      { label: 'Finish', value: 'Calendered, anti-static' },
    ],
    featured: false,
  },
  {
    slug: 'turtleneck',
    name: 'Turtleneck',
    tagline: 'Extra-Fine Merino',
    description:
      'A sleek turtleneck in extra-fine 19.5 micron merino wool. Whole-garment knitting eliminates side seams for ultimate comfort.',
    tags: ['women', 'winter', 'heavy'],
    image: '/images/models/turtleneck.jpg',
    gallery: [],
    colors: [
      { name: 'Cream', hex: '#c5baa8' },
      { name: 'Black', hex: '#2a2a2a' },
    ],
    specs: [
      { label: 'Gauge', value: '12 GG' },
      { label: 'Weight', value: '300 g/m²' },
      { label: 'Composition', value: '100% Extra-Fine Merino' },
      { label: 'Finish', value: 'EXP treatment, cashmere-feel' },
    ],
    featured: false,
  },
  {
    slug: 'knit-crop-top',
    name: 'Knit Crop Top',
    tagline: 'Compact Rib',
    description:
      'A sporty cropped silhouette in compact rib knit with a wide elastic hem. Perfect for layering or as a stand-alone summer piece.',
    tags: ['women', 'summer', 'fine'],
    image: '/images/models/crop-top.jpg',
    gallery: [],
    colors: [
      { name: 'Coral', hex: '#c47a6a' },
      { name: 'White', hex: '#f0f0f2' },
    ],
    specs: [
      { label: 'Gauge', value: '14 GG' },
      { label: 'Weight', value: '190 g/m²' },
      { label: 'Composition', value: '92% Cotton / 8% Elastane' },
      { label: 'Finish', value: 'Garment-dyed, silicone wash' },
    ],
    featured: false,
  },
  {
    slug: 'oversized-sweater',
    name: 'Oversized Sweater',
    tagline: 'Bouclé Yarn',
    description:
      'A cosy oversized sweater in textured bouclé yarn with dropped shoulders and extended cuffs. Relaxed luxury for the modern wardrobe.',
    tags: ['women', 'winter', 'heavy'],
    image: '/images/models/oversized.jpg',
    gallery: [],
    colors: [
      { name: 'Wine', hex: '#6b2d3e' },
      { name: 'Stone', hex: '#c5baa8' },
    ],
    specs: [
      { label: 'Gauge', value: '5 GG' },
      { label: 'Weight', value: '480 g/m²' },
      { label: 'Composition', value: '45% Wool / 35% Mohair / 20% Nylon' },
      { label: 'Finish', value: 'Steam-blocked, brushed' },
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
  return useSiteModels().filter((m) => m.featured);
}

export function getHydratedFeaturedModels(): KnitwearModel[] {
  return getHydratedModels().filter((m) => m.featured);
}

export function getModelBySlug(slug: string): KnitwearModel | undefined {
  return useSiteModels().find((m) => m.slug === slug);
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

// ─── Server-side async functions (use Vercel Blob) ──

/**
 * Fetch all models from persistent storage.
 * If blob has data, use only blob models (admin is source of truth).
 * If blob is empty, fall back to static catalogue.
 */
export async function getServerModels(): Promise<KnitwearModel[]> {
  const adminModels = await getPersistedModels();
  return adminModelsToKnitwear(adminModels);
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
