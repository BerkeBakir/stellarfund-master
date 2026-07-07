// Privacy-light first-party analytics. Stores ONLY {type, wallet, campaign, ref, ts}
// — never IP/email/user-agent. Wallet is a public key. One blob per event.

export type EventType = 'visit' | 'connect' | 'contribute_intent' | 'share' | 'referral';

export const EVENT_TYPES: readonly EventType[] = [
  'visit',
  'connect',
  'contribute_intent',
  'share',
  'referral',
];

export type AnalyticsEvent = {
  type: EventType;
  wallet: string | null;
  campaign: string | null;
  ref: string | null;
  ts: string;
};

function str(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return s ? s.slice(0, max) : null;
}

export function sanitizeEvent(raw: unknown): AnalyticsEvent | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const type = r.type;
  if (typeof type !== 'string' || !EVENT_TYPES.includes(type as EventType)) return null;
  return {
    type: type as EventType,
    wallet: str(r.wallet, 60),
    campaign: str(r.campaign, 60),
    ref: str(r.ref, 60),
    ts: new Date().toISOString(),
  };
}

export function eventBlobPath(ev: AnalyticsEvent): string {
  const date = ev.ts.slice(0, 10); // YYYY-MM-DD
  const rand = Math.random().toString(36).slice(2, 10);
  return `events/${date}/${Date.parse(ev.ts)}-${rand}.json`;
}
