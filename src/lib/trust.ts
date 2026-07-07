// Trust & PMF data: verified creators and curated testimonials. Keep this honest
// — only add a creator to VERIFIED_CREATORS after real verification, and only add
// testimonials that are real, consented quotes (from the Google Form / feedback).

export const VERIFIED_CREATORS = new Set<string>([
  // 'GC...'  // add wallet addresses of verified creators
]);

export function isVerifiedCreator(wallet: string | null | undefined): boolean {
  return !!wallet && VERIFIED_CREATORS.has(wallet);
}

export type Testimonial = { name: string; quote: string; wallet?: string; rating?: number };

// Real, consented testimonials only. Populated from docs/feedback responses.
export const TESTIMONIALS: Testimonial[] = [];
