'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminContext } from '../template';
import { getCollections, getModels, createCollection, updateCollection, deleteCollection } from '@/lib/admin-store';
import type { AdminCollection, AdminModel } from '@/types/admin';

export default function CollectionsPage() {
  const { toggleSidebar } = useAdminContext();
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [models, setModels] = useState<AdminModel[]>([]);
  const [editing, setEditing] = useState<AdminCollection | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [season, setSeason] = useState('SS26');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    setCollections(getCollections());
    setModels(getModels());
  }, []);

  const refresh = () => { setCollections(getCollections()); setModels(getModels()); };

  const resetForm = () => {
    setName(''); setSeason('SS26'); setDescription(''); setCoverImage('');
    setEditing(null); setShowForm(false);
  };

  const openNew = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (c: AdminCollection) => {
    setEditing(c);
    setName(c.name);
    setSeason(c.season);
    setDescription(c.description);
    setCoverImage(c.coverImage);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateCollection(editing.id, { name, season, description, coverImage });
    } else {
      createCollection({ name, season, description, coverImage });
    }
    resetForm();
    refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu koleksiyonu silmek istiyor musunuz? Modeller silinmeyecektir.')) {
      deleteCollection(id);
      refresh();
    }
  };

  const countModels = (colName: string) => models.filter((m) => m.collection === colName).length;

  const inputCls = 'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100';

  return (
    <>
      <AdminHeader
        title="Koleksiyonlar"
        subtitle={`${collections.length} koleksiyon`}
        onMenuToggle={toggleSidebar}
        actions={
          <button onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Yeni Koleksiyon
          </button>
        }
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => resetForm()}>
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{editing ? 'Koleksiyonu Düzenle' : 'Yeni Koleksiyon'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Koleksiyon Adı *</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="ör. Yaz Koleksiyonu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sezon</label>
                  <select value={season} onChange={(e) => setSeason(e.target.value)} className={inputCls}>
                    {['SS25', 'FW25', 'SS26', 'FW26'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} placeholder="Koleksiyon açıklaması..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Görseli URL</label>
                  <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className={inputCls} placeholder="/images/..." />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={resetForm} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">İptal</button>
                  <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">{editing ? 'Kaydet' : 'Oluştur'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <div key={col.id} className="rounded-xl bg-white border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {col.coverImage ? (
                  <div className="h-full w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-xs text-blue-300">
                    {col.coverImage}
                  </div>
                ) : (
                  <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{col.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{col.season} &middot; {countModels(col.name)} model</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(col)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(col.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                {col.description && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{col.description}</p>}
              </div>
            </div>
          ))}
        </div>

        {collections.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">Henüz koleksiyon yok</p>
            <button onClick={openNew} className="mt-2 text-sm text-blue-600 hover:text-blue-800">İlk koleksiyonunuzu oluşturun</button>
          </div>
        )}
      </div>
    </>
  );
}
