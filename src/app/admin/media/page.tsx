'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminContext } from '../template';
import { getMediaItems, getMediaFolders, addMediaItem, updateMediaItem, deleteMediaItem } from '@/lib/admin-store';
import type { MediaItem } from '@/types/admin';

export default function MediaPage() {
  const { toggleSidebar } = useAdminContext();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState('');
  const [editFolder, setEditFolder] = useState('');

  useEffect(() => { refresh(); }, []);

  const refresh = () => {
    setItems(getMediaItems());
    setFolders(getMediaFolders());
  };

  const filtered = items
    .filter((i) => activeFolder === 'all' || i.folder === activeFolder)
    .filter((i) => !search || i.name.toLowerCase().includes(search.toLowerCase()) || (i.alt || '').toLowerCase().includes(search.toLowerCase()));

  const handleFiles = useCallback((files: FileList | null, folder?: string) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          addMediaItem({ name: file.name, url, type: file.type, size: file.size, width: img.width, height: img.height, folder: folder || activeFolder === 'all' ? 'general' : activeFolder });
          refresh();
        };
        img.onerror = () => {
          addMediaItem({ name: file.name, url, type: file.type, size: file.size, folder: folder || activeFolder === 'all' ? 'general' : activeFolder });
          refresh();
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    });
  }, [activeFolder]);

  const handleDelete = (id: string) => {
    if (confirm('Delete this file?')) { deleteMediaItem(id); setSelected(null); refresh(); }
  };

  const handleSaveDetail = () => {
    if (!selected) return;
    updateMediaItem(selected, { alt: editAlt, folder: editFolder });
    refresh();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const selectedItem = items.find((i) => i.id === selected);

  useEffect(() => {
    if (selectedItem) { setEditAlt(selectedItem.alt || ''); setEditFolder(selectedItem.folder || 'general'); }
  }, [selectedItem]);

  return (
    <>
      <AdminHeader
        title="Media Library"
        subtitle={`${filtered.length} file${filtered.length !== 1 ? 's' : ''}${activeFolder !== 'all' ? ` in ${activeFolder}` : ''}`}
        onMenuToggle={toggleSidebar}
        actions={
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex rounded-lg border border-gray-200 overflow-hidden">
              <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              </button>
            </div>
            <button onClick={() => document.getElementById('media-upload')?.click()} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Upload
            </button>
            <input id="media-upload" type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </div>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Search + Folders bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            <button onClick={() => setActiveFolder('all')} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors ${activeFolder === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>All</button>
            {folders.map((f) => (
              <button key={f} onClick={() => setActiveFolder(f)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors ${activeFolder === f ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>{f}</button>
            ))}
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          className={`flex flex-col items-center rounded-xl border-2 border-dashed p-8 transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
        >
          <svg className="h-10 w-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          <p className="text-sm text-gray-500">Drag & drop files here, or <button onClick={() => document.getElementById('media-upload')?.click()} className="text-blue-600 font-medium">browse</button></p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 10MB</p>
        </div>

        <div className="flex gap-6">
          {/* Grid/List */}
          <div className="flex-1">
            {view === 'grid' ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {filtered.map((item) => (
                  <button key={item.id} onClick={() => setSelected(item.id)} className={`group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 transition-colors ${selected === item.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'}`}>
                    {item.url.startsWith('data:image') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.alt || item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-[10px] text-gray-400 p-1 text-center">{item.name}</div>
                    )}
                    {item.folder && item.folder !== 'general' && (
                      <span className="absolute top-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-[9px] text-white capitalize">{item.folder}</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-white border border-gray-200 divide-y divide-gray-50">
                {filtered.map((item) => (
                  <button key={item.id} onClick={() => setSelected(item.id)} className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${selected === item.id ? 'bg-blue-50' : ''}`}>
                    <div className="h-10 w-10 rounded bg-gray-100 shrink-0 overflow-hidden">
                      {item.url.startsWith('data:image') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.url} alt={item.alt || item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gray-200" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{formatSize(item.size)} {item.width && `· ${item.width}×${item.height}`} {item.folder && `· ${item.folder}`}</p>
                    </div>
                    <p className="text-xs text-gray-400 shrink-0">{new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                  </button>
                ))}
              </div>
            )}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-sm">{search ? 'No files match your search' : 'No media files yet'}</p>
                <p className="text-xs mt-1">Upload images to get started</p>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          {selectedItem && (
            <div className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-4 rounded-xl bg-white border border-gray-200 overflow-hidden">
                <div className="aspect-video bg-gray-100">
                  {selectedItem.url.startsWith('data:image') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selectedItem.url} alt={selectedItem.alt || selectedItem.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">Preview</div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm font-medium text-gray-900 break-all">{selectedItem.name}</p>
                  <div className="space-y-1.5 text-xs text-gray-500">
                    <p>Type: {selectedItem.type}</p>
                    <p>Size: {formatSize(selectedItem.size)}</p>
                    {selectedItem.width && <p>Dimensions: {selectedItem.width} × {selectedItem.height}px</p>}
                    <p>Uploaded: {new Date(selectedItem.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  {/* Editable fields */}
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Alt Text</label>
                      <input value={editAlt} onChange={(e) => setEditAlt(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-blue-400 focus:outline-none" placeholder="Describe image..." />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Folder</label>
                      <input value={editFolder} onChange={(e) => setEditFolder(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-blue-400 focus:outline-none" placeholder="general" />
                    </div>
                    <button onClick={handleSaveDetail} className="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">Save Details</button>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => handleDelete(selectedItem.id)} className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
