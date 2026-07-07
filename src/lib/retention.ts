import type { AnalyticsEvent } from './analytics';

// Pure aggregation over first-party analytics events. No I/O, no PII beyond the
// public wallet keys already present in the events.

export type Funnel = {
  visits: number;
  connects: number;
  contributeIntents: number;
  shares: number;
  referrals: number;
};

export function funnel(events: AnalyticsEvent[]): Funnel {
  const f: Funnel = { visits: 0, connects: 0, contributeIntents: 0, shares: 0, referrals: 0 };
  for (const e of events) {
    switch (e.type) {
      case 'visit':
        f.visits += 1;
        break;
      case 'connect':
        f.connects += 1;
        break;
      case 'contribute_intent':
        f.contributeIntents += 1;
        break;
      case 'share':
        f.shares += 1;
        break;
      case 'referral':
        f.referrals += 1;
        break;
    }
  }
  return f;
}

// A wallet is "new" if its earliest event across the whole set is on/after
// sinceIso; otherwise "returning". Events with no wallet are ignored.
export function newVsReturning(
  events: AnalyticsEvent[],
  sinceIso: string,
): { newWallets: number; returningWallets: number } {
  const firstSeen = new Map<string, string>();
  for (const e of events) {
    if (!e.wallet) continue;
    const prev = firstSeen.get(e.wallet);
    if (!prev || e.ts < prev) firstSeen.set(e.wallet, e.ts);
  }
  let newW = 0;
  let ret = 0;
  for (const ts of firstSeen.values()) {
    if (ts >= sinceIso) newW += 1;
    else ret += 1;
  }
  return { newWallets: newW, returningWallets: ret };
}

// Start-of-week (UTC Monday) date string for a timestamp.
function weekStart(ts: string): string {
  const d = new Date(ts);
  const day = (d.getUTCDay() + 6) % 7; // 0 = Monday
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}

// Unique wallets active per ISO week, ascending by week.
export function weeklyCohorts(events: AnalyticsEvent[]): { week: string; wallets: number }[] {
  const byWeek = new Map<string, Set<string>>();
  for (const e of events) {
    if (!e.wallet) continue;
    const wk = weekStart(e.ts);
    if (!byWeek.has(wk)) byWeek.set(wk, new Set());
    byWeek.get(wk)!.add(e.wallet);
  }
  return [...byWeek.entries()]
    .map(([week, set]) => ({ week, wallets: set.size }))
    .sort((a, b) => a.week.localeCompare(b.week));
}

// Referral sources ranked by number of attributed events, descending.
export function referralLeaders(events: AnalyticsEvent[]): { ref: string; count: number }[] {
  const tally = new Map<string, number>();
  for (const e of events) {
    if (!e.ref) continue;
    tally.set(e.ref, (tally.get(e.ref) ?? 0) + 1);
  }
  return [...tally.entries()]
    .map(([ref, count]) => ({ ref, count }))
    .sort((a, b) => b.count - a.count);
}
