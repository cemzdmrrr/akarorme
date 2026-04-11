import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getPersistedModels,
  updatePersistedModel,
  deletePersistedModel,
} from '@/lib/model-store';

function authorize(request: Request): boolean {
  const serverKey = process.env.ADMIN_API_KEY;
  // If no server key configured, allow all requests
  if (!serverKey) return true;
  const apiKey = request.headers.get('x-api-key');
  return apiKey === serverKey;
}

/**
 * GET /api/models/[id] — Return a single model by ID.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const models = await getPersistedModels();
    const model = models.find((m) => m.id === params.id);
    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }
    return NextResponse.json(model);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch model' }, { status: 500 });
  }
}

/**
 * PUT /api/models/[id] — Update an existing model.
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    if (!authorize(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updated = await updatePersistedModel(params.id, body);

    if (!updated) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');

    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update model';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/models/[id] — Delete a model.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    if (!authorize(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deleted = await deletePersistedModel(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete model';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
