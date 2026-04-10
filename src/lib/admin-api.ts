/* ===================================================
   Admin API Client — Calls /api/models for persistent
   CRUD operations. Also syncs to localStorage for
   backward compatibility with dashboard stats.
   =================================================== */

import type { AdminModel } from '@/types/admin';

function getApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('admin_api_key') || '';
}

const headers = () => ({
  'Content-Type': 'application/json',
  'x-api-key': getApiKey(),
});

// ─── Models ─────────────────────────────────────────

export async function fetchModels(): Promise<AdminModel[]> {
  const res = await fetch('/api/models');
  if (!res.ok) throw new Error('Failed to fetch models');
  return res.json();
}

export async function fetchModel(id: string): Promise<AdminModel | null> {
  const res = await fetch(`/api/models/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch model');
  return res.json();
}

export async function apiCreateModel(
  data: Omit<AdminModel, 'id' | 'slug' | 'createdAt' | 'updatedAt'>,
): Promise<AdminModel> {
  const res = await fetch('/api/models', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to create model');
  }
  const model: AdminModel = await res.json();
  syncToLocalStorage();
  return model;
}

export async function apiUpdateModel(
  id: string,
  data: Partial<AdminModel>,
): Promise<AdminModel> {
  const res = await fetch(`/api/models/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to update model');
  }
  const model: AdminModel = await res.json();
  syncToLocalStorage();
  return model;
}

export async function apiDeleteModel(id: string): Promise<void> {
  const res = await fetch(`/api/models/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to delete model');
  }
  syncToLocalStorage();
}

/**
 * Sync persisted models back to localStorage so that
 * admin dashboard stats and other localStorage-based
 * features continue to work.
 */
async function syncToLocalStorage(): Promise<void> {
  try {
    const models = await fetchModels();
    localStorage.setItem('admin_models', JSON.stringify(models));
    window.dispatchEvent(new Event('admin-models-updated'));
  } catch {
    // Silent fail — localStorage sync is best-effort
  }
}

/**
 * Save the admin API key to localStorage.
 * Called once from the settings page.
 */
export function setApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_api_key', key);
  }
}
