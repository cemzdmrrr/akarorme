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

// ─── CRUD Operations ────────────────────────────────

export async function createPersistedModel(
  data: Omit<AdminModel, 'id' | 'slug' | 'createdAt' | 'updatedAt'>,
): Promise<AdminModel> {
  const now = new Date().toISOString();
  const model: AdminModel = {
    ...data,
    id: generateId(),
    slug: slugify(data.name),
    createdAt: now,
    updatedAt: now,
  };

  const models = await getPersistedModels();
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

  models[idx] = {
    ...models[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  if (data.name) models[idx].slug = slugify(data.name);

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
