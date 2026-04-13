'use client';

import { useState, useCallback } from 'react';
import type { AdminModel } from '@/types/admin';

type ModelFormData = Omit<AdminModel, 'id' | 'slug' | 'createdAt' | 'updatedAt'>;

interface ModelFormProps {
  initial?: Partial<ModelFormData>;
  onSubmit: (data: ModelFormData) => void;
  submitLabel: string;
}

const TAG_OPTIONS = [
  { label: 'Erkek', value: 'men' },
  { label: 'Kadın', value: 'women' },
  { label: 'Kış', value: 'winter' },
  { label: 'Yaz', value: 'summer' },
  { label: 'İnce Örme', value: 'fine' },
  { label: 'Kalın Örme', value: 'heavy' },
];
const SEASONS = ['SS25', 'FW25', 'SS26', 'FW26'];
const YARN_TYPES = ['Pamuk', 'Yün', 'Viskon', 'Polyester', 'Karışım', 'İpek', 'Kaşmir', 'Keten'];

export default function ModelForm({ initial, onSubmit, submitLabel }: ModelFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [tagline, setTagline] = useState(initial?.tagline ?? '');
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
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
  const [coverImage, setCoverImage] = useState<string>(initial?.coverImage ?? '');
  const [colors, setColors] = useState<{ name: string; hex: string; image?: string; images?: string[] }[]>(
    (initial?.colors ?? [{ name: '', hex: '#C9A84C' }]).map(c => ({
      ...c,
      images: c.images ?? (c.image ? [c.image] : []),
    }))
  );
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [colorUploading, setColorUploading] = useState<number | null>(null);

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

  const addColor = () => setColors([...colors, { name: '', hex: '#000000', image: '', images: [] }]);
  const removeColor = (i: number) => setColors(colors.filter((_, idx) => idx !== i));
  const updateColor = (i: number, key: 'name' | 'hex' | 'image', val: string) => {
    const next = [...colors];
    next[i] = { ...next[i], [key]: val };
    setColors(next);
  };
  const addColorImage = (colorIdx: number, url: string) => {
    const next = [...colors];
    const imgs = next[colorIdx].images ?? [];
    if (!imgs.includes(url)) {
      next[colorIdx] = { ...next[colorIdx], images: [...imgs, url] };
      setColors(next);
    }
  };
  const removeColorImage = (colorIdx: number, imgIdx: number) => {
    const next = [...colors];
    const imgs = [...(next[colorIdx].images ?? [])];
    imgs.splice(imgIdx, 1);
    next[colorIdx] = { ...next[colorIdx], images: imgs, image: imgs[0] || '' };
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

    setUploading(true);
    const apiKey = getApiKey();

    for (const file of validFiles) {
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
        setImages((prev) => [...prev, url]);
      } catch {
        setUploadError('Görsel yüklenirken bir hata oluştu.');
      }
    }
    setUploading(false);
  }, []);

  const removeImage = (i: number) => {
    const removed = images[i];
    setImages(images.filter((_, idx) => idx !== i));
    // If removing the cover image, reset coverImage
    if (removed === coverImage) setCoverImage('');
  };

  // Upload images directly to a color
  const handleColorFiles = useCallback(async (colorIdx: number, files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    setColorUploading(colorIdx);
    const apiKey = getApiKey();

    for (const file of validFiles) {
      if (file.size > 10 * 1024 * 1024) continue;
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'x-api-key': apiKey },
          body: formData,
        });
        if (!res.ok) continue;
        const { url } = await res.json();
        // Add to both global images and color images
        setImages((prev) => prev.includes(url) ? prev : [...prev, url]);
        setColors((prev) => {
          const next = [...prev];
          const imgs = next[colorIdx].images ?? [];
          next[colorIdx] = { ...next[colorIdx], images: [...imgs, url] };
          return next;
        });
      } catch { /* skip */ }
    }
    setColorUploading(null);
  }, []);

  // Convert a base64 data URL to a File object
  const dataUrlToFile = (dataUrl: string, filename: string): File => {
    const [header, base64] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return new File([array], filename, { type: mime });
  };

  // Upload any remaining base64 images to blob before saving
  const migrateBase64Images = async (imgs: string[]): Promise<string[]> => {
    const apiKey = getApiKey();
    const migrated: string[] = [];

    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i];
      if (!img.startsWith('data:')) {
        migrated.push(img);
        continue;
      }
      // Upload base64 to blob
      try {
        const file = dataUrlToFile(img, `migrated-${Date.now()}-${i}.jpg`);
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'x-api-key': apiKey },
          body: formData,
        });
        if (res.ok) {
          const { url } = await res.json();
          migrated.push(url);
        } else {
          // Skip failed uploads
        }
      } catch {
        // Skip failed
      }
    }
    return migrated;
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Migrate any base64 images to blob URLs
    const finalImages = await migrateBase64Images(images);
    setImages(finalImages);

    // Migrate cover image if base64
    let finalCoverImage = coverImage;
    if (coverImage && coverImage.startsWith('data:')) {
      const migrated = await migrateBase64Images([coverImage]);
      finalCoverImage = migrated[0] || '';
    }

    // Also migrate color images
    const finalColors = await Promise.all(
      colors.filter((c) => c.name).map(async (c) => {
        const colorImgs = c.images ?? (c.image ? [c.image] : []);
        const migratedImgs = await migrateBase64Images(colorImgs);
        return { ...c, image: migratedImgs[0] || '', images: migratedImgs };
      })
    );

    setSubmitting(false);
    onSubmit({
      name,
      tagline,
      tags,
      collection,
      season: isCustomSeason ? customSeason : season,
      fabricType,
      yarnType,
      gauge,
      description,
      technicalDetails: specs.filter((s) => s.label && s.value),
      colors: finalColors,
      coverImage: finalCoverImage,
      images: finalImages,
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
          <div className="sm:col-span-3">
            <label className={labelCls}>Etiketler (Filtre)</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {TAG_OPTIONS.map((opt) => {
                const selected = tags.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setTags((prev) =>
                        selected ? prev.filter((t) => t !== opt.value) : [...prev, opt.value]
                      )
                    }
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                      selected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
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
        <div className="space-y-3">
          {colors.map((color, i) => (
            <div key={i} className="rounded-lg border border-gray-100 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input type="color" value={color.hex} onChange={(e) => updateColor(i, 'hex', e.target.value)} className="h-8 w-8 cursor-pointer rounded border-0" />
                <input type="text" value={color.name} onChange={(e) => updateColor(i, 'name', e.target.value)} className="flex-1 border-0 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none" placeholder="Renk adı" />
                <span className="text-xs text-gray-400 font-mono">{color.hex}</span>
                <button type="button" onClick={() => removeColor(i)} className="text-gray-400 hover:text-red-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {/* Color images */}
              <div className="pl-10 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 shrink-0">Görseller:</label>
                  <button
                    type="button"
                    onClick={() => document.getElementById(`color-images-${i}`)?.click()}
                    disabled={colorUploading === i}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                  >
                    {colorUploading === i ? 'Yükleniyor...' : '+ Görsel Yükle'}
                  </button>
                  <input
                    id={`color-images-${i}`}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => { handleColorFiles(i, e.target.files); e.target.value = ''; }}
                  />
                  {images.length > 0 && (
                    <select
                      value=""
                      onChange={(e) => { if (e.target.value) addColorImage(i, e.target.value); e.target.value = ''; }}
                      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
                    >
                      <option value="">Galeriden ekle...</option>
                      {images.filter(img => !(color.images ?? []).includes(img)).map((img, idx) => (
                        <option key={idx} value={img}>Görsel {images.indexOf(img) + 1}</option>
                      ))}
                    </select>
                  )}
                </div>
                {(color.images ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(color.images ?? []).map((img, imgIdx) => (
                      <div key={imgIdx} className="group relative h-14 w-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeColorImage(i, imgIdx)}
                          className="absolute top-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        {imgIdx === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-center text-[8px] font-medium text-white">Ana</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {(color.images ?? []).length === 0 && (
                  <span className="text-xs text-gray-400">Bu renge henüz görsel eklenmedi</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Images */}
      <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Görsel Galerisi</h3>
          <span className="text-xs text-gray-400">{images.length} görsel</span>
        </div>

        {uploadError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
            {uploadError}
          </div>
        )}

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
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP — maks. 10MB — sınırsız görsel</p>
            </>
          )}
          <input id="model-images" type="file" accept="image/*" multiple className="hidden" onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
        </div>

        {images.length > 0 && (
          <>
            {/* Cover image selection */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="text-xs font-medium text-blue-800 mb-2">Kapak Görseli Seçin</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCoverImage(img)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      coverImage === img ? 'border-blue-600 ring-2 ring-blue-300' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    {coverImage === img && (
                      <span className="absolute inset-0 flex items-center justify-center bg-blue-600/30">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {!coverImage && <p className="text-xs text-blue-600 mt-1">Seçilmezse ilk görsel kapak olarak kullanılır</p>}
            </div>

            {/* Gallery grid */}
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
                  {coverImage === img && (
                    <span className="absolute bottom-1 left-1 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium text-white">Kapak</span>
                  )}
                </div>
              ))}
            </div>
          </>
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
        <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60">
          {submitting ? 'Görseller işleniyor…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
