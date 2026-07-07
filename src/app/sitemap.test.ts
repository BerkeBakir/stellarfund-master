import { describe, it, expect } from 'vitest';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('lists the core public routes with absolute URLs', () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain('https://stellarfund-master.vercel.app/');
    expect(urls).toContain('https://stellarfund-master.vercel.app/proof');
    for (const e of entries) {
      expect(e.url.startsWith('https://')).toBe(true);
    }
  });
});
