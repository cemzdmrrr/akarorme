import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getPersistedModels,
  createPersistedModel,
} from '@/lib/model-store';
import { requireAdmin } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/models — Return all persisted admin models.
 */
export async function GET() {
  try {
    const models = await getPersistedModels();
    return NextResponse.json(models);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}

/**
 * POST /api/models — Create a new model and persist it.
 */
export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Model name is required' }, { status: 400 });
    }

    const model = await createPersistedModel(body);

    // Revalidate frontend pages so changes appear immediately
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');

    return NextResponse.json(model, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create model';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
