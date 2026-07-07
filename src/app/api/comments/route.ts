import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { StrKey } from '@stellar/stellar-sdk';

// Public campaign comments. One blob per comment under comments/<campaign>/<ts>.json.
export type Comment = { campaign: string; author: string; body: string; at: string };

const token = process.env.BLOB_READ_WRITE_TOKEN;

export async function GET(req: Request) {
  const campaign = new URL(req.url).searchParams.get('campaign') ?? '';
  if (!StrKey.isValidContract(campaign)) {
    return NextResponse.json({ error: 'Invalid campaign' }, { status: 400 });
  }
  if (!token) return NextResponse.json({ comments: [] });
  try {
    const { blobs } = await list({ prefix: `comments/${campaign}/`, token });
    const comments = (
      await Promise.all(
        blobs
          .filter((b) => b.pathname.endsWith('.json'))
          .map(async (b) => {
            try {
              return (await (await fetch(b.url, { cache: 'no-store' })).json()) as Comment;
            } catch {
              return null;
            }
          }),
      )
    ).filter((c): c is Comment => c !== null);
    comments.sort((a, b) => b.at.localeCompare(a.at));
    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ comments: [] });
  }
}

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
  const body = String(b.body ?? '').trim().slice(0, 1000);
  if (!body) return NextResponse.json({ error: 'Comment is empty' }, { status: 400 });

  const comment: Comment = {
    campaign,
    author: b.author ? String(b.author).slice(0, 60) : 'anon',
    body,
    at: new Date().toISOString(),
  };
  try {
    await put(`comments/${campaign}/${Date.now()}.json`, JSON.stringify(comment), {
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
