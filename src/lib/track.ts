import type { EventType } from './analytics';

type Props = { wallet?: string; campaign?: string; ref?: string };

// Fire-and-forget. Uses sendBeacon when available (survives page unload),
// else fetch with keepalive. Never throws into the caller.
export function track(type: EventType, props: Props = {}): void {
  try {
    const payload = JSON.stringify({ type, ...props });
    const nav = typeof navigator !== 'undefined' ? navigator : undefined;
    if (nav && typeof nav.sendBeacon === 'function') {
      nav.sendBeacon('/api/events', new Blob([payload], { type: 'application/json' }));
      return;
    }
    void fetch('/api/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload,
      keepalive: true,
    });
  } catch {
    /* analytics must never break the app */
  }
}
