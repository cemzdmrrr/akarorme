/* ===================================================
   Admin Store — localStorage-based CRUD operations
   for the CMS. Replace with API calls when a backend
   is connected.
   =================================================== */

import type {
  AdminModel,
  AdminCollection,
  AdminFabricType,
  AdminReference,
  ContactMessage,
  MediaItem,
  PageContent,
  SiteSettings,
  DashboardStats,
  ActivityEntry,
} from '@/types/admin';
import { DEFAULT_PAGE_CONTENT } from '@/data/page-content';

// ─── Keys ────────────────────────────────────────────
const KEYS = {
  models: 'admin_models',
  collections: 'admin_collections',
  fabrics: 'admin_fabrics',
  references: 'admin_references',
  messages: 'admin_messages',
  media: 'admin_media',
  pages: 'admin_pages',
  settings: 'admin_settings',
  activity: 'admin_activity',
  initialized: 'admin_initialized',
} as const;

// ─── Helpers ────────────────────────────────────────
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getStore<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function setStore<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function getObject<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

function setObject<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Activity Log ───────────────────────────────────
export function logActivity(action: string, entity: string, entityName: string): void {
  const entries = getStore<ActivityEntry>(KEYS.activity);
  entries.unshift({
    id: generateId(),
    action,
    entity,
    entityName,
    timestamp: new Date().toISOString(),
  });
  // Keep last 100 entries
  setStore(KEYS.activity, entries.slice(0, 100));
}

export function getActivity(): ActivityEntry[] {
  return getStore<ActivityEntry>(KEYS.activity);
}

// ─── MODELS ─────────────────────────────────────────
export function getModels(): AdminModel[] {
  return getStore<AdminModel>(KEYS.models);
}

export function getModel(id: string): AdminModel | undefined {
  return getModels().find((m) => m.id === id);
}

export function createModel(data: Omit<AdminModel, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): AdminModel {
  const now = new Date().toISOString();
  const model: AdminModel = {
    ...data,
    id: generateId(),
    slug: slugify(data.name),
    createdAt: now,
    updatedAt: now,
  };
  const models = getModels();
  models.push(model);
  setStore(KEYS.models, models);
  logActivity('created', 'model', model.name);
  return model;
}

