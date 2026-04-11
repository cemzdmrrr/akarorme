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
      tags: m.tags?.length ? m.tags : (m as any).category ? [(m as any).category] : [],
      image: m.images?.[0] || '',
      gallery: m.images || [],
      colors: (m.colors || []).map((c) => ({ name: c.name, hex: c.hex, image: c.image || '' })),
      specs: m.technicalDetails || [],
      featured: m.featured,
    }));
}

export function useClientModels(staticModels: KnitwearModel[], onlyFeatured = false) {
  const [models, setModels] = useState<KnitwearModel[]>(staticModels);

  useEffect(() => {
    // Fetch latest models from API (source of truth: Vercel Blob)
    // This ensures admin changes are reflected without waiting for ISR
    let cancelled = false;
    fetch('/api/models')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AdminModel[] | null) => {
        if (cancelled || !data || !Array.isArray(data)) return;
        let result = adminModelsToKnitwear(data);
        if (onlyFeatured) {
          result = result.filter((m) => m.featured);
        }
        setModels(result);
      })
      .catch(() => {
        // Silent fail — use server-rendered static models
      });
    return () => { cancelled = true; };
  }, [onlyFeatured]);

  return models;
}
