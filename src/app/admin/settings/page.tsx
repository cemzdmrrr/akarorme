'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminContext } from '../template';
import { getSettings, updateSettings } from '@/lib/admin-store';
import { changePassword } from '@/lib/auth';
import type { SiteSettings } from '@/types/admin';

export default function SettingsPage() {
  const { toggleSidebar } = useAdminContext();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password change states
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => { setSettings(getSettings()); }, []);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    updateSettings(settings);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }, 300);
  };

  const handleChangePassword = async () => {
    setPwMsg(null);
    if (!currentPw || !newPw) { setPwMsg({ type: 'error', text: 'All fields are required.' }); return; }
    if (newPw.length < 6) { setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' }); return; }
    if (newPw !== confirmPw) { setPwMsg({ type: 'error', text: 'New passwords do not match.' }); return; }
    setPwLoading(true);
    const ok = await changePassword(currentPw, newPw);
    setPwLoading(false);
    if (ok) {
      setPwMsg({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } else {
      setPwMsg({ type: 'error', text: 'Current password is incorrect.' });
    }
  };

  const inputCls = 'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <>
      <AdminHeader
        title="Settings"
        subtitle="Website configuration"
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
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        }
      />

      <div className="p-4 sm:p-6 max-w-3xl space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* General */}
          <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">General</h3>
            <div>
              <label className={labelCls}>Site Name</label>
              <input value={settings.siteName} onChange={(e) => update('siteName', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Site Description</label>
              <textarea rows={2} value={settings.siteDescription} onChange={(e) => update('siteDescription', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Footer Text</label>
              <input value={settings.footerText} onChange={(e) => update('footerText', e.target.value)} className={inputCls} placeholder="e.g. © 2024 Akar Örme. All rights reserved." />
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">Contact Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={settings.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input value={settings.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Address</label>
              <textarea rows={2} value={settings.address} onChange={(e) => update('address', e.target.value)} className={inputCls} />
            </div>
          </section>

          {/* Social */}
          <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Social Links</h3>
              <button type="button" onClick={addSocial} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add Link</button>
            </div>
            {settings.socialLinks.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">No social links configured</p>
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

        {/* Change Password */}
        <section className="rounded-xl bg-white border border-gray-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">Change Password</h3>
          <div className="space-y-3 max-w-sm">
            <div>
              <label className={labelCls}>Current Password</label>
              <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>New Password</label>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className={inputCls} placeholder="Min 6 characters" />
            </div>
            <div>
              <label className={labelCls}>Confirm New Password</label>
              <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className={inputCls} />
            </div>
            {pwMsg && (
              <p className={`text-xs ${pwMsg.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>{pwMsg.text}</p>
            )}
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={pwLoading}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {pwLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </section>

        {/* Danger zone */}
        <section className="rounded-xl bg-white border border-red-100 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-red-600 pb-2 border-b border-red-50">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Reset All Data</p>
              <p className="text-xs text-gray-500">Clear all CMS data and start fresh with seed data.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('This will delete all your CMS data and reload seed data. Are you sure?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Reset Data
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
