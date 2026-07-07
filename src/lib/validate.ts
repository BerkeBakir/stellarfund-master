// Small pure validators/helpers shared by Tier-2 growth features.

export function isValidEmail(s: string): boolean {
  const t = s.trim();
  if (t.length < 3 || t.length > 254) return false;
  // Pragmatic check: one @, non-empty local part, a dotted domain.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

// Build a shareable URL for a path with an optional ?ref= attribution param.
export function refLink(base: string, path: string, ref?: string | null): string {
  const url = new URL(path, base.endsWith('/') ? base : base + '/');
  if (ref) url.searchParams.set('ref', ref);
  return url.toString();
}

// Stable, non-reversible key for de-duplicating subscribers by email without
// storing the raw address in the blob pathname.
export function emailKey(email: string): string {
  const e = email.trim().toLowerCase();
  let h = 5381;
  for (let i = 0; i < e.length; i++) h = ((h << 5) + h + e.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
