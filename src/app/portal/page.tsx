'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePortalContext } from '@/app/portal/template';
import { getCurrentClientId } from '@/lib/b2b-auth';
import {
  getSampleRequests,
  getProductionRequests,
  getFavorites,
  getUnreadMessageCount,
  getB2BActivity,
} from '@/lib/b2b-store';
import { getModels } from '@/lib/admin-store';
import type { SampleRequest, ProductionRequest, ClientFavorite, B2BActivityEntry } from '@/types/b2b';

export default function PortalDashboard() {
  const { client } = usePortalContext();
  const [samples, setSamples] = useState<SampleRequest[]>([]);
  const [production, setProduction] = useState<ProductionRequest[]>([]);
  const [favorites, setFavorites] = useState<ClientFavorite[]>([]);
  const [unread, setUnread] = useState(0);
  const [activity, setActivity] = useState<B2BActivityEntry[]>([]);
  const [recentModels, setRecentModels] = useState<{ id: string; name: string; image: string; collection: string }[]>([]);

  useEffect(() => {
    const cid = getCurrentClientId();
    if (!cid) return;
    setSamples(getSampleRequests(cid));
    setProduction(getProductionRequests(cid));
    setFavorites(getFavorites(cid));
    setUnread(getUnreadMessageCount(cid));
    setActivity(getB2BActivity(cid).slice(0, 5));

    const models = getModels().filter((m) => m.status === 'published').slice(0, 4);
    setRecentModels(models.map((m) => ({ id: m.id, name: m.name, image: m.images[0] || '', collection: m.collection })));
  }, []);

  const statusColor: Record<string, string> = {
    requested: 'bg-yellow-500/15 text-yellow-400',
    approved: 'bg-blue-500/15 text-blue-400',
    in_production: 'bg-purple-500/15 text-purple-400',
    shipped: 'bg-green-500/15 text-green-400',
    submitted: 'bg-yellow-500/15 text-yellow-400',
    under_review: 'bg-orange-500/15 text-orange-400',
    quoted: 'bg-cyan-500/15 text-cyan-400',
    completed: 'bg-green-500/15 text-green-400',
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-accent/20 to-brand-dark-2 border border-brand-dark-3 p-6 lg:p-8">
        <h1 className="text-2xl font-display font-bold text-brand-white">
          Welcome back, {client?.contactPerson?.split(' ')[0] || 'Partner'}
        </h1>
        <p className="mt-2 text-sm text-brand-grey-light max-w-xl">
          {client?.companyName} — Access your collections, track sample requests, and manage production orders from your dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Saved Models', value: favorites.length, href: '/portal/favorites', icon: '♥', color: 'text-pink-400' },
          { label: 'Sample Requests', value: samples.length, href: '/portal/samples', icon: '◈', color: 'text-blue-400' },
          { label: 'Production Orders', value: production.length, href: '/portal/production', icon: '⚙', color: 'text-purple-400' },
          { label: 'Unread Messages', value: unread, href: '/portal/messages', icon: '✉', color: 'text-green-400' },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl bg-brand-dark border border-brand-dark-3 p-5 hover:border-brand-dark-4 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-2xl ${stat.color}`}>{stat.icon}</span>
              <svg className="h-4 w-4 text-brand-grey opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
            <p className="text-2xl font-bold text-brand-white">{stat.value}</p>
            <p className="text-xs text-brand-grey mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Collections */}
        <div className="lg:col-span-2 rounded-xl bg-brand-dark border border-brand-dark-3 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-white">Recent Collections</h2>
            <Link href="/portal/collections" className="text-xs text-brand-accent-light hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recentModels.map((model) => (
              <Link key={model.id} href={`/portal/models/${model.id}`} className="group rounded-lg bg-brand-dark-2 border border-brand-dark-3 overflow-hidden hover:border-brand-accent/30 transition-colors">
                <div className="aspect-[4/3] bg-brand-dark-3 swatch-placeholder" />
                <div className="p-3">
                  <p className="text-sm font-medium text-brand-white group-hover:text-brand-accent-light transition-colors">{model.name}</p>
                  <p className="text-xs text-brand-grey mt-0.5">{model.collection}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl bg-brand-dark border border-brand-dark-3 p-6">
            <h2 className="text-lg font-semibold text-brand-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/portal/collections" className="flex items-center gap-3 rounded-lg bg-brand-dark-2 px-4 py-3 text-sm text-brand-grey-light hover:bg-brand-dark-3 hover:text-brand-white transition-colors">
                <span className="text-brand-accent-light text-lg">⊞</span> Browse Collections
              </Link>
              <Link href="/portal/messages" className="flex items-center gap-3 rounded-lg bg-brand-dark-2 px-4 py-3 text-sm text-brand-grey-light hover:bg-brand-dark-3 hover:text-brand-white transition-colors">
                <span className="text-brand-accent-light text-lg">✉</span> Send Message
              </Link>
              <Link href="/portal/documents" className="flex items-center gap-3 rounded-lg bg-brand-dark-2 px-4 py-3 text-sm text-brand-grey-light hover:bg-brand-dark-3 hover:text-brand-white transition-colors">
                <span className="text-brand-accent-light text-lg">📄</span> View Documents
              </Link>
            </div>
          </div>

          {/* Recent Sample Requests */}
          <div className="rounded-xl bg-brand-dark border border-brand-dark-3 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-brand-white">Sample Requests</h2>
              <Link href="/portal/samples" className="text-xs text-brand-accent-light hover:underline">View all</Link>
            </div>
            {samples.length === 0 ? (
              <p className="text-xs text-brand-grey">No sample requests yet.</p>
            ) : (
              <div className="space-y-2">
                {samples.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg bg-brand-dark-2 px-3 py-2">
                    <div>
                      <p className="text-xs font-medium text-brand-white">{s.modelName}</p>
                      <p className="text-[10px] text-brand-grey">Qty: {s.quantity}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor[s.status] || 'bg-brand-dark-3 text-brand-grey'}`}>
                      {s.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {activity.length > 0 && (
        <div className="rounded-xl bg-brand-dark border border-brand-dark-3 p-6">
          <h2 className="text-lg font-semibold text-brand-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activity.map((a) => (
              <div key={a.id} className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-brand-accent flex-shrink-0" />
                <span className="text-brand-grey-light">
                  <span className="capitalize">{a.action}</span> {a.entity.replace('_', ' ')} — <span className="text-brand-white">{a.entityName}</span>
                </span>
                <span className="ml-auto text-xs text-brand-grey">{new Date(a.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
