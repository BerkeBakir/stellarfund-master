import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { sanitizeEvent, eventBlobPath } from '@/lib/analytics';

// POST /api/events  body: { type, wallet?, campaign?, ref? } -> stores one blob.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  const ev = sanitizeEvent(body);
  if (!ev) return NextResponse.json({ error: 'Invalid event' }, { status: 400 });

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return NextResponse.json({ ok: true, stored: false });

  try {
    await put(eventBlobPath(ev), JSON.stringify(ev), {
      access: 'public',
      contentType: 'application/json',
      token,
      addRandomSuffix: false,
    });
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    // Best effort — never break the UX for analytics.
    return NextResponse.json({ ok: true, stored: false });
  }
}
