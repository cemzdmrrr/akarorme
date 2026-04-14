'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminContext } from '../template';
import { fetchSettings, apiUpdateSettings } from '@/lib/admin-api';
import type { SiteSettings } from '@/types/admin';

export default function SettingsPage() {
  const { toggleSidebar } = useAdminContext();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings().then(setSettings).catch(console.error);
  }, []);

  if (!settings) return null;

  const update = (key: keyof SiteSettings, value: string) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const updateSocial = (index: number, key: 'platform' | 'url', value: string) => {
    const next = [...settings.socialLinks];
    next[index] = { ...next[index], [key]: value };
    setSettings({ ...settings, socialLinks: next });
    setSaved(false);
  };

  const addSocial = () => {
    setSettings({ ...settings, socialLinks: [...settings.socialLinks, { platform: '', url: '' }] });
  };

  const removeSocial = (i: number) => {
    setSettings({ ...settings, socialLinks: settings.socialLinks.filter((_, idx) => idx !== i) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await apiUpdateSettings(settings);
      setSettings(updated);
      setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  const inputCls = 'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <>
      <AdminHeader
        title="Ayarlar"
        subtitle="Web sitesi yapılandırması"
        onMenuToggle={toggleSidebar}
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
              saved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : saved ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            ) : null}
            {saved ? 'Kaydedildi!' : 'Ayarları Kaydet'}
          </button>
        }
      />

      <div className="p-4 sm:p-6 max-w-3xl space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* General */}
          <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">Genel</h3>
            <div>
              <label className={labelCls}>Site Adı</label>
              <input value={settings.siteName} onChange={(e) => update('siteName', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Site Açıklaması</label>
              <textarea rows={2} value={settings.siteDescription} onChange={(e) => update('siteDescription', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Alt Bilgi Metni</label>
              <input value={settings.footerText} onChange={(e) => update('footerText', e.target.value)} className={inputCls} placeholder="ör. © 2024 Akar Örme. Tüm hakları saklıdır." />
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">İletişim Bilgileri</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>E-posta</label>
                <input type="email" value={settings.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Telefon</label>
                <input value={settings.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Adres</label>
              <textarea rows={2} value={settings.address} onChange={(e) => update('address', e.target.value)} className={inputCls} />
            </div>
          </section>

          {/* Social */}
          <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Sosyal Bağlantılar</h3>
              <button type="button" onClick={addSocial} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Bağlantı Ekle</button>
            </div>
            {settings.socialLinks.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">Sosyal bağlantı yapılandırılmadı</p>
            )}
            <div className="space-y-2">
              {settings.socialLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={link.platform}
                    onChange={(e) => updateSocial(i, 'platform', e.target.value)}
                    className="w-36 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-400 focus:outline-none"
                  >
                    <option value="">Platform</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="pinterest">Pinterest</option>
                  </select>
                  <input
                    value={link.url}
                    onChange={(e) => updateSocial(i, 'url', e.target.value)}
                    className={`flex-1 ${inputCls}`}
                    placeholder="https://..."
                  />
                  <button type="button" onClick={() => removeSocial(i)} className="shrink-0 rounded-lg p-2 text-gray-400 hover:text-red-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </form>

        {/* Auth Info */}
        <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">Kimlik Doğrulama</h3>
          <p className="text-sm text-gray-500">
            Admin giriş bilgileri sunucu tarafında yönetilmektedir. Şifre veya kullanıcı adını değiştirmek için
            Vercel Dashboard &rarr; Settings &rarr; Environment Variables bölümünden{' '}
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">ADMIN_USERNAME</code> ve{' '}
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">ADMIN_PASSWORD_HASH</code> değerlerini güncelleyin.
          </p>
        </section>

        {/* Danger zone */}
        <section className="rounded-xl bg-white border border-red-100 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-red-600 pb-2 border-b border-red-50">Tehlikeli Bölge</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Tüm Verileri Sıfırla</p>
              <p className="text-xs text-gray-500">Tüm CMS verilerini temizleyin ve varsayılan verilerle yeniden başlatın.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Bu, tüm CMS verilerinizi silecek ve varsayılan verileri yeniden yükleyecektir. Emin misiniz?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Verileri Sıfırla
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
