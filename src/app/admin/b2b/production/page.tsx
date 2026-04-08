'use client';

import { useEffect, useState, useCallback } from 'react';
import { getProductionRequests, updateProductionStatus, updateProductionRequest, getClients, initializeB2BStore } from '@/lib/b2b-store';
import type { ProductionRequest, ProductionStatus, B2BClient } from '@/types/b2b';

const statusTabs: { label: string; value: ProductionStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Quoted', value: 'quoted' },
  { label: 'Approved', value: 'approved' },
  { label: 'In Production', value: 'in_production' },
  { label: 'Completed', value: 'completed' },
];

const statusColors: Record<ProductionStatus, string> = {
  submitted: 'bg-yellow-100 text-yellow-700',
  under_review: 'bg-orange-100 text-orange-700',
  quoted: 'bg-cyan-100 text-cyan-700',
  approved: 'bg-blue-100 text-blue-700',
  in_production: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
};

const nextStatus: Record<ProductionStatus, ProductionStatus | null> = {
  submitted: 'under_review',
  under_review: 'quoted',
  quoted: 'approved',
  approved: 'in_production',
  in_production: 'completed',
  completed: null,
};

export default function AdminB2BProduction() {
  const [orders, setOrders] = useState<ProductionRequest[]>([]);
  const [clients, setClients] = useState<B2BClient[]>([]);
  const [tab, setTab] = useState<ProductionStatus | 'all'>('all');
  const [selected, setSelected] = useState<ProductionRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');

  const load = useCallback(() => {
    initializeB2BStore();
    setOrders(getProductionRequests());
    setClients(getClients());
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (selected) {
      setAdminNotes(selected.adminResponse || '');
      setQuotedPrice(selected.quotedPrice?.toString() || '');
    }
  }, [selected]);

  const clientName = (clientId: string) => {
    const c = clients.find((cl) => cl.id === clientId);
    return c ? c.companyName : 'Unknown';
  };

  const filtered = orders.filter((o) => tab === 'all' || o.status === tab);

  const handleAdvanceStatus = (order: ProductionRequest) => {
    const next = nextStatus[order.status];
    if (next) {
      updateProductionStatus(order.id, next);
      load();
      if (selected?.id === order.id) {
        const updated = getProductionRequests().find((o) => o.id === order.id);
        if (updated) setSelected(updated);
      }
    }
  };

  const handleSaveNotes = () => {
    if (!selected) return;
    const updates: Partial<ProductionRequest> = { adminResponse: adminNotes };
    if (quotedPrice) updates.quotedPrice = quotedPrice;
    updateProductionRequest(selected.id, updates);
    load();
    const updated = getProductionRequests().find((o) => o.id === selected.id);
    if (updated) setSelected(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Production Orders</h1>
        <p className="mt-1 text-sm text-gray-500">Manage B2B production requests and orders.</p>
      </div>

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
              ({t.value === 'all' ? orders.length : orders.filter((o) => o.status === t.value).length})
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* List */}
        <div className="flex-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl bg-white border border-gray-200 p-8 text-center text-gray-400 text-sm">
              No production orders found.
            </div>
          ) : (
            filtered.map((o) => (
              <div
                key={o.id}
                onClick={() => setSelected(o)}
                className={`rounded-xl bg-white border p-4 cursor-pointer hover:shadow-sm transition-all ${
                  selected?.id === o.id ? 'border-blue-400 shadow-sm' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{o.modelName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{clientName(o.clientId)} · {o.estimatedQuantity} pcs · {o.preferredColor}</p>
                    <p className="text-xs text-gray-400 mt-1">Target: {new Date(o.targetDeliveryDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[o.status]}`}>
                      {o.status.replace(/_/g, ' ')}
                    </span>
                    {nextStatus[o.status] && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAdvanceStatus(o); }}
                        className="rounded-md bg-blue-50 px-2.5 py-1 text-xs text-blue-700 hover:bg-blue-100"
                        title={`Move to ${nextStatus[o.status]!.replace(/_/g, ' ')}`}
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
              <div><span className="text-gray-400">Quantity:</span><br /><span className="text-gray-700">{selected.estimatedQuantity} pcs</span></div>
              <div><span className="text-gray-400">Color:</span><br /><span className="text-gray-700">{selected.preferredColor}</span></div>
              <div><span className="text-gray-400">Yarn:</span><br /><span className="text-gray-700">{selected.preferredYarn}</span></div>
              <div><span className="text-gray-400">Target Delivery:</span><br /><span className="text-gray-700">{new Date(selected.targetDeliveryDate).toLocaleDateString()}</span></div>
              <div><span className="text-gray-400">Status:</span><br />
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[selected.status]}`}>
                  {selected.status.replace(/_/g, ' ')}
                </span>
              </div>
              {selected.quotedPrice && (
                <div className="col-span-2">
                  <span className="text-gray-400">Current Quote:</span><br />
                  <span className="text-lg font-bold text-green-600">€{selected.quotedPrice}/pc</span>
                </div>
              )}
            </div>
            {selected.notes && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Client Notes</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{selected.notes}</p>
              </div>
            )}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Quoted Price (€ per piece)</label>
              <input
                type="number"
                step="0.01"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                placeholder="e.g. 12.50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Admin Response / Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveNotes} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Save
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
