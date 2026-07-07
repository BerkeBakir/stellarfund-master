// Client-side campaign watchlist. Kept in localStorage (per device, no auth, no
// XLM, no server write) — powers the /me dashboard and in-app notifications.

const KEY = 'sf.follows';

export function getFollows(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function isFollowing(address: string): boolean {
  return getFollows().includes(address);
}

export function toggleFollow(address: string): boolean {
  const cur = getFollows();
  const has = cur.includes(address);
  const next = has ? cur.filter((a) => a !== address) : [...cur, address];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return !has; // new following state
}

// Last-seen markers for notification derivation: address -> ISO timestamp.
const SEEN_KEY = 'sf.seen';

export function getSeen(): Record<string, string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function markSeen(address: string, at: string): void {
  try {
    const cur = getSeen();
    cur[address] = at;
    localStorage.setItem(SEEN_KEY, JSON.stringify(cur));
  } catch {
    /* ignore */
  }
}
