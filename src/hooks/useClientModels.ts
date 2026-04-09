import { useEffect, useState } from 'react';
import type { KnitwearModel } from '@/types';
import type { AdminModel } from '@/types/admin';

// AdminModel'den KnitwearModel'e dönüştürme
function adminModelsToKnitwear(models: AdminModel[]): KnitwearModel[] {
  return models
    .filter((m) => m.status === 'published')
    .map((m) => ({
      slug: m.slug,
      name: m.name,
      tagline: m.tagline,
      description: m.description,
      tags: [], // Admin panelinde tag yoksa boş bırak
      image: m.images?.[0] || '',
      gallery: m.images || [],
      colors: m.colors || [],
      specs: m.technicalDetails || [],
      featured: m.featured,
    }));
}

export function useClientModels(staticModels: KnitwearModel[], onlyFeatured = false) {
  const [models, setModels] = useState<KnitwearModel[]>(staticModels);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('admin_models');
      if (raw) {
        const adminModels: AdminModel[] = JSON.parse(raw);
        let result = adminModelsToKnitwear(adminModels);
        if (onlyFeatured) {
          result = result.filter((m) => m.featured);
        }
        if (result.length > 0) {
          setModels(result);
        }
      }
    } catch {
      // ignore
    }
  }, [onlyFeatured]);

  return models;
}
