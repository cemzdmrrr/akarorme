'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { sha256 } from '@/lib/b2b-auth';
import { createClient, getClientByEmail, initializeB2BStore } from '@/lib/b2b-store';
import { useEffect } from 'react';
import type { BusinessType } from '@/types/b2b';

export default function PortalRegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { initializeB2BStore(); }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const email = (data.get('email') as string).trim().toLowerCase();
    const password = data.get('password') as string;
    const confirm = data.get('confirm') as string;

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const existing = getClientByEmail(email);
    if (existing) {
      setError('An account with this email already exists');
      setLoading(false);
      return;
    }

    const passwordHash = await sha256(password);

    createClient({
      email,
      passwordHash,
      companyName: (data.get('companyName') as string).trim(),
      country: (data.get('country') as string).trim(),
      contactPerson: (data.get('contactPerson') as string).trim(),
      phone: (data.get('phone') as string).trim(),
      businessType: data.get('businessType') as BusinessType,
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-black px-4 font-body">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
            <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-semibold text-brand-white mb-2">Registration Submitted</h2>
          <p className="text-sm text-brand-grey mb-6">
            Your registration request has been received. Our team will review your application and you will receive access once approved.
          </p>
          <Link
            href="/portal/login"
            className="inline-block rounded-lg bg-brand-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black px-4 py-12 font-body">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-wider text-brand-white">AKAR ÖRME</h1>
          <p className="mt-1 text-sm text-brand-grey">B2B Portal — Request Access</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-brand-dark border border-brand-dark-3 p-8">
          <h2 className="text-lg font-semibold text-brand-white mb-1">Register Your Company</h2>
          <p className="text-sm text-brand-grey mb-6">Complete the form below. Registration requests are reviewed by our team.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-brand-grey-light mb-1.5">Company Name *</label>
                <input name="companyName" required className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" placeholder="Your company name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-grey-light mb-1.5">Country *</label>
                <input name="country" required className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" placeholder="Country" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-grey-light mb-1.5">Business Type *</label>
                <select name="businessType" required className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20">
                  <option value="fashion_brand">Fashion Brand</option>
                  <option value="wholesaler">Wholesaler</option>
                  <option value="retailer">Retailer</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-brand-grey-light mb-1.5">Contact Person *</label>
                <input name="contactPerson" required className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-grey-light mb-1.5">Email *</label>
                <input name="email" type="email" required className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" placeholder="you@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-grey-light mb-1.5">Phone *</label>
                <input name="phone" type="tel" required className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-grey-light mb-1.5">Password *</label>
                <input name="password" type="password" required minLength={6} className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" placeholder="Min. 6 characters" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-grey-light mb-1.5">Confirm Password *</label>
                <input name="confirm" type="password" required className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" placeholder="Repeat password" />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-brand-grey">
            Already have an account?{' '}
            <Link href="/portal/login" className="text-brand-accent-light hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
