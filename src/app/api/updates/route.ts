import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { StrKey } from '@stellar/stellar-sdk';

// Campaign updates posted by creators. One blob per update under
// updates/<campaign>/<ts>.json (no read-modify-write contention).
export type CampaignUpdate = {
  campaign: string;
  title: string;
  body: string;
  author: string; // creator wallet (self-declared; UI only shows for own campaigns)
  at: string;
};

const token = process.env.BLOB_READ_WRITE_TOKEN;

// GET /api/updates?campaign=<addr> -> { updates: CampaignUpdate[] } (newest first)
export async function GET(req: Request) {
  const campaign = new URL(req.url).searchParams.get('campaign') ?? '';
  if (!StrKey.isValidContract(campaign)) {
    return NextResponse.json({ error: 'Invalid campaign' }, { status: 400 });
  }
  if (!token) return NextResponse.json({ updates: [] });
  try {
    const { blobs } = await list({ prefix: `updates/${campaign}/`, token });
    const updates = (
      await Promise.all(
        blobs
          .filter((b) => b.pathname.endsWith('.json'))
          .map(async (b) => {
            try {
              return (await (await fetch(b.url, { cache: 'no-store' })).json()) as CampaignUpdate;
            } catch {
              return null;
            }
          }),
      )
    ).filter((u): u is CampaignUpdate => u !== null);
    updates.sort((a, b) => b.at.localeCompare(a.at));
    return NextResponse.json({ updates });
  } catch {
    return NextResponse.json({ updates: [] });
  }
}

// POST /api/updates  body: { campaign, title, body, author }
export async function POST(req: Request) {
  if (!token) return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  const campaign = String(b.campaign ?? '');
  if (!StrKey.isValidContract(campaign)) {
    return NextResponse.json({ error: 'Invalid campaign' }, { status: 400 });
  }
  const title = String(b.title ?? '').trim().slice(0, 120);
  const body = String(b.body ?? '').trim().slice(0, 2000);
  if (!title || !body) return NextResponse.json({ error: 'Title and body required' }, { status: 400 });

  const update: CampaignUpdate = {
    campaign,
    title,
    body,
    author: b.author ? String(b.author).slice(0, 60) : '',
    at: new Date().toISOString(),
  };
  try {
    await put(`updates/${campaign}/${Date.now()}.json`, JSON.stringify(update), {
      access: 'public',
      contentType: 'application/json',
      token,
      addRandomSuffix: false,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'write failed' }, { status: 502 });
  }
}
