/* ===================================================
   B2B Authentication — localStorage-based
   Separate auth system for B2B clients (not admin).
   Uses SubtleCrypto for password hashing (SHA-256).
   =================================================== */

const B2B_SESSION_KEY = 'b2b_session';
const B2B_RESET_TOKENS_KEY = 'b2b_reset_tokens';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

import type { B2BSession, PasswordResetToken } from '@/types/b2b';

export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function b2bLogin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined') return { success: false, error: 'SSR' };

  // Dynamically import to avoid circular deps
  const { getClientByEmail } = await import('@/lib/b2b-store');
  const client = getClientByEmail(email);

  if (!client) {
    return { success: false, error: 'Invalid email or password' };
  }

  if (client.status === 'pending') {
    return { success: false, error: 'Your registration is pending approval. Please wait for admin confirmation.' };
  }

  if (client.status === 'rejected') {
    return { success: false, error: 'Your registration has been rejected. Please contact us for more information.' };
  }

  const inputHash = await sha256(password);
  if (inputHash !== client.passwordHash) {
    return { success: false, error: 'Invalid email or password' };
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
  const session: B2BSession = {
    token,
    clientId: client.id,
    role: client.role,
    expiresAt,
  };
  localStorage.setItem(B2B_SESSION_KEY, JSON.stringify(session));

  // Update last login
  const { updateClient } = await import('@/lib/b2b-store');
  updateClient(client.id, { lastLoginAt: new Date().toISOString() });

  return { success: true };
}

export function b2bLogout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(B2B_SESSION_KEY);
}

export function getB2BSession(): B2BSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(B2B_SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as B2BSession;
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(B2B_SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function isB2BAuthenticated(): boolean {
  return getB2BSession() !== null;
}

export function getCurrentClientId(): string | null {
  const session = getB2BSession();
  return session?.clientId ?? null;
}

export async function b2bChangePassword(
  clientId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined') return { success: false };

  const { getClient, updateClient } = await import('@/lib/b2b-store');
  const client = getClient(clientId);
  if (!client) return { success: false, error: 'Client not found' };

  const currentHash = await sha256(currentPassword);
  if (currentHash !== client.passwordHash) {
    return { success: false, error: 'Current password is incorrect' };
  }

  const newHash = await sha256(newPassword);
  updateClient(clientId, { passwordHash: newHash });

  return { success: true };
}

// ─── Password Reset (simulated — in a real app, email would be sent) ───
export function createResetToken(clientId: string): string {
  const token = generateToken();
  const tokens = getResetTokens();
  tokens.push({
    token,
    clientId,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
    used: false,
  });
  if (typeof window !== 'undefined') {
    localStorage.setItem(B2B_RESET_TOKENS_KEY, JSON.stringify(tokens));
  }
  return token;
}

function getResetTokens(): PasswordResetToken[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(B2B_RESET_TOKENS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const tokens = getResetTokens();
  const entry = tokens.find((t) => t.token === token && !t.used);

  if (!entry) return { success: false, error: 'Invalid or expired reset token' };
  if (new Date(entry.expiresAt) < new Date()) return { success: false, error: 'Reset token has expired' };

  const { updateClient } = await import('@/lib/b2b-store');
  const newHash = await sha256(newPassword);
  updateClient(entry.clientId, { passwordHash: newHash });

  entry.used = true;
  if (typeof window !== 'undefined') {
    localStorage.setItem(B2B_RESET_TOKENS_KEY, JSON.stringify(tokens));
  }

  return { success: true };
}
