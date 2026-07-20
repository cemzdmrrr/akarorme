/* ===================================================
   Admin API Client
   =================================================== */

import type {
  AdminBlogPost,
  AdminCollection,
  AdminFabricType,
  AdminModel,
  AdminReference,
  ContactMessage,
  MediaItem,
  PageContent,
  SiteSettings,
} from '@/types/admin';

const headers = () => ({
  'Content-Type': 'application/json',
});

export async function fetchModels(): Promise<AdminModel[]> {
  const res = await fetch('/api/models', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch models');
  return res.json();
}

export async function fetchModel(id: string): Promise<AdminModel | null> {
  const res = await fetch(`/api/models/${encodeURIComponent(id)}`, { cache: 'no-store' });
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
  syncModelsToLocalStorage();
  return model;
}

export async function apiUpdateModel(id: string, data: Partial<AdminModel>): Promise<AdminModel> {
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
  syncModelsToLocalStorage();
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
  syncModelsToLocalStorage();
}

async function syncModelsToLocalStorage(): Promise<void> {
  try {
    const models = await fetchModels();
    localStorage.setItem('admin_models', JSON.stringify(models));
    window.dispatchEvent(new Event('admin-models-updated'));
  } catch {
    // local storage sync is best-effort
  }
}

export async function fetchReferences(): Promise<AdminReference[]> {
  const res = await fetch('/api/references', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch references');
  return res.json();
}

export async function apiCreateReference(
  data: Omit<AdminReference, 'id' | 'createdAt'>,
): Promise<AdminReference> {
  const res = await fetch('/api/references', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to create reference');
  }
  return res.json();
}

export async function apiUpdateReference(
  id: string,
  data: Partial<AdminReference>,
): Promise<AdminReference> {
  const res = await fetch(`/api/references/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to update reference');
  }
  return res.json();
}

export async function apiDeleteReference(id: string): Promise<void> {
  const res = await fetch(`/api/references/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to delete reference');
  }
}

export async function fetchCollections(): Promise<AdminCollection[]> {
  const res = await fetch('/api/collections', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch collections');
  return res.json();
}

export async function apiCreateCollection(
  data: Omit<AdminCollection, 'id' | 'slug' | 'createdAt' | 'updatedAt'>,
): Promise<AdminCollection> {
  const res = await fetch('/api/collections', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to create collection');
  }
  return res.json();
}

export async function apiUpdateCollection(
  id: string,
  data: Partial<AdminCollection>,
): Promise<AdminCollection> {
  const res = await fetch(`/api/collections/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to update collection');
  }
  return res.json();
}

export async function apiDeleteCollection(id: string): Promise<void> {
  const res = await fetch(`/api/collections/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to delete collection');
  }
}

export async function fetchFabrics(): Promise<AdminFabricType[]> {
  const res = await fetch('/api/fabrics', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch fabrics');
  return res.json();
}

export async function apiCreateFabric(
  data: Omit<AdminFabricType, 'id' | 'slug' | 'createdAt' | 'updatedAt'>,
): Promise<AdminFabricType> {
  const res = await fetch('/api/fabrics', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to create fabric');
  }
  return res.json();
}

export async function apiUpdateFabric(
  id: string,
  data: Partial<AdminFabricType>,
): Promise<AdminFabricType> {
  const res = await fetch(`/api/fabrics/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to update fabric');
  }
  return res.json();
}

export async function apiDeleteFabric(id: string): Promise<void> {
  const res = await fetch(`/api/fabrics/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to delete fabric');
  }
}

export async function fetchMessages(): Promise<ContactMessage[]> {
  const res = await fetch('/api/messages', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function apiMarkMessageRead(id: string): Promise<ContactMessage> {
  const res = await fetch(`/api/messages/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ read: true }),
  });
  if (!res.ok) throw new Error('Failed to mark message as read');
  return res.json();
}

export async function apiMarkMessageResponded(id: string): Promise<ContactMessage> {
  const res = await fetch(`/api/messages/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ responded: true, respondedAt: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error('Failed to mark message as responded');
  return res.json();
}

export async function apiDeleteMessage(id: string): Promise<void> {
  const res = await fetch(`/api/messages/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) throw new Error('Failed to delete message');
}

export async function fetchMedia(): Promise<MediaItem[]> {
  const res = await fetch('/api/media', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch media');
  return res.json();
}

export async function apiAddMedia(data: Omit<MediaItem, 'id' | 'createdAt'>): Promise<MediaItem> {
  const res = await fetch('/api/media', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to add media');
  }
  return res.json();
}

export async function apiUpdateMedia(id: string, data: Partial<MediaItem>): Promise<MediaItem> {
  const res = await fetch(`/api/media/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update media');
  return res.json();
}

export async function apiDeleteMedia(id: string): Promise<void> {
  const res = await fetch(`/api/media/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) throw new Error('Failed to delete media');
}

export async function fetchBlogPosts(): Promise<AdminBlogPost[]> {
  const res = await fetch('/api/blog-posts', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  return res.json();
}

export async function apiCreateBlogPost(
  data: Omit<AdminBlogPost, 'id' | 'slug' | 'createdAt' | 'updatedAt'>,
): Promise<AdminBlogPost> {
  const res = await fetch('/api/blog-posts', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to create blog post');
  }
  return res.json();
}

export async function apiUpdateBlogPost(
  id: string,
  data: Partial<AdminBlogPost>,
): Promise<AdminBlogPost> {
  const res = await fetch(`/api/blog-posts/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to update blog post');
  }
  return res.json();
}

export async function apiDeleteBlogPost(id: string): Promise<void> {
  const res = await fetch(`/api/blog-posts/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to delete blog post');
  }
}

export async function fetchPages(): Promise<PageContent[]> {
  const res = await fetch('/api/pages', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch pages');
  return res.json();
}

export async function apiUpdatePage(
  id: string,
  sections: PageContent['sections'],
): Promise<PageContent> {
  const res = await fetch(`/api/pages/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ sections }),
  });
  if (!res.ok) throw new Error('Failed to update page');
  return res.json();
}

export async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch('/api/settings', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function apiUpdateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

export function setApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_api_key', key);
  }
}
