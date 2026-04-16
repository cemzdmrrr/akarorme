'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { b2bLogin, isB2BAuthenticated } from '@/lib/b2b-auth';
import { initializeB2BStore } from '@/lib/b2b-store';

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeB2BStore();
    if (isB2BAuthenticated()) router.replace('/portal');
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await b2bLogin(email.trim(), password);
    if (result.success) {
      router.push('/portal');
    } else {
      setError(result.error || 'Giriş yapılamadı.');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black px-4 font-body">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-wider text-brand-white">AKAR ÖRME</h1>
          <p className="mt-1 text-sm text-brand-grey">B2B Müşteri Portalı</p>
        </div>

        <div className="rounded-2xl border border-brand-dark-3 bg-brand-dark p-8">
          <h2 className="mb-1 text-lg font-semibold text-brand-white">Giriş Yap</h2>
          <p className="mb-6 text-sm text-brand-grey">
            Firmanız için paylaşılan giriş bilgileriyle portal hesabınıza erişebilirsiniz.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-grey-light">E-posta</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                placeholder="ornek@firma.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-grey-light">Şifre</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-light disabled:opacity-50"
            >
              {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs">
            <Link href="/portal/reset-password" className="text-brand-accent-light hover:underline">
              Şifremi unuttum
            </Link>
            <Link href="/contact" className="text-brand-accent-light hover:underline">
              Erişim talep et
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-brand-dark-3 bg-brand-dark-2 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-brand-grey">Hesap erişimi</p>
          <p className="mt-1 text-xs text-brand-grey-light">
            Portal hesapları AKAR ÖRME tarafından açılır. Firmanızın erişime ihtiyacı varsa müşteri temsilcinizle iletişime geçebilir veya iletişim sayfasını kullanabilirsiniz.
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-brand-grey transition-colors hover:text-brand-white">
            Ana siteye dön
          </Link>
        </div>
      </div>
    </div>
  );
}
