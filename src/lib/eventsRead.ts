import { list } from '@vercel/blob';
import { EVENT_TYPES, type AnalyticsEvent, type EventType } from './analytics';

// Server-side reader for Tier-0 analytics blobs (one JSON per event under
// events/<date>/…). Returns [] when storage is unset or on any error — analytics
// must never break a page render.

const PREFIX = 'events/';

function isEvent(v: unknown): v is AnalyticsEvent {
  if (!v || typeof v !== 'object') return false;
  const r = v as Record<string, unknown>;
  return (
    typeof r.type === 'string' &&
    EVENT_TYPES.includes(r.type as EventType) &&
    typeof r.ts === 'string'
  );
}

export async function readEvents(opts: { sinceDays?: number } = {}): Promise<AnalyticsEvent[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return [];

  const cutoff =
    opts.sinceDays != null
      ? new Date(Date.now() - opts.sinceDays * 86_400_000).toISOString()
      : null;

  try {
    const { blobs } = await list({ prefix: PREFIX, token, limit: 1000 });
    const parsed = await Promise.all(
      blobs
        .filter((b) => b.pathname.endsWith('.json'))
        .map(async (b) => {
          try {
            const r = await fetch(b.url, { cache: 'no-store' });
            const j = await r.json();
            return isEvent(j) ? j : null;
          } catch {
            return null;
          }
        }),
    );
    const events = parsed.filter((e): e is AnalyticsEvent => e !== null);
    const filtered = cutoff ? events.filter((e) => e.ts >= cutoff) : events;
    return filtered.sort((a, b) => a.ts.localeCompare(b.ts));
  } catch {
    return [];
  }
}
