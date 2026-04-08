'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentClientId } from '@/lib/b2b-auth';
import { getProductionRequests } from '@/lib/b2b-store';
import type { ProductionRequest, ProductionStatus } from '@/types/b2b';

const statuses: { label: string; value: ProductionStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Quoted', value: 'quoted' },
  { label: 'Approved', value: 'approved' },
  { label: 'In Production', value: 'in_production' },
  { label: 'Completed', value: 'completed' },
];

const statusConfig: Record<ProductionStatus, { color: string; bg: string }> = {
  submitted: { color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  under_review: { color: 'text-orange-400', bg: 'bg-orange-500/15' },
  quoted: { color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
  approved: { color: 'text-blue-400', bg: 'bg-blue-500/15' },
  in_production: { color: 'text-purple-400', bg: 'bg-purple-500/15' },
  completed: { color: 'text-green-400', bg: 'bg-green-500/15' },
};

const stepOrder: ProductionStatus[] = ['submitted', 'under_review', 'quoted', 'approved', 'in_production', 'completed'];

export default function PortalProduction() {
  const [requests, setRequests] = useState<ProductionRequest[]>([]);
  const [filter, setFilter] = useState<ProductionStatus | 'all'>('all');
  const [selected, setSelected] = useState<ProductionRequest | null>(null);

  useEffect(() => {
    const cid = getCurrentClientId();
    if (cid) setRequests(getProductionRequests(cid));
  }, []);

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-white">Production Requests</h1>
        <p className="mt-1 text-sm text-brand-grey">Track your production orders and review quotations.</p>
      </div>

      {/* Status Tabs */}
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
              <p className="text-sm text-brand-grey">No production requests found.</p>
              <Link href="/portal/collections" className="mt-3 inline-block text-xs text-brand-accent-light hover:underline">Browse collections →</Link>
            </div>
          ) : (
            filtered.map((r) => {
              const cfg = statusConfig[r.status];
              return (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`w-full text-left rounded-xl bg-brand-dark border p-4 transition-colors ${
                    selected?.id === r.id ? 'border-brand-accent/40' : 'border-brand-dark-3 hover:border-brand-dark-4'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-brand-white">{r.modelName}</p>
                      <p className="text-xs text-brand-grey mt-0.5">{r.estimatedQuantity.toLocaleString()} pcs · {r.preferredColor}</p>
                    </div>
                    <span className={`rounded-full ${cfg.bg} px-2.5 py-0.5 text-[10px] font-medium ${cfg.color}`}>
                      {r.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[10px] text-brand-grey mt-2">Target: {new Date(r.targetDeliveryDate).toLocaleDateString()}</p>
                </button>
              );
            })
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="rounded-xl bg-brand-dark border border-brand-dark-3 p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-brand-white">{selected.modelName}</h2>
                  <p className="text-xs text-brand-grey">Request ID: {selected.id}</p>
                </div>
                <span className={`rounded-full ${statusConfig[selected.status].bg} px-3 py-1 text-xs font-medium ${statusConfig[selected.status].color}`}>
                  {selected.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Progress */}
              <div>
                <p className="text-xs font-medium text-brand-grey mb-3">Progress</p>
                <div className="flex items-center gap-0.5">
                  {stepOrder.map((step, i) => {
                    const idx = stepOrder.indexOf(selected.status);
                    const done = i <= idx;
                    return (
                      <div key={step} className={`h-1.5 flex-1 rounded-full ${done ? 'bg-brand-accent' : 'bg-brand-dark-3'}`} />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  {stepOrder.map((step) => (
                    <span key={step} className="text-[8px] text-brand-grey capitalize">{step.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] text-brand-grey uppercase tracking-wider">Quantity</p>
                  <p className="text-sm text-brand-white mt-0.5">{selected.estimatedQuantity.toLocaleString()} pcs</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] text-brand-grey uppercase tracking-wider">Preferred Yarn</p>
                  <p className="text-sm text-brand-white mt-0.5">{selected.preferredYarn}</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] text-brand-grey uppercase tracking-wider">Preferred Color</p>
                  <p className="text-sm text-brand-white mt-0.5">{selected.preferredColor}</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] text-brand-grey uppercase tracking-wider">Target Delivery</p>
                  <p className="text-sm text-brand-white mt-0.5">{new Date(selected.targetDeliveryDate).toLocaleDateString()}</p>
                </div>
              </div>

              {selected.notes && (
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] text-brand-grey uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-brand-grey-light">{selected.notes}</p>
                </div>
              )}

              {selected.quotedPrice && (
                <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-4">
                  <p className="text-[10px] text-cyan-400 uppercase tracking-wider mb-1">Quoted Price</p>
                  <p className="text-lg font-semibold text-cyan-300">{selected.quotedPrice}</p>
                </div>
              )}

              {selected.adminResponse && (
                <div className="rounded-lg bg-brand-accent/10 border border-brand-accent/20 p-3">
                  <p className="text-[10px] text-brand-accent-light uppercase tracking-wider mb-1">Admin Response</p>
                  <p className="text-sm text-brand-grey-light">{selected.adminResponse}</p>
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
