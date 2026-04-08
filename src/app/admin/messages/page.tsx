'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminContext } from '../template';
import { getMessages, markMessageRead, markMessageResponded, deleteMessage } from '@/lib/admin-store';
import type { ContactMessage } from '@/types/admin';

export default function MessagesPage() {
  const { toggleSidebar } = useAdminContext();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'responded'>('all');

  useEffect(() => { setMessages(getMessages()); }, []);
  const refresh = () => {
    const m = getMessages();
    setMessages(m);
    if (selected) { const up = m.find((x) => x.id === selected.id); setSelected(up || null); }
  };

  const filtered = messages
    .filter((m) => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !m.read;
      if (filter === 'read') return m.read;
      if (filter === 'responded') return m.responded;
      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const unreadCount = messages.filter((m) => !m.read).length;
  const respondedCount = messages.filter((m) => m.responded).length;

  const selectMessage = (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.read) { markMessageRead(msg.id); refresh(); }
  };

  const handleResponded = (id: string) => {
    markMessageResponded(id);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this message?')) {
      deleteMessage(id);
      if (selected?.id === id) setSelected(null);
      refresh();
    }
  };

  return (
    <>
      <AdminHeader
        title="Contact Messages"
        subtitle={`${unreadCount} unread · ${respondedCount} responded`}
        onMenuToggle={toggleSidebar}
      />

      <div className="p-4 sm:p-6">
        {/* Filter bar */}
        <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden mb-4 w-fit">
          {(['all', 'unread', 'read', 'responded'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f}{f === 'unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* List */}
          <div className={`${selected ? 'hidden lg:block lg:w-96' : 'w-full'} shrink-0`}>
            <div className="rounded-xl bg-white border border-gray-200 divide-y divide-gray-50 overflow-hidden">
              {filtered.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => selectMessage(msg)}
                  className={`flex items-start gap-3 w-full px-4 py-4 text-left hover:bg-gray-50 transition-colors ${selected?.id === msg.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="mt-1.5 flex flex-col items-center gap-1 shrink-0">
                    <div className={`h-2 w-2 rounded-full ${msg.read ? 'bg-gray-200' : 'bg-blue-500'}`} />
                    {msg.responded && (
                      <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm truncate ${msg.read ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>{msg.name}</p>
                      <span className="text-xs text-gray-400 shrink-0">{msg.company}</span>
                    </div>
                    <p className={`text-sm mt-0.5 truncate ${msg.read ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>{msg.subject}</p>
                    <p className="text-xs text-gray-400 mt-1 truncate">{msg.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[11px] text-gray-400">
                        {new Date(msg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {msg.responded && <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Responded</span>}
                    </div>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-5 py-12 text-center text-sm text-gray-400">No messages</p>
              )}
            </div>
          </div>

          {/* Detail */}
          {selected && (
            <div className="flex-1 min-w-0">
              <div className="rounded-xl bg-white border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selected.subject}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-sm font-bold">
                        {selected.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selected.name}</p>
                        <p className="text-xs text-gray-500">{selected.email} {selected.company && `· ${selected.company}`}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="lg:hidden rounded-lg p-2 text-gray-400 hover:bg-gray-100" onClick={() => setSelected(null)}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <button onClick={() => handleDelete(selected.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Delete">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-6 space-y-2">
                  <p className="text-xs text-gray-400">
                    Received: {new Date(selected.createdAt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {selected.responded && selected.respondedAt && (
                    <p className="text-xs text-emerald-600">
                      Responded: {new Date(selected.respondedAt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Reply via Email
                  </a>
                  {!selected.responded && (
                    <button
                      onClick={() => handleResponded(selected.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Mark as Responded
                    </button>
                  )}
                  {selected.responded && (
                    <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Responded
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
