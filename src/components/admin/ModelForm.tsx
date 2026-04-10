'use client';

import { useState, useCallback } from 'react';
import type { AdminModel } from '@/types/admin';

type ModelFormData = Omit<AdminModel, 'id' | 'slug' | 'createdAt' | 'updatedAt'>;

interface ModelFormProps {
  initial?: Partial<ModelFormData>;
  onSubmit: (data: ModelFormData) => void;
  submitLabel: string;
}

const CATEGORIES = ['T-Shirt', 'Polo', 'Sweatshirt', 'Hırka', 'Kazak', 'Yelek', 'Ceket', 'Pantolon', 'Diğer'];
const SEASONS = ['SS25', 'FW25', 'SS26', 'FW26'];
const YARN_TYPES = ['Pamuk', 'Yün', 'Viskon', 'Polyester', 'Karışım', 'İpek', 'Kaşmir', 'Keten'];

export default function ModelForm({ initial, onSubmit, submitLabel }: ModelFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [tagline, setTagline] = useState(initial?.tagline ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [collection, setCollection] = useState(initial?.collection ?? '');
  const [season, setSeason] = useState(initial?.season ?? 'SS26');
  const [customSeason, setCustomSeason] = useState('');
  const [isCustomSeason, setIsCustomSeason] = useState(initial?.season ? !SEASONS.includes(initial.season) : false);
  const [fabricType, setFabricType] = useState(initial?.fabricType ?? '');
  const [yarnType, setYarnType] = useState(initial?.yarnType ?? 'Pamuk');
  const [gauge, setGauge] = useState(initial?.gauge ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [status, setStatus] = useState<'published' | 'draft'>(initial?.status ?? 'draft');
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(initial?.technicalDetails ?? [{ label: '', value: '' }]);
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(initial?.colors ?? [{ name: '', hex: '#C9A84C' }]);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const MAX_IMAGES = 5;

  // Initialize custom season if initial value is not in SEASONS
  useState(() => {
    if (initial?.season && !SEASONS.includes(initial.season)) {
      setCustomSeason(initial.season);
      setIsCustomSeason(true);
    }
  });

  const addSpec = () => setSpecs([...specs, { label: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, key: 'label' | 'value', val: string) => {
    const next = [...specs];
    next[i] = { ...next[i], [key]: val };
    setSpecs(next);
  };

  const addColor = () => setColors([...colors, { name: '', hex: '#000000' }]);
  const removeColor = (i: number) => setColors(colors.filter((_, idx) => idx !== i));
  const updateColor = (i: number, key: 'name' | 'hex', val: string) => {
    const next = [...colors];
    next[i] = { ...next[i], [key]: val };
    setColors(next);
  };

  const getApiKey = () => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('admin_api_key') || '';
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    setUploadError('');

    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    // Check max images limit
    setImages((prev) => {
      const remaining = MAX_IMAGES - prev.length;
      if (remaining <= 0) {
        setUploadError(`En fazla ${MAX_IMAGES} görsel ekleyebilirsiniz.`);
        return prev;
      }
      if (validFiles.length > remaining) {
        setUploadError(`En fazla ${remaining} görsel daha ekleyebilirsiniz.`);
      }
      return prev;
    });

    setUploading(true);
    const apiKey = getApiKey();

    for (const file of validFiles) {
      // Re-check limit before each upload
      const currentCount = await new Promise<number>((resolve) => {
        setImages((prev) => { resolve(prev.length); return prev; });
      });
      if (currentCount >= MAX_IMAGES) break;

      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`"${file.name}" çok büyük (maks. 10MB).`);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'x-api-key': apiKey },
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Yükleme hatası' }));
          setUploadError(err.error || 'Görsel yüklenemedi.');
          continue;
        }

        const { url } = await res.json();
        setImages((prev) => (prev.length < MAX_IMAGES ? [...prev, url] : prev));
      } catch {
        setUploadError('Görsel yüklenirken bir hata oluştu.');
      }
    }
    setUploading(false);
  }, []);

  const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      tagline,
      category,
      collection,
      season: isCustomSeason ? customSeason : season,
      fabricType,
      yarnType,
      gauge,
      description,
      technicalDetails: specs.filter((s) => s.label && s.value),
      colors: colors.filter((c) => c.name),
      images,
      status,
      featured,
    });
  };

  const inputCls = 'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">Temel Bilgiler</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Model Adı *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="ör. Klasik Polo" />
          </div>
          <div>
            <label className={labelCls}>Alt Başlık</label>
            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputCls} placeholder="ör. %100 Pamuk Pike" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Kategori</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              <option value="">Kategori seçin</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Koleksiyon</label>
            <input type="text" value={collection} onChange={(e) => setCollection(e.target.value)} className={inputCls} placeholder="ör. Yaz Koleksiyonu" />
          </div>
          <div>
            <label className={labelCls}>Sezon</label>
            {isCustomSeason ? (
              <div className="flex gap-2">
                <input type="text" value={customSeason} onChange={(e) => setCustomSeason(e.target.value)} className={inputCls} placeholder="ör. SS27" />
                <button type="button" onClick={() => { setIsCustomSeason(false); setSeason('SS26'); setCustomSeason(''); }} className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                  Listeden Seç
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select value={season} onChange={(e) => setSeason(e.target.value)} className={inputCls}>
                  {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="button" onClick={() => setIsCustomSeason(true)} className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                  Yeni Sezon
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className={labelCls}>Açıklama</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} placeholder="Modelin detaylı açıklaması..." />
        </div>
      </section>

      {/* Technical */}
      <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">Teknik Detaylar</h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Kumaş Türü</label>
            <input type="text" value={fabricType} onChange={(e) => setFabricType(e.target.value)} className={inputCls} placeholder="ör. Süprem" />
          </div>
          <div>
            <label className={labelCls}>İplik Türü</label>
            <select value={yarnType} onChange={(e) => setYarnType(e.target.value)} className={inputCls}>
              {YARN_TYPES.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Numara (Gauge)</label>
            <input type="text" value={gauge} onChange={(e) => setGauge(e.target.value)} className={inputCls} placeholder="ör. 14 GG" />
          </div>
        </div>

        {/* Specs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Özellikler</label>
            <button type="button" onClick={addSpec} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Ekle</button>
          </div>
          <div className="space-y-2">
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="text" value={spec.label} onChange={(e) => updateSpec(i, 'label', e.target.value)} className={inputCls} placeholder="Etiket" />
                <input type="text" value={spec.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} className={inputCls} placeholder="Değer" />
                <button type="button" onClick={() => removeSpec(i)} className="shrink-0 rounded-lg p-2 text-gray-400 hover:text-red-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Renk Seçenekleri</h3>
          <button type="button" onClick={addColor} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Renk Ekle</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {colors.map((color, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-gray-100 p-2.5">
              <input type="color" value={color.hex} onChange={(e) => updateColor(i, 'hex', e.target.value)} className="h-8 w-8 cursor-pointer rounded border-0" />
              <input type="text" value={color.name} onChange={(e) => updateColor(i, 'name', e.target.value)} className="flex-1 border-0 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none" placeholder="Renk adı" />
              <span className="text-xs text-gray-400 font-mono">{color.hex}</span>
              <button type="button" onClick={() => removeColor(i)} className="text-gray-400 hover:text-red-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Images */}
      <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Görsel Galerisi</h3>
          <span className="text-xs text-gray-400">{images.length} / {MAX_IMAGES}</span>
        </div>

        {uploadError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
            {uploadError}
          </div>
        )}

        {images.length < MAX_IMAGES && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            className={`flex flex-col items-center rounded-xl border-2 border-dashed p-8 transition-colors ${
              uploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'
            } ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => !uploading && document.getElementById('model-images')?.click()}
          >
            {uploading ? (
              <>
                <svg className="h-8 w-8 animate-spin text-blue-500 mb-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-gray-500">Yükleniyor...</p>
              </>
            ) : (
              <>
                <svg className="h-10 w-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">Görselleri sürükleyip bırakın veya <span className="text-blue-600 font-medium">gözatın</span></p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP — maks. 10MB — en fazla {MAX_IMAGES} görsel</p>
              </>
            )}
            <input id="model-images" type="file" accept="image/*" multiple className="hidden" onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
          </div>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((img, i) => (
              <div key={i} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Görsel ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium text-white">Kapak</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Publishing */}
      <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">Yayın Ayarları</h3>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" checked={status === 'published'} onChange={(e) => setStatus(e.target.checked ? 'published' : 'draft')} className="sr-only peer" />
              <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors" />
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </div>
            <span className="text-sm text-gray-700">Yayında</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="sr-only peer" />
              <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-amber-500 transition-colors" />
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </div>
            <span className="text-sm text-gray-700">Ana Sayfada Öne Çıkan</span>
          </label>
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <button type="button" onClick={() => history.back()} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">İptal</button>
        <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">{submitLabel}</button>
      </div>
    </form>
  );
}
