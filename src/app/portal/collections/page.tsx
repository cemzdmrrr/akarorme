'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { getModels } from '@/lib/admin-store';
import type { AdminModel } from '@/types/admin';

const seasons = ['All', 'SS25', 'FW25', 'SS26', 'FW26'];
const gauges = ['All', '5 GG', '7 GG', '12 GG', '14 GG', '18 GG', '20 GG', '24 GG', '28 GG'];

export default function PortalCollections() {
  const [models, setModels] = useState<AdminModel[]>([]);
  const [fabricTypes, setFabricTypes] = useState<string[]>([]);
  const [yarnTypes, setYarnTypes] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [season, setSeason] = useState('All');
  const [fabric, setFabric] = useState('All');
  const [gauge, setGauge] = useState('All');
  const [yarn, setYarn] = useState('All');

  useEffect(() => {
    const all = getModels().filter((m) => m.status === 'published');
    setModels(all);

    const fTypes = new Set(all.map((m) => m.fabricType).filter(Boolean));
    setFabricTypes(['All', ...Array.from(fTypes).sort()]);

    const yTypes = new Set(all.map((m) => m.yarnType).filter(Boolean));
    setYarnTypes(['All', ...Array.from(yTypes).sort()]);
  }, []);

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.tagline.toLowerCase().includes(search.toLowerCase())) return false;
      if (season !== 'All' && m.season !== season) return false;
      if (fabric !== 'All' && m.fabricType !== fabric) return false;
      if (gauge !== 'All' && m.gauge !== gauge) return false;
      if (yarn !== 'All' && m.yarnType !== yarn) return false;
      return true;
    });
  }, [models, search, season, fabric, gauge, yarn]);

  const selectClass = "rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3 py-2 text-sm text-brand-white focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/20";

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-white">Collection Catalog</h1>
        <p className="mt-1 text-sm text-brand-grey">Browse available models, review specifications, and open a conversation when something fits your collection.</p>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-brand-dark border border-brand-dark-3 p-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-brand-grey mb-1.5">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search models..."
              className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3 py-2 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-grey mb-1.5">Season</label>
            <select value={season} onChange={(e) => setSeason(e.target.value)} className={selectClass}>
              {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-grey mb-1.5">Fabric Type</label>
            <select value={fabric} onChange={(e) => setFabric(e.target.value)} className={selectClass}>
              {fabricTypes.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-grey mb-1.5">Gauge</label>
            <select value={gauge} onChange={(e) => setGauge(e.target.value)} className={selectClass}>
              {gauges.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-grey mb-1.5">Yarn Type</label>
            <select value={yarn} onChange={(e) => setYarn(e.target.value)} className={selectClass}>
              {yarnTypes.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-brand-grey">{filtered.length} model{filtered.length !== 1 ? 's' : ''} found</p>
          {(search || season !== 'All' || fabric !== 'All' || gauge !== 'All' || yarn !== 'All') && (
            <button onClick={() => { setSearch(''); setSeason('All'); setFabric('All'); setGauge('All'); setYarn('All'); }} className="text-xs text-brand-accent-light hover:underline">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl bg-brand-dark border border-brand-dark-3 p-12 text-center">
          <p className="text-brand-grey">No models match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((model) => (
            <Link
              key={model.id}
              href={`/portal/models/${model.id}`}
              className="group rounded-xl bg-brand-dark border border-brand-dark-3 overflow-hidden hover:border-brand-accent/30 transition-all hover:shadow-glow"
            >
              <div className="aspect-[4/3] bg-brand-dark-2 swatch-placeholder relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl text-brand-dark-4 opacity-30 font-display font-bold">{model.name.slice(0, 2)}</span>
                </div>
                {/* Season badge */}
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-brand-dark/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-brand-grey-light">{model.season}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-brand-white group-hover:text-brand-accent-light transition-colors">{model.name}</h3>
                <p className="text-xs text-brand-grey mt-0.5">{model.tagline}</p>
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
