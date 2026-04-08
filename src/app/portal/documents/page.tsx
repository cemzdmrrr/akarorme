'use client';

import { useEffect, useState } from 'react';
import { getCurrentClientId } from '@/lib/b2b-auth';
import { getDocuments } from '@/lib/b2b-store';
import type { B2BDocument, DocumentCategory } from '@/types/b2b';

const categories: { label: string; value: DocumentCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Technical Sheets', value: 'technical_sheet' },
  { label: 'Fabric Details', value: 'fabric_detail' },
  { label: 'Catalogs', value: 'catalog' },
  { label: 'Price Lists', value: 'price_list' },
  { label: 'Other', value: 'other' },
];

const categoryIcons: Record<DocumentCategory, string> = {
  technical_sheet: '📊',
  fabric_detail: '🧵',
  catalog: '📖',
  price_list: '💰',
  other: '📄',
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
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-white">Documents</h1>
        <p className="mt-1 text-sm text-brand-grey">Access technical sheets, catalogs, and other shared documents.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                filter === c.value
                  ? 'bg-brand-accent text-white'
                  : 'bg-brand-dark border border-brand-dark-3 text-brand-grey hover:text-brand-white'
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
          placeholder="Search documents..."
          className="rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none w-full sm:w-64 ml-auto"
        />
      </div>

      {/* Document Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl bg-brand-dark border border-brand-dark-3 p-12 text-center">
          <p className="text-brand-grey">No documents available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div key={doc.id} className="rounded-xl bg-brand-dark border border-brand-dark-3 p-5 hover:border-brand-dark-4 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{categoryIcons[doc.category]}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-brand-white truncate">{doc.name}</h3>
                  <p className="text-xs text-brand-grey mt-0.5 capitalize">{doc.category.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <p className="text-xs text-brand-grey-light mt-3 line-clamp-2">{doc.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-[10px] text-brand-grey">
                  {formatSize(doc.fileSize)} · {new Date(doc.createdAt).toLocaleDateString()}
                </div>
                <button className="rounded-lg bg-brand-dark-2 border border-brand-dark-3 px-3 py-1.5 text-xs text-brand-accent-light hover:bg-brand-dark-3 transition-colors">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
