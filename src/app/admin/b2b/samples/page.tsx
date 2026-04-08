'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSampleRequests, updateSampleStatus, updateSampleRequest, getClients, initializeB2BStore } from '@/lib/b2b-store';
import type { SampleRequest, SampleStatus, B2BClient } from '@/types/b2b';

const statusTabs: { label: string; value: SampleStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Requested', value: 'requested' },
  { label: 'Approved', value: 'approved' },
  { label: 'In Production', value: 'in_production' },
  { label: 'Shipped', value: 'shipped' },
];

const statusColors: Record<SampleStatus, string> = {
  requested: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  in_production: 'bg-purple-100 text-purple-700',
  shipped: 'bg-green-100 text-green-700',
};

const nextStatus: Record<SampleStatus, SampleStatus | null> = {
  requested: 'approved',
  approved: 'in_production',
  in_production: 'shipped',
  shipped: null,
};

export default function AdminB2BSamples() {
  const [samples, setSamples] = useState<SampleRequest[]>([]);
  const [clients, setClients] = useState<B2BClient[]>([]);
  const [tab, setTab] = useState<SampleStatus | 'all'>('all');
  const [selected, setSelected] = useState<SampleRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const load = useCallback(() => {
    initializeB2BStore();
    setSamples(getSampleRequests());
    setClients(getClients());
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (selected) {
      setAdminNotes(selected.adminNotes || '');
      setTrackingNumber(selected.trackingNumber || '');
    }
  }, [selected]);

  const clientName = (clientId: string) => {
    const c = clients.find((cl) => cl.id === clientId);
    return c ? c.companyName : 'Unknown';
  };

  const filtered = samples.filter((s) => tab === 'all' || s.status === tab);

  const handleAdvanceStatus = (sample: SampleRequest) => {
    const next = nextStatus[sample.status];
    if (next) {
      updateSampleStatus(sample.id, next);
      load();
      if (selected?.id === sample.id) {
        const updated = getSampleRequests().find((s) => s.id === sample.id);
        if (updated) setSelected(updated);
      }
    }
  };

  const handleSaveNotes = () => {
    if (!selected) return;
    const updates: Partial<SampleRequest> = { adminNotes: adminNotes };
    if (trackingNumber) updates.trackingNumber = trackingNumber;
    updateSampleRequest(selected.id, updates);
    load();
    const updated = getSampleRequests().find((s) => s.id === selected.id);
    if (updated) setSelected(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sample Requests</h1>
        <p className="mt-1 text-sm text-gray-500">Manage B2B client sample requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((t) => (
          <button
            key={t.value}
            onClick={() => { setTab(t.value); setSelected(null); }}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              tab === t.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-[10px] opacity-75">
              ({t.value === 'all' ? samples.length : samples.filter((s) => s.status === t.value).length})
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* List */}
        <div className="flex-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl bg-white border border-gray-200 p-8 text-center text-gray-400 text-sm">
              No sample requests found.
            </div>
          ) : (
            filtered.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelected(s)}
                className={`rounded-xl bg-white border p-4 cursor-pointer hover:shadow-sm transition-all ${
                  selected?.id === s.id ? 'border-blue-400 shadow-sm' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.modelName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{clientName(s.clientId)} · {s.colorPreference}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(s.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[s.status]}`}>
                      {s.status.replace(/_/g, ' ')}
                    </span>
                    {nextStatus[s.status] && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAdvanceStatus(s); }}
                        className="rounded-md bg-blue-50 px-2.5 py-1 text-xs text-blue-700 hover:bg-blue-100"
                        title={`Move to ${nextStatus[s.status]!.replace(/_/g, ' ')}`}
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="hidden lg:block w-96 rounded-xl bg-white border border-gray-200 p-5 self-start sticky top-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">{selected.modelName}</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400">Client:</span><br /><span className="text-gray-700">{clientName(selected.clientId)}</span></div>
              <div><span className="text-gray-400">Color:</span><br /><span className="text-gray-700">{selected.colorPreference}</span></div>
              <div><span className="text-gray-400">Quantity:</span><br /><span className="text-gray-700">{selected.quantity}</span></div>
              <div><span className="text-gray-400">Status:</span><br />
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[selected.status]}`}>
                  {selected.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="col-span-2"><span className="text-gray-400">Requested:</span><br /><span className="text-gray-700">{new Date(selected.createdAt).toLocaleDateString()}</span></div>
            </div>
            {selected.notes && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Client Notes</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{selected.notes}</p>
              </div>
            )}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Admin Response / Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                placeholder="Enter tracking number"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveNotes} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Save Notes
              </button>
              {nextStatus[selected.status] && (
                <button onClick={() => handleAdvanceStatus(selected)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                  → {nextStatus[selected.status]!.replace(/_/g, ' ')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
