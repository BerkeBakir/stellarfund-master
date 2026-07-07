import { describe, it, expect, vi, beforeEach } from 'vitest';

const { put } = vi.hoisted(() => ({ put: vi.fn(async () => ({ url: 'https://blob/x.json' })) }));
vi.mock('@vercel/blob', () => ({ put }));

import { POST } from './route';

function req(body: unknown): Request {
  return new Request('http://x/api/events', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/events', () => {
  beforeEach(() => {
    put.mockClear();
    process.env.BLOB_READ_WRITE_TOKEN = 'tok';
  });

  it('stores a valid event', async () => {
    const res = await POST(req({ type: 'visit', campaign: 'CABC' }));
    const json = await res.json();
    expect(json).toEqual({ ok: true, stored: true });
    expect(put).toHaveBeenCalledTimes(1);
  });

  it('rejects an invalid event type with 400', async () => {
    const res = await POST(req({ type: 'nope' }));
    expect(res.status).toBe(400);
    expect(put).not.toHaveBeenCalled();
  });

  it('degrades gracefully when storage unset', async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    const res = await POST(req({ type: 'visit' }));
    expect(await res.json()).toEqual({ ok: true, stored: false });
    expect(put).not.toHaveBeenCalled();
  });
});
