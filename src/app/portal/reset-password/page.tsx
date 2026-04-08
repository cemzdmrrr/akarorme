'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { getClientByEmail, initializeB2BStore } from '@/lib/b2b-store';
import { createResetToken, resetPasswordWithToken } from '@/lib/b2b-auth';
import { useEffect } from 'react';

export default function ResetPasswordPage() {
  const [step, setStep] = useState<'request' | 'reset' | 'done'>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { initializeB2BStore(); }, []);

  async function handleRequest(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const client = getClientByEmail(email.trim());
    if (!client) {
      // For security, show same message regardless
      setStep('reset');
      setLoading(false);
      return;
    }

    const t = createResetToken(client.id);
    setToken(t);
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
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    if (newPassword !== confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const inputToken = (data.get('token') as string || token).trim();
    if (!inputToken) {
      setError('Please enter the reset token');
      setLoading(false);
      return;
    }

    const result = await resetPasswordWithToken(inputToken, newPassword);
    if (result.success) {
      setStep('done');
    } else {
      setError(result.error || 'Reset failed');
    }
    setLoading(false);
  }

  if (step === 'done') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-black px-4 font-body">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
            <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-semibold text-brand-white mb-2">Password Reset Successfully</h2>
          <p className="text-sm text-brand-grey mb-6">Your password has been updated. You can now sign in with your new password.</p>
          <Link href="/portal/login" className="inline-block rounded-lg bg-brand-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light transition-colors">
            Sign In
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
          <p className="mt-1 text-sm text-brand-grey">Reset Your Password</p>
        </div>

        <div className="rounded-2xl bg-brand-dark border border-brand-dark-3 p-8">
          {step === 'request' ? (
            <>
              <h2 className="text-lg font-semibold text-brand-white mb-1">Forgot Password</h2>
              <p className="text-sm text-brand-grey mb-6">Enter your email and we will generate a reset token.</p>
              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-grey-light mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                    placeholder="you@company.com"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light transition-colors disabled:opacity-50">
                  {loading ? 'Processing...' : 'Send Reset Token'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-brand-white mb-1">Set New Password</h2>
              <p className="text-sm text-brand-grey mb-2">Enter your reset token and new password.</p>
              {token && (
                <div className="rounded-lg bg-brand-accent/10 border border-brand-accent/20 px-4 py-3 mb-4">
                  <p className="text-xs text-brand-grey mb-1">Your reset token (demo):</p>
                  <p className="text-xs text-brand-accent-light font-mono break-all">{token}</p>
                </div>
              )}
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-grey-light mb-1.5">Reset Token</label>
                  <input name="token" required defaultValue={token} className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white font-mono placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" placeholder="Paste token here" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-grey-light mb-1.5">New Password</label>
                  <input name="password" type="password" required minLength={6} className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" placeholder="Min. 6 characters" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-grey-light mb-1.5">Confirm Password</label>
                  <input name="confirm" type="password" required className="w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" placeholder="Repeat password" />
                </div>
                {error && <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">{error}</div>}
                <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light transition-colors disabled:opacity-50">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          <p className="mt-4 text-center text-xs text-brand-grey">
            <Link href="/portal/login" className="text-brand-accent-light hover:underline">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
