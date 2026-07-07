// Product changelog / roadmap — the source for /changelog and the "product update
// posts" evidence. Newest entries first (enforced by sortedChangelog).

export type ChangeStatus = 'shipped' | 'in-progress' | 'planned';

export type ChangeEntry = {
  date: string; // ISO date
  title: string;
  status: ChangeStatus;
  items: string[];
};

export const CHANGELOG: ChangeEntry[] = [
  {
    date: '2026-07-07',
    title: 'Founder Belt — growth foundation',
    status: 'shipped',
    items: [
      'First-party, privacy-light analytics (visit / connect / contribute / share / referral).',
      'Live build-in-public /metrics board and monthly /growth report.',
      'SEO: sitemap, robots, and rich social cards for organic reach.',
    ],
  },
  {
    date: '2026-07-07',
    title: 'Growth & retention tooling',
    status: 'in-progress',
    items: [
      'Creator dashboard, campaign updates, and follow + notifications.',
      'Referral links, one-click sharing, and email digests.',
      'Testnet free-try funnel to lower the barrier before real XLM.',
    ],
  },
  {
    date: '2026-07-06',
    title: 'Black Belt — mainnet launch',
    status: 'shipped',
    items: [
      'Deployed to Stellar mainnet with native XLM milestone escrow.',
      'Gasless contributions via fee sponsorship.',
      'Security review, user guide, and launch marketing.',
    ],
  },
];

export function sortedChangelog(entries: ChangeEntry[] = CHANGELOG): ChangeEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}
