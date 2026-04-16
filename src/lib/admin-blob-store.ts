/* ===================================================
   Admin Blob Store — Vercel Blob-backed persistent
   storage for all admin entities (references, collections,
   fabrics, pages, settings, messages, media).
   =================================================== */

import { put, get } from '@vercel/blob';
import type {
  AdminCollection,
  AdminFabricType,
  AdminReference,
  ContactMessage,
  MediaItem,
  PageContent,
  SiteSettings,
} from '@/types/admin';
import { DEFAULT_PAGE_CONTENT, mergePagesWithDefaults } from '@/data/page-content';

// ─── Blob Paths ──────────────────────────────────────
const BLOB = {
  references: 'data/references.json',
  collections: 'data/collections.json',
  fabrics: 'data/fabrics.json',
  messages: 'data/messages.json',
  media: 'data/media.json',
  pages: 'data/pages.json',
  settings: 'data/settings.json',
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

async function readBlob<T>(path: string): Promise<T | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const result = await get(path, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const reader = result.stream.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    const text = new TextDecoder().decode(
      chunks.reduce((acc, chunk) => {
        const merged = new Uint8Array(acc.length + chunk.length);
        merged.set(acc);
        merged.set(chunk, acc.length);
        return merged;
      }, new Uint8Array(0)),
    );
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function writeBlob<T>(path: string, data: T): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  }
  await put(path, JSON.stringify(data), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

// ─── REFERENCES ─────────────────────────────────────
export async function getPersistedReferences(): Promise<AdminReference[]> {
  const data = await readBlob<AdminReference[]>(BLOB.references);
  return Array.isArray(data) ? data : [];
}

export async function createPersistedReference(
  data: Omit<AdminReference, 'id' | 'createdAt'>,
): Promise<AdminReference> {
  const ref: AdminReference = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const list = await getPersistedReferences();
  list.push(ref);
  await writeBlob(BLOB.references, list);
  return ref;
}

export async function updatePersistedReference(
  id: string,
  data: Partial<AdminReference>,
): Promise<AdminReference | null> {
  const list = await getPersistedReferences();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...data };
  await writeBlob(BLOB.references, list);
  return list[idx];
}

export async function deletePersistedReference(id: string): Promise<boolean> {
  const list = await getPersistedReferences();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  list.splice(idx, 1);
  await writeBlob(BLOB.references, list);
  return true;
}

// ─── COLLECTIONS ────────────────────────────────────
export async function getPersistedCollections(): Promise<AdminCollection[]> {
  const data = await readBlob<AdminCollection[]>(BLOB.collections);
  return Array.isArray(data) ? data : [];
}

export async function createPersistedCollection(
  data: Omit<AdminCollection, 'id' | 'slug' | 'createdAt' | 'updatedAt'>,
): Promise<AdminCollection> {
  const now = new Date().toISOString();
  const collection: AdminCollection = {
    ...data,
    id: generateId(),
    slug: slugify(data.name),
    createdAt: now,
    updatedAt: now,
  };
  const list = await getPersistedCollections();
  list.push(collection);
  await writeBlob(BLOB.collections, list);
  return collection;
}

export async function updatePersistedCollection(
  id: string,
  data: Partial<AdminCollection>,
): Promise<AdminCollection | null> {
  const list = await getPersistedCollections();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  if (data.name) list[idx].slug = slugify(data.name);
  await writeBlob(BLOB.collections, list);
  return list[idx];
}

export async function deletePersistedCollection(id: string): Promise<boolean> {
  const list = await getPersistedCollections();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  list.splice(idx, 1);
  await writeBlob(BLOB.collections, list);
  return true;
}

// ─── FABRICS ────────────────────────────────────────
export async function getPersistedFabrics(): Promise<AdminFabricType[]> {
  const data = await readBlob<AdminFabricType[]>(BLOB.fabrics);
  return Array.isArray(data) ? data : [];
}

export async function createPersistedFabric(
  data: Omit<AdminFabricType, 'id' | 'slug' | 'createdAt' | 'updatedAt'>,
): Promise<AdminFabricType> {
  const now = new Date().toISOString();
  const fabric: AdminFabricType = {
    ...data,
    id: generateId(),
    slug: slugify(data.name),
    createdAt: now,
    updatedAt: now,
  };
  const list = await getPersistedFabrics();
  list.push(fabric);
  await writeBlob(BLOB.fabrics, list);
  return fabric;
}

export async function updatePersistedFabric(
  id: string,
  data: Partial<AdminFabricType>,
): Promise<AdminFabricType | null> {
  const list = await getPersistedFabrics();
  const idx = list.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  if (data.name) list[idx].slug = slugify(data.name);
  await writeBlob(BLOB.fabrics, list);
  return list[idx];
}

export async function deletePersistedFabric(id: string): Promise<boolean> {
  const list = await getPersistedFabrics();
  const idx = list.findIndex((f) => f.id === id);
  if (idx === -1) return false;
  list.splice(idx, 1);
  await writeBlob(BLOB.fabrics, list);
  return true;
}

// ─── MESSAGES ───────────────────────────────────────
export async function getPersistedMessages(): Promise<ContactMessage[]> {
  const data = await readBlob<ContactMessage[]>(BLOB.messages);
  return Array.isArray(data) ? data : [];
}

export async function createPersistedMessage(
  data: Omit<ContactMessage, 'id' | 'read' | 'responded' | 'createdAt'>,
): Promise<ContactMessage> {
  const msg: ContactMessage = {
    ...data,
    id: generateId(),
    read: false,
    responded: false,
    createdAt: new Date().toISOString(),
  };
  const list = await getPersistedMessages();
  list.unshift(msg);
  await writeBlob(BLOB.messages, list);
  return msg;
}

export async function updatePersistedMessage(
  id: string,
  data: Partial<ContactMessage>,
): Promise<ContactMessage | null> {
  const list = await getPersistedMessages();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...data };
  await writeBlob(BLOB.messages, list);
  return list[idx];
}

