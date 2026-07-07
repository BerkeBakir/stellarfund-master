import { describe, it, expect, vi, beforeEach } from 'vitest';

const { list } = vi.hoisted(() => ({ list: vi.fn() }));
vi.mock('@vercel/blob', () => ({ list }));

import { readEvents } from './eventsRead';

describe('readEvents', () => {
  beforeEach(() => {
    list.mockReset();
    process.env.BLOB_READ_WRITE_TOKEN = 'tok';
  });

  it('returns [] when no token', async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    expect(await readEvents()).toEqual([]);
    expect(list).not.toHaveBeenCalled();
  });

  it('lists, fetches and parses valid events sorted by ts', async () => {
    list.mockResolvedValue({
      blobs: [
        { pathname: 'events/2026-07-07/a.json', url: 'https://blob/a' },
        { pathname: 'events/2026-07-07/b.json', url: 'https://blob/b' },
        { pathname: 'events/2026-07-07/junk.txt', url: 'https://blob/j' },
      ],
    });
    const bodies: Record<string, unknown> = {
      'https://blob/a': { type: 'connect', wallet: 'GA', campaign: null, ref: null, ts: '2026-07-07T02:00:00Z' },
      'https://blob/b': { type: 'visit', wallet: null, campaign: null, ref: null, ts: '2026-07-07T01:00:00Z' },
    };
    vi.stubGlobal('fetch', vi.fn(async (u: string) => new Response(JSON.stringify(bodies[u]))));

    const events = await readEvents();
    expect(events.map((e) => e.type)).toEqual(['visit', 'connect']); // sorted by ts asc
  });

  it('returns [] on list error', async () => {
    list.mockRejectedValue(new Error('boom'));
    expect(await readEvents()).toEqual([]);
  });
});
