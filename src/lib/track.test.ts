import { describe, it, expect, vi, beforeEach } from 'vitest';
import { track } from './track';

describe('track', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('posts the event to /api/events via fetch when no beacon', () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response('{}')));
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('navigator', {}); // no sendBeacon
    track('share', { campaign: 'CABC' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/events');
    expect(JSON.parse((opts as RequestInit).body as string)).toMatchObject({
      type: 'share',
      campaign: 'CABC',
    });
  });

  it('prefers navigator.sendBeacon when available', () => {
    const beacon = vi.fn(() => true);
    vi.stubGlobal('navigator', { sendBeacon: beacon });
    vi.stubGlobal('fetch', vi.fn());
    track('connect', { wallet: 'GABC' });
    expect(beacon).toHaveBeenCalledTimes(1);
    expect(beacon.mock.calls[0][0]).toBe('/api/events');
  });
});