export function updateModel(id: string, data: Partial<AdminModel>): AdminModel | undefined {
  const models = getModels();
  const idx = models.findIndex((m) => m.id === id);
  if (idx === -1) return undefined;
  models[idx] = {
    ...models[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  if (data.name) models[idx].slug = slugify(data.name);
  setStore(KEYS.models, models);
  logActivity('updated', 'model', models[idx].name);
  return models[idx];
}

export function deleteModel(id: string): boolean {
  const models = getModels();
  const model = models.find((m) => m.id === id);
  if (!model) return false;
  setStore(KEYS.models, models.filter((m) => m.id !== id));
  logActivity('deleted', 'model', model.name);
  return true;
}

// ─── COLLECTIONS ────────────────────────────────────
export function getCollections(): AdminCollection[] {
  return getStore<AdminCollection>(KEYS.collections);
}

export function getCollection(id: string): AdminCollection | undefined {
  return getCollections().find((c) => c.id === id);
}

export function createCollection(data: Omit<AdminCollection, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): AdminCollection {
  const now = new Date().toISOString();
  const collection: AdminCollection = {
    ...data,
    id: generateId(),
    slug: slugify(data.name),
    createdAt: now,
    updatedAt: now,
  };
  const list = getCollections();
  list.push(collection);
  setStore(KEYS.collections, list);
  logActivity('created', 'collection', collection.name);
  return collection;
}

export function updateCollection(id: string, data: Partial<AdminCollection>): AdminCollection | undefined {
  const list = getCollections();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  if (data.name) list[idx].slug = slugify(data.name);
  setStore(KEYS.collections, list);
  logActivity('updated', 'collection', list[idx].name);
  return list[idx];
}

export function deleteCollection(id: string): boolean {
  const list = getCollections();
  const item = list.find((c) => c.id === id);
  if (!item) return false;
  setStore(KEYS.collections, list.filter((c) => c.id !== id));
  logActivity('deleted', 'collection', item.name);
  return true;
}

// ─── FABRICS ────────────────────────────────────────
export function getFabrics(): AdminFabricType[] {
  return getStore<AdminFabricType>(KEYS.fabrics);
}

export function getFabric(id: string): AdminFabricType | undefined {
  return getFabrics().find((f) => f.id === id);
}

export function createFabric(data: Omit<AdminFabricType, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): AdminFabricType {
  const now = new Date().toISOString();
  const fabric: AdminFabricType = {
    ...data,
    id: generateId(),
    slug: slugify(data.name),
    createdAt: now,
    updatedAt: now,
  };
  const list = getFabrics();
  list.push(fabric);
  setStore(KEYS.fabrics, list);
  logActivity('created', 'fabric', fabric.name);
  return fabric;
}

export function updateFabric(id: string, data: Partial<AdminFabricType>): AdminFabricType | undefined {
  const list = getFabrics();
  const idx = list.findIndex((f) => f.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  if (data.name) list[idx].slug = slugify(data.name);
  setStore(KEYS.fabrics, list);
  logActivity('updated', 'fabric', list[idx].name);
  return list[idx];
}

export function deleteFabric(id: string): boolean {
  const list = getFabrics();
  const item = list.find((f) => f.id === id);
  if (!item) return false;
  setStore(KEYS.fabrics, list.filter((f) => f.id !== id));
  logActivity('deleted', 'fabric', item.name);
  return true;
}

// ─── REFERENCES ─────────────────────────────────────
export function getReferences(): AdminReference[] {
  return getStore<AdminReference>(KEYS.references);
}

export function createReference(data: Omit<AdminReference, 'id' | 'createdAt'>): AdminReference {
  const ref: AdminReference = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const list = getReferences();
  list.push(ref);
  setStore(KEYS.references, list);
  logActivity('created', 'reference', ref.name);
  return ref;
}

export function updateReference(id: string, data: Partial<AdminReference>): AdminReference | undefined {
  const list = getReferences();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  setStore(KEYS.references, list);
  logActivity('updated', 'reference', list[idx].name);
  return list[idx];
}

export function deleteReference(id: string): boolean {
  const list = getReferences();
  const item = list.find((r) => r.id === id);
  if (!item) return false;
  setStore(KEYS.references, list.filter((r) => r.id !== id));
  logActivity('deleted', 'reference', item.name);
  return true;
}

// ─── CONTACT MESSAGES ───────────────────────────────
export function getMessages(): ContactMessage[] {
  return getStore<ContactMessage>(KEYS.messages);
}

export function createMessage(data: Omit<ContactMessage, 'id' | 'read' | 'responded' | 'createdAt'>): ContactMessage {
  const msg: ContactMessage = {
    ...data,
    id: generateId(),
    read: false,
    responded: false,
    createdAt: new Date().toISOString(),
  };
  const list = getMessages();
  list.unshift(msg);
  setStore(KEYS.messages, list);
  logActivity('received', 'message', `from ${msg.name}`);
  return msg;
}

export function markMessageRead(id: string): void {
  const list = getMessages();
  const idx = list.findIndex((m) => m.id === id);
  if (idx !== -1) {
    list[idx].read = true;
    setStore(KEYS.messages, list);
  }
}

export function markMessageResponded(id: string): void {
  const list = getMessages();
  const idx = list.findIndex((m) => m.id === id);
  if (idx !== -1) {
    list[idx].responded = true;
    list[idx].respondedAt = new Date().toISOString();
    setStore(KEYS.messages, list);
    logActivity('responded', 'message', `from ${list[idx].name}`);
  }
}

export function deleteMessage(id: string): boolean {
  const list = getMessages();
  setStore(KEYS.messages, list.filter((m) => m.id !== id));
  return true;
}

// ─── MEDIA ──────────────────────────────────────────
export function getMediaItems(): MediaItem[] {
  return getStore<MediaItem>(KEYS.media);
}

export function getMediaFolders(): string[] {
  const items = getMediaItems();
  const folders = new Set(items.map((i) => i.folder));
  return Array.from(folders).sort();
}

export function addMediaItem(data: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem {
  const item: MediaItem = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const list = getMediaItems();
  list.unshift(item);
  setStore(KEYS.media, list);
  logActivity('uploaded', 'media', item.name);
  return item;
}

export function updateMediaItem(id: string, data: Partial<MediaItem>): MediaItem | undefined {
  const list = getMediaItems();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  setStore(KEYS.media, list);
  return list[idx];
}

export function deleteMediaItem(id: string): boolean {
  const list = getMediaItems();
  const item = list.find((m) => m.id === id);
  if (!item) return false;
  setStore(KEYS.media, list.filter((m) => m.id !== id));
  logActivity('deleted', 'media', item.name);
  return true;
}

// ─── PAGES ──────────────────────────────────────────
export function getPages(): PageContent[] {
  return getStore<PageContent>(KEYS.pages);
}

export function getPage(id: string): PageContent | undefined {
  return getPages().find((p) => p.id === id);
}

export function getPageBySlug(slug: string): PageContent | undefined {
  return getPages().find((p) => p.slug === slug);
}

export function updatePage(id: string, sections: PageContent['sections']): PageContent | undefined {
  const list = getPages();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], sections, updatedAt: new Date().toISOString() };
  setStore(KEYS.pages, list);
  logActivity('updated', 'page', list[idx].title);
  return list[idx];
}

// ─── SETTINGS ───────────────────────────────────────
export function getSettings(): SiteSettings {
  return (
    getObject<SiteSettings>(KEYS.settings) ?? {
      siteName: 'AKAR ÖRME',
      siteDescription: 'Premium Knitwear Manufacturing',
      contactEmail: 'info@akarorme.com',
      contactPhone: '+90 (212) 886 00 42',
      address: 'İkitelli OSB, Atatürk Bulvarı No: 42, Başakşehir, İstanbul 34307',
      footerText: '© {year} Akar Örme. All rights reserved.',
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/akarorme' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/akarorme' },
      ],
      updatedAt: new Date().toISOString(),
    }
  );
}

