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
    if (!m) {
      router.replace('/portal/collections');
      return;
    }
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
      quantity: parseInt(data.get('quantity') as string, 10),
      deliveryCountry: data.get('country') as string,
      notes: data.get('notes') as string,
    });
    setModal(null);
    setSuccess('Numune talebiniz başarıyla gönderildi.');
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
      estimatedQuantity: parseInt(data.get('quantity') as string, 10),
      preferredYarn: data.get('yarn') as string,
      preferredColor: data.get('color') as string,
      targetDeliveryDate: data.get('delivery') as string,
      notes: data.get('notes') as string,
    });
    setModal(null);
    setSuccess('Üretim talebiniz başarıyla gönderildi.');
    setTimeout(() => setSuccess(''), 4000);
  }

  function handleQuestionSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cid = getCurrentClientId();
    if (!cid || !model || !client) return;

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const subject = (data.get('subject') as string)?.trim() || `${model.name} modeli hakkında soru`;
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

  const inputClass = 'w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/20';

  return (
    <div className="p-6 lg:p-8">
      <nav className="mb-6 flex items-center gap-2 text-xs text-brand-grey">
        <Link href="/portal/collections" className="transition-colors hover:text-brand-white">Koleksiyonlar</Link>
        <span>/</span>
        <span className="text-brand-white">{model.name}</span>
      </nav>

      {success && (
        <div className="animate-fade-up fixed right-4 top-4 z-50 rounded-lg border border-green-500/30 bg-green-500/15 px-5 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-brand-dark-3 bg-brand-dark-2 swatch-placeholder">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-6xl font-bold text-brand-dark-4 opacity-20">{model.name.slice(0, 2)}</span>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-medium text-brand-grey">Mevcut Renkler</h3>
            <div className="flex flex-wrap gap-2">
              {model.colors.map((c) => (
                <div key={c.hex} className="flex items-center gap-2 rounded-lg border border-brand-dark-3 bg-brand-dark px-3 py-2">
                  <div className="h-5 w-5 rounded-full border border-brand-dark-4" style={{ backgroundColor: c.hex }} />
                  <span className="text-xs text-brand-grey-light">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-3">
          <div>
            <div className="mb-1 flex items-center gap-3">
              <span className="rounded-full bg-brand-dark-2 px-2.5 py-0.5 text-[10px] font-medium text-brand-grey">{model.season}</span>
              <span className="rounded-full bg-brand-dark-2 px-2.5 py-0.5 text-[10px] font-medium text-brand-grey">{model.collection}</span>
            </div>
            <h1 className="mt-2 text-3xl font-display font-bold text-brand-white">{model.name}</h1>
            <p className="mt-1 text-lg text-brand-accent-light">{model.tagline}</p>
          </div>

          <p className="text-sm leading-relaxed text-brand-grey-light">{model.description}</p>

          <div className="rounded-xl border border-brand-dark-3 bg-brand-dark p-5">
            <h2 className="mb-4 text-sm font-semibold text-brand-white">Teknik Özellikler</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-brand-dark-2 p-3">
                <p className="text-[10px] uppercase tracking-wider text-brand-grey">Kumaş Yapısı</p>
                <p className="mt-0.5 text-sm font-medium text-brand-white">{model.fabricType}</p>
              </div>
              <div className="rounded-lg bg-brand-dark-2 p-3">
                <p className="text-[10px] uppercase tracking-wider text-brand-grey">İplik Türü</p>
                <p className="mt-0.5 text-sm font-medium text-brand-white">{model.yarnType}</p>
              </div>
              <div className="rounded-lg bg-brand-dark-2 p-3">
                <p className="text-[10px] uppercase tracking-wider text-brand-grey">Numara</p>
                <p className="mt-0.5 text-sm font-medium text-brand-white">{model.gauge}</p>
              </div>
              {model.technicalDetails.map((td) => (
                <div key={td.label} className="rounded-lg bg-brand-dark-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-brand-grey">{td.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-brand-white">{td.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setModal('question')}
              className="rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-5 py-2.5 text-sm font-medium text-brand-grey-light transition-colors hover:border-brand-dark-4 hover:text-brand-white"
            >
              Soru Sor
            </button>
            <button
              onClick={() => setModal('sample')}
              className="rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-light"
            >
              Numune Talep Et
            </button>
            <button
              onClick={() => setModal('production')}
              className="rounded-lg border border-brand-accent/40 bg-brand-accent/10 px-5 py-2.5 text-sm font-medium text-brand-accent-light transition-colors hover:bg-brand-accent/20"
            >
              Üretim Talebi Oluştur
            </button>
            <button
              onClick={toggleFav}
              className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors ${
                fav
                  ? 'border-pink-500/40 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20'
                  : 'border-brand-dark-3 bg-brand-dark-2 text-brand-grey hover:border-brand-dark-4 hover:text-brand-white'
              }`}
            >
              {fav ? 'Kaydedildi' : 'Modeli Kaydet'}
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="w-full max-w-md rounded-2xl border border-brand-dark-3 bg-brand-dark p-6" onClick={(e) => e.stopPropagation()}>
            {modal === 'question' ? (
              <>
                <h2 className="mb-1 text-lg font-semibold text-brand-white">Bu Model Hakkında Sor</h2>
                <p className="mb-4 text-xs text-brand-grey">Model: {model.name}</p>
                <form onSubmit={handleQuestionSubmit} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-grey">Konu</label>
                    <input
                      name="subject"
                      defaultValue={`${model.name} modeli hakkında soru`}
                      className={inputClass}
                      placeholder="Mesaj konusu"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-grey">Mesaj</label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      className={inputClass}
                      placeholder="İplik, minimum sipariş, termin, renk seçenekleri veya fiyat yaklaşımı hakkında sorunuzu yazın..."
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-light">
                      Mesajı Gönder
                    </button>
                    <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-brand-dark-3 px-4 py-2.5 text-sm text-brand-grey transition-colors hover:text-brand-white">
                      Vazgeç
                    </button>
                  </div>
                </form>
              </>
            ) : modal === 'sample' ? (
              <>
                <h2 className="mb-1 text-lg font-semibold text-brand-white">Numune Talep Et</h2>
                <p className="mb-4 text-xs text-brand-grey">Model: {model.name}</p>
                <form onSubmit={handleSampleSubmit} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-grey">Renk Tercihi</label>
                    <input name="color" required className={inputClass} placeholder="Örn. Lacivert, Ekru" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-grey">Adet</label>
                    <input name="quantity" type="number" min="1" required className={inputClass} placeholder="Numune adedi" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-grey">Teslimat Ülkesi</label>
                    <input name="country" required defaultValue={client?.country} className={inputClass} placeholder="Ülke" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-grey">Ek Notlar</label>
                    <textarea name="notes" rows={3} className={inputClass} placeholder="Varsa özel isteklerinizi yazın..." />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-light">
                      Talebi Gönder
                    </button>
                    <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-brand-dark-3 px-4 py-2.5 text-sm text-brand-grey transition-colors hover:text-brand-white">
                      Vazgeç
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="mb-1 text-lg font-semibold text-brand-white">Üretim Talebi Oluştur</h2>
                <p className="mb-4 text-xs text-brand-grey">Model: {model.name}</p>
                <form onSubmit={handleProductionSubmit} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-grey">Tahmini Adet</label>
                    <input name="quantity" type="number" min="100" required className={inputClass} placeholder="Örn. 5000" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-grey">Tercih Edilen İplik</label>
                    <input name="yarn" required defaultValue={model.yarnType} className={inputClass} placeholder="İplik kompozisyonu" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-grey">Tercih Edilen Renk</label>
                    <input name="color" required className={inputClass} placeholder="Renk veya Pantone kodu" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-grey">Hedef Teslim Tarihi</label>
                    <input name="delivery" type="date" required className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-grey">Ek Notlar</label>
                    <textarea name="notes" rows={3} className={inputClass} placeholder="Özel istekler, Pantone referansları, beden bilgileri..." />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-light">
                      Talebi Gönder
                    </button>
                    <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-brand-dark-3 px-4 py-2.5 text-sm text-brand-grey transition-colors hover:text-brand-white">
                      Vazgeç
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
