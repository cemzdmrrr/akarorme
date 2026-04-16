'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentClientId } from '@/lib/b2b-auth';
import { getFavorites, removeFavorite } from '@/lib/b2b-store';
import type { ClientFavorite } from '@/types/b2b';

export default function PortalFavorites() {
  const [favs, setFavs] = useState<ClientFavorite[]>([]);

  useEffect(() => {
    const cid = getCurrentClientId();
    if (cid) setFavs(getFavorites(cid));
  }, []);

  function handleRemove(modelId: string) {
    const cid = getCurrentClientId();
    if (!cid) return;
    removeFavorite(cid, modelId);
    setFavs((prev) => prev.filter((f) => f.modelId !== modelId));
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-white">Kaydedilen Modeller</h1>
        <p className="mt-1 text-sm text-brand-grey">Hızlı erişim için kaydettiğiniz triko modelleri.</p>
      </div>

      {favs.length === 0 ? (
        <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark-2">
            <span className="text-2xl text-brand-grey">♡</span>
          </div>
          <p className="mb-3 text-brand-grey">Henüz kaydedilmiş model yok.</p>
          <Link href="/portal/collections" className="text-sm text-brand-accent-light hover:underline">
            Koleksiyonları incele
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favs.map((fav) => (
            <div key={fav.id} className="group overflow-hidden rounded-xl border border-brand-dark-3 bg-brand-dark">
              <Link href={`/portal/models/${fav.modelId}`}>
                <div className="relative aspect-[4/3] bg-brand-dark-2 swatch-placeholder">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-4xl font-bold text-brand-dark-4 opacity-30">{fav.modelName.slice(0, 2)}</span>
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/portal/models/${fav.modelId}`} className="block">
                  <h3 className="text-sm font-semibold text-brand-white transition-colors group-hover:text-brand-accent-light">{fav.modelName}</h3>
                  <p className="mt-0.5 text-xs text-brand-grey">{fav.collection}</p>
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[10px] text-brand-grey">Kaydedildi: {new Date(fav.addedAt).toLocaleDateString()}</p>
                  <button
                    onClick={() => handleRemove(fav.modelId)}
                    className="text-xs text-red-400 transition-colors hover:text-red-300"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
