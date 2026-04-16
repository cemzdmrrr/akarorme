'use client';

import { useState, type FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { getClientByEmail, initializeB2BStore } from '@/lib/b2b-store';
import { createResetToken, resetPasswordWithToken } from '@/lib/b2b-auth';

export default function ResetPasswordPage() {
  const [step, setStep] = useState<'request' | 'reset' | 'done'>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeB2BStore();
  }, []);

  async function handleRequest(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const client = getClientByEmail(email.trim());
    if (!client) {
      setStep('reset');
      setLoading(false);
      return;
    }

    const newToken = createResetToken(client.id);
    setToken(newToken);
    setStep('reset');
    setLoading(false);
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const newPassword = data.get('password') as string;
    const confirm = data.get('confirm') as string;

    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      setLoading(false);
      return;
    }
    if (newPassword !== confirm) {
      setError('Şifreler eşleşmiyor.');
      setLoading(false);
      return;
    }

    const inputToken = ((data.get('token') as string) || token).trim();
    if (!inputToken) {
      setError('Lütfen sıfırlama kodunu girin.');
      setLoading(false);
      return;
    }

    const result = await resetPasswordWithToken(inputToken, newPassword);
    if (result.success) {
      setStep('done');
    } else {
      setError(result.error || 'Şifre sıfırlanamadı.');
    }
    setLoading(false);
  }

  if (step === 'done') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-black px-4 font-body">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
            <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-brand-white">Şifre Başarıyla Güncellendi</h2>
          <p className="mb-6 text-sm text-brand-grey">Yeni şifreniz kaydedildi. Artık yeni şifrenizle giriş yapabilirsiniz.</p>
          <Link href="/portal/login" className="inline-block rounded-lg bg-brand-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-light">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black px-4 font-body">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-wider text-brand-white">AKAR ÖRME</h1>
          <p className="mt-1 text-sm text-brand-grey">Şifre Sıfırlama</p>
        </div>

        <div className="rounded-2xl border border-brand-dark-3 bg-brand-dark p-8">
          {step === 'request' ? (
            <>
              <h2 className="mb-1 text-lg font-semibold text-brand-white">Şifremi Unuttum</h2>
              <p className="mb-6 text-sm text-brand-grey">E-posta adresinizi girin, sizin için sıfırlama kodu oluşturalım.</p>
              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-brand-grey-light">E-posta</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                    placeholder="ornek@firma.com"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-light disabled:opacity-50">
                  {loading ? 'İşleniyor...' : 'Sıfırlama Kodu Oluştur'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="mb-1 text-lg font-semibold text-brand-white">Yeni Şifre Belirle</h2>
              <p className="mb-2 text-sm text-brand-grey">Sıfırlama kodunuzu ve yeni şifrenizi girin.</p>
              {token && (
                <div className="mb-4 rounded-lg border border-brand-accent/20 bg-brand-accent/10 px-4 py-3">
                  <p className="mb-1 text-xs text-brand-grey">Sıfırlama kodunuz (demo):</p>
                  <p className="break-all font-mono text-xs text-brand-accent-light">{token}</p>
                </div>
              )}
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-brand-grey-light">Sıfırlama Kodu</label>
                  <input name="token" required defaultValue={token} className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 font-mono text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" placeholder="Kodu buraya yapıştırın" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-brand-grey-light">Yeni Şifre</label>
                  <input name="password" type="password" required minLength={6} className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" placeholder="En az 6 karakter" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-brand-grey-light">Şifre Tekrar</label>
                  <input name="confirm" type="password" required className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" placeholder="Şifreyi tekrar girin" />
                </div>
                {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
                <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-light disabled:opacity-50">
                  {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </button>
              </form>
            </>
          )}

          <p className="mt-4 text-center text-xs text-brand-grey">
            <Link href="/portal/login" className="text-brand-accent-light hover:underline">Girişe dön</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
