'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminContext } from './template';
import {
  getDashboardStats,
  getActivity,
  getMessages,
} from '@/lib/admin-store';
import { fetchModels } from '@/lib/admin-api';
import type { DashboardStats, ActivityEntry, AdminModel, ContactMessage } from '@/types/admin';
import Link from 'next/link';

export default function DashboardPage() {
  const { toggleSidebar } = useAdminContext();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [recentModels, setRecentModels] = useState<AdminModel[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [modelCount, setModelCount] = useState(0);

  useEffect(() => {
    const baseStats = getDashboardStats();
    setStats(baseStats);
    setActivity(getActivity().slice(0, 8));
    setRecentMessages(getMessages().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5));

    // Fetch models from API (Vercel Blob — source of truth)
    fetchModels()
      .then((models) => {
        setRecentModels(models.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5));
        setModelCount(models.length);
      })
      .catch(() => {
        setRecentModels([]);
        setModelCount(0);
      });
  }, []);

  if (!stats) return <div className="flex items-center justify-center h-full"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>;

  const statCards = [
    { label: 'Toplam Model', value: modelCount, color: 'bg-blue-500', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', href: '/admin/models' },
    { label: 'Koleksiyonlar', value: stats.totalCollections, color: 'bg-emerald-500', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', href: '/admin/collections' },
    { label: 'Referanslar', value: stats.totalReferences, color: 'bg-purple-500', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', href: '/admin/references' },
    { label: 'Okunmamış Mesajlar', value: stats.unreadMessages, color: 'bg-amber-500', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', href: '/admin/messages' },
    { label: 'Kumaş Türleri', value: stats.totalFabrics, color: 'bg-rose-500', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z', href: '/admin/fabrics' },
    { label: 'Medya Dosyaları', value: stats.totalMedia, color: 'bg-cyan-500', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', href: '/admin/media' },
  ];

  return (
    <>
      <AdminHeader title="Gösterge Paneli" subtitle="Web sitesi genel bakış" onMenuToggle={toggleSidebar} />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((s) => (
            <Link key={s.label} href={s.href} className="group rounded-xl bg-white border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${s.color} text-white mb-3`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Models */}
          <div className="lg:col-span-2 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Son Modeller</h2>
              <Link href="/admin/models" className="text-xs text-blue-600 hover:text-blue-800">Tümünü gör &rarr;</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentModels.map((model) => (
                <div key={model.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold overflow-hidden shrink-0">
                    {model.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={model.images[0]} alt={model.name} className="h-full w-full object-cover" />
                    ) : (
                      model.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{model.name}</p>
                    <p className="text-xs text-gray-500">{model.collection} &middot; {model.season}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    model.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {model.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
              ))}
              {recentModels.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-gray-400">Henüz model yok</p>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-xl bg-white border border-gray-200">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Aktivite Akışı</h2>
            </div>
            <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
              {activity.map((entry) => (
                <div key={entry.id} className="px-5 py-3">
                  <p className="text-sm text-gray-700">
                    <span className="capitalize font-medium">{entry.action}</span>{' '}
                    <span className="text-gray-500">{entry.entity}</span>{' '}
                    <span className="font-medium">&ldquo;{entry.entityName}&rdquo;</span>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {new Date(entry.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
              {activity.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-gray-400">Henüz aktivite yok</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="rounded-xl bg-white border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Son Mesajlar</h2>
            <Link href="/admin/messages" className="text-xs text-blue-600 hover:text-blue-800">Tümünü gör &rarr;</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-4 px-5 py-4">
                <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${msg.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{msg.name}</p>
                    <span className="text-xs text-gray-400">{msg.company}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5 truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
            {recentMessages.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-gray-400">Henüz mesaj yok</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/admin/models?action=new" className="flex items-center gap-3 rounded-xl bg-blue-600 px-5 py-4 text-white hover:bg-blue-700 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">Yeni Model Ekle</span>
          </Link>
          <Link href="/admin/collections?action=new" className="flex items-center gap-3 rounded-xl bg-white border border-gray-200 px-5 py-4 text-gray-900 hover:bg-gray-50 transition-colors">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">Yeni Koleksiyon</span>
          </Link>
          <Link href="/admin/media" className="flex items-center gap-3 rounded-xl bg-white border border-gray-200 px-5 py-4 text-gray-900 hover:bg-gray-50 transition-colors">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-sm font-medium">Medya Yükle</span>
          </Link>
        </div>
      </div>
    </>
  );
}
