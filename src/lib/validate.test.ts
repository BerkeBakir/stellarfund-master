import { describe, it, expect } from 'vitest';
import { isValidEmail, refLink, emailKey } from './validate';

describe('isValidEmail', () => {
  it('accepts a normal address', () => {
    expect(isValidEmail('ada@example.com')).toBe(true);
  });
  it('rejects malformed addresses', () => {
    expect(isValidEmail('nope')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('a @b.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('refLink', () => {
  it('appends the ref param', () => {
    expect(refLink('https://x.app', '/campaign/CABC', 'GWALLET')).toBe(
      'https://x.app/campaign/CABC?ref=GWALLET',
    );
  });
  it('omits ref when absent', () => {
    expect(refLink('https://x.app', '/campaign/CABC')).toBe('https://x.app/campaign/CABC');
  });
});

describe('emailKey', () => {
  it('is case/whitespace-insensitive and stable', () => {
    expect(emailKey(' Ada@Example.com ')).toBe(emailKey('ada@example.com'));
  });
  it('differs for different emails', () => {
    expect(emailKey('a@x.com')).not.toBe(emailKey('b@x.com'));
  });
});
