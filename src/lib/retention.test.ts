import { describe, it, expect } from 'vitest';
import { funnel, newVsReturning, weeklyCohorts, referralLeaders } from './retention';
import type { AnalyticsEvent } from './analytics';

function ev(type: AnalyticsEvent['type'], wallet: string | null, ts: string, ref: string | null = null): AnalyticsEvent {
  return { type, wallet, campaign: null, ref, ts };
}

describe('funnel', () => {
  it('counts events by type', () => {
    const f = funnel([
      ev('visit', null, '2026-07-01T00:00:00Z'),
      ev('visit', null, '2026-07-01T01:00:00Z'),
      ev('connect', 'GA', '2026-07-01T02:00:00Z'),
      ev('contribute_intent', 'GA', '2026-07-01T03:00:00Z'),
      ev('share', null, '2026-07-01T04:00:00Z'),
      ev('referral', null, '2026-07-01T05:00:00Z'),
    ]);
    expect(f).toEqual({ visits: 2, connects: 1, contributeIntents: 1, shares: 1, referrals: 1 });
  });
});

describe('newVsReturning', () => {
  it('classifies wallets by first-seen vs the cutoff', () => {
    const events = [
      ev('connect', 'OLD', '2026-06-01T00:00:00Z'),
      ev('connect', 'OLD', '2026-07-05T00:00:00Z'),
      ev('connect', 'NEW', '2026-07-05T00:00:00Z'),
    ];
    expect(newVsReturning(events, '2026-07-01T00:00:00Z')).toEqual({ newWallets: 1, returningWallets: 1 });
  });
});

describe('weeklyCohorts', () => {
  it('buckets unique wallets by UTC-Monday week', () => {
    const c = weeklyCohorts([
      ev('visit', 'A', '2026-07-01T00:00:00Z'), // Wed → week of Mon 2026-06-29
      ev('visit', 'A', '2026-07-02T00:00:00Z'),
      ev('visit', 'B', '2026-07-08T00:00:00Z'), // next week (Mon 2026-07-06)
    ]);
    expect(c).toEqual([
      { week: '2026-06-29', wallets: 1 },
      { week: '2026-07-06', wallets: 1 },
    ]);
  });
});

describe('referralLeaders', () => {
  it('tallies and sorts referral sources desc', () => {
    const r = referralLeaders([
      ev('visit', null, '2026-07-01T00:00:00Z', 'GA'),
      ev('visit', null, '2026-07-01T01:00:00Z', 'GA'),
      ev('visit', null, '2026-07-01T02:00:00Z', 'GB'),
    ]);
    expect(r).toEqual([{ ref: 'GA', count: 2 }, { ref: 'GB', count: 1 }]);
  });
});
