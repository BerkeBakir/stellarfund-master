import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { StrKey } from '@stellar/stellar-sdk';
import { isValidCategory, type CampaignMeta } from '@/lib/metadata';

const PREFIX = 'campaigns/';
const token = process.env.BLOB_READ_WRITE_TOKEN;

// GET /api/campaigns -> { campaigns: { [address]: CampaignMeta } }
export async function GET() {
  if (!token) return NextResponse.json({ campaigns: {} });
  try {
    const { blobs } = await list({ prefix: PREFIX, token });
    const entries = await Promise.all(
      blobs
        .filter((b) => b.pathname.endsWith('.json'))
        .map(async (b) => {
          try {
            const r = await fetch(b.url, { cache: 'no-store' });
            const meta = (await r.json()) as CampaignMeta;
            return [meta.address, meta] as const;
          } catch {
            return null;
          }
        }),
    );
    const campaigns: Record<string, CampaignMeta> = {};
    for (const e of entries) if (e) campaigns[e[0]] = e[1];
    return NextResponse.json({ campaigns });
  } catch (e) {
    return NextResponse.json(
      { campaigns: {}, error: e instanceof Error ? e.message : 'list failed' },
      { status: 200 },
    );
  }
}

// POST /api/campaigns  body: CampaignMeta -> writes campaigns/<address>.json
export async function POST(req: Request) {
  if (!token) return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
  let body: Partial<CampaignMeta>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const address = String(body.address ?? '');
  if (!StrKey.isValidContract(address)) {
    return NextResponse.json({ error: 'Invalid campaign address' }, { status: 400 });
  }
  const title = String(body.title ?? '').trim().slice(0, 120);
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  const category = String(body.category ?? '');
  if (!isValidCategory(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  const meta: CampaignMeta = {
    address,
    title,
    description: String(body.description ?? '').trim().slice(0, 2000),
    category,
    creatorName: String(body.creatorName ?? '').trim().slice(0, 80),
    imageUrl: body.imageUrl ? String(body.imageUrl) : null,
    createdAt: body.createdAt ? String(body.createdAt) : new Date().toISOString(),
  };

  try {
    await put(`${PREFIX}${address}.json`, JSON.stringify(meta), {
      access: 'public',
      contentType: 'application/json',
      token,
      allowOverwrite: true,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'write failed' },
      { status: 502 },
    );
  }
}
