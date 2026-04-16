'use client';

import { useEffect, useMemo, useState } from 'react';
import { getCurrentClientId } from '@/lib/b2b-auth';
import { getOrders, initializeB2BStore } from '@/lib/b2b-store';
import type { B2BOrder, OrderStatus } from '@/types/b2b';

const orderTabs: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'In Production', value: 'in_production' },
  { label: 'Quality Control', value: 'quality_control' },
  { label: 'Ready to Ship', value: 'ready_to_ship' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Completed', value: 'completed' },
];

const orderConfig: Record<OrderStatus, { color: string; bg: string }> = {
  confirmed: { color: 'text-blue-400', bg: 'bg-blue-500/15' },
  in_production: { color: 'text-purple-400', bg: 'bg-purple-500/15' },
  quality_control: { color: 'text-orange-400', bg: 'bg-orange-500/15' },
  ready_to_ship: { color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
  shipped: { color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  completed: { color: 'text-green-400', bg: 'bg-green-500/15' },
};

const stepOrder: OrderStatus[] = ['confirmed', 'in_production', 'quality_control', 'ready_to_ship', 'shipped', 'completed'];

export default function PortalOrders() {
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      await initializeB2BStore();
      const clientId = getCurrentClientId();
      if (!clientId || cancelled) return;

      setOrders(getOrders(clientId));
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(
    () => orders.find((order) => order.id === selectedId) ?? null,
    [orders, selectedId],
  );

  const filtered = filter === 'all' ? orders : orders.filter((order) => order.status === filter);

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-white">Orders</h1>
        <p className="mt-1 text-sm text-brand-grey">
          Track confirmed production jobs after approval, including shipping and completion updates.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {orderTabs.map((item) => (
          <button
            key={item.value}
            onClick={() => {
              setFilter(item.value);
              setSelectedId(null);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              filter === item.value
                ? 'bg-brand-accent text-white'
                : 'border border-brand-dark-3 bg-brand-dark text-brand-grey hover:text-brand-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-8 text-center">
              <p className="text-sm text-brand-grey">No orders available yet.</p>
            </div>
          ) : (
            filtered.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedId(order.id)}
                className={`w-full rounded-xl border bg-brand-dark p-4 text-left transition-colors ${
                  selectedId === order.id ? 'border-brand-accent/40' : 'border-brand-dark-3 hover:border-brand-dark-4'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-white">{order.modelName}</p>
                    <p className="mt-0.5 text-xs text-brand-grey">{order.orderNumber}</p>
                    <p className="mt-2 text-[10px] text-brand-grey">
                      {order.quantity.toLocaleString()} pcs · target {new Date(order.targetDeliveryDate).toLocaleDateString()}
                    </p>
                    <div className="mt-3">
                      <div className="h-2 rounded-full bg-brand-dark-3">
                        <div className="h-2 rounded-full bg-brand-accent transition-all" style={{ width: `${order.progressPercent}%` }} />
                      </div>
                      <p className="mt-1 text-[10px] text-brand-grey">{order.progressPercent}% complete</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${orderConfig[order.status].bg} ${orderConfig[order.status].color}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="space-y-5 rounded-xl border border-brand-dark-3 bg-brand-dark p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-brand-white">{selected.orderNumber}</h2>
                  <p className="text-xs text-brand-grey">{selected.modelName}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${orderConfig[selected.status].bg} ${orderConfig[selected.status].color}`}>
                  {selected.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="rounded-xl border border-brand-dark-3 bg-brand-dark-2 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-brand-grey">Production progress</p>
                  <span className="text-sm font-semibold text-brand-white">{selected.progressPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-brand-dark-3">
                  <div className="h-2 rounded-full bg-brand-accent transition-all" style={{ width: `${selected.progressPercent}%` }} />
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium text-brand-grey">Order milestones</p>
                <div className="space-y-3">
                  {stepOrder.map((step, index) => {
                    const currentIndex = stepOrder.indexOf(selected.status);
                    const done = index <= currentIndex;
                    const current = index === currentIndex;

                    return (
                      <div key={step} className="flex items-center gap-3">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${
                            done
                              ? 'bg-brand-accent text-white'
                              : 'bg-brand-dark-3 text-brand-grey'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm ${current ? 'text-brand-white' : 'text-brand-grey-light'}`}>
                            {step.replace(/_/g, ' ')}
                          </p>
                          <p className="text-[10px] text-brand-grey">
                            {done ? 'Reached or completed' : 'Upcoming stage'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Quantity</p>
                  <p className="mt-0.5 text-sm text-brand-white">{selected.quantity.toLocaleString()} pcs</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Quoted price</p>
                  <p className="mt-0.5 text-sm text-brand-white">{selected.quotedPrice || 'Shared separately'}</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Preferred yarn</p>
                  <p className="mt-0.5 text-sm text-brand-white">{selected.yarnDetails}</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Preferred color</p>
                  <p className="mt-0.5 text-sm text-brand-white">{selected.colorDetails}</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Target delivery</p>
                  <p className="mt-0.5 text-sm text-brand-white">{new Date(selected.targetDeliveryDate).toLocaleDateString()}</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Estimated ship</p>
                  <p className="mt-0.5 text-sm text-brand-white">
                    {selected.estimatedShipDate ? new Date(selected.estimatedShipDate).toLocaleDateString() : 'Pending'}
                  </p>
                </div>
              </div>

              {selected.latestUpdate && (
                <div className="rounded-lg border border-brand-accent/20 bg-brand-accent/10 p-3">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-brand-accent-light">Latest update</p>
                  <p className="text-sm text-brand-grey-light">{selected.latestUpdate}</p>
                </div>
              )}

              {selected.adminNotes && (
                <div className="rounded-lg border border-brand-dark-3 bg-brand-dark-2 p-3">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-brand-grey">Additional production note</p>
                  <p className="text-sm text-brand-grey-light">{selected.adminNotes}</p>
                </div>
              )}

              {selected.trackingNumber && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-emerald-300">Tracking number</p>
                  <p className="text-sm font-medium text-emerald-200">{selected.trackingNumber}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-12 text-center">
              <p className="text-sm text-brand-grey">Select an order to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
