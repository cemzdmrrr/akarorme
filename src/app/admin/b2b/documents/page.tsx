'use client';

import { useEffect, useState, useCallback } from 'react';
import { getDocuments, createDocument, deleteDocument, getClients, initializeB2BStore } from '@/lib/b2b-store';
import type { B2BDocument, DocumentCategory, B2BClient } from '@/types/b2b';

const categories: DocumentCategory[] = ['technical_sheet', 'fabric_detail', 'catalog', 'price_list', 'other'];

const categoryLabels: Record<DocumentCategory, string> = {
  technical_sheet: 'Technical Sheet',
  fabric_detail: 'Fabric Detail',
  catalog: 'Catalog',
  price_list: 'Price List',
  other: 'Other',
};

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

export default function AdminB2BDocuments() {
  const [docs, setDocs] = useState<B2BDocument[]>([]);
  const [clients, setClients] = useState<B2BClient[]>([]);
  const [filter, setFilter] = useState<DocumentCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', category: 'technical_sheet' as DocumentCategory,
    fileUrl: '', fileSize: '1024', visibility: 'all_clients' as 'all_clients' | 'specific',
    allowedClientId: '',
  });
  const [confirmDelete, setConfirmDelete] = useState<B2BDocument | null>(null);

  const load = useCallback(() => {
    initializeB2BStore();
    setDocs(getDocuments());
    setClients(getClients().filter((c) => c.status === 'approved'));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = docs.filter((d) => filter === 'all' || d.category === filter);

  const handleCreate = () => {
    if (!form.name.trim()) return;
    createDocument({
      name: form.name,
      description: form.description,
      category: form.category,
      fileUrl: form.fileUrl || `/documents/${form.name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      fileSize: parseInt(form.fileSize) || 1024,
      fileType: 'application/pdf',
      uploadedBy: 'admin',
      visibility: form.visibility,
      allowedClientIds: form.visibility === 'specific' && form.allowedClientId ? [form.allowedClientId] : undefined,
    });
    setShowForm(false);
    setForm({ name: '', description: '', category: 'technical_sheet', fileUrl: '', fileSize: '1024', visibility: 'all_clients', allowedClientId: '' });
    load();
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    deleteDocument(confirmDelete.id);
    setConfirmDelete(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">B2B Documents</h1>
          <p className="mt-1 text-sm text-gray-500">Share documents with B2B clients.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Document'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">New Document</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Document Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none" placeholder="e.g. SS25 Catalog" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as DocumentCategory })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none">
                {categories.map((c) => <option key={c} value={c}>{categoryLabels[c]}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 block mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">File URL (simulated)</label>
              <input type="text" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none" placeholder="/documents/file.pdf" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Visible To</label>
              <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as 'all_clients' | 'specific' })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none">
                <option value="all_clients">All Approved Clients</option>
                <option value="specific">Specific Client</option>
              </select>
            </div>
            {form.visibility === 'specific' && (
              <div>
                <label className="text-xs text-gray-500 block mb-1">Select Client</label>
                <select value={form.allowedClientId} onChange={(e) => setForm({ ...form, allowedClientId: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none">
                  <option value="">Select...</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                </select>
              </div>
            )}
          </div>
          <button onClick={handleCreate} disabled={!form.name.trim()}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            Create Document
          </button>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          All ({docs.length})
        </button>
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${filter === c ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {categoryLabels[c]} ({docs.filter((d) => d.category === c).length})
          </button>
        ))}
      </div>

      {/* Document Table */}
      <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Document</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Size</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Created</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{categoryIcons[doc.category]}</span>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-xs">{doc.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-gray-600 capitalize">{doc.category.replace(/_/g, ' ')}</td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-500">{formatSize(doc.fileSize)}</td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setConfirmDelete(doc)}
                    className="rounded-md bg-red-50 px-2.5 py-1 text-xs text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No documents found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Delete Document</h3>
            <p className="text-sm text-gray-500 mb-4">Delete &quot;{confirmDelete.name}&quot;? This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
