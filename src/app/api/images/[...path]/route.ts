import { NextResponse } from 'next/server';
import { get } from '@vercel/blob';

/**
 * GET /api/images/[...path] — Proxy for serving private Vercel Blob images.
 * Streams directly from blob to client without buffering the entire file in RAM.
 * Caches responses for 1 hour with stale-while-revalidate.
 */
export async function GET(
  _request: Request,
  { params }: { params: { path: string[] } },
) {
  try {
    const blobPath = params.path.join('/');

    // Validate path to prevent directory traversal
    if (blobPath.includes('..') || blobPath.startsWith('/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const result = await get(blobPath, { access: 'private' });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Determine content type from extension
    const ext = blobPath.split('.').pop()?.toLowerCase() || '';
    const contentTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    const contentType = contentTypes[ext] || 'application/octet-stream';

    // Stream directly — no full-file buffering
    return new Response(result.stream as ReadableStream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
}
