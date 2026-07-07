import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isValidEmail, emailKey } from '@/lib/validate';

// Email capture for the weekly digest. One blob per subscriber under
// subscribers/<key>.json — the key de-dupes without storing the raw email in the
// pathname. Degrades to {ok:true, stored:false} if storage is unset.
const token = process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  const email = String(b.email ?? '').trim();
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Enter a valid email' }, { status: 400 });
  }
  if (!token) return NextResponse.json({ ok: true, stored: false });

  const entry = {
    email: email.toLowerCase(),
    wallet: b.wallet ? String(b.wallet).slice(0, 60) : null,
    at: new Date().toISOString(),
  };
  try {
    await put(`subscribers/${emailKey(email)}.json`, JSON.stringify(entry), {
      access: 'public',
      contentType: 'application/json',
      token,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json({ ok: true, stored: false });
  }
}
