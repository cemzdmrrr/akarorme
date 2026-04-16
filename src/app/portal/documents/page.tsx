'use client';

import { useEffect, useState } from 'react';
import { getCurrentClientId } from '@/lib/b2b-auth';
import { getDocuments } from '@/lib/b2b-store';
import type { B2BDocument, DocumentCategory } from '@/types/b2b';

const categories: { label: string; value: DocumentCategory | 'all' }[] = [
  { label: 'Tümü', value: 'all' },
  { label: 'Teknik Föyler', value: 'technical_sheet' },
  { label: 'Kumaş Detayları', value: 'fabric_detail' },
  { label: 'Kataloglar', value: 'catalog' },
  { label: 'Fiyat Listeleri', value: 'price_list' },
  { label: 'Diğer', value: 'other' },
];

const categoryIcons: Record<DocumentCategory, string> = {
  technical_sheet: '📊',
  fabric_detail: '🧵',
  catalog: '📖',
  price_list: '💰',
  other: '📄',
};

const categoryLabels: Record<DocumentCategory, string> = {
  technical_sheet: 'Teknik föy',
  fabric_detail: 'Kumaş detayı',
  catalog: 'Katalog',
  price_list: 'Fiyat listesi',
  other: 'Diğer',
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PortalDocuments() {
  const [docs, setDocs] = useState<B2BDocument[]>([]);
  const [filter, setFilter] = useState<DocumentCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const cid = getCurrentClientId();
    if (cid) setDocs(getDocuments(cid));
  }, []);

  const filtered = docs.filter((d) => {
    if (filter !== 'all' && d.category !== filter) return false;
    if (
      search
      && !d.name.toLowerCase().includes(search.toLowerCase())
      && !d.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-white">Dokümanlar</h1>
        <p className="mt-1 text-sm text-brand-grey">Teknik föylere, kataloglara ve sizinle paylaşılan diğer dokümanlara buradan erişin.</p>
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                filter === c.value
                  ? 'bg-brand-accent text-white'
                  : 'border border-brand-dark-3 bg-brand-dark text-brand-grey hover:text-brand-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Doküman ara..."
          className="ml-auto w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none sm:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-12 text-center">
          <p className="text-brand-grey">Uygun doküman bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <div key={doc.id} className="rounded-xl border border-brand-dark-3 bg-brand-dark p-5 transition-colors hover:border-brand-dark-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-2xl">{categoryIcons[doc.category]}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-brand-white">{doc.name}</h3>
                  <p className="mt-0.5 text-xs text-brand-grey">{categoryLabels[doc.category]}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-xs text-brand-grey-light">{doc.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-[10px] text-brand-grey">
                  {formatSize(doc.fileSize)} · {new Date(doc.createdAt).toLocaleDateString()}
                </div>
                <button className="rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3 py-1.5 text-xs text-brand-accent-light transition-colors hover:bg-brand-dark-3">
                  İndir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
