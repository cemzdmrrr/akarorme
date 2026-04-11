import { NextResponse } from 'next/server';
import { get } from '@vercel/blob';

/**
 * GET /api/images/[...path] — Proxy for serving private Vercel Blob images.
 * Reads the blob from private store and streams it to the client.
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

    // Read the stream
    const reader = result.stream.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    const buffer = chunks.reduce((acc, chunk) => {
      const merged = new Uint8Array(acc.length + chunk.length);
      merged.set(acc);
      merged.set(chunk, acc.length);
      return merged;
    }, new Uint8Array(0));

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

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
}
