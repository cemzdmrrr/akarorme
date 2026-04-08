'use client';

import { useEffect, useState, useCallback } from 'react';
import { getClients, approveClient, rejectClient, deleteClient, initializeB2BStore } from '@/lib/b2b-store';
import type { B2BClient, RegistrationStatus } from '@/types/b2b';

const statusTabs: { label: string; value: RegistrationStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Approved', value: 'approved' },
  { label: 'Pending', value: 'pending' },
  { label: 'Rejected', value: 'rejected' },
];

const statusBadge: Record<RegistrationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminB2BClients() {
  const [clients, setClients] = useState<B2BClient[]>([]);
  const [tab, setTab] = useState<RegistrationStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<B2BClient | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject' | 'delete'; client: B2BClient } | null>(null);

  const load = useCallback(() => {
    initializeB2BStore();
    setClients(getClients());
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = clients.filter((c) => {
    if (tab !== 'all' && c.status !== tab) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.companyName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.contactPerson.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAction = () => {
    if (!confirmAction) return;
    const { type, client } = confirmAction;
    if (type === 'approve') approveClient(client.id);
    else if (type === 'reject') rejectClient(client.id);
    else if (type === 'delete') deleteClient(client.id);
    setConfirmAction(null);
    if (selected?.id === client.id) setSelected(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">B2B Clients</h1>
        <p className="mt-1 text-sm text-gray-500">Manage client registrations and accounts.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-2">
          {statusTabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                tab === t.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.label}
              <span className="ml-1.5 text-[10px] opacity-75">
                ({t.value === 'all' ? clients.length : clients.filter((c) => c.status === t.value).length})
              </span>
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm focus:border-blue-400 focus:outline-none w-full sm:w-64 ml-auto"
        />
      </div>

      <div className="flex gap-6">
        {/* Client List */}
        <div className="flex-1 rounded-xl bg-white border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Company</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Country</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === c.id ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{c.companyName}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-600">{c.contactPerson}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">{c.country}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                      {c.status === 'pending' && (
                        <>
                          <button
                            onClick={() => setConfirmAction({ type: 'approve', client: c })}
                            className="rounded-md bg-green-50 px-2.5 py-1 text-xs text-green-700 hover:bg-green-100"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setConfirmAction({ type: 'reject', client: c })}
                            className="rounded-md bg-red-50 px-2.5 py-1 text-xs text-red-700 hover:bg-red-100"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {c.status !== 'pending' && (
                        <button
                          onClick={() => setConfirmAction({ type: 'delete', client: c })}
                          className="rounded-md bg-gray-50 px-2.5 py-1 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No clients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Client Detail */}
        {selected && (
          <div className="hidden lg:block w-80 rounded-xl bg-white border border-gray-200 p-5 self-start sticky top-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">{selected.companyName}</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Contact:</span> <span className="text-gray-700">{selected.contactPerson}</span></div>
              <div><span className="text-gray-400">Email:</span> <span className="text-gray-700">{selected.email}</span></div>
              <div><span className="text-gray-400">Phone:</span> <span className="text-gray-700">{selected.phone || '—'}</span></div>
              <div><span className="text-gray-400">Country:</span> <span className="text-gray-700">{selected.country}</span></div>
              <div><span className="text-gray-400">Business:</span> <span className="text-gray-700 capitalize">{selected.businessType.replace(/_/g, ' ')}</span></div>
              <div><span className="text-gray-400">Status:</span>{' '}
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[selected.status]}`}>
                  {selected.status}
                </span>
              </div>
              <div><span className="text-gray-400">Registered:</span> <span className="text-gray-700">{new Date(selected.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setConfirmAction(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {confirmAction.type === 'approve' && 'Approve Client'}
              {confirmAction.type === 'reject' && 'Reject Registration'}
              {confirmAction.type === 'delete' && 'Delete Client'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {confirmAction.type === 'approve' && `Approve ${confirmAction.client.companyName}? They will be able to log in to the B2B portal.`}
              {confirmAction.type === 'reject' && `Reject ${confirmAction.client.companyName}'s registration? They will not be able to access the portal.`}
              {confirmAction.type === 'delete' && `Permanently delete ${confirmAction.client.companyName}? This cannot be undone.`}
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmAction(null)} className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                Cancel
              </button>
              <button
                onClick={handleAction}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                  confirmAction.type === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                  confirmAction.type === 'reject' ? 'bg-orange-600 hover:bg-orange-700' :
                  'bg-green-600 hover:bg-green-700'
                }`}
              >
                {confirmAction.type === 'approve' ? 'Approve' : confirmAction.type === 'reject' ? 'Reject' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
