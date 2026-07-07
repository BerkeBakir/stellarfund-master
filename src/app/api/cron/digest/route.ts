import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

// Weekly digest cron. Configure in vercel.json crons -> /api/cron/digest.
// Sends via Resend when RESEND_API_KEY + DIGEST_FROM are set; otherwise it is a
// safe no-op (logs the audience size). Protected by CRON_SECRET when set.
const token = process.env.BLOB_READ_WRITE_TOKEN;

type Subscriber = { email: string; wallet: string | null; at: string };

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  if (!token) return NextResponse.json({ ok: true, sent: 0, reason: 'no storage' });

  // Load subscribers.
  let subs: Subscriber[] = [];
  try {
    const { blobs } = await list({ prefix: 'subscribers/', token });
    subs = (
      await Promise.all(
        blobs
          .filter((b) => b.pathname.endsWith('.json'))
          .map(async (b) => {
            try {
              return (await (await fetch(b.url, { cache: 'no-store' })).json()) as Subscriber;
            } catch {
              return null;
            }
          }),
      )
    ).filter((s): s is Subscriber => s !== null);
  } catch {
    return NextResponse.json({ ok: true, sent: 0, reason: 'list failed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.DIGEST_FROM;
  if (!apiKey || !from) {
    console.log(`[digest] would email ${subs.length} subscribers (Resend not configured)`);
    return NextResponse.json({ ok: true, sent: 0, audience: subs.length, reason: 'email not configured' });
  }

  const base = 'https://stellarfund-master.vercel.app';
  let sent = 0;
  for (const s of subs) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from,
          to: s.email,
          subject: 'StellarFund — your weekly campaign digest',
          html: `<p>New activity on StellarFund this week.</p><p><a href="${base}/">Browse campaigns</a> · <a href="${base}/metrics">Live metrics</a></p>`,
        }),
      });
      if (res.ok) sent += 1;
    } catch {
      /* skip failed recipient */
    }
  }
  return NextResponse.json({ ok: true, sent, audience: subs.length });
}