export function updateSettings(data: Partial<SiteSettings>): SiteSettings {
  const current = getSettings();
  const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
  setObject(KEYS.settings, updated);
  logActivity('updated', 'settings', 'Site Settings');
  return updated;
}

// ─── DASHBOARD STATS ────────────────────────────────
export function getDashboardStats(): DashboardStats {
  return {
    totalModels: getModels().length,
    totalCollections: getCollections().length,
    totalReferences: getReferences().length,
    unreadMessages: getMessages().filter((m) => !m.read).length,
    totalMedia: getMediaItems().length,
    totalFabrics: getFabrics().length,
  };
}

// ─── SEED DATA ──────────────────────────────────────
// Populates localStorage with existing data from static files on first run.
export function initializeStore(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(KEYS.initialized)) return;

  // Seed models from existing data
  const seedModels: AdminModel[] = [
    { id: 'm1', slug: 'classic-polo', name: 'Classic Polo', tagline: '100% Cotton Piqué', collection: 'Summer Essentials', season: 'SS25', fabricType: 'Piqué Knit', yarnType: 'Cotton', gauge: '14 GG', description: 'A timeless polo silhouette crafted from premium long-staple cotton piqué.', technicalDetails: [{ label: 'Gauge', value: '14 GG' }, { label: 'Weight', value: '220 g/m²' }, { label: 'Composition', value: '100% Supima Cotton' }, { label: 'Finish', value: 'Bio-polished, enzyme wash' }], colors: [{ name: 'Navy', hex: '#1e3a5f' }, { name: 'White', hex: '#f5f5f0' }, { name: 'Sage', hex: '#7a9a7e' }], images: ['/images/models/polo.jpg'], status: 'published', featured: true, createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-01-15T10:00:00Z' },
    { id: 'm2', slug: 'cable-knit-sweater', name: 'Cable Knit Sweater', tagline: 'Merino Wool Blend', collection: 'Winter Heritage', season: 'FW25', fabricType: 'Cable & Jacquard', yarnType: 'Wool', gauge: '7 GG', description: 'A heritage cable-knit sweater knitted from premium merino-blend yarn.', technicalDetails: [{ label: 'Gauge', value: '7 GG' }, { label: 'Weight', value: '380 g/m²' }, { label: 'Composition', value: '80% Merino Wool / 20% Nylon' }, { label: 'Finish', value: 'Felted, brushed' }], colors: [{ name: 'Cream', hex: '#c5baa8' }, { name: 'Charcoal', hex: '#3a3a42' }], images: ['/images/models/cable-knit.jpg'], status: 'published', featured: true, createdAt: '2025-01-20T10:00:00Z', updatedAt: '2025-01-20T10:00:00Z' },
    { id: 'm3', slug: 'premium-tee', name: 'Premium Tee', tagline: 'Compact Jersey Knit', collection: 'Summer Essentials', season: 'SS25', fabricType: 'Single Jersey', yarnType: 'Cotton', gauge: '18 GG', description: 'An elevated basic T-shirt in compact-spun jersey.', technicalDetails: [{ label: 'Gauge', value: '18 GG' }, { label: 'Weight', value: '180 g/m²' }, { label: 'Composition', value: '100% Compact Cotton' }, { label: 'Finish', value: 'Silicone softener' }], colors: [{ name: 'Black', hex: '#2a2a2a' }, { name: 'Grey Marl', hex: '#8e8e96' }, { name: 'White', hex: '#f0f0f2' }], images: ['/images/models/tshirt.jpg'], status: 'published', featured: true, createdAt: '2025-02-01T10:00:00Z', updatedAt: '2025-02-01T10:00:00Z' },
    { id: 'm4', slug: 'crew-neck-sweater', name: 'Crew Neck Sweater', tagline: 'Fine Gauge Knit', collection: 'Winter Heritage', season: 'FW25', fabricType: 'Milano Rib', yarnType: 'Blended', gauge: '12 GG', description: 'A versatile crew-neck silhouette in fine-gauge knit.', technicalDetails: [{ label: 'Gauge', value: '12 GG' }, { label: 'Weight', value: '280 g/m²' }, { label: 'Composition', value: '50% Merino / 50% Acrylic' }, { label: 'Finish', value: 'Anti-pilling treatment' }], colors: [{ name: 'Gold', hex: '#C9A84C' }, { name: 'Burgundy', hex: '#6b2d3e' }], images: ['/images/models/crew-neck.jpg'], status: 'published', featured: true, createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-02-10T10:00:00Z' },
    { id: 'm5', slug: 'zip-hoodie', name: 'Zip Hoodie', tagline: 'Heavy Fleece Knit', collection: 'Winter Heritage', season: 'FW25', fabricType: 'French Terry', yarnType: 'Blended', gauge: '7 GG', description: 'A contemporary zip-through hoodie in heavyweight fleece knit.', technicalDetails: [{ label: 'Gauge', value: '7 GG' }, { label: 'Weight', value: '420 g/m²' }, { label: 'Composition', value: '80% Cotton / 20% Polyester' }, { label: 'Finish', value: 'Brushed back, garment-dyed' }], colors: [{ name: 'Anthracite', hex: '#3a3a42' }, { name: 'Navy', hex: '#1e3a5f' }], images: ['/images/models/hoodie.jpg'], status: 'published', featured: true, createdAt: '2025-02-15T10:00:00Z', updatedAt: '2025-02-15T10:00:00Z' },
    { id: 'm6', slug: 'henley-shirt', name: 'Henley', tagline: 'Slub Jersey', collection: 'Summer Essentials', season: 'SS25', fabricType: 'Single Jersey', yarnType: 'Cotton', gauge: '14 GG', description: 'A relaxed henley with a three-button placket in textured slub jersey.', technicalDetails: [{ label: 'Gauge', value: '14 GG' }, { label: 'Weight', value: '200 g/m²' }, { label: 'Composition', value: '100% Slub Cotton' }, { label: 'Finish', value: 'Enzyme wash, air-dry' }], colors: [{ name: 'Sage', hex: '#7a9a7e' }, { name: 'Sand', hex: '#c5baa8' }], images: ['/images/models/henley.jpg'], status: 'published', featured: true, createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-03-01T10:00:00Z' },
    { id: 'm7', slug: 'v-neck-pullover', name: 'V-Neck Pullover', tagline: 'Silk-Cashmere Blend', collection: 'Luxury Line', season: 'FW25', fabricType: 'Milano Rib', yarnType: 'Blended', gauge: '14 GG', description: 'An elevated V-neck pullover knitted from a luxurious silk-cashmere blend.', technicalDetails: [{ label: 'Gauge', value: '14 GG' }, { label: 'Weight', value: '240 g/m²' }, { label: 'Composition', value: '70% Silk / 30% Cashmere' }, { label: 'Finish', value: 'Hand-finished hems' }], colors: [{ name: 'Wine', hex: '#6b2d3e' }, { name: 'Midnight', hex: '#1e3a5f' }], images: ['/images/models/v-neck.jpg'], status: 'published', featured: true, createdAt: '2025-03-10T10:00:00Z', updatedAt: '2025-03-10T10:00:00Z' },
    { id: 'm8', slug: 'knit-cardigan', name: 'Knit Cardigan', tagline: 'Chunky Mouliné', collection: 'Winter Heritage', season: 'FW25', fabricType: 'Cable & Jacquard', yarnType: 'Wool', gauge: '5 GG', description: 'A statement cardigan in chunky mouliné yarn.', technicalDetails: [{ label: 'Gauge', value: '5 GG' }, { label: 'Weight', value: '450 g/m²' }, { label: 'Composition', value: '60% Wool / 40% Acrylic' }, { label: 'Finish', value: 'Brushed, relaxed tumble' }], colors: [{ name: 'Coral', hex: '#c47a6a' }, { name: 'Oatmeal', hex: '#c5baa8' }], images: ['/images/models/cardigan.jpg'], status: 'published', featured: true, createdAt: '2025-03-15T10:00:00Z', updatedAt: '2025-03-15T10:00:00Z' },
    { id: 'm9', slug: 'knit-wrap-dress', name: 'Knit Wrap Dress', tagline: 'Viscose Rib Knit', collection: 'Luxury Line', season: 'SS25', fabricType: 'Single Jersey', yarnType: 'Viscose', gauge: '14 GG', description: 'An elegant wrap-front dress in fluid viscose rib knit.', technicalDetails: [{ label: 'Gauge', value: '14 GG' }, { label: 'Weight', value: '260 g/m²' }, { label: 'Composition', value: '95% Viscose / 5% Elastane' }, { label: 'Finish', value: 'Calendered, anti-static' }], colors: [{ name: 'Sage', hex: '#7a9a7e' }, { name: 'Black', hex: '#2a2a2a' }], images: ['/images/models/dress.jpg'], status: 'draft', featured: false, createdAt: '2025-04-01T10:00:00Z', updatedAt: '2025-04-01T10:00:00Z' },
    { id: 'm10', slug: 'turtleneck', name: 'Turtleneck', tagline: 'Extra-Fine Merino', collection: 'Winter Heritage', season: 'FW25', fabricType: 'Interlock', yarnType: 'Wool', gauge: '12 GG', description: 'A sleek turtleneck in extra-fine 19.5 micron merino wool.', technicalDetails: [{ label: 'Gauge', value: '12 GG' }, { label: 'Weight', value: '300 g/m²' }, { label: 'Composition', value: '100% Extra-Fine Merino' }, { label: 'Finish', value: 'EXP treatment, cashmere-feel' }], colors: [{ name: 'Cream', hex: '#c5baa8' }, { name: 'Black', hex: '#2a2a2a' }], images: ['/images/models/turtleneck.jpg'], status: 'draft', featured: false, createdAt: '2025-04-05T10:00:00Z', updatedAt: '2025-04-05T10:00:00Z' },
    { id: 'm11', slug: 'knit-crop-top', name: 'Knit Crop Top', tagline: 'Compact Rib', collection: 'Summer Essentials', season: 'SS25', fabricType: 'Single Jersey', yarnType: 'Cotton', gauge: '14 GG', description: 'A sporty cropped silhouette in compact rib knit.', technicalDetails: [{ label: 'Gauge', value: '14 GG' }, { label: 'Weight', value: '190 g/m²' }, { label: 'Composition', value: '92% Cotton / 8% Elastane' }, { label: 'Finish', value: 'Garment-dyed, silicone wash' }], colors: [{ name: 'Coral', hex: '#c47a6a' }, { name: 'White', hex: '#f0f0f2' }], images: ['/images/models/crop-top.jpg'], status: 'draft', featured: false, createdAt: '2025-04-10T10:00:00Z', updatedAt: '2025-04-10T10:00:00Z' },
    { id: 'm12', slug: 'oversized-sweater', name: 'Oversized Sweater', tagline: 'Bouclé Yarn', collection: 'Winter Heritage', season: 'FW25', fabricType: 'Cable & Jacquard', yarnType: 'Wool', gauge: '5 GG', description: 'A cosy oversized sweater in textured bouclé yarn.', technicalDetails: [{ label: 'Gauge', value: '5 GG' }, { label: 'Weight', value: '480 g/m²' }, { label: 'Composition', value: '45% Wool / 35% Mohair / 20% Nylon' }, { label: 'Finish', value: 'Steam-blocked, brushed' }], colors: [{ name: 'Wine', hex: '#6b2d3e' }, { name: 'Stone', hex: '#c5baa8' }], images: ['/images/models/oversized.jpg'], status: 'draft', featured: false, createdAt: '2025-04-15T10:00:00Z', updatedAt: '2025-04-15T10:00:00Z' },
  ];
  setStore(KEYS.models, seedModels);

  // Seed collections
  const seedCollections: AdminCollection[] = [
    { id: 'c1', name: 'Summer Essentials', slug: 'summer-essentials', season: 'SS25', description: 'Lightweight, breathable knitwear for warm-weather styling.', coverImage: '/images/models/polo.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
    { id: 'c2', name: 'Winter Heritage', slug: 'winter-heritage', season: 'FW25', description: 'Heritage-inspired heavy knits for the cold season.', coverImage: '/images/models/cable-knit.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
    { id: 'c3', name: 'Luxury Line', slug: 'luxury-line', season: 'FW25', description: 'Premium fabrics and refined silhouettes for elevated knitwear.', coverImage: '/images/models/v-neck.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
  ];
  setStore(KEYS.collections, seedCollections);

  // Seed fabric types
  const seedFabrics: AdminFabricType[] = [
    { id: 'f1', slug: 'single-jersey', name: 'Single Jersey', gauge: '28 GG', composition: '100% Supima Cotton', weight: '140–180 g/m²', description: 'Ultra-fine single jersey with exceptional softness and drape.', image: '/images/fabrics/single-jersey.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
    { id: 'f2', slug: 'rib-knit', name: 'Rib Knit', gauge: '14 GG', composition: '100% Cotton', weight: '180–240 g/m²', description: 'Alternating knit-purl columns creating vertical ridges with natural stretch.', image: '/images/fabrics/rib-knit.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
    { id: 'f3', slug: 'interlock', name: 'Interlock', gauge: '24 GG', composition: '100% Compact Cotton', weight: '180–240 g/m²', description: 'Double-face interlock with a smooth, stable hand-feel on both sides.', image: '/images/fabrics/interlock.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
    { id: 'f4', slug: 'jacquard', name: 'Jacquard', gauge: '12 GG', composition: '80% Wool / 20% Nylon', weight: '280–400 g/m²', description: 'Multi-colour patterned knit using individual needle selection.', image: '/images/fabrics/jacquard.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
    { id: 'f5', slug: 'cable-knit', name: 'Cable Knit', gauge: '7 GG', composition: '80% Wool / 20% Nylon', weight: '350–480 g/m²', description: 'Heavy-gauge cable patterns with deep texture definition.', image: '/images/fabrics/cable-jacquard.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
    { id: 'f6', slug: 'pique', name: 'Piqué Knit', gauge: '14 GG', composition: '100% Long-Staple Cotton', weight: '200–240 g/m²', description: 'Classic waffle-textured piqué with diamond patterns.', image: '/images/fabrics/pique.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
    { id: 'f7', slug: 'french-terry', name: 'French Terry', gauge: '20 GG', composition: '80% Cotton / 20% Polyester', weight: '280–350 g/m²', description: 'Looped-back terry knit with a smooth exterior.', image: '/images/fabrics/french-terry.jpg', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
  ];
  setStore(KEYS.fabrics, seedFabrics);

  // Seed references
  const seedReferences: AdminReference[] = [
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
  setStore(KEYS.references, seedReferences);

  // Seed messages
  const seedMessages: ContactMessage[] = [
    { id: 'msg1', name: 'Erik Johansson', email: 'erik@nordmode.se', company: 'NordMode', subject: 'SS26 Collection Inquiry', message: 'We are interested in developing a summer capsule collection of 15 pieces. Could we schedule a meeting to discuss production capabilities?', read: false, responded: false, createdAt: '2026-03-10T14:30:00Z' },
    { id: 'msg2', name: 'Sophie Laurent', email: 'sophie@etoile-tricot.fr', company: 'Étoile Tricot', subject: 'Jacquard Samples', message: 'Following our meeting in Istanbul, I would like to request jacquard swatches in the colorways we discussed. Please confirm lead time for sampling.', read: false, responded: false, createdAt: '2026-03-09T11:15:00Z' },
    { id: 'msg3', name: 'Marco Venturi', email: 'marco@altamoda.it', company: 'Alta Moda', subject: 'Re: FW26 Development', message: 'The merino prototype samples arrived in excellent condition. We approve the hand-feel and weight. Please proceed with the graded set.', read: true, responded: true, respondedAt: '2026-03-08T14:00:00Z', createdAt: '2026-03-08T09:00:00Z' },
  ];
  setStore(KEYS.messages, seedMessages);

  // Seed pages
  const seedPages: PageContent[] = DEFAULT_PAGE_CONTENT;
  setStore(KEYS.pages, seedPages);

  // Seed activity
  const seedActivity: ActivityEntry[] = [
    { id: 'a1', action: 'created', entity: 'model', entityName: 'Classic Polo', timestamp: '2025-01-15T10:00:00Z' },
    { id: 'a2', action: 'created', entity: 'model', entityName: 'Cable Knit Sweater', timestamp: '2025-01-20T10:00:00Z' },
    { id: 'a3', action: 'created', entity: 'collection', entityName: 'Summer Essentials', timestamp: '2025-01-01T10:00:00Z' },
    { id: 'a4', action: 'created', entity: 'collection', entityName: 'Winter Heritage', timestamp: '2025-01-01T10:00:00Z' },
    { id: 'a5', action: 'updated', entity: 'settings', entityName: 'Site Settings', timestamp: '2025-02-01T10:00:00Z' },
  ];
  setStore(KEYS.activity, seedActivity);

  // Mark as initialized
  localStorage.setItem(KEYS.initialized, 'true');
}
