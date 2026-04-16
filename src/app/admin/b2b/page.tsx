'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getB2BActivity,
  getClients,
  getClientsByStatus,
  getConversations,
  getOrders,
  getProductionRequests,
  getSampleRequests,
  initializeB2BStore,
} from '@/lib/b2b-store';
import type { B2BActivityEntry, B2BClient, B2BOrder, ProductionRequest, SampleRequest } from '@/types/b2b';

export default function AdminB2BOverview() {
  const [pendingClients, setPendingClients] = useState<B2BClient[]>([]);
  const [allClients, setAllClients] = useState<B2BClient[]>([]);
  const [samples, setSamples] = useState<SampleRequest[]>([]);
  const [productions, setProductions] = useState<ProductionRequest[]>([]);
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [unreadConversations, setUnreadConversations] = useState(0);
  const [activity, setActivity] = useState<B2BActivityEntry[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      await initializeB2BStore();
      if (cancelled) return;

      setAllClients(getClients());
      setPendingClients(getClientsByStatus('pending'));
      setSamples(getSampleRequests());
      setProductions(getProductionRequests());
      setOrders(getOrders());
      setActivity(getB2BActivity().slice(0, 10));
      setUnreadConversations(getConversations().filter((conversation) => conversation.unreadAdmin > 0).length);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const approvedClients = allClients.filter((client) => client.status === 'approved').length;
  const pendingSamples = samples.filter((sample) => sample.status === 'requested').length;
  const activeRequests = productions.filter((request) => !['approved', 'cancelled'].includes(request.status)).length;
  const activeOrders = orders.filter((order) => order.status !== 'completed').length;

  const stats = [
    { label: 'Aktif Musteriler', value: approvedClients, color: 'text-blue-700', href: '/admin/b2b/clients' },
    { label: 'Bekleyen Kayitlar', value: pendingClients.length, color: 'text-yellow-700', href: '/admin/b2b/clients' },
    { label: 'Bekleyen Numuneler', value: pendingSamples, color: 'text-purple-700', href: '/admin/b2b/samples' },
    { label: 'Aktif Talepler', value: activeRequests, color: 'text-cyan-700', href: '/admin/b2b/production' },
    { label: 'Aktif Siparisler', value: activeOrders, color: 'text-green-700', href: '/admin/b2b/orders' },
    { label: 'Okunmamis Mesajlar', value: unreadConversations, color: 'text-red-700', href: '/admin/b2b/messages' },
  ];

  const quickLinks = [
    { label: 'Manage Clients', href: '/admin/b2b/clients', icon: '👥' },
    { label: 'Sample Requests', href: '/admin/b2b/samples', icon: '📋' },
    { label: 'Production Requests', href: '/admin/b2b/production', icon: '🧶' },
    { label: 'Orders', href: '/admin/b2b/orders', icon: '📦' },
    { label: 'B2B Messages', href: '/admin/b2b/messages', icon: '💬' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">B2B Portal Yonetimi</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor customer accounts, incoming requests, and active orders from one overview.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </Link>
        ))}
      </div>

      {pendingClients.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Bekleyen Kayitlar</h2>
            <Link href="/admin/b2b/clients" className="text-xs text-blue-600 hover:underline">
              Tumunu gor
            </Link>
          </div>
          <div className="space-y-3">
            {pendingClients.slice(0, 5).map((client) => (
              <div key={client.id} className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{client.companyName}</p>
                  <p className="text-xs text-gray-500">
                    {client.contactPerson} · {client.email} · {client.country}
                  </p>
                </div>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">Pending</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Recent B2B Activity</h2>
        {activity.length === 0 ? (
          <p className="text-sm text-gray-400">No activity yet.</p>
        ) : (
          <div className="space-y-3">
            {activity.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 border-b border-gray-100 py-2 last:border-0">
                <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-700">
                    {entry.action} {entry.entity}: {entry.entityName}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <span className="text-xl">{link.icon}</span>
            <span className="text-sm font-medium text-gray-700">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
