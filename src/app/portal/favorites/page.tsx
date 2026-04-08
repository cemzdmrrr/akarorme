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
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-white">Saved Models</h1>
        <p className="mt-1 text-sm text-brand-grey">Your bookmarked knitwear models for quick access.</p>
      </div>

      {favs.length === 0 ? (
        <div className="rounded-xl bg-brand-dark border border-brand-dark-3 p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark-2">
            <span className="text-2xl text-brand-grey">♡</span>
          </div>
          <p className="text-brand-grey mb-3">No saved models yet.</p>
          <Link href="/portal/collections" className="text-sm text-brand-accent-light hover:underline">Browse collections →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favs.map((fav) => (
            <div key={fav.id} className="rounded-xl bg-brand-dark border border-brand-dark-3 overflow-hidden group">
              <Link href={`/portal/models/${fav.modelId}`}>
                <div className="aspect-[4/3] bg-brand-dark-2 swatch-placeholder relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl text-brand-dark-4 opacity-30 font-display font-bold">{fav.modelName.slice(0, 2)}</span>
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/portal/models/${fav.modelId}`} className="block">
                  <h3 className="text-sm font-semibold text-brand-white group-hover:text-brand-accent-light transition-colors">{fav.modelName}</h3>
                  <p className="text-xs text-brand-grey mt-0.5">{fav.collection}</p>
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[10px] text-brand-grey">Saved {new Date(fav.addedAt).toLocaleDateString()}</p>
                  <button
                    onClick={() => handleRemove(fav.modelId)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
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
