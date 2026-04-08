'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentClientId } from '@/lib/b2b-auth';
import { getSampleRequests } from '@/lib/b2b-store';
import type { SampleRequest, SampleStatus } from '@/types/b2b';

const statuses: { label: string; value: SampleStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Requested', value: 'requested' },
  { label: 'Approved', value: 'approved' },
  { label: 'In Production', value: 'in_production' },
  { label: 'Shipped', value: 'shipped' },
];

const statusConfig: Record<SampleStatus, { color: string; bg: string; icon: string }> = {
  requested: { color: 'text-yellow-400', bg: 'bg-yellow-500/15', icon: '◯' },
  approved: { color: 'text-blue-400', bg: 'bg-blue-500/15', icon: '✓' },
  in_production: { color: 'text-purple-400', bg: 'bg-purple-500/15', icon: '⚙' },
  shipped: { color: 'text-green-400', bg: 'bg-green-500/15', icon: '✈' },
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
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-white">Sample Requests</h1>
        <p className="mt-1 text-sm text-brand-grey">Track your sample requests and their delivery status.</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => { setFilter(s.value); setSelected(null); }}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              filter === s.value
                ? 'bg-brand-accent text-white'
                : 'bg-brand-dark border border-brand-dark-3 text-brand-grey hover:text-brand-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl bg-brand-dark border border-brand-dark-3 p-8 text-center">
              <p className="text-sm text-brand-grey">No sample requests found.</p>
              <Link href="/portal/collections" className="mt-3 inline-block text-xs text-brand-accent-light hover:underline">
                Browse collections →
              </Link>
            </div>
          ) : (
            filtered.map((s) => {
              const cfg = statusConfig[s.status];
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`w-full text-left rounded-xl bg-brand-dark border p-4 transition-colors ${
                    selected?.id === s.id ? 'border-brand-accent/40' : 'border-brand-dark-3 hover:border-brand-dark-4'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-brand-white">{s.modelName}</p>
                      <p className="text-xs text-brand-grey mt-0.5">Qty: {s.quantity} · {s.colorPreference}</p>
                    </div>
                    <span className={`rounded-full ${cfg.bg} px-2.5 py-0.5 text-[10px] font-medium ${cfg.color}`}>
                      {cfg.icon} {s.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[10px] text-brand-grey mt-2">{new Date(s.createdAt).toLocaleDateString()}</p>
                </button>
              );
            })
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="rounded-xl bg-brand-dark border border-brand-dark-3 p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-brand-white">{selected.modelName}</h2>
                  <p className="text-xs text-brand-grey">Request ID: {selected.id}</p>
                </div>
                <span className={`rounded-full ${statusConfig[selected.status].bg} px-3 py-1 text-xs font-medium ${statusConfig[selected.status].color}`}>
                  {selected.status.replace('_', ' ')}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <p className="text-xs font-medium text-brand-grey mb-3">Progress</p>
                <div className="flex items-center gap-1">
                  {stepOrder.map((step, i) => {
                    const currentIdx = stepOrder.indexOf(selected.status);
                    const done = i <= currentIdx;
                    return (
                      <div key={step} className="flex items-center flex-1">
                        <div className={`h-2 flex-1 rounded-full ${done ? 'bg-brand-accent' : 'bg-brand-dark-3'}`} />
                        <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] ml-0.5 ${
                          done ? 'bg-brand-accent text-white' : 'bg-brand-dark-3 text-brand-grey'
                        }`}>
                          {i + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  {stepOrder.map((step) => (
                    <span key={step} className="text-[9px] text-brand-grey capitalize">{step.replace('_', ' ')}</span>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] text-brand-grey uppercase tracking-wider">Color</p>
                  <p className="text-sm text-brand-white mt-0.5">{selected.colorPreference}</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] text-brand-grey uppercase tracking-wider">Quantity</p>
                  <p className="text-sm text-brand-white mt-0.5">{selected.quantity} pcs</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] text-brand-grey uppercase tracking-wider">Delivery Country</p>
                  <p className="text-sm text-brand-white mt-0.5">{selected.deliveryCountry}</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] text-brand-grey uppercase tracking-wider">Requested</p>
                  <p className="text-sm text-brand-white mt-0.5">{new Date(selected.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {selected.notes && (
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] text-brand-grey uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-brand-grey-light">{selected.notes}</p>
                </div>
              )}

              {selected.adminNotes && (
                <div className="rounded-lg bg-brand-accent/10 border border-brand-accent/20 p-3">
                  <p className="text-[10px] text-brand-accent-light uppercase tracking-wider mb-1">Admin Response</p>
                  <p className="text-sm text-brand-grey-light">{selected.adminNotes}</p>
                </div>
              )}

              {selected.trackingNumber && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                  <p className="text-[10px] text-green-400 uppercase tracking-wider mb-1">Tracking Number</p>
                  <p className="text-sm font-mono text-green-300">{selected.trackingNumber}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-brand-dark border border-brand-dark-3 p-12 text-center">
              <p className="text-brand-grey text-sm">Select a request to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
