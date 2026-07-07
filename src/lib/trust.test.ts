import { describe, it, expect } from 'vitest';
import { isVerifiedCreator, VERIFIED_CREATORS } from './trust';

describe('isVerifiedCreator', () => {
  it('is false for unknown / empty wallets', () => {
    expect(isVerifiedCreator(null)).toBe(false);
    expect(isVerifiedCreator(undefined)).toBe(false);
    expect(isVerifiedCreator('GUNKNOWN')).toBe(false);
  });

  it('is true only for allowlisted wallets', () => {
    VERIFIED_CREATORS.add('GTESTVERIFIED');
    expect(isVerifiedCreator('GTESTVERIFIED')).toBe(true);
    VERIFIED_CREATORS.delete('GTESTVERIFIED');
  });
});
