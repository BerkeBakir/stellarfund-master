import { describe, it, expect } from 'vitest';
import { sanitizeEvent, eventBlobPath, type AnalyticsEvent } from './analytics';

describe('sanitizeEvent', () => {
  it('accepts a valid event and strips unknown fields', () => {
    const ev = sanitizeEvent({ type: 'connect', wallet: 'GABC', evil: 1, ip: '1.2.3.4' });
    expect(ev).not.toBeNull();
    expect(ev!.type).toBe('connect');
    expect(ev!.wallet).toBe('GABC');
    expect(ev!.campaign).toBeNull();
    expect((ev as unknown as Record<string, unknown>).ip).toBeUndefined();
    expect(typeof ev!.ts).toBe('string');
  });

  it('rejects an unknown event type', () => {
    expect(sanitizeEvent({ type: 'hack' })).toBeNull();
  });

  it('truncates over-long fields', () => {
    const ev = sanitizeEvent({ type: 'visit', wallet: 'x'.repeat(200) });
    expect(ev!.wallet!.length).toBeLessThanOrEqual(60);
  });

  it('builds a date-partitioned blob path', () => {
    const ev: AnalyticsEvent = { type: 'visit', wallet: null, campaign: null, ref: null, ts: '2026-07-07T10:00:00.000Z' };
    expect(eventBlobPath(ev)).toMatch(/^events\/2026-07-07\/.+\.json$/);
  });
});
