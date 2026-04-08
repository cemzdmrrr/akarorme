/* ===================================================
   Admin Authentication — localStorage-based
   Uses SubtleCrypto for password hashing (SHA-256).
   =================================================== */

const AUTH_KEY = 'admin_auth';
const SESSION_KEY = 'admin_session';
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'Akar1973.'; // Change this default password immediately after first login!
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

async function sha256(text: string): Promise<string> {
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

export async function initializeAuth(): Promise<void> {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(AUTH_KEY);
  if (existing) return;
  const passwordHash = await sha256(DEFAULT_PASSWORD);
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ username: DEFAULT_USERNAME, passwordHash })
  );
}

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined') return { success: false, error: 'SSR' };

  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) {
    await initializeAuth();
    return login(username, password);
  }

  const auth = JSON.parse(raw) as { username: string; passwordHash: string };
  const inputHash = await sha256(password);

  if (username !== auth.username || inputHash !== auth.passwordHash) {
    return { success: false, error: 'Invalid username or password' };
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
  localStorage.setItem(SESSION_KEY, JSON.stringify({ token, expiresAt }));

  return { success: true };
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return false;
  try {
    const session = JSON.parse(raw) as { token: string; expiresAt: string };
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined') return { success: false };

  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return { success: false, error: 'No auth data' };

  const auth = JSON.parse(raw) as { username: string; passwordHash: string };
  const currentHash = await sha256(currentPassword);

  if (currentHash !== auth.passwordHash) {
    return { success: false, error: 'Current password is incorrect' };
  }

  const newHash = await sha256(newPassword);
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ username: auth.username, passwordHash: newHash })
  );

  return { success: true };
}
