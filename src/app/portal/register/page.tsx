'use client';

import Link from 'next/link';

export default function PortalRegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black px-4 py-12 font-body">
      <div className="w-full max-w-lg rounded-2xl border border-brand-dark-3 bg-brand-dark p-8 text-center">
        <h1 className="font-display text-2xl font-bold tracking-wider text-brand-white">AKAR ÖRME</h1>
        <p className="mt-2 text-sm text-brand-grey">B2B Portal Erişimi</p>

        <div className="mt-8 rounded-2xl border border-brand-dark-3 bg-brand-dark-2 px-6 py-8">
          <h2 className="text-lg font-semibold text-brand-white">Hesaplar AKAR ÖRME tarafından açılır</h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-grey-light">
            Bu portal, ekibimiz tarafından oluşturulan firma hesaplarıyla çalışır. Firmanız onaylandıktan sonra giriş bilgileriniz sizinle doğrudan paylaşılır.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-brand-grey-light">
            Erişim talep etmek isterseniz AKAR ÖRME temsilcinizle iletişime geçebilir veya iletişim sayfasını kullanabilirsiniz.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-light"
            >
              İletişime Geç
            </Link>
            <Link
              href="/portal/login"
              className="inline-flex items-center justify-center rounded-lg border border-brand-dark-3 px-5 py-2.5 text-sm font-medium text-brand-grey-light transition-colors hover:text-brand-white"
            >
              Girişe Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
