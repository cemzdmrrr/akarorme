/* ===================================================
   Model Store — Vercel Blob-backed persistent storage
   for admin models. Falls back to empty array when
   BLOB_READ_WRITE_TOKEN is not configured.
   =================================================== */

import { put, get } from '@vercel/blob';
import type { AdminModel } from '@/types/admin';

const MODELS_BLOB_PATH = 'data/models.json';

/**
 * Read all admin models from Vercel Blob storage.
 * Returns an empty array if blob doesn't exist or token is missing.
 */
export async function getPersistedModels(): Promise<AdminModel[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return [];
  }

  try {
    const result = await get(MODELS_BLOB_PATH, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) return [];

    // Read stream to string
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

    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch {
    // Blob doesn't exist yet — return empty
    return [];
  }
}

/**
 * Write all admin models to Vercel Blob storage.
 * Overwrites the existing blob.
 */
export async function persistModels(models: AdminModel[]): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  }

  await put(MODELS_BLOB_PATH, JSON.stringify(models), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

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

// ─── Validation ─────────────────────────────────────

const VALID_STATUSES = ['published', 'draft'] as const;
const VALID_TAGS = ['men', 'women', 'winter', 'summer', 'fine', 'heavy'];
const MAX_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_IMAGES = 50;

function validateModelData(
  data: Record<string, unknown>,
): { valid: true } | { valid: false; error: string } {
  const name = data.name;
  if (typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Model name is required' };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: `Model name must be under ${MAX_NAME_LENGTH} characters` };
  }

  if (data.description !== undefined && typeof data.description !== 'string') {
    return { valid: false, error: 'Description must be a string' };
  }
  if (typeof data.description === 'string' && data.description.length > MAX_DESCRIPTION_LENGTH) {
    return { valid: false, error: `Description must be under ${MAX_DESCRIPTION_LENGTH} characters` };
  }

  if (data.status !== undefined) {
    if (!VALID_STATUSES.includes(data.status as typeof VALID_STATUSES[number])) {
      return { valid: false, error: 'Status must be "published" or "draft"' };
    }
  }

  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags) || !data.tags.every((t: unknown) => typeof t === 'string')) {
      return { valid: false, error: 'Tags must be an array of strings' };
    }
    const invalid = (data.tags as string[]).filter((t) => !VALID_TAGS.includes(t));
    if (invalid.length > 0) {
      return { valid: false, error: `Invalid tags: ${invalid.join(', ')}` };
    }
  }

  if (data.images !== undefined) {
    if (!Array.isArray(data.images)) {
      return { valid: false, error: 'Images must be an array' };
    }
    if (data.images.length > MAX_IMAGES) {
      return { valid: false, error: `Maximum ${MAX_IMAGES} images allowed` };
    }
  }

  if (data.colors !== undefined) {
    if (!Array.isArray(data.colors)) {
      return { valid: false, error: 'Colors must be an array' };
    }
    for (const c of data.colors as Record<string, unknown>[]) {
      if (typeof c.name !== 'string' || typeof c.hex !== 'string') {
        return { valid: false, error: 'Each color must have name and hex' };
      }
      if (!/^#[0-9a-fA-F]{6}$/.test(c.hex as string)) {
        return { valid: false, error: `Invalid hex color: ${c.hex}` };
      }
    }
  }

  return { valid: true };
}

/**
 * Ensure a slug is unique among existing models.
 * Appends -2, -3, etc. if needed.
 */
function uniqueSlug(base: string, existing: AdminModel[], excludeId?: string): string {
  const taken = new Set(
    existing.filter((m) => m.id !== excludeId).map((m) => m.slug),
  );
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

// ─── CRUD Operations ────────────────────────────────

export async function createPersistedModel(
  data: Omit<AdminModel, 'id' | 'slug' | 'createdAt' | 'updatedAt'>,
): Promise<AdminModel> {
  const validation = validateModelData(data as Record<string, unknown>);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const models = await getPersistedModels();
  const now = new Date().toISOString();
  const baseSlug = slugify(data.name);

  const model: AdminModel = {
    ...data,
    id: generateId(),
    slug: uniqueSlug(baseSlug, models),
    createdAt: now,
    updatedAt: now,
  };

  models.push(model);
  await persistModels(models);
  return model;
}

export async function updatePersistedModel(
  id: string,
  data: Partial<AdminModel>,
): Promise<AdminModel | null> {
  const models = await getPersistedModels();
  const idx = models.findIndex((m) => m.id === id);
  if (idx === -1) return null;

  // Validate partial update data
  if (data.name !== undefined || data.description !== undefined || data.status !== undefined ||
      data.tags !== undefined || data.images !== undefined || data.colors !== undefined) {
    const merged = { ...models[idx], ...data };
    const validation = validateModelData(merged as unknown as Record<string, unknown>);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
  }

  models[idx] = {
    ...models[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  if (data.name) models[idx].slug = uniqueSlug(slugify(data.name), models, id);

  await persistModels(models);
  return models[idx];
}

export async function deletePersistedModel(id: string): Promise<boolean> {
  const models = await getPersistedModels();
  const idx = models.findIndex((m) => m.id === id);
  if (idx === -1) return false;

  models.splice(idx, 1);
  await persistModels(models);
  return true;
}
