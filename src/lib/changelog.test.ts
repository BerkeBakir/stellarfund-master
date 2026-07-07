import { describe, it, expect } from 'vitest';
import { CHANGELOG, sortedChangelog } from './changelog';

describe('changelog', () => {
  it('has non-empty titles and items for every entry', () => {
    for (const e of CHANGELOG) {
      expect(e.title.trim().length).toBeGreaterThan(0);
      expect(e.items.length).toBeGreaterThan(0);
      expect(['shipped', 'in-progress', 'planned']).toContain(e.status);
    }
  });

  it('sorts entries by date descending', () => {
    const sorted = sortedChangelog([
      { date: '2026-01-01', title: 'a', status: 'shipped', items: ['x'] },
      { date: '2026-03-01', title: 'b', status: 'shipped', items: ['y'] },
    ]);
    expect(sorted.map((e) => e.date)).toEqual(['2026-03-01', '2026-01-01']);
  });
});
