'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminContext } from '../template';
import { getReferences, createReference, updateReference, deleteReference } from '@/lib/admin-store';
import type { AdminReference } from '@/types/admin';

export default function ReferencesPage() {
  const { toggleSidebar } = useAdminContext();
  const [refs, setRefs] = useState<AdminReference[]>([]);
  const [editing, setEditing] = useState<AdminReference | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [initials, setInitials] = useState('');
  const [country, setCountry] = useState('');
  const [logo, setLogo] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { setRefs(getReferences()); }, []);
  const refresh = () => setRefs(getReferences());

  const resetForm = () => { setName(''); setInitials(''); setCountry(''); setLogo(''); setWebsite(''); setDescription(''); setEditing(null); setShowForm(false); };
  const openNew = () => { resetForm(); setShowForm(true); };
  const openEdit = (r: AdminReference) => {
    setEditing(r); setName(r.name); setInitials(r.initials); setCountry(r.country);
    setLogo(r.logo || ''); setWebsite(r.website || ''); setDescription(r.description || '');
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateReference(editing.id, { name, initials, country, logo, website, description });
    } else {
      createReference({ name, initials, country, logo, website, description });
    }
    resetForm(); refresh();
  };

  const handleDelete = (id: string) => { if (confirm('Delete this reference?')) { deleteReference(id); refresh(); } };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setLogo(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const inputCls = 'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100';

  const grouped = refs.reduce<Record<string, AdminReference[]>>((acc, r) => {
    (acc[r.country] ??= []).push(r);
    return acc;
  }, {});

  return (
    <>
      <AdminHeader
        title="References"
        subtitle={`${refs.length} brand partners`}
        onMenuToggle={toggleSidebar}
        actions={
          <button onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Reference
          </button>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={resetForm}>
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{editing ? 'Edit Reference' : 'New Reference'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. NordMode" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Initials</label>
                    <input value={initials} onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 3))} className={inputCls} placeholder="NM" maxLength={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <input required value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls} placeholder="e.g. Sweden" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <input value={website} onChange={(e) => setWebsite(e.target.value)} className={inputCls} placeholder="https://www.example.com" type="url" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} placeholder="Brief description of the company..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <div className="flex items-center gap-3">
                    {logo && (
                      <div className="h-12 w-12 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo} alt="Logo" className="h-full w-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1 flex gap-2">
                      <input value={logo} onChange={(e) => setLogo(e.target.value)} className={inputCls} placeholder="Logo URL or upload..." />
                      <label className="shrink-0 cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center">
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={resetForm} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">{editing ? 'Save' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {refs.map((r) => (
            <div key={r.id} className="rounded-xl bg-white border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                {r.logo ? (
                  <div className="h-10 w-10 rounded-full bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.logo} alt={r.name} className="h-full w-full object-contain" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-sm font-bold shrink-0">
                    {r.initials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.country}</p>
                </div>
                <div className="flex gap-0.5 shrink-0">
                  <button onClick={() => openEdit(r)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              {(r.website || r.description) && (
                <div className="mt-3 pt-3 border-t border-gray-50 space-y-1">
                  {r.description && <p className="text-xs text-gray-500 line-clamp-2">{r.description}</p>}
                  {r.website && (
                    <a href={r.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 truncate block">
                      {r.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {refs.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No references yet</p>
            <button onClick={openNew} className="mt-2 text-sm text-blue-600 hover:text-blue-800">Add your first reference</button>
          </div>
        )}

        {/* Country summary */}
        {Object.keys(grouped).length > 0 && (
          <div className="rounded-xl bg-white border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">By Country</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(grouped).sort((a,b) => b[1].length - a[1].length).map(([c, list]) => (
                <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-xs text-gray-700">
                  {c}
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold">{list.length}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
