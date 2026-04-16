'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getModels } from '@/lib/admin-store';
import type { AdminModel } from '@/types/admin';

const ALL = 'Tümü';
const seasons = [ALL, 'SS25', 'FW25', 'SS26', 'FW26'];
const gauges = [ALL, '5 GG', '7 GG', '12 GG', '14 GG', '18 GG', '20 GG', '24 GG', '28 GG'];

export default function PortalCollections() {
  const [models, setModels] = useState<AdminModel[]>([]);
  const [fabricTypes, setFabricTypes] = useState<string[]>([]);
  const [yarnTypes, setYarnTypes] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [season, setSeason] = useState(ALL);
  const [fabric, setFabric] = useState(ALL);
  const [gauge, setGauge] = useState(ALL);
  const [yarn, setYarn] = useState(ALL);

  useEffect(() => {
    const all = getModels().filter((m) => m.status === 'published');
    setModels(all);

    const fTypes = new Set(all.map((m) => m.fabricType).filter(Boolean));
    setFabricTypes([ALL, ...Array.from(fTypes).sort()]);

    const yTypes = new Set(all.map((m) => m.yarnType).filter(Boolean));
    setYarnTypes([ALL, ...Array.from(yTypes).sort()]);
  }, []);

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.tagline.toLowerCase().includes(search.toLowerCase())) return false;
      if (season !== ALL && m.season !== season) return false;
      if (fabric !== ALL && m.fabricType !== fabric) return false;
      if (gauge !== ALL && m.gauge !== gauge) return false;
      if (yarn !== ALL && m.yarnType !== yarn) return false;
      return true;
    });
  }, [models, search, season, fabric, gauge, yarn]);

  const selectClass = 'rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3 py-2 text-sm text-brand-white focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/20';

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-white">Koleksiyon Kataloğu</h1>
        <p className="mt-1 text-sm text-brand-grey">
          Uygun modelleri inceleyin, teknik detayları değerlendirin ve koleksiyonunuza uyan ürünler için doğrudan iletişime geçin.
        </p>
      </div>

      <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1.5 block text-xs font-medium text-brand-grey">Ara</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Model ara..."
              className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3 py-2 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-grey">Sezon</label>
            <select value={season} onChange={(e) => setSeason(e.target.value)} className={selectClass}>
              {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-grey">Kumaş Türü</label>
            <select value={fabric} onChange={(e) => setFabric(e.target.value)} className={selectClass}>
              {fabricTypes.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-grey">Numara</label>
            <select value={gauge} onChange={(e) => setGauge(e.target.value)} className={selectClass}>
              {gauges.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brand-grey">İplik Türü</label>
            <select value={yarn} onChange={(e) => setYarn(e.target.value)} className={selectClass}>
              {yarnTypes.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-brand-grey">{filtered.length} model bulundu</p>
          {(search || season !== ALL || fabric !== ALL || gauge !== ALL || yarn !== ALL) && (
            <button
              onClick={() => {
                setSearch('');
                setSeason(ALL);
                setFabric(ALL);
                setGauge(ALL);
                setYarn(ALL);
              }}
              className="text-xs text-brand-accent-light hover:underline"
            >
              Filtreleri temizle
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-12 text-center">
          <p className="text-brand-grey">Filtrelerinize uygun model bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((model) => (
            <Link
              key={model.id}
              href={`/portal/models/${model.id}`}
              className="group overflow-hidden rounded-xl border border-brand-dark-3 bg-brand-dark transition-all hover:border-brand-accent/30 hover:shadow-glow"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-brand-dark-2 swatch-placeholder">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-4xl font-bold text-brand-dark-4 opacity-30">{model.name.slice(0, 2)}</span>
                </div>
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-brand-dark/80 px-2.5 py-1 text-[10px] font-medium text-brand-grey-light backdrop-blur-sm">
                    {model.season}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-brand-white transition-colors group-hover:text-brand-accent-light">{model.name}</h3>
                <p className="mt-0.5 text-xs text-brand-grey">{model.tagline}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-brand-dark-2 px-2 py-0.5 text-[10px] text-brand-grey">{model.gauge}</span>
                  <span className="rounded-full bg-brand-dark-2 px-2 py-0.5 text-[10px] text-brand-grey">{model.fabricType}</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  {model.colors.slice(0, 4).map((c) => (
                    <div key={c.hex} className="h-4 w-4 rounded-full border border-brand-dark-3" style={{ backgroundColor: c.hex }} title={c.name} />
                  ))}
                  {model.colors.length > 4 && <span className="text-[10px] text-brand-grey">+{model.colors.length - 4}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
