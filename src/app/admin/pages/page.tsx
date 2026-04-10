'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminContext } from '../template';
import { getPages, updatePage } from '@/lib/admin-store';
import type { PageContent, PageSection } from '@/types/admin';

function genId() {
  return 'sec_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function PagesPage() {
  const { toggleSidebar } = useAdminContext();
  const [pages, setPages] = useState<PageContent[]>([]);
  const [activePage, setActivePage] = useState<PageContent | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addingSection, setAddingSection] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newType, setNewType] = useState<PageSection['type']>('text');

  const sortSec = (s: PageSection[]) => [...s].sort((a, b) => a.order - b.order);

  useEffect(() => {
    const p = getPages();
    setPages(p);
    if (p.length > 0) {
      setActivePage(p[0]);
      setSections(sortSec(p[0].sections));
    }
  }, []);

  const selectPage = (page: PageContent) => {
    setActivePage(page);
    setSections(sortSec(page.sections));
    setSaved(false);
    setAddingSection(false);
  };

  const updateField = (id: string, field: keyof PageSection, value: string | boolean | number) => {
    setSections((s) => s.map((sec) => (sec.id === id ? { ...sec, [field]: value } : sec)));
    setSaved(false);
  };

  const moveSection = useCallback((id: string, dir: 'up' | 'down') => {
    setSections((prev) => {
      const arr = [...prev].sort((a, b) => a.order - b.order);
      const idx = arr.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= arr.length) return prev;
      const tmpO = arr[idx].order;
      arr[idx] = { ...arr[idx], order: arr[swap].order };
      arr[swap] = { ...arr[swap], order: tmpO };
      return arr.sort((a, b) => a.order - b.order);
    });
    setSaved(false);
  }, []);

  const toggleVis = (id: string) => {
    setSections((s) => s.map((sec) => (sec.id === id ? { ...sec, visible: !sec.visible } : sec)));
    setSaved(false);
  };

  const removeSection = (id: string) => {
    if (!confirm('Bu bölümü kaldırmak istiyor musunuz?')) return;
    setSections((s) => s.filter((sec) => sec.id !== id));
    setSaved(false);
  };

  const addSection = () => {
    if (!newLabel.trim()) return;
    const maxOrder = sections.reduce((max, s) => Math.max(max, s.order), -1);
    setSections((prev) => [...prev, {
      id: genId(),
      key: newKey.trim() || newLabel.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
      label: newLabel.trim(),
      type: newType,
      content: '',
      visible: true,
      order: maxOrder + 1,
    }]);
    setNewLabel(''); setNewKey(''); setNewType('text'); setAddingSection(false);
    setSaved(false);
  };

  const handleSave = () => {
    if (!activePage) return;
    setSaving(true);
    updatePage(activePage.id, sections);
    const fresh = getPages();
    setPages(fresh);
    const up = fresh.find((p) => p.id === activePage.id);
    if (up) setActivePage(up);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }, 300);
  };

  const handleImageUpload = (sectionId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => { updateField(sectionId, 'content', e.target?.result as string); };
    reader.readAsDataURL(file);
  };

  const inputCls = 'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100';

  return (
    <>
      <AdminHeader
        title="Sayfalar"
        subtitle="Web sitesi sayfa içeriğini düzenleyin"
        onMenuToggle={toggleSidebar}
        actions={
          activePage && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                saved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {saving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : saved ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              )}
              {saved ? 'Kaydedildi!' : 'Değişiklikleri Kaydet'}
            </button>
          )
        }
      />

      <div className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Page tabs */}
          <div className="lg:w-48 shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => selectPage(page)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium text-left transition-colors ${
                    activePage?.id === page.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {page.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Editor */}
          {activePage && (
            <div className="flex-1 space-y-4 max-w-3xl">
              <div className="rounded-xl bg-white border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">{activePage.title}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">/{activePage.slug}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-400">
                      Güncellendi: {new Date(activePage.updatedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button onClick={() => setAddingSection(true)} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      Bölüm Ekle
                    </button>
                  </div>
                </div>

                {/* Add section form */}
                {addingSection && (
                  <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50/50 p-4 space-y-3">
                    <p className="text-sm font-medium text-gray-900">Yeni Bölüm</p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <input value={newLabel} onChange={(e) => { setNewLabel(e.target.value); setNewKey(e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')); }} placeholder="Etiket (ör. Hero Başlığı)" className={inputCls} />
                      <input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="Anahtar (ör. hero_baslik)" className={inputCls} />
                      <select value={newType} onChange={(e) => setNewType(e.target.value as PageSection['type'])} className={inputCls}>
                        <option value="text">Metin</option>
                        <option value="textarea">Metin Alanı</option>
                        <option value="image">Görsel</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setAddingSection(false)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">İptal</button>
                      <button onClick={addSection} disabled={!newLabel.trim()} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50">Ekle</button>
                    </div>
                  </div>
                )}

                {/* Sections list */}
                <div className="space-y-3">
                  {sections.map((section, idx) => (
                    <div key={section.id} className={`rounded-lg border p-4 transition-colors ${section.visible ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{section.label}</span>
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{section.key}</span>
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded capitalize">{section.type}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button onClick={() => moveSection(section.id, 'up')} disabled={idx === 0} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30" title="Move up">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                          </button>
                          <button onClick={() => moveSection(section.id, 'down')} disabled={idx === sections.length - 1} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30" title="Move down">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          </button>
                          <button onClick={() => toggleVis(section.id)} className={`rounded p-1 transition-colors ${section.visible ? 'text-gray-400 hover:bg-gray-100 hover:text-gray-600' : 'text-amber-500 hover:bg-amber-50'}`} title={section.visible ? 'Hide section' : 'Show section'}>
                            {section.visible ? (
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            ) : (
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            )}
                          </button>
                          <button onClick={() => removeSection(section.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500" title="Remove">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>

                      {section.type === 'image' ? (
                        <div className="space-y-2">
                          {section.content && (
                            <div className="relative w-40 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={section.content} alt={section.label} className="h-full w-full object-cover" />
                            </div>
                          )}
                          <div className="flex gap-2">
                            <input type="text" value={section.content} onChange={(e) => updateField(section.id, 'content', e.target.value)} placeholder="Image URL or upload..." className={inputCls} />
                            <label className="shrink-0 cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                              Upload
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(section.id, f); }} />
                            </label>
                          </div>
                        </div>
                      ) : section.type === 'textarea' ? (
                        <textarea rows={3} value={section.content} onChange={(e) => updateField(section.id, 'content', e.target.value)} className={`${inputCls} resize-y`} />
                      ) : (
                        <input type="text" value={section.content} onChange={(e) => updateField(section.id, 'content', e.target.value)} className={inputCls} />
                      )}
                    </div>
                  ))}
                </div>

                {sections.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-400">
                    No sections yet.{' '}<button onClick={() => setAddingSection(true)} className="text-blue-600 hover:text-blue-800">İlk bölümünüzü ekleyin</button>
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-400">
                  {sections.filter((s) => !s.visible).length > 0
                    ? `${sections.filter((s) => !s.visible).length} bölüm gizli — web sitesinde görünmeyecek.`
                    : 'Tüm bölümler görünür. Değişiklikler kaydedildikten sonra web sitesine yansıyacaktır.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
