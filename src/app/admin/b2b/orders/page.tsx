'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getClients, getOrders, initializeB2BStore, updateOrder, updateOrderStatus } from '@/lib/b2b-store';
import type { B2BClient, B2BOrder, OrderStatus } from '@/types/b2b';

const orderTabs: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'In Production', value: 'in_production' },
  { label: 'Quality Control', value: 'quality_control' },
  { label: 'Ready to Ship', value: 'ready_to_ship' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Completed', value: 'completed' },
];

const orderColors: Record<OrderStatus, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  in_production: 'bg-purple-100 text-purple-700',
  quality_control: 'bg-orange-100 text-orange-700',
  ready_to_ship: 'bg-cyan-100 text-cyan-700',
  shipped: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-green-100 text-green-700',
};

const nextOrderStatus: Record<OrderStatus, OrderStatus | null> = {
  confirmed: 'in_production',
  in_production: 'quality_control',
  quality_control: 'ready_to_ship',
  ready_to_ship: 'shipped',
  shipped: 'completed',
  completed: null,
};

export default function AdminB2BOrders() {
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [clients, setClients] = useState<B2BClient[]>([]);
  const [tab, setTab] = useState<OrderStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [latestUpdate, setLatestUpdate] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedShipDate, setEstimatedShipDate] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = useCallback(async () => {
    await initializeB2BStore();
    setOrders(getOrders());
    setClients(getClients());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = useMemo(
    () => orders.find((order) => order.id === selectedId) ?? null,
    [orders, selectedId],
  );

  useEffect(() => {
    if (!selected) {
      setAdminNotes('');
      setLatestUpdate('');
      setTrackingNumber('');
      setEstimatedShipDate('');
      setProgressPercent(0);
      return;
    }

    setAdminNotes(selected.adminNotes || '');
    setLatestUpdate(selected.latestUpdate || '');
    setTrackingNumber(selected.trackingNumber || '');
    setEstimatedShipDate(selected.estimatedShipDate || '');
    setProgressPercent(selected.progressPercent);
  }, [selected]);

  const filtered = orders.filter((order) => tab === 'all' || order.status === tab);

  const getClientName = (clientId: string) =>
    clients.find((client) => client.id === clientId)?.companyName || 'Unknown client';

  const refreshSelection = async (orderId: string) => {
    await load();
    setSelectedId(orderId);
  };

  const handleSave = async () => {
    if (!selected) return;

    updateOrder(selected.id, {
      adminNotes: adminNotes.trim() || undefined,
      latestUpdate: latestUpdate.trim() || undefined,
      trackingNumber: trackingNumber.trim() || undefined,
      estimatedShipDate: estimatedShipDate || undefined,
      progressPercent: Math.max(0, Math.min(100, progressPercent)),
    });
    setFeedback('Order details saved.');
    await refreshSelection(selected.id);
  };

  const handleAdvance = async () => {
    if (!selected) return;

    const targetStatus = nextOrderStatus[selected.status];
    if (!targetStatus) return;

    updateOrderStatus(
      selected.id,
      targetStatus,
      latestUpdate.trim() || adminNotes.trim() || undefined,
      trackingNumber.trim() || undefined,
    );
    setFeedback(`Order moved to ${targetStatus.replace(/_/g, ' ')}.`);
    await refreshSelection(selected.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track approved jobs after they move into production, shipment, and completion.
        </p>
      </div>

      {feedback && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{feedback}</div>}

      <div className="flex flex-wrap gap-2">
        {orderTabs.map((item) => (
          <button
            key={item.value}
            onClick={() => {
              setTab(item.value);
              setSelectedId(null);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              tab === item.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {item.label}
            <span className="ml-1.5 text-[10px] opacity-75">
              ({item.value === 'all' ? orders.length : orders.filter((order) => order.status === item.value).length})
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
              No active orders found.
            </div>
          ) : (
            filtered.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setSelectedId(order.id)}
                className={`w-full rounded-xl border bg-white p-4 text-left transition-all hover:shadow-sm ${
                  selectedId === order.id ? 'border-blue-400 shadow-sm' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{order.modelName}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {getClientName(order.clientId)} · {order.orderNumber}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {order.quantity.toLocaleString()} pcs · target {new Date(order.targetDeliveryDate).toLocaleDateString()}
                    </p>
                    <div className="mt-3">
                      <div className="h-2 rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${order.progressPercent}%` }} />
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500">{order.progressPercent}% complete</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${orderColors[order.status]}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {selected && (
          <div className="hidden w-96 self-start rounded-xl border border-gray-200 bg-white p-5 lg:block">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">{selected.orderNumber}</h2>
                  <p className="mt-1 text-xs text-gray-400">{selected.modelName}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${orderColors[selected.status]}`}>
                  {selected.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-500">Production progress</p>
                  <span className="text-sm font-semibold text-gray-900">{progressPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressPercent}
                  onChange={(event) => setProgressPercent(Number(event.target.value))}
                  className="mt-3 w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">Client</span>
                  <p className="mt-1 text-gray-700">{getClientName(selected.clientId)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Quantity</span>
                  <p className="mt-1 text-gray-700">{selected.quantity.toLocaleString()} pcs</p>
                </div>
                <div>
                  <span className="text-gray-400">Color</span>
                  <p className="mt-1 text-gray-700">{selected.colorDetails}</p>
                </div>
                <div>
                  <span className="text-gray-400">Yarn</span>
                  <p className="mt-1 text-gray-700">{selected.yarnDetails}</p>
                </div>
                <div>
                  <span className="text-gray-400">Target delivery</span>
                  <p className="mt-1 text-gray-700">{new Date(selected.targetDeliveryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Estimated ship</span>
                  <p className="mt-1 text-gray-700">
                    {selected.estimatedShipDate ? new Date(selected.estimatedShipDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
              </div>

              {selected.quotedPrice && (
                <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-3">
                  <p className="text-xs text-cyan-700">Quoted price</p>
                  <p className="mt-1 text-sm font-medium text-cyan-800">{selected.quotedPrice}</p>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs text-gray-400">Estimated ship date</label>
                <input
                  type="date"
                  value={estimatedShipDate}
                  onChange={(event) => setEstimatedShipDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-400">Tracking number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(event) => setTrackingNumber(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                  placeholder="Optional shipment reference"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-400">Latest update for client</label>
                <textarea
                  value={latestUpdate}
                  onChange={(event) => setLatestUpdate(event.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                  placeholder="Short production update shown in the client portal"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-400">Internal/admin notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(event) => setAdminNotes(event.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => void handleSave()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save
                </button>
                {nextOrderStatus[selected.status] && (
                  <button
                    onClick={() => void handleAdvance()}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Move to {nextOrderStatus[selected.status]?.replace(/_/g, ' ')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
