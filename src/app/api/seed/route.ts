import { NextResponse } from 'next/server';
import {
  getPersistedReferences,
  getPersistedCollections,
  getPersistedFabrics,
  getPersistedMessages,
  getPersistedMedia,
  getPersistedPages,
  getPersistedSettings,
  writeBlob,
} from '@/lib/admin-blob-store';

export const dynamic = 'force-dynamic';

/**
 * GET /api/seed — Same as POST, so it can be triggered from browser URL bar.
 */
export async function GET() {
  return seedData();
}

/**
 * POST /api/seed — Initialize Vercel Blob with default data
 * if the blob storage is empty. Safe to call multiple times.
 */
export async function POST() {
  return seedData();
}

async function seedData() {
  try {
    const results: Record<string, string> = {};

    // References
    const refs = await getPersistedReferences();
    if (refs.length === 0) {
      await writeBlob('data/references.json', defaultReferences);
      results.references = `seeded ${defaultReferences.length} items`;
    } else {
      results.references = `already has ${refs.length} items`;
    }

    // Collections
    const cols = await getPersistedCollections();
    if (cols.length === 0) {
      await writeBlob('data/collections.json', defaultCollections);
      results.collections = `seeded ${defaultCollections.length} items`;
    } else {
      results.collections = `already has ${cols.length} items`;
    }

    // Fabrics
    const fabs = await getPersistedFabrics();
    if (fabs.length === 0) {
      await writeBlob('data/fabrics.json', defaultFabrics);
      results.fabrics = `seeded ${defaultFabrics.length} items`;
    } else {
      results.fabrics = `already has ${fabs.length} items`;
    }

    // Messages
    const msgs = await getPersistedMessages();
    if (msgs.length === 0) {
      await writeBlob('data/messages.json', defaultMessages);
      results.messages = `seeded ${defaultMessages.length} items`;
    } else {
      results.messages = `already has ${msgs.length} items`;
    }

    // Pages
    const pages = await getPersistedPages();
    if (pages.length === 0) {
      await writeBlob('data/pages.json', defaultPages);
      results.pages = `seeded ${defaultPages.length} items`;
    } else {
      results.pages = `already has ${pages.length} items`;
    }

    // Settings
    const settings = await getPersistedSettings();
    if (settings.siteName === 'AKAR ÖRME' && !settings.updatedAt?.includes('T')) {
      // Already default, write it to blob to ensure it exists
      await writeBlob('data/settings.json', settings);
      results.settings = 'initialized defaults';
    } else {
      results.settings = 'already configured';
    }

    // Media (start empty)
    const media = await getPersistedMedia();
    if (media.length === 0) {
      await writeBlob('data/media.json', []);
      results.media = 'initialized empty';
    } else {
      results.media = `already has ${media.length} items`;
    }

    return NextResponse.json({ success: true, results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Seed failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── Default seed data ──────────────────────────────

const defaultReferences = [
  { id: 'r1', initials: 'NM', name: 'NordMode', country: 'Sweden', logo: '', website: 'https://nordmode.se', description: 'Scandinavian contemporary fashion brand.', createdAt: '2025-01-01T10:00:00Z' },
  { id: 'r2', initials: 'AM', name: 'Alta Moda', country: 'Italy', logo: '', website: 'https://altamoda.it', description: 'Italian luxury fashion house.', createdAt: '2025-01-01T10:00:00Z' },
  { id: 'r3', initials: 'TW', name: 'ThreadWorks', country: 'United Kingdom', logo: '', website: 'https://threadworks.co.uk', description: 'British knitwear retailer.', createdAt: '2025-01-01T10:00:00Z' },
  { id: 'r4', initials: 'FL', name: 'FibreLink', country: 'Germany', logo: '', website: 'https://fibrelink.de', description: 'German textile sourcing company.', createdAt: '2025-01-01T10:00:00Z' },
  { id: 'r5', initials: 'ÉT', name: 'Étoile Tricot', country: 'France', logo: '', website: 'https://etoile-tricot.fr', description: 'French premium knitwear label.', createdAt: '2025-01-01T10:00:00Z' },
  { id: 'r6', initials: 'VK', name: 'VelvetKnit', country: 'Netherlands', logo: '', website: '', description: 'Dutch sustainable fashion brand.', createdAt: '2025-01-01T10:00:00Z' },
  { id: 'r7', initials: 'LX', name: 'Luxana Group', country: 'Spain', logo: '', website: '', description: 'Spanish fashion conglomerate.', createdAt: '2025-01-01T10:00:00Z' },
  { id: 'r8', initials: 'KZ', name: 'Kazmir Textiles', country: 'Poland', logo: '', website: '', description: 'Eastern European textile distributor.', createdAt: '2025-01-01T10:00:00Z' },
  { id: 'r9', initials: 'WV', name: 'WaveWear', country: 'Denmark', logo: '', website: '', description: 'Danish minimalist fashion brand.', createdAt: '2025-01-01T10:00:00Z' },
  { id: 'r10', initials: 'AR', name: 'ArcticRow', country: 'Finland', logo: '', website: '', description: 'Finnish outdoor knitwear brand.', createdAt: '2025-01-01T10:00:00Z' },
  { id: 'r11', initials: 'SL', name: 'SoleLine', country: 'Portugal', logo: '', website: '', description: 'Portuguese fashion manufacturer.', createdAt: '2025-01-01T10:00:00Z' },
  { id: 'r12', initials: 'BK', name: 'BlueKnit Co.', country: 'Belgium', logo: '', website: '', description: 'Belgian knit accessories brand.', createdAt: '2025-01-01T10:00:00Z' },
];

const defaultCollections = [
  { id: 'c1', name: 'Summer Essentials', slug: 'summer-essentials', season: 'SS25', description: 'Lightweight, breathable knitwear for warm-weather styling.', coverImage: '/images/models/polo.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
  { id: 'c2', name: 'Winter Heritage', slug: 'winter-heritage', season: 'FW25', description: 'Heritage-inspired heavy knits for the cold season.', coverImage: '/images/models/cable-knit.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
  { id: 'c3', name: 'Luxury Line', slug: 'luxury-line', season: 'FW25', description: 'Premium fabrics and refined silhouettes for elevated knitwear.', coverImage: '/images/models/v-neck.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
];

const defaultFabrics = [
  { id: 'f1', slug: 'single-jersey', name: 'Single Jersey', gauge: '28 GG', composition: '100% Supima Cotton', weight: '140–180 g/m²', description: 'Ultra-fine single jersey with exceptional softness and drape.', image: '/images/fabrics/single-jersey.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
  { id: 'f2', slug: 'rib-knit', name: 'Rib Knit', gauge: '14 GG', composition: '100% Cotton', weight: '180–240 g/m²', description: 'Alternating knit-purl columns creating vertical ridges with natural stretch.', image: '/images/fabrics/rib-knit.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
  { id: 'f3', slug: 'interlock', name: 'Interlock', gauge: '24 GG', composition: '100% Compact Cotton', weight: '180–240 g/m²', description: 'Double-face interlock with a smooth, stable hand-feel on both sides.', image: '/images/fabrics/interlock.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
  { id: 'f4', slug: 'jacquard', name: 'Jacquard', gauge: '12 GG', composition: '80% Wool / 20% Nylon', weight: '280–400 g/m²', description: 'Multi-colour patterned knit using individual needle selection.', image: '/images/fabrics/jacquard.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
  { id: 'f5', slug: 'cable-knit', name: 'Cable Knit', gauge: '7 GG', composition: '80% Wool / 20% Nylon', weight: '350–480 g/m²', description: 'Heavy-gauge cable patterns with deep texture definition.', image: '/images/fabrics/cable-jacquard.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
  { id: 'f6', slug: 'pique', name: 'Piqué Knit', gauge: '14 GG', composition: '100% Long-Staple Cotton', weight: '200–240 g/m²', description: 'Classic waffle-textured piqué with diamond patterns.', image: '/images/fabrics/pique.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
  { id: 'f7', slug: 'french-terry', name: 'French Terry', gauge: '20 GG', composition: '80% Cotton / 20% Polyester', weight: '280–350 g/m²', description: 'Looped-back terry knit with a smooth exterior.', image: '/images/fabrics/french-terry.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
];

const defaultMessages = [
  { id: 'msg1', name: 'Erik Johansson', email: 'erik@nordmode.se', company: 'NordMode', subject: 'SS26 Collection Inquiry', message: 'We are interested in developing a summer capsule collection of 15 pieces. Could we schedule a meeting to discuss production capabilities?', read: false, responded: false, createdAt: '2026-03-10T14:30:00Z' },
  { id: 'msg2', name: 'Sophie Laurent', email: 'sophie@etoile-tricot.fr', company: 'Étoile Tricot', subject: 'Jacquard Samples', message: 'Following our meeting in Istanbul, I would like to request jacquard swatches in the colorways we discussed. Please confirm lead time for sampling.', read: false, responded: false, createdAt: '2026-03-09T11:15:00Z' },
  { id: 'msg3', name: 'Marco Venturi', email: 'marco@altamoda.it', company: 'Alta Moda', subject: 'Re: FW26 Development', message: 'The merino prototype samples arrived in excellent condition. We approve the hand-feel and weight. Please proceed with the graded set.', read: true, responded: true, respondedAt: '2026-03-08T14:00:00Z', createdAt: '2026-03-08T09:00:00Z' },
];

const defaultPages = [
  { id: 'p1', slug: 'home', title: 'Homepage', sections: [
    { id: 's1', key: 'hero_title', label: 'Hero Title', type: 'text', content: 'Precision in Every Thread', visible: true, order: 0 },
    { id: 's2', key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea', content: 'Decades of textile expertise woven into every metre. From premium yarn to finished fabric — engineered for the world\'s leading fashion houses.', visible: true, order: 1 },
    { id: 's3', key: 'hero_badge', label: 'Hero Badge Text', type: 'text', content: 'Premium Knitwear Manufacturing', visible: true, order: 2 },
    { id: 's4', key: 'cta_primary', label: 'Primary CTA Text', type: 'text', content: 'Explore Collections', visible: true, order: 3 },
    { id: 's5', key: 'cta_secondary', label: 'Secondary CTA Text', type: 'text', content: 'Request a Sample', visible: true, order: 4 },
    { id: 's6', key: 'brand_story_title', label: 'Brand Story Title', type: 'text', content: 'Crafting Excellence, Thread by Thread', visible: true, order: 5 },
    { id: 's7', key: 'brand_story_text', label: 'Brand Story Text', type: 'textarea', content: 'For over two decades, Akar Örme has been the trusted production partner behind some of the world\'s finest knitwear labels. Our 15,000 m² facility in İstanbul houses 120+ state-of-the-art knitting machines.', visible: true, order: 6 },
    { id: 's8', key: 'brand_story_since', label: 'Since Year', type: 'text', content: 'Since 2000', visible: true, order: 7 },
    { id: 's9', key: 'cta_section_title', label: 'CTA Section Title', type: 'text', content: 'Ready to Bring Your Vision to Life?', visible: true, order: 8 },
    { id: 's10', key: 'cta_section_text', label: 'CTA Section Body', type: 'textarea', content: 'Whether you need 500 metres or 50,000 — our team is ready to engineer the perfect knitwear solution for your brand.', visible: true, order: 9 },
  ], updatedAt: '2025-01-01T10:00:00Z' },
  { id: 'p2', slug: 'about', title: 'About Us', sections: [
    { id: 's11', key: 'page_title', label: 'Page Title', type: 'text', content: 'About Us', visible: true, order: 0 },
    { id: 's12', key: 'page_subtitle', label: 'Page Subtitle', type: 'textarea', content: '25+ years of precision knitwear manufacturing — from a 12-machine workshop to a world-class production facility.', visible: true, order: 1 },
  ], updatedAt: '2025-01-01T10:00:00Z' },
  { id: 'p3', slug: 'contact', title: 'Contact', sections: [
    { id: 's20', key: 'page_title', label: 'Page Title', type: 'text', content: 'Contact Us', visible: true, order: 0 },
    { id: 's21', key: 'page_subtitle', label: 'Page Subtitle', type: 'textarea', content: 'Get in touch with our team to discuss your knitwear production needs.', visible: true, order: 1 },
  ], updatedAt: '2025-01-01T10:00:00Z' },
];
