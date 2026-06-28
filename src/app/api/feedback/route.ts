import { NextResponse } from 'next/server';

// Lightweight feedback collection. Submissions are logged (visible in Vercel
// logs) and forwarded to FEEDBACK_WEBHOOK_URL (e.g. a Discord/Slack/Sheet
// webhook) when configured. A small in-memory ring buffer powers a quick admin
// read at GET /api/feedback.
type Feedback = {
  message: string;
  rating: number | null;
  wallet: string | null;
  locale: string | null;
  at: string;
};

const recent: Feedback[] = [];
const MAX = 50;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const message = String(body.message ?? '').slice(0, 2000).trim();
  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }
  const entry: Feedback = {
    message,
    rating: typeof body.rating === 'number' ? body.rating : null,
    wallet: body.wallet ? String(body.wallet).slice(0, 60) : null,
    locale: body.locale ? String(body.locale).slice(0, 8) : null,
    at: new Date().toISOString(),
  };

  recent.unshift(entry);
  if (recent.length > MAX) recent.pop();
  console.log('[feedback]', JSON.stringify(entry));

  const webhook = process.env.FEEDBACK_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          content: `⭐ ${entry.rating ?? '—'} | ${entry.wallet ?? 'anon'} (${entry.locale ?? '?'})\n${entry.message}`,
        }),
      });
    } catch {
      /* best effort */
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ count: recent.length, recent });
}
