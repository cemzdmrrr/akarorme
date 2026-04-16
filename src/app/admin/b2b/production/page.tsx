'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createOrderFromProductionRequest,
  getClients,
  getOrders,
  getProductionRequests,
  initializeB2BStore,
  updateProductionRequest,
  updateProductionStatus,
} from '@/lib/b2b-store';
import type { B2BClient, B2BOrder, ProductionRequest, ProductionStatus } from '@/types/b2b';

const requestTabs: { label: string; value: ProductionStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Quoted', value: 'quoted' },
  { label: 'Revision Requested', value: 'revision_requested' },
  { label: 'Approved', value: 'approved' },
  { label: 'Cancelled', value: 'cancelled' },
];

const requestColors: Record<ProductionStatus, string> = {
  submitted: 'bg-yellow-100 text-yellow-700',
  under_review: 'bg-orange-100 text-orange-700',
  quoted: 'bg-cyan-100 text-cyan-700',
  revision_requested: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

const nextStatus: Record<ProductionStatus, ProductionStatus | null> = {
  submitted: 'under_review',
  under_review: 'quoted',
  quoted: null,
  revision_requested: 'quoted',
  approved: null,
  cancelled: null,
};

export default function AdminB2BProduction() {
  const [requests, setRequests] = useState<ProductionRequest[]>([]);
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [clients, setClients] = useState<B2BClient[]>([]);
  const [tab, setTab] = useState<ProductionStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    await initializeB2BStore();
    setRequests(getProductionRequests());
    setOrders(getOrders());
    setClients(getClients());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? null,
    [requests, selectedId],
  );

  useEffect(() => {
    if (!selected) {
      setAdminNotes('');
      setQuotedPrice('');
      return;
    }

    setAdminNotes(selected.adminResponse || '');
    setQuotedPrice(selected.quotedPrice || '');
  }, [selected]);

  const filtered = requests.filter((request) => tab === 'all' || request.status === tab);

  const getClientName = (clientId: string) =>
    clients.find((client) => client.id === clientId)?.companyName || 'Unknown client';

  const getRequestOrder = (requestId: string) =>
    orders.find((order) => order.productionRequestId === requestId);

  const refreshSelection = async (requestId: string) => {
    await load();
    setSelectedId(requestId);
  };

  const handleAdvanceStatus = async (request: ProductionRequest) => {
    const targetStatus = nextStatus[request.status];
    if (!targetStatus) return;

    updateProductionStatus(request.id, targetStatus, adminNotes.trim() || undefined, quotedPrice.trim() || undefined);
    setFeedback({ type: 'success', text: `Request moved to ${targetStatus.replace(/_/g, ' ')}.` });
    await refreshSelection(request.id);
  };

  const handleSave = async () => {
    if (!selected) return;

    updateProductionRequest(selected.id, {
      adminResponse: adminNotes.trim(),
      quotedPrice: quotedPrice.trim() || undefined,
    });

    setFeedback({ type: 'success', text: 'Request notes saved.' });
    await refreshSelection(selected.id);
  };

  const handleCancel = async () => {
    if (!selected) return;

    updateProductionStatus(selected.id, 'cancelled', adminNotes.trim() || undefined, quotedPrice.trim() || undefined);
    setFeedback({ type: 'success', text: 'Request marked as cancelled.' });
    await refreshSelection(selected.id);
  };

  const handleCreateOrder = async () => {
    if (!selected) return;

    try {
      const order = createOrderFromProductionRequest(selected.id, {
        adminNotes: adminNotes.trim() || undefined,
      });
      setFeedback({ type: 'success', text: `Order ${order.orderNumber} created.` });
      await refreshSelection(selected.id);
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : 'Order could not be created.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Production Requests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review customer demand, prepare quotations, and wait for client approval before creating orders.
        </p>
      </div>

      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {requestTabs.map((item) => (
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
              ({item.value === 'all' ? requests.length : requests.filter((request) => request.status === item.value).length})
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
              No production requests found.
            </div>
          ) : (
            filtered.map((request) => {
              const order = getRequestOrder(request.id);

              return (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => setSelectedId(request.id)}
                  className={`w-full rounded-xl border bg-white p-4 text-left transition-all hover:shadow-sm ${
                    selectedId === request.id ? 'border-blue-400 shadow-sm' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.modelName}</p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {getClientName(request.clientId)} · {request.estimatedQuantity.toLocaleString()} pcs · {request.preferredColor}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Target delivery: {new Date(request.targetDeliveryDate).toLocaleDateString()}
                      </p>
                      {request.status === 'quoted' && (
                        <p className="mt-1 text-xs font-medium text-cyan-700">Waiting for client decision</p>
                      )}
                      {request.status === 'revision_requested' && (
                        <p className="mt-1 text-xs font-medium text-amber-700">Client requested revisions</p>
                      )}
                      {order && (
                        <p className="mt-1 text-xs font-medium text-blue-600">Converted to order {order.orderNumber}</p>
                      )}
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${requestColors[request.status]}`}>
                      {request.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {selected && (
          <div className="hidden w-96 self-start rounded-xl border border-gray-200 bg-white p-5 lg:block">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">{selected.modelName}</h2>
                  <p className="mt-1 text-xs text-gray-400">Request ID: {selected.id}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${requestColors[selected.status]}`}>
                  {selected.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">Client</span>
                  <p className="mt-1 text-gray-700">{getClientName(selected.clientId)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Quantity</span>
                  <p className="mt-1 text-gray-700">{selected.estimatedQuantity.toLocaleString()} pcs</p>
                </div>
                <div>
                  <span className="text-gray-400">Color</span>
                  <p className="mt-1 text-gray-700">{selected.preferredColor}</p>
                </div>
                <div>
                  <span className="text-gray-400">Yarn</span>
                  <p className="mt-1 text-gray-700">{selected.preferredYarn}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400">Target delivery</span>
                  <p className="mt-1 text-gray-700">{new Date(selected.targetDeliveryDate).toLocaleDateString()}</p>
                </div>
              </div>

              {selected.notes && (
                <div>
                  <p className="mb-1 text-xs text-gray-400">Client request notes</p>
                  <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{selected.notes}</p>
                </div>
              )}

              {selected.clientResponse && (
                <div>
                  <p className="mb-1 text-xs text-gray-400">Latest client reply</p>
                  <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{selected.clientResponse}</p>
                  {selected.discussionConversationId && (
                    <Link
                      href={`/admin/b2b/messages?conversation=${selected.discussionConversationId}`}
                      className="mt-2 inline-flex text-xs font-medium text-amber-700 hover:underline"
                    >
                      Open messages
                    </Link>
                  )}
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs text-gray-400">Quoted price</label>
                <input
                  type="text"
                  value={quotedPrice}
                  onChange={(event) => setQuotedPrice(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                  placeholder="e.g. EUR 12.50 per unit"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-400">Admin response</label>
                <textarea
                  value={adminNotes}
                  onChange={(event) => setAdminNotes(event.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                />
              </div>

              {getRequestOrder(selected.id) ? (
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <p className="text-xs font-medium text-blue-700">This request has already become an order.</p>
                  <Link href="/admin/b2b/orders" className="mt-2 inline-flex text-xs font-medium text-blue-700 hover:underline">
                    Open orders page
                  </Link>
                </div>
              ) : selected.status === 'quoted' ? (
                <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-3 text-xs text-cyan-700">
                  Quotation sent. Waiting for the client to approve or request changes.
                </div>
              ) : (
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500">
                  Approved requests can be converted into a live order for production tracking.
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => void handleSave()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save notes
                </button>
                {nextStatus[selected.status] && (
                  <button
                    onClick={() => void handleAdvanceStatus(selected)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Move to {nextStatus[selected.status]?.replace(/_/g, ' ')}
                  </button>
                )}
                {selected.status !== 'cancelled' && (
                  <button
                    onClick={() => void handleCancel()}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                  >
                    Cancel request
                  </button>
                )}
                {selected.status === 'approved' && !getRequestOrder(selected.id) && (
                  <button
                    onClick={() => void handleCreateOrder()}
                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
                  >
                    Create order
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
