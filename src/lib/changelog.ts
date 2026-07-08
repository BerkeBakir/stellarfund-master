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
    date: '2026-07-08',
    title: 'UX polish from user testing',
    status: 'shipped',
    items: [
      'Reliable one-tap sharing (X / Telegram / WhatsApp open correctly).',
      'Minimum contribution set to 0.25 XLM; no maximum.',
      'Global slide-in navigation menu across every page.',
      'Weekly-active-wallets bar chart on /metrics and /stats.',
      'Redesigned, larger first-run onboarding tour.',
    ],
  },
  {
    date: '2026-07-07',
    title: 'Founder Belt — growth foundation',
    status: 'shipped',
    items: [
      'First-party, privacy-light analytics (visit / connect / contribute / share / referral) — no third-party trackers.',
      'Live build-in-public /metrics board and monthly /growth report.',
      'Acquisition funnel + weekly cohorts in /stats.',
      'SEO: sitemap, robots, and dynamic social share cards for organic reach.',
    ],
  },
  {
    date: '2026-07-07',
    title: 'Growth, retention & trust tooling',
    status: 'shipped',
    items: [
      'Creator dashboard: post updates, share, and grow your backers.',
      'Personal dashboard (/me): your contributions, campaigns, and follows.',
      'Referral links, embeddable campaign widgets, and email capture + weekly digest.',
      'Comments, transparency badges, creator verification, and a testimonial wall.',
      'Installable app (PWA) and a testnet free-try funnel.',
    ],
  },
  {
    date: '2026-07-06',
    title: 'Black Belt — mainnet launch',
    status: 'shipped',
    items: [
      'Deployed to Stellar mainnet with native XLM milestone escrow.',
      'On-chain proof board, security review, user guide, and launch marketing.',
    ],
  },
  {
    date: '2026-08-01',
    title: 'On the roadmap',
    status: 'planned',
    items: [
      'Web-push notifications for milestone and update alerts.',
      'Creator payout analytics and backer cohort retention.',
      'Multi-language coverage across all pages.',
    ],
  },
];

export function sortedChangelog(entries: ChangeEntry[] = CHANGELOG): ChangeEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}
