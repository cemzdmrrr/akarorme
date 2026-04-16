'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePortalContext } from '@/app/portal/template';
import { getCurrentClientId } from '@/lib/b2b-auth';
import {
  getB2BActivity,
  getFavorites,
  getOrders,
  getProductionRequests,
  getSampleRequests,
  getUnreadMessageCount,
  initializeB2BStore,
} from '@/lib/b2b-store';
import { getModels } from '@/lib/admin-store';
import type { B2BActivityEntry, B2BOrder, ClientFavorite, ProductionRequest, SampleRequest } from '@/types/b2b';

export default function PortalDashboard() {
  const { client } = usePortalContext();
  const [samples, setSamples] = useState<SampleRequest[]>([]);
  const [requests, setRequests] = useState<ProductionRequest[]>([]);
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [favorites, setFavorites] = useState<ClientFavorite[]>([]);
  const [unread, setUnread] = useState(0);
  const [activity, setActivity] = useState<B2BActivityEntry[]>([]);
  const [recentModels, setRecentModels] = useState<{ id: string; name: string; collection: string }[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      await initializeB2BStore();
      const clientId = getCurrentClientId();
      if (!clientId || cancelled) return;

      setSamples(getSampleRequests(clientId));
      setRequests(getProductionRequests(clientId));
      setOrders(getOrders(clientId));
      setFavorites(getFavorites(clientId));
      setUnread(getUnreadMessageCount(clientId));
      setActivity(getB2BActivity(clientId).slice(0, 5));

      const models = getModels().filter((item) => item.status === 'published').slice(0, 4);
      setRecentModels(models.map((item) => ({ id: item.id, name: item.name, collection: item.collection })));
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const statusColor: Record<string, string> = {
    requested: 'bg-yellow-500/15 text-yellow-400',
    approved: 'bg-blue-500/15 text-blue-400',
    in_production: 'bg-purple-500/15 text-purple-400',
    submitted: 'bg-yellow-500/15 text-yellow-400',
    under_review: 'bg-orange-500/15 text-orange-400',
    quoted: 'bg-cyan-500/15 text-cyan-400',
    confirmed: 'bg-blue-500/15 text-blue-400',
    quality_control: 'bg-orange-500/15 text-orange-400',
    ready_to_ship: 'bg-cyan-500/15 text-cyan-400',
    shipped: 'bg-emerald-500/15 text-emerald-400',
    completed: 'bg-green-500/15 text-green-400',
  };

  const stats = [
    { label: 'Saved Models', value: favorites.length, href: '/portal/favorites', icon: '♥', color: 'text-pink-400' },
    { label: 'Sample Requests', value: samples.length, href: '/portal/samples', icon: '◈', color: 'text-blue-400' },
    { label: 'Production Requests', value: requests.length, href: '/portal/production', icon: '◌', color: 'text-cyan-400' },
    { label: 'Orders', value: orders.length, href: '/portal/orders', icon: '⬚', color: 'text-purple-400' },
    { label: 'Unread Messages', value: unread, href: '/portal/messages', icon: '✉', color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="rounded-2xl border border-brand-dark-3 bg-gradient-to-br from-brand-accent/20 to-brand-dark-2 p-6 lg:p-8">
        <h1 className="text-2xl font-display font-bold text-brand-white">
          Welcome back, {client?.contactPerson?.split(' ')[0] || 'Partner'}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-brand-grey-light">
          {client?.companyName} - browse the collection catalog, ask product questions, track request approvals, and follow live orders from one place.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-brand-dark-3 bg-brand-dark p-5 transition-colors hover:border-brand-dark-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className={`text-2xl ${stat.color}`}>{stat.icon}</span>
              <svg className="h-4 w-4 text-brand-grey opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-brand-white">{stat.value}</p>
            <p className="mt-1 text-xs text-brand-grey">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-white">Featured Models</h2>
            <Link href="/portal/collections" className="text-xs text-brand-accent-light hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recentModels.map((model) => (
              <Link
                key={model.id}
                href={`/portal/models/${model.id}`}
                className="group overflow-hidden rounded-lg border border-brand-dark-3 bg-brand-dark-2 transition-colors hover:border-brand-accent/30"
              >
                <div className="aspect-[4/3] swatch-placeholder bg-brand-dark-3" />
                <div className="p-3">
                  <p className="text-sm font-medium text-brand-white transition-colors group-hover:text-brand-accent-light">{model.name}</p>
                  <p className="mt-0.5 text-xs text-brand-grey">{model.collection}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-6">
            <h2 className="mb-4 text-lg font-semibold text-brand-white">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/portal/collections" className="flex items-center gap-3 rounded-lg bg-brand-dark-2 px-4 py-3 text-sm text-brand-grey-light transition-colors hover:bg-brand-dark-3 hover:text-brand-white">
                <span className="text-lg text-brand-accent-light">⊞</span> Browse Collections
              </Link>
              <Link href="/portal/messages" className="flex items-center gap-3 rounded-lg bg-brand-dark-2 px-4 py-3 text-sm text-brand-grey-light transition-colors hover:bg-brand-dark-3 hover:text-brand-white">
                <span className="text-lg text-brand-accent-light">✉</span> Ask a Question
              </Link>
              <Link href="/portal/production" className="flex items-center gap-3 rounded-lg bg-brand-dark-2 px-4 py-3 text-sm text-brand-grey-light transition-colors hover:bg-brand-dark-3 hover:text-brand-white">
                <span className="text-lg text-brand-accent-light">◌</span> Track Requests
              </Link>
              <Link href="/portal/orders" className="flex items-center gap-3 rounded-lg bg-brand-dark-2 px-4 py-3 text-sm text-brand-grey-light transition-colors hover:bg-brand-dark-3 hover:text-brand-white">
                <span className="text-lg text-brand-accent-light">⬚</span> Track Orders
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-brand-white">Recent Orders</h2>
              <Link href="/portal/orders" className="text-xs text-brand-accent-light hover:underline">
                View all
              </Link>
            </div>
            {orders.length === 0 ? (
              <p className="text-xs text-brand-grey">No orders yet.</p>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-lg bg-brand-dark-2 px-3 py-2">
                    <div>
                      <p className="text-xs font-medium text-brand-white">{order.modelName}</p>
                      <p className="text-[10px] text-brand-grey">{order.orderNumber}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor[order.status] || 'bg-brand-dark-3 text-brand-grey'}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {activity.length > 0 && (
        <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-6">
          <h2 className="mb-4 text-lg font-semibold text-brand-white">Recent Activity</h2>
          <div className="space-y-3">
            {activity.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-brand-accent" />
                <span className="text-brand-grey-light">
                  <span className="capitalize">{entry.action}</span> {entry.entity.replace('_', ' ')} - <span className="text-brand-white">{entry.entityName}</span>
                </span>
                <span className="ml-auto text-xs text-brand-grey">{new Date(entry.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
