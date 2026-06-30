import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { StrKey } from '@stellar/stellar-sdk';

const token = process.env.BLOB_READ_WRITE_TOKEN;
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// POST /api/campaigns/upload?address=C...&ext=jpg  body: raw image bytes
export async function POST(req: Request) {
  if (!token) return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });

  const url = new URL(req.url);
  const address = url.searchParams.get('address') ?? '';
  if (!StrKey.isValidContract(address)) {
    return NextResponse.json({ error: 'Invalid campaign address' }, { status: 400 });
  }

  const contentType = req.headers.get('content-type') ?? '';
  const ext = TYPES[contentType];
  if (!ext) {
    return NextResponse.json({ error: 'Only JPG, PNG or WEBP allowed' }, { status: 400 });
  }

  const buf = await req.arrayBuffer();
  if (buf.byteLength === 0) {
    return NextResponse.json({ error: 'Empty file' }, { status: 400 });
  }
  if (buf.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be 2 MB or smaller' }, { status: 400 });
  }

  try {
    const blob = await put(`covers/${address}.${ext}`, Buffer.from(buf), {
      access: 'public',
      contentType,
      token,
      allowOverwrite: true,
    });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'upload failed' },
      { status: 502 },
    );
  }
}
