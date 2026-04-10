'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminContext } from '../template';
import { getFabrics, createFabric, updateFabric, deleteFabric } from '@/lib/admin-store';
import type { AdminFabricType } from '@/types/admin';

export default function FabricsPage() {
  const { toggleSidebar } = useAdminContext();
  const [fabrics, setFabrics] = useState<AdminFabricType[]>([]);
  const [editing, setEditing] = useState<AdminFabricType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [gauge, setGauge] = useState('');
  const [composition, setComposition] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => { setFabrics(getFabrics()); }, []);
  const refresh = () => setFabrics(getFabrics());

  const resetForm = () => {
    setName(''); setGauge(''); setComposition(''); setWeight(''); setDescription(''); setImage('');
    setEditing(null); setShowForm(false);
  };

  const openNew = () => { resetForm(); setShowForm(true); };

  const openEdit = (f: AdminFabricType) => {
    setEditing(f); setName(f.name); setGauge(f.gauge); setComposition(f.composition);
    setWeight(f.weight); setDescription(f.description); setImage(f.image); setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateFabric(editing.id, { name, gauge, composition, weight, description, image });
    } else {
      createFabric({ name, gauge, composition, weight, description, image });
    }
    resetForm(); refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu kumaş türünü silmek istiyor musunuz?')) { deleteFabric(id); refresh(); }
  };

  const inputCls = 'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100';

  return (
    <>
      <AdminHeader
        title="Kumaş Türleri"
        subtitle={`${fabrics.length} kumaş yapısı`}
        onMenuToggle={toggleSidebar}
        actions={
          <button onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Kumaş Ekle
          </button>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => resetForm()}>
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{editing ? 'Kumaş Türünü Düzenle' : 'Yeni Kumaş Türü'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kumaş Adı *</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="ör. Süprem" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numara</label>
                    <input value={gauge} onChange={(e) => setGauge(e.target.value)} className={inputCls} placeholder="ör. 28 GG" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ağırlık</label>
                    <input value={weight} onChange={(e) => setWeight(e.target.value)} className={inputCls} placeholder="ör. 140–180 g/m²" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kompozisyon</label>
                  <input value={composition} onChange={(e) => setComposition(e.target.value)} className={inputCls} placeholder="ör. %100 Pamuk" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                  <input value={image} onChange={(e) => setImage(e.target.value)} className={inputCls} placeholder="/images/fabrics/..." />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={resetForm} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">İptal</button>
                  <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">{editing ? 'Kaydet' : 'Oluştur'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Kumaş</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Numara</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Kompozisyon</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ağırlık</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fabrics.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{f.name}</p>
                    <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{f.description}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 hidden sm:table-cell">{f.gauge}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 hidden md:table-cell">{f.composition}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 hidden lg:table-cell">{f.weight}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(f)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Edit">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(f.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Delete">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {fabrics.length === 0 && (
            <p className="px-5 py-12 text-center text-sm text-gray-400">Henüz kumaş türü yok</p>
          )}
        </div>
      </div>
    </>
  );
}
