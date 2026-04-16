'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentClientId } from '@/lib/b2b-auth';
import { getSampleRequests } from '@/lib/b2b-store';
import type { SampleRequest, SampleStatus } from '@/types/b2b';

const statuses: { label: string; value: SampleStatus | 'all' }[] = [
  { label: 'Tümü', value: 'all' },
  { label: 'Talep Edildi', value: 'requested' },
  { label: 'Onaylandı', value: 'approved' },
  { label: 'Üretimde', value: 'in_production' },
  { label: 'Sevk Edildi', value: 'shipped' },
];

const statusConfig: Record<SampleStatus, { color: string; bg: string; icon: string; label: string }> = {
  requested: { color: 'text-yellow-400', bg: 'bg-yellow-500/15', icon: '○', label: 'Talep edildi' },
  approved: { color: 'text-blue-400', bg: 'bg-blue-500/15', icon: '✓', label: 'Onaylandı' },
  in_production: { color: 'text-purple-400', bg: 'bg-purple-500/15', icon: '⚙', label: 'Üretimde' },
  shipped: { color: 'text-green-400', bg: 'bg-green-500/15', icon: '✈', label: 'Sevk edildi' },
};

const stepOrder: SampleStatus[] = ['requested', 'approved', 'in_production', 'shipped'];

export default function PortalSamples() {
  const [samples, setSamples] = useState<SampleRequest[]>([]);
  const [filter, setFilter] = useState<SampleStatus | 'all'>('all');
  const [selected, setSelected] = useState<SampleRequest | null>(null);

  useEffect(() => {
    const cid = getCurrentClientId();
    if (cid) setSamples(getSampleRequests(cid));
  }, []);

  const filtered = filter === 'all' ? samples : samples.filter((s) => s.status === filter);

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-white">Numune Talepleri</h1>
        <p className="mt-1 text-sm text-brand-grey">Numune taleplerinizi ve teslimat durumlarını buradan takip edebilirsiniz.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => {
              setFilter(s.value);
              setSelected(null);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              filter === s.value
                ? 'bg-brand-accent text-white'
                : 'border border-brand-dark-3 bg-brand-dark text-brand-grey hover:text-brand-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-8 text-center">
              <p className="text-sm text-brand-grey">Henüz numune talebi bulunmuyor.</p>
              <Link href="/portal/collections" className="mt-3 inline-block text-xs text-brand-accent-light hover:underline">
                Koleksiyonları incele
              </Link>
            </div>
          ) : (
            filtered.map((sample) => {
              const cfg = statusConfig[sample.status];
              return (
                <button
                  key={sample.id}
                  onClick={() => setSelected(sample)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    selected?.id === sample.id ? 'border-brand-accent/40' : 'border-brand-dark-3 bg-brand-dark hover:border-brand-dark-4'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-brand-white">{sample.modelName}</p>
                      <p className="mt-0.5 text-xs text-brand-grey">Adet: {sample.quantity} · {sample.colorPreference}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${cfg.bg} ${cfg.color}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] text-brand-grey">{new Date(sample.createdAt).toLocaleDateString()}</p>
                </button>
              );
            })
          )}
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="space-y-5 rounded-xl border border-brand-dark-3 bg-brand-dark p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-brand-white">{selected.modelName}</h2>
                  <p className="text-xs text-brand-grey">Talep No: {selected.id}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusConfig[selected.status].bg} ${statusConfig[selected.status].color}`}>
                  {statusConfig[selected.status].label}
                </span>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium text-brand-grey">İlerleme</p>
                <div className="flex items-center gap-1">
                  {stepOrder.map((step, i) => {
                    const currentIdx = stepOrder.indexOf(selected.status);
                    const done = i <= currentIdx;
                    return (
                      <div key={step} className="flex flex-1 items-center">
                        <div className={`h-2 flex-1 rounded-full ${done ? 'bg-brand-accent' : 'bg-brand-dark-3'}`} />
                        <div className={`ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] ${
                          done ? 'bg-brand-accent text-white' : 'bg-brand-dark-3 text-brand-grey'
                        }`}>
                          {i + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-1 flex justify-between">
                  {stepOrder.map((step) => (
                    <span key={step} className="text-[9px] text-brand-grey">
                      {statusConfig[step].label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Renk</p>
                  <p className="mt-0.5 text-sm text-brand-white">{selected.colorPreference}</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Adet</p>
                  <p className="mt-0.5 text-sm text-brand-white">{selected.quantity} adet</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Teslimat Ülkesi</p>
                  <p className="mt-0.5 text-sm text-brand-white">{selected.deliveryCountry}</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Talep Tarihi</p>
                  <p className="mt-0.5 text-sm text-brand-white">{new Date(selected.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {selected.notes && (
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-brand-grey">Notlarınız</p>
                  <p className="text-sm text-brand-grey-light">{selected.notes}</p>
                </div>
              )}

              {selected.adminNotes && (
                <div className="rounded-lg border border-brand-accent/20 bg-brand-accent/10 p-3">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-brand-accent-light">Admin Yanıtı</p>
                  <p className="text-sm text-brand-grey-light">{selected.adminNotes}</p>
                </div>
              )}

              {selected.trackingNumber && (
                <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-green-400">Takip Numarası</p>
                  <p className="font-mono text-sm text-green-300">{selected.trackingNumber}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-12 text-center">
              <p className="text-sm text-brand-grey">Detayları görmek için bir talep seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
