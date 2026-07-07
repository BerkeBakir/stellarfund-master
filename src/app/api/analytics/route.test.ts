import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AnalyticsEvent } from '@/lib/analytics';

const { readEvents } = vi.hoisted(() => ({ readEvents: vi.fn() }));
vi.mock('@/lib/eventsRead', () => ({ readEvents }));

import { GET } from './route';

function ev(type: AnalyticsEvent['type'], wallet: string | null, ts: string): AnalyticsEvent {
  return { type, wallet, campaign: null, ref: null, ts };
}

describe('GET /api/analytics', () => {
  beforeEach(() => readEvents.mockReset());

  it('returns funnel + cohorts + totals from events', async () => {
    readEvents.mockResolvedValue([
      ev('visit', null, '2026-07-01T00:00:00Z'),
      ev('connect', 'GA', new Date().toISOString()),
    ]);
    const res = await GET();
    const json = await res.json();
    expect(json.totalEvents).toBe(2);
    expect(json.funnel.visits).toBe(1);
    expect(json.funnel.connects).toBe(1);
    expect(json.newWalletsThisWeek).toBe(1);
    expect(Array.isArray(json.cohorts)).toBe(true);
  });
});
