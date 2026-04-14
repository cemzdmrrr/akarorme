/* ===================================================
   Server-side Admin Authentication
   Uses HMAC-SHA256 signed session tokens stored in
   httpOnly cookies. Credentials from env vars.
   =================================================== */

import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  const secret = process.env.ADMIN_API_KEY;
  if (!secret) throw new Error('ADMIN_API_KEY env var is required');
  return secret;
}

// ─── Crypto helpers (Web Crypto API, works in Node 18+ and Edge) ────

async function hmacSign(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return bufToHex(new Uint8Array(sig));
}

async function hmacVerify(payload: string, signature: string): Promise<boolean> {
  const expected = await hmacSign(payload);
  // Constant-time comparison
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return bufToHex(new Uint8Array(hash));
}

function bufToHex(buf: Uint8Array): string {
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
}

// ─── Password Validation ────────────────────────────

export async function validateCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const envUser = process.env.ADMIN_USERNAME;
  const envPassHash = process.env.ADMIN_PASSWORD_HASH;

  if (!envUser || !envPassHash) {
    console.error('ADMIN_USERNAME and ADMIN_PASSWORD_HASH env vars are required');
    return false;
  }

  // Constant-time username comparison
  const userMatch =
    username.length === envUser.length &&
    username.split('').every((c, i) => c === envUser[i]);

  const inputHash = await sha256(password);
  const passMatch =
    inputHash.length === envPassHash.length &&
    inputHash.split('').every((c, i) => c === envPassHash[i]);

  return userMatch && passMatch;
}

// ─── Session Token ──────────────────────────────────

interface SessionPayload {
  sub: string; // username
  exp: number; // expiry timestamp
  iat: number; // issued at
}

async function createSessionToken(username: string): Promise<string> {
  const payload: SessionPayload = {
    sub: username,
    exp: Date.now() + SESSION_DURATION_MS,
    iat: Date.now(),
  };
  const payloadB64 = btoa(JSON.stringify(payload));
  const signature = await hmacSign(payloadB64);
  return `${payloadB64}.${signature}`;
}

async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const valid = await hmacVerify(payloadB64, signature);
  if (!valid) return null;

  try {
    const payload: SessionPayload = JSON.parse(atob(payloadB64));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── Cookie Management ──────────────────────────────

export async function createSession(username: string): Promise<void> {
  const token = await createSessionToken(username);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

// ─── Request Auth Helper (for API routes) ───────────

export async function requireAdmin(request: Request): Promise<
  | { authenticated: true; username: string }
  | { authenticated: false; response: Response }
> {
  // 1. Check session cookie
  const session = await getSession();
  if (session) {
    return { authenticated: true, username: session.sub };
  }

  // 2. Check x-api-key header as fallback (for programmatic access)
  const apiKey = request.headers.get('x-api-key');
  const serverKey = process.env.ADMIN_API_KEY;
  if (apiKey && serverKey && apiKey === serverKey) {
    return { authenticated: true, username: 'api-key' };
  }

  return {
    authenticated: false,
    response: new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }),
  };
}

// ─── Hash utility (for generating ADMIN_PASSWORD_HASH) ─

export { sha256 as hashPassword };
