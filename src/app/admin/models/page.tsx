'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminContext } from '../template';
import { fetchModels, apiDeleteModel, apiUpdateModel } from '@/lib/admin-api';
import type { AdminModel } from '@/types/admin';
import Link from 'next/link';

export default function ModelsPage() {
  const { toggleSidebar } = useAdminContext();
  const [models, setModels] = useState<AdminModel[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadModels = () => {
    setLoading(true);
    fetchModels()
      .then(setModels)
      .catch(() => setModels([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadModels();
  }, []);

  const filtered = models
    .filter((m) => filter === 'all' || m.status === filter)
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.collection.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (confirm('Bu modeli silmek istediğinize emin misiniz?')) {
      try {
        await apiDeleteModel(id);
        loadModels();
      } catch {
        alert('Model silinemedi');
      }
    }
  };

  const handleToggleStatus = async (id: string, current: string) => {
    try {
      await apiUpdateModel(id, { status: current === 'published' ? 'draft' : 'published' });
      loadModels();
    } catch {
      alert('Durum güncellenemedi');
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await apiUpdateModel(id, { featured: !current });
      loadModels();
    } catch {
      alert('Öne çıkan durumu güncellenemedi');
    }
  };

  return (
    <>
      <AdminHeader
        title="Modeller / Tasarımlar"
        subtitle={`${models.length} toplam model`}
        onMenuToggle={toggleSidebar}
        actions={
          <Link href="/admin/models/new" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Model Ekle
          </Link>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Model ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
            {(['all', 'published', 'draft'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  filter === f ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f === 'all' ? 'Tümü' : f === 'published' ? 'Yayında' : 'Taslak'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Koleksiyon</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Sezon</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Kumaş</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Öne Çıkan</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((model) => (
                  <tr key={model.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {model.images?.[0] ? (
                          <img
                            src={model.images[0]}
                            alt={model.name}
                            className="h-10 w-10 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[11px] font-bold text-gray-400 shrink-0">
                            {model.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{model.name}</p>
                          <p className="text-xs text-gray-400 truncate">{model.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 hidden sm:table-cell">{model.collection}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 hidden md:table-cell">{model.season}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 hidden lg:table-cell">{model.fabricType}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(model.id, model.status)}
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                          model.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {model.status === 'published' ? 'Yayında' : 'Taslak'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleFeatured(model.id, model.featured)}
                        className="text-gray-400 hover:text-amber-500 transition-colors"
                      >
                        <svg className={`h-5 w-5 ${model.featured ? 'fill-amber-400 text-amber-400' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} fill={model.featured ? 'currentColor' : 'none'}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/models/${model.id}`}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                          title="Düzenle"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(model.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Sil"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="px-5 py-12 text-center text-sm text-gray-400">Model bulunamadı</p>
          )}
        </div>
      </div>
    </>
  );
}
