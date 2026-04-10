'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getClients, getSampleRequests, getProductionRequests, getConversations, getB2BActivity, initializeB2BStore, getClientsByStatus } from '@/lib/b2b-store';
import type { B2BClient, SampleRequest, ProductionRequest, B2BActivityEntry } from '@/types/b2b';

export default function AdminB2BOverview() {
  const [pendingClients, setPendingClients] = useState<B2BClient[]>([]);
  const [allClients, setAllClients] = useState<B2BClient[]>([]);
  const [samples, setSamples] = useState<SampleRequest[]>([]);
  const [productions, setProductions] = useState<ProductionRequest[]>([]);
  const [unreadConvos, setUnreadConvos] = useState(0);
  const [activity, setActivity] = useState<B2BActivityEntry[]>([]);

  useEffect(() => {
    initializeB2BStore();
    setAllClients(getClients());
    setPendingClients(getClientsByStatus('pending'));
    setSamples(getSampleRequests());
    setProductions(getProductionRequests());
    setActivity(getB2BActivity().slice(0, 10));
    const convos = getConversations();
    setUnreadConvos(convos.filter((c) => c.unreadAdmin > 0).length);
  }, []);

  const approvedClients = allClients.filter((c) => c.status === 'approved').length;
  const pendingSamples = samples.filter((s) => s.status === 'requested').length;
  const activeProd = productions.filter((p) => !['completed'].includes(p.status)).length;

  const stats = [
    { label: 'Aktif Müşteriler', value: approvedClients, color: 'bg-blue-50 text-blue-700', href: '/admin/b2b/clients' },
    { label: 'Bekleyen Kayıtlar', value: pendingClients.length, color: 'bg-yellow-50 text-yellow-700', href: '/admin/b2b/clients' },
    { label: 'Bekleyen Numuneler', value: pendingSamples, color: 'bg-purple-50 text-purple-700', href: '/admin/b2b/samples' },
    { label: 'Aktif Üretim', value: activeProd, color: 'bg-green-50 text-green-700', href: '/admin/b2b/production' },
    { label: 'Okunmamış Mesajlar', value: unreadConvos, color: 'bg-red-50 text-red-700', href: '/admin/b2b/messages' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">B2B Portal Yönetimi</h1>
        <p className="mt-1 text-sm text-gray-500">B2B müşteri portalı aktivitesi genel bakış.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-xl bg-white border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color.split(' ')[1]}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Pending Registrations */}
      {pendingClients.length > 0 && (
        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Bekleyen Kayıtlar</h2>
            <Link href="/admin/b2b/clients" className="text-xs text-blue-600 hover:underline">Tümünü Gör</Link>
          </div>
          <div className="space-y-3">
            {pendingClients.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.companyName}</p>
                  <p className="text-xs text-gray-500">{c.contactPerson} · {c.email} · {c.country}</p>
                </div>
                <span className="rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-xs font-medium">Pending</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="rounded-xl bg-white border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent B2B Activity</h2>
        {activity.length === 0 ? (
          <p className="text-sm text-gray-400">Henüz aktivite yok.</p>
        ) : (
          <div className="space-y-3">
            {activity.map((a) => (
              <div key={a.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-700">{a.action} {a.entity}: {a.entityName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(a.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Manage Clients', href: '/admin/b2b/clients', icon: '👥' },
          { label: 'Sample Requests', href: '/admin/b2b/samples', icon: '📋' },
          { label: 'Production Orders', href: '/admin/b2b/production', icon: '🏭' },
          { label: 'B2B Messages', href: '/admin/b2b/messages', icon: '💬' },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="rounded-xl bg-white border border-gray-200 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-xl">{link.icon}</span>
            <span className="text-sm font-medium text-gray-700">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
