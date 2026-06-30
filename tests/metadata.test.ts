import { describe, it, expect } from 'vitest';
import { CATEGORIES, isValidCategory } from '@/lib/metadata';

describe('metadata', () => {
  it('has the 6 fixed categories', () => {
    expect(CATEGORIES).toEqual([
      'Education',
      'Health',
      'Technology',
      'Community',
      'Emergency',
      'Other',
    ]);
  });
  it('validates category membership', () => {
    expect(isValidCategory('Health')).toBe(true);
    expect(isValidCategory('Nope')).toBe(false);
  });
});
