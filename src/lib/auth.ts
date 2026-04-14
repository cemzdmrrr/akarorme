/* ===================================================
   Admin Authentication — Server-side cookie-based
   All auth is handled via /api/admin/auth endpoint.
   Session stored in httpOnly cookie, NOT localStorage.
   =================================================== */

/** No-op for backward compatibility (no client-side init needed) */
export async function initializeAuth(): Promise<void> {
  // Server-side auth requires no client initialization
}

export async function login(
  username: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/admin/auth', { method: 'DELETE' });
  } catch {
    // Silent fail
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/auth', { cache: 'no-store' });
    return res.ok;
  } catch {
    return false;
  }
}
