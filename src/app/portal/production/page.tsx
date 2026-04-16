'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getCurrentClientId } from '@/lib/b2b-auth';
import {
  getOrders,
  getProductionRequests,
  initializeB2BStore,
  respondToProductionQuote,
} from '@/lib/b2b-store';
import { usePortalContext } from '@/app/portal/template';
import type { B2BOrder, ProductionRequest, ProductionStatus } from '@/types/b2b';

const requestTabs: { label: string; value: ProductionStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Quoted', value: 'quoted' },
  { label: 'Revision Requested', value: 'revision_requested' },
  { label: 'Approved', value: 'approved' },
  { label: 'Cancelled', value: 'cancelled' },
];

const statusConfig: Record<ProductionStatus, { color: string; bg: string }> = {
  submitted: { color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  under_review: { color: 'text-orange-400', bg: 'bg-orange-500/15' },
  quoted: { color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
  revision_requested: { color: 'text-amber-300', bg: 'bg-amber-500/15' },
  approved: { color: 'text-green-400', bg: 'bg-green-500/15' },
  cancelled: { color: 'text-brand-grey-light', bg: 'bg-brand-dark-3' },
};

const stepOrder: ProductionStatus[] = ['submitted', 'under_review', 'quoted', 'approved'];

export default function PortalProduction() {
  const router = useRouter();
  const { client } = usePortalContext();
  const [requests, setRequests] = useState<ProductionRequest[]>([]);
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [filter, setFilter] = useState<ProductionStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revisionNote, setRevisionNote] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => {
    await initializeB2BStore();
    const clientId = getCurrentClientId();
    if (!clientId) return;

    setRequests(getProductionRequests(clientId));
    setOrders(getOrders(clientId));
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await initializeB2BStore();
      const clientId = getCurrentClientId();
      if (!clientId || cancelled) return;

      setRequests(getProductionRequests(clientId));
      setOrders(getOrders(clientId));
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? null,
    [requests, selectedId],
  );

  useEffect(() => {
    setShowRevisionForm(false);
    setRevisionNote(selected?.clientResponse || '');
  }, [selectedId, selected?.clientResponse]);

  const filtered = filter === 'all' ? requests : requests.filter((request) => request.status === filter);

  const getRequestOrder = (requestId: string) =>
    orders.find((order) => order.productionRequestId === requestId);

  const getProgressIndex = (status: ProductionStatus) => {
    if (status === 'revision_requested') return stepOrder.indexOf('quoted');
    return stepOrder.indexOf(status);
  };

  const handleApproveQuote = async () => {
    if (!selected || !client) return;

    try {
      await initializeB2BStore();
      respondToProductionQuote(
        selected.id,
        'approved',
        client.contactPerson,
        client.companyName,
        revisionNote.trim() || undefined,
      );
      setFeedback({ type: 'success', text: 'Quotation approved. AKAR ORME has been notified.' });
      await load();
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : 'Quotation could not be approved.',
      });
    }
  };

  const handleRequestRevision = async () => {
    if (!selected || !client) return;

    const message = revisionNote.trim();
    if (!message) {
      setFeedback({ type: 'error', text: 'Please add a short note about the revision you need.' });
      return;
    }

    try {
      await initializeB2BStore();
      const result = respondToProductionQuote(
        selected.id,
        'revision_requested',
        client.contactPerson,
        client.companyName,
        message,
      );
      setFeedback({ type: 'success', text: 'Revision request sent to AKAR ORME.' });
      await load();
      router.push(`/portal/messages?conversation=${result.conversation.id}`);
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : 'Revision request could not be sent.',
      });
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-white">Production Requests</h1>
        <p className="mt-1 text-sm text-brand-grey">
          Follow quotation and approval progress before an order moves into production.
        </p>
      </div>

      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-green-500/20 bg-green-500/10 text-green-300'
              : 'border-red-500/20 bg-red-500/10 text-red-300'
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
              <p className="text-sm text-brand-grey">No production requests found.</p>
              <Link href="/portal/collections" className="mt-3 inline-block text-xs text-brand-accent-light hover:underline">
                Browse collections →
              </Link>
            </div>
          ) : (
            filtered.map((request) => {
              const config = statusConfig[request.status];
              const order = getRequestOrder(request.id);

              return (
                <button
                  key={request.id}
                  onClick={() => setSelectedId(request.id)}
                  className={`w-full rounded-xl border bg-brand-dark p-4 text-left transition-colors ${
                    selectedId === request.id ? 'border-brand-accent/40' : 'border-brand-dark-3 hover:border-brand-dark-4'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-brand-white">{request.modelName}</p>
                      <p className="mt-0.5 text-xs text-brand-grey">
                        {request.estimatedQuantity.toLocaleString()} pcs · {request.preferredColor}
                      </p>
                      <p className="mt-2 text-[10px] text-brand-grey">
                        Target: {new Date(request.targetDeliveryDate).toLocaleDateString()}
                      </p>
                      {request.clientResponse && request.status === 'revision_requested' && (
                        <p className="mt-1 text-[10px] font-medium text-amber-200">Revision note sent</p>
                      )}
                      {order && (
                        <p className="mt-1 text-[10px] font-medium text-brand-accent-light">
                          Converted to order {order.orderNumber}
                        </p>
                      )}
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${config.bg} ${config.color}`}>
                      {request.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="space-y-5 rounded-xl border border-brand-dark-3 bg-brand-dark p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-brand-white">{selected.modelName}</h2>
                  <p className="text-xs text-brand-grey">Request ID: {selected.id}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusConfig[selected.status].bg} ${statusConfig[selected.status].color}`}>
                  {selected.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium text-brand-grey">Request progress</p>
                <div className="flex items-center gap-1">
                  {stepOrder.map((step, index) => {
                    const currentIndex = getProgressIndex(selected.status);
                    const done = currentIndex >= 0 && index <= currentIndex;

                    return <div key={step} className={`h-1.5 flex-1 rounded-full ${done ? 'bg-brand-accent' : 'bg-brand-dark-3'}`} />;
                  })}
                </div>
                <div className="mt-1 flex justify-between">
                  {stepOrder.map((step) => (
                    <span key={step} className="text-[8px] capitalize text-brand-grey">
                      {step.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Quantity</p>
                  <p className="mt-0.5 text-sm text-brand-white">{selected.estimatedQuantity.toLocaleString()} pcs</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Preferred yarn</p>
                  <p className="mt-0.5 text-sm text-brand-white">{selected.preferredYarn}</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Preferred color</p>
                  <p className="mt-0.5 text-sm text-brand-white">{selected.preferredColor}</p>
                </div>
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">Target delivery</p>
                  <p className="mt-0.5 text-sm text-brand-white">{new Date(selected.targetDeliveryDate).toLocaleDateString()}</p>
                </div>
              </div>

              {selected.notes && (
                <div className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-brand-grey">Your request notes</p>
                  <p className="text-sm text-brand-grey-light">{selected.notes}</p>
                </div>
              )}

              {selected.quotedPrice && (
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-4">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-cyan-400">Quotation</p>
                  <p className="text-lg font-semibold text-cyan-300">{selected.quotedPrice}</p>
                </div>
              )}

              {selected.adminResponse && (
                <div className="rounded-lg border border-brand-accent/20 bg-brand-accent/10 p-3">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-brand-accent-light">Akar Orme response</p>
                  <p className="text-sm text-brand-grey-light">{selected.adminResponse}</p>
                </div>
              )}

              {selected.clientResponse && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-amber-300">Your latest reply</p>
                  <p className="text-sm text-amber-100">{selected.clientResponse}</p>
                </div>
              )}

              {selected.status === 'quoted' && (
                <div className="rounded-xl border border-brand-dark-3 bg-brand-dark-2 p-4">
                  <p className="text-sm font-medium text-brand-white">Quotation ready for your decision</p>
                  <p className="mt-1 text-xs text-brand-grey">
                    Approve the quotation to move forward or request a revision with a short note.
                  </p>

                  {showRevisionForm && (
                    <div className="mt-4">
                      <label className="mb-1 block text-xs text-brand-grey">Revision note</label>
                      <textarea
                        value={revisionNote}
                        onChange={(event) => setRevisionNote(event.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-brand-dark-3 bg-brand-black px-3 py-2 text-sm text-brand-white focus:border-brand-accent focus:outline-none"
                        placeholder="Tell AKAR ORME what should change in the quotation or timing."
                      />
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={handleApproveQuote}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Approve quotation
                    </button>
                    <button
                      onClick={() => setShowRevisionForm((current) => !current)}
                      className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200 hover:bg-amber-500/20"
                    >
                      {showRevisionForm ? 'Hide revision form' : 'Request revision'}
                    </button>
                    {showRevisionForm && (
                      <button
                        onClick={handleRequestRevision}
                        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
                      >
                        Send revision request
                      </button>
                    )}
                  </div>
                </div>
              )}

              {selected.status === 'revision_requested' && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
                  <p className="text-sm text-amber-200">
                    Your revision request has been sent. AKAR ORME will update the quotation and reply in messages.
                  </p>
                  {selected.discussionConversationId && (
                    <Link
                      href={`/portal/messages?conversation=${selected.discussionConversationId}`}
                      className="mt-2 inline-flex text-xs font-medium text-amber-100 hover:underline"
                    >
                      Open message thread
                    </Link>
                  )}
                </div>
              )}

              {getRequestOrder(selected.id) && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <p className="text-sm text-emerald-300">Your request has been approved and converted into a live order.</p>
                  <Link href="/portal/orders" className="mt-2 inline-flex text-xs font-medium text-emerald-200 hover:underline">
                    Open orders page
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-12 text-center">
              <p className="text-sm text-brand-grey">Select a request to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
