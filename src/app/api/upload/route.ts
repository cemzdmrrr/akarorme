import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

/**
 * POST /api/upload — Upload an image to Vercel Blob (public access).
 * Accepts multipart/form-data with a "file" field.
 * Auth: accepts x-api-key if configured, otherwise allows upload
 * (file type/size validation still enforced).
 * Returns { url: string } on success.
 */
export async function POST(request: Request) {
  try {
    // If ADMIN_API_KEY is configured, validate it
    const serverKey = process.env.ADMIN_API_KEY;
    if (serverKey) {
      const apiKey = request.headers.get('x-api-key');
      if (apiKey && apiKey !== serverKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WebP, GIF allowed.' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum 10MB.' }, { status: 400 });
    }

    // Generate a unique filename
    const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
    const filename = `models/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
