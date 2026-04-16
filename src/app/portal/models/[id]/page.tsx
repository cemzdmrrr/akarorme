'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getModel } from '@/lib/admin-store';
import { getCurrentClientId } from '@/lib/b2b-auth';
import { addFavorite, removeFavorite, isFavorited, createSampleRequest, createProductionRequest, createConversation, sendMessage } from '@/lib/b2b-store';
import { usePortalContext } from '@/app/portal/template';
import type { AdminModel } from '@/types/admin';

type ModalType = 'sample' | 'production' | 'question' | null;

export default function PortalModelDetail() {
  const params = useParams();
  const router = useRouter();
  const { client } = usePortalContext();
  const [model, setModel] = useState<AdminModel | null>(null);
  const [fav, setFav] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const id = params.id as string;
    const m = getModel(id);
    if (!m) { router.replace('/portal/collections'); return; }
    setModel(m);
    const cid = getCurrentClientId();
    if (cid) setFav(isFavorited(cid, id));
  }, [params.id, router]);

  function toggleFav() {
    const cid = getCurrentClientId();
    if (!cid || !model) return;
    if (fav) {
      removeFavorite(cid, model.id);
      setFav(false);
    } else {
      addFavorite({
        clientId: cid,
        modelId: model.id,
        modelName: model.name,
        modelImage: model.images[0] || '',
        collection: model.collection,
      });
      setFav(true);
    }
  }

  function handleSampleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cid = getCurrentClientId();
    if (!cid || !model) return;
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    createSampleRequest({
      clientId: cid,
      modelId: model.id,
      modelName: model.name,
      colorPreference: data.get('color') as string,
      quantity: parseInt(data.get('quantity') as string),
      deliveryCountry: data.get('country') as string,
      notes: data.get('notes') as string,
    });
    setModal(null);
    setSuccess('Sample request submitted successfully!');
    setTimeout(() => setSuccess(''), 4000);
  }

  function handleProductionSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cid = getCurrentClientId();
    if (!cid || !model) return;
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    createProductionRequest({
      clientId: cid,
      modelId: model.id,
      modelName: model.name,
      estimatedQuantity: parseInt(data.get('quantity') as string),
      preferredYarn: data.get('yarn') as string,
      preferredColor: data.get('color') as string,
      targetDeliveryDate: data.get('delivery') as string,
      notes: data.get('notes') as string,
    });
    setModal(null);
    setSuccess('Production request submitted successfully!');
    setTimeout(() => setSuccess(''), 4000);
  }

  function handleQuestionSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cid = getCurrentClientId();
    if (!cid || !model || !client) return;

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const subject = (data.get('subject') as string)?.trim() || `Question about ${model.name}`;
    const body = (data.get('message') as string)?.trim();
    if (!body) return;

    const conversation = createConversation(cid, client.contactPerson, client.companyName, subject);
    sendMessage(conversation.id, cid, 'client', client.contactPerson, subject, body);

    setModal(null);
    router.push(`/portal/messages?conversation=${conversation.id}`);
  }

  if (!model) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  const inputClass = "w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/20";

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-brand-grey mb-6">
        <Link href="/portal/collections" className="hover:text-brand-white transition-colors">Collections</Link>
        <span>/</span>
        <span className="text-brand-white">{model.name}</span>
      </nav>

      {/* Success toast */}
      {success && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-green-500/15 border border-green-500/30 px-5 py-3 text-sm text-green-400 animate-fade-up">
          ✓ {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Images */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main image area */}
          <div className="aspect-square rounded-2xl bg-brand-dark-2 swatch-placeholder border border-brand-dark-3 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl text-brand-dark-4 opacity-20 font-display font-bold">{model.name.slice(0, 2)}</span>
            </div>
          </div>
          {/* Color swatches */}
          <div>
            <h3 className="text-xs font-medium text-brand-grey mb-2">Available Colors</h3>
            <div className="flex flex-wrap gap-2">
              {model.colors.map((c) => (
                <div key={c.hex} className="flex items-center gap-2 rounded-lg bg-brand-dark border border-brand-dark-3 px-3 py-2">
                  <div className="h-5 w-5 rounded-full border border-brand-dark-4" style={{ backgroundColor: c.hex }} />
                  <span className="text-xs text-brand-grey-light">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="rounded-full bg-brand-dark-2 px-2.5 py-0.5 text-[10px] font-medium text-brand-grey">{model.season}</span>
              <span className="rounded-full bg-brand-dark-2 px-2.5 py-0.5 text-[10px] font-medium text-brand-grey">{model.collection}</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-brand-white mt-2">{model.name}</h1>
            <p className="text-lg text-brand-accent-light mt-1">{model.tagline}</p>
          </div>

          <p className="text-sm text-brand-grey-light leading-relaxed">{model.description}</p>

          {/* Technical Specs */}
          <div className="rounded-xl bg-brand-dark border border-brand-dark-3 p-5">
            <h2 className="text-sm font-semibold text-brand-white mb-4">Technical Specifications</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-brand-dark-2 p-3">
                <p className="text-[10px] text-brand-grey uppercase tracking-wider">Fabric Structure</p>
                <p className="text-sm font-medium text-brand-white mt-0.5">{model.fabricType}</p>
              </div>
              <div className="rounded-lg bg-brand-dark-2 p-3">
                <p className="text-[10px] text-brand-grey uppercase tracking-wider">Yarn Type</p>
                <p className="text-sm font-medium text-brand-white mt-0.5">{model.yarnType}</p>
              </div>
              <div className="rounded-lg bg-brand-dark-2 p-3">
                <p className="text-[10px] text-brand-grey uppercase tracking-wider">Gauge</p>
                <p className="text-sm font-medium text-brand-white mt-0.5">{model.gauge}</p>
              </div>
              {model.technicalDetails.map((td) => (
                <div key={td.label} className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] text-brand-grey uppercase tracking-wider">{td.label}</p>
                  <p className="text-sm font-medium text-brand-white mt-0.5">{td.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setModal('question')}
              className="rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-5 py-2.5 text-sm font-medium text-brand-grey-light hover:text-brand-white hover:border-brand-dark-4 transition-colors"
            >
              Ask a Question
            </button>
            <button
              onClick={() => setModal('sample')}
              className="rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light transition-colors"
            >
              Request Sample
            </button>
            <button
              onClick={() => setModal('production')}
              className="rounded-lg border border-brand-accent/40 bg-brand-accent/10 px-5 py-2.5 text-sm font-medium text-brand-accent-light hover:bg-brand-accent/20 transition-colors"
            >
              Request Production
            </button>
            <button
              onClick={toggleFav}
              className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors ${
                fav
                  ? 'border-pink-500/40 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20'
                  : 'border-brand-dark-3 bg-brand-dark-2 text-brand-grey hover:text-brand-white hover:border-brand-dark-4'
              }`}
            >
              {fav ? '♥ Saved' : '♡ Save Model'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-brand-dark border border-brand-dark-3 p-6" onClick={(e) => e.stopPropagation()}>
            {modal === 'question' ? (
              <>
                <h2 className="text-lg font-semibold text-brand-white mb-1">Ask About This Model</h2>
                <p className="text-xs text-brand-grey mb-4">Model: {model.name}</p>
                <form onSubmit={handleQuestionSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-brand-grey mb-1">Subject</label>
                    <input
                      name="subject"
                      defaultValue={`Question about ${model.name}`}
                      className={inputClass}
                      placeholder="Message subject"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-grey mb-1">Message</label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      className={inputClass}
                      placeholder="Ask about yarn, MOQ, lead time, color options, pricing approach..."
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light transition-colors">
                      Send Message
                    </button>
                    <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-brand-dark-3 px-4 py-2.5 text-sm text-brand-grey hover:text-brand-white transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : modal === 'sample' ? (
              <>
                <h2 className="text-lg font-semibold text-brand-white mb-1">Request Sample</h2>
                <p className="text-xs text-brand-grey mb-4">Model: {model.name}</p>
                <form onSubmit={handleSampleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-brand-grey mb-1">Color Preference</label>
                    <input name="color" required className={inputClass} placeholder="e.g. Navy, White" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-grey mb-1">Quantity</label>
                    <input name="quantity" type="number" min="1" required className={inputClass} placeholder="Number of samples" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-grey mb-1">Delivery Country</label>
                    <input name="country" required defaultValue={client?.country} className={inputClass} placeholder="Country" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-grey mb-1">Additional Notes</label>
                    <textarea name="notes" rows={3} className={inputClass} placeholder="Any special requirements..." />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light transition-colors">
                      Submit Request
                    </button>
                    <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-brand-dark-3 px-4 py-2.5 text-sm text-brand-grey hover:text-brand-white transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-brand-white mb-1">Request Production</h2>
                <p className="text-xs text-brand-grey mb-4">Model: {model.name}</p>
                <form onSubmit={handleProductionSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-brand-grey mb-1">Estimated Quantity</label>
                    <input name="quantity" type="number" min="100" required className={inputClass} placeholder="e.g. 5000" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-grey mb-1">Preferred Yarn</label>
                    <input name="yarn" required defaultValue={model.yarnType} className={inputClass} placeholder="Yarn composition" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-grey mb-1">Preferred Color</label>
                    <input name="color" required className={inputClass} placeholder="Color or Pantone reference" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-grey mb-1">Target Delivery Date</label>
                    <input name="delivery" type="date" required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-grey mb-1">Additional Notes</label>
                    <textarea name="notes" rows={3} className={inputClass} placeholder="Special requirements, Pantone refs, sizing..." />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light transition-colors">
                      Submit Request
                    </button>
                    <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-brand-dark-3 px-4 py-2.5 text-sm text-brand-grey hover:text-brand-white transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