export async function deletePersistedMessage(id: string): Promise<boolean> {
  const list = await getPersistedMessages();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  list.splice(idx, 1);
  await writeBlob(BLOB.messages, list);
  return true;
}

// ─── MEDIA ──────────────────────────────────────────
export async function getPersistedMedia(): Promise<MediaItem[]> {
  const data = await readBlob<MediaItem[]>(BLOB.media);
  return Array.isArray(data) ? data : [];
}

export async function createPersistedMedia(
  data: Omit<MediaItem, 'id' | 'createdAt'>,
): Promise<MediaItem> {
  const item: MediaItem = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const list = await getPersistedMedia();
  list.unshift(item);
  await writeBlob(BLOB.media, list);
  return item;
}

export async function updatePersistedMedia(
  id: string,
  data: Partial<MediaItem>,
): Promise<MediaItem | null> {
  const list = await getPersistedMedia();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...data };
  await writeBlob(BLOB.media, list);
  return list[idx];
}

export async function deletePersistedMedia(id: string): Promise<boolean> {
  const list = await getPersistedMedia();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  list.splice(idx, 1);
  await writeBlob(BLOB.media, list);
  return true;
}

// ─── PAGES ──────────────────────────────────────────
export async function getPersistedPages(): Promise<PageContent[]> {
  const data = await readBlob<PageContent[]>(BLOB.pages);
  if (!Array.isArray(data) || data.length === 0) {
    return DEFAULT_PAGE_CONTENT;
  }
  return mergePagesWithDefaults(data);
}

export async function updatePersistedPage(
  id: string,
  sections: PageContent['sections'],
): Promise<PageContent | null> {
  const list = await getPersistedPages();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], sections, updatedAt: new Date().toISOString() };
  await writeBlob(BLOB.pages, list);
  return list[idx];
}

export async function persistPages(pages: PageContent[]): Promise<void> {
  await writeBlob(BLOB.pages, pages);
}

// ─── SETTINGS ───────────────────────────────────────
const DEFAULT_SETTINGS: SiteSettings = {
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
};

export async function getPersistedSettings(): Promise<SiteSettings> {
  const data = await readBlob<SiteSettings>(BLOB.settings);
  return data ?? DEFAULT_SETTINGS;
}

export async function updatePersistedSettings(
  data: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const current = await getPersistedSettings();
  const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
  await writeBlob(BLOB.settings, updated);
  return updated;
}
