// Self-reported growth figures for the L7 monthly report + build-in-public
// /metrics board. On-chain numbers come from getProofData(); the fields here are
// OFF-CHAIN social/community metrics the user maintains by hand. They are always
// rendered with a "self-reported" label — never presented as verified on-chain data.

export type SocialMetrics = {
  // Report period (inclusive), ISO dates.
  periodStart: string;
  periodEnd: string;
  // Off-chain, self-reported. Update by hand as the month progresses.
  followers: number;
  followersStart: number; // at period start, to show growth delta
  updatePosts: number; // product-update posts published
  communityContributions: number; // blog/tutorial/workshop/OSS contributions
  // Short narrative bullets for the report body.
  highlights: string[];
  // Links the user fills in as proof (screenshots, post URLs).
  socialProofUrls: string[];
};

export const SOCIAL: SocialMetrics = {
  periodStart: '2026-07-07',
  periodEnd: '2026-08-07',
  followers: 0,
  followersStart: 0,
  updatePosts: 0,
  communityContributions: 1, // dev.to technical blog (from L6, ongoing)
  highlights: [
    'Launched the Founder-Belt build: analytics pipeline, growth report, referral & creator tooling.',
    'Gasless contributions keep onboarding friction near zero for new mainnet users.',
    'Build-in-public: live /metrics board and monthly growth report published.',
  ],
  socialProofUrls: [
    // e.g. 'https://x.com/Berkebey001/status/…'
  ],
};

export function followerGrowth(m: SocialMetrics = SOCIAL): number {
  return m.followers - m.followersStart;
}
