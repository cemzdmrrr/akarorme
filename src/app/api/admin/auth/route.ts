import { NextResponse } from 'next/server';
import {
  validateCredentials,
  createSession,
  destroySession,
  getSession,
} from '@/lib/server-auth';

/**
 * POST /api/admin/auth — Login
 * Body: { username: string, password: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 },
      );
    }

    const valid = await validateCredentials(username, password);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 },
      );
    }

    await createSession(username);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

/**
 * GET /api/admin/auth — Check auth status
 */
export async function GET() {
  const session = await getSession();
  if (session) {
    return NextResponse.json({ authenticated: true, username: session.sub });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

/**
 * DELETE /api/admin/auth — Logout
 */
export async function DELETE() {
  await destroySession();
  return NextResponse.json({ success: true });
}
