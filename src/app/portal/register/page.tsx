'use client';

import Link from 'next/link';

export default function PortalRegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black px-4 py-12 font-body">
      <div className="w-full max-w-lg rounded-2xl border border-brand-dark-3 bg-brand-dark p-8 text-center">
        <h1 className="font-display text-2xl font-bold tracking-wider text-brand-white">AKAR ORME</h1>
        <p className="mt-2 text-sm text-brand-grey">B2B Portal Access</p>

        <div className="mt-8 rounded-2xl border border-brand-dark-3 bg-brand-dark-2 px-6 py-8">
          <h2 className="text-lg font-semibold text-brand-white">Accounts are opened by AKAR ORME</h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-grey-light">
            This portal works with company accounts created by our team. Once your company is approved, we share your login details directly with you.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-brand-grey-light">
            If you would like access, please contact your AKAR ORME representative or reach out through the contact page.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/portal/login"
              className="inline-flex items-center justify-center rounded-lg border border-brand-dark-3 px-5 py-2.5 text-sm font-medium text-brand-grey-light hover:text-brand-white transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
