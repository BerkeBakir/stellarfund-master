# StellarFund 🏆

> Cross-border crowdfunding on **Stellar mainnet** — backers fund creators anywhere in
> **XLM**, money is held in a **milestone-escrow** smart contract that releases funds
> tranche-by-tranche as milestones are met, and **refunds are enforced by code** if the
> goal is missed.

Built for the **Stellar Journey to Mastery — Founder Belt (Level 7 / Master Track)**:
turning the mainnet product into a startup — sustainable growth, retention, product-market
fit, and real adoption. Builds on the L6 Black Belt mainnet app (same Factory → Escrow →
Reputation engine, same mainnet contracts).

🔗 **Live app (mainnet):** https://stellarfund-master.vercel.app
📈 **Growth report:** https://stellarfund-master.vercel.app/growth · [`docs/GROWTH-REPORT.md`](docs/GROWTH-REPORT.md)
📊 **Build-in-public metrics:** https://stellarfund-master.vercel.app/metrics
🗒️ **Changelog:** https://stellarfund-master.vercel.app/changelog
🧾 **Proof of users:** https://stellarfund-master.vercel.app/proof (on-chain backer evidence)
📝 **L7 submission:** [`docs/SUBMISSION-L7.md`](docs/SUBMISSION-L7.md)
🔒 **Security review:** [`docs/SECURITY.md`](docs/SECURITY.md)

## Founder-track features (L7)

- **Growth & analytics:** first-party privacy-light funnel + weekly cohorts (`/stats`, `/metrics`), monthly growth report (`/growth`), SEO + dynamic social cards.
- **Acquisition:** creator dashboard (`/creator`), referral share links (`?ref=`), embeddable widget (`/embed/<id>`), testnet free-try funnel (`/try`), email capture + weekly digest.
- **Retention:** personal dashboard (`/me`), follow/watch campaigns, campaign updates, onboarding tour, installable PWA.
- **Trust / PMF:** comments, transparency badges, creator verification, testimonial wall, on-chain reputation.

## Feedback-driven improvements

Improvements shipped in direct response to hands-on user testing (each links to the commit):

| Feedback | Shipped fix | Commit |
|---|---|---|
| Share buttons (X/Telegram/WhatsApp) didn't open | Rewrote share actions as real links | [`4726b9b`](https://github.com/BerkeBakir/stellarfund-master/commit/4726b9b) |
| Contributions allowed dust amounts (0.0000001) | Enforced a 0.25 XLM minimum, removed the cap | [`4726b9b`](https://github.com/BerkeBakir/stellarfund-master/commit/4726b9b) |
| Metrics never updated after connecting/contributing | Fixed a stale service-worker bundle + centralized connect tracking | [`2b80a05`](https://github.com/BerkeBakir/stellarfund-master/commit/2b80a05) |
| Email signup didn't actually send | Wired the weekly digest to Brevo | [`2b80a05`](https://github.com/BerkeBakir/stellarfund-master/commit/2b80a05) |
| No visible "release milestone" control for creators | Always-visible release button with an unlock explanation | [`b6918bc`](https://github.com/BerkeBakir/stellarfund-master/commit/b6918bc) |
| App reverted to English on some pages | Full Turkish/English localization + in-menu language switcher | [`b6918bc`](https://github.com/BerkeBakir/stellarfund-master/commit/b6918bc), [`8106583`](https://github.com/BerkeBakir/stellarfund-master/commit/8106583) |
| Wanted quicker access to all features | Added a global slide-in navigation menu | [`4726b9b`](https://github.com/BerkeBakir/stellarfund-master/commit/4726b9b) |

_As Google Form responses arrive (→ [`docs/feedback/`](docs/feedback/)), new themes and their
fixes are appended here._
📖 **User guide:** [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md)
📣 **Launch thread:** https://x.com/Berkebey001
📝 **Technical blog:** https://dev.to/berkebey01/building-milestone-escrow-crowdfunding-on-soroban-5hc

> **Network:** Stellar **mainnet (Public)**. Contributions are **real XLM** — only fund
> what you're comfortable with, and never share your secret key.

---

## Why it matters

Cross-border fundraising is broken for everyone outside major financial hubs: 5–10%+
fees, days to settle, and most emerging-market creators can't even access
Kickstarter/GoFundMe payout rails. StellarFund makes global funding near-instant,
low-fee, transparent, and **milestone-enforced** — a backer in Germany can fund a
project in Kenya in seconds, and the creator receives value released against real
progress.

## Architecture — 3 contracts, milestone escrow

```
        create_campaign(goal, milestones[])            record_success()
  ┌──────────┐  deploy + init   ┌──────────────────┐  on completion  ┌────────────┐
  │ Factory  │ ───────────────▶ │ Escrow (Campaign) │ ──────────────▶ │ Reputation │
  │ registry │                  │  XLM custody +    │                 │  scores +  │
  └──────────┘ ◀── is_campaign ─│ milestone release │                 │ deliveries │
                                 └──────────────────┘
                                   │ XLM SAC transfer (contribute / release / refund)
                                   ▼
                          ┌────────────────────────┐
                          │  Native XLM (SAC)       │
                          └────────────────────────┘
```

- **Factory** — `create_campaign(creator, goal, deadline, milestones)` deploys & registers an Escrow; `list_campaigns`, `is_campaign`.
- **Escrow** — custodies XLM. `contribute`, `release(index)` (sequential milestone tranche to creator, after goal met + deadline), `refund` (backers reclaim if goal missed). State: Active → Releasing → Completed / Refunding. Invariant: milestones sum to goal; each releases once. Calls Reputation on final release.
- **Reputation** — `record_success` (gated to registered campaigns via Factory), `get_score`, `milestones_delivered`.

The escrow is asset-agnostic: it uses the token client against the **native XLM Stellar
Asset Contract**, so the same logic that moves any Stellar asset moves lumens.

## Security

Pre-mainnet internal security review in [`docs/SECURITY.md`](docs/SECURITY.md) — threat
model, invariants, authorization review, and findings (state-TTL on mainnet,
checks-effects-interactions and `checked_add` hardening). Submitted as the basis for the
Level 6 **mentor/team security review**.

## Features

- **XLM milestone escrow** with sequential tranche release + code-enforced refunds
- **Mainnet onboarding** — connect wallet, fund with XLM, contribute (no faucet)
- **Proof of Users** (`/proof`) — unique backer wallets straight from chain, with stellar.expert links
- **Campaign identity** — title, description, category, cover image, creator name
- **Discovery** — search + category filters; active/past split
- **Bold animated UI** — aurora/glassmorphism theme, Framer-Motion hero, live count-up stats
- **TR/EN i18n** + language switcher
- **Private analytics** (`/stats`, key-gated) computed on-chain
- **CI/CD** — contract tests + frontend lint/test/build

## Advanced feature — Fee Sponsorship (gasless)

Contributions and campaign creation are **gasless**: the user signs their transaction,
and the server wraps it in a **fee-bump transaction** paid by a sponsor account
([`/api/sponsor`](src/app/api/sponsor/route.ts)). The user pays **no network fee** — only
the contribution amount itself — which removes a real onboarding barrier on mainnet. The
contribute panel shows a "⚡ Gasless — network fee sponsored" badge, and the flow falls
back to a normal (user-paid) submission automatically if no sponsor is configured.

_Also implemented:_ **SEP-10 + SEP-24** cross-border anchor integration (interactive
deposit/withdraw). On the mainnet build the `/ramp` page is gated because the reference
`testanchor.stellar.org` is testnet-only; the core product custodies native XLM directly.

## Feedback-driven improvements

User feedback is collected via a [Google Form](docs/GOOGLE_FORM.md) (wallet + email +
name + rating + feedback); exported responses live in **`docs/feedback/`** _(Excel link
added after collection)_. Each recurring theme maps to a shipped change with its commit:

| Feedback theme | Shipped change | Commit |
|---|---|---|
| "I can't tell what a campaign is — only an address shows" | Campaign identity (title/description/category/image/creator) | [`0230d31`](https://github.com/BerkeBakir/stellarfund-black/commit/0230d31) |
| "Hard to find relevant campaigns" | Search + category filters | [`7685208`](https://github.com/BerkeBakir/stellarfund-black/commit/7685208) |
| "Proof page showed 0 backers" | getEvents pagination + 5-ID chunking fix | [`c8d6d68`](https://github.com/BerkeBakir/stellarfund-black/commit/c8d6d68) |
| "The 0-backers stat looked broken while loading" | Loading state on the backers counter | [`65546c3`](https://github.com/BerkeBakir/stellarfund-black/commit/65546c3) |
| "Testnet USDC isn't real adoption" | Mainnet + native XLM migration | [`066b64e`](https://github.com/BerkeBakir/stellarfund-black/commit/066b64e) |

> **Next phase (based on feedback):** TTL-hardening on the contracts (see SECURITY.md
> F-1), fee sponsorship for gasless contributions, creator profiles, and campaign
> updates/comments — prioritised by the form's "what should we add next?" responses.
> Commit links will be added here as each ships.

## Tech stack

| Layer | Technology |
|---|---|
| Contracts | Rust + soroban-sdk 22 (Soroban), stellar-cli |
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind v4, Framer Motion |
| Chain | @stellar/stellar-sdk 16, @creit.tech/stellar-wallets-kit 2.4 |
| Hosting | Vercel |

## Deployed on Mainnet

Deployed 2026-07-06 on Stellar **Public (mainnet)**.

| Contract | Address |
|---|---|
| Factory | [`CBUAZAAH7R7WXP3PIBKVPHYJ3XIHUTDOYBNUPPTLDVUWI6ZK6X33ZPN2`](https://stellar.expert/explorer/public/contract/CBUAZAAH7R7WXP3PIBKVPHYJ3XIHUTDOYBNUPPTLDVUWI6ZK6X33ZPN2) |
| Reputation | [`CCXGJUE6UXPMU27WKJZJS7XXV2NA5ZQPWLPQUJ2XNGDH5TD7L4DMAT5X`](https://stellar.expert/explorer/public/contract/CCXGJUE6UXPMU27WKJZJS7XXV2NA5ZQPWLPQUJ2XNGDH5TD7L4DMAT5X) |
| Token (native XLM SAC) | `CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA` |
| Campaign wasm hash | `f42f7c5faae416b3a77695e9f9a8330cdad45901a1deebea894081ccf7f4f1a2` |

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000

# contracts
cd contracts/<name> && cargo test --lib
```

Environment (`.env.local`):

```bash
NEXT_PUBLIC_FACTORY_ID=          # mainnet Factory contract id (after deploy)
NEXT_PUBLIC_REPUTATION_ID=       # mainnet Reputation contract id (after deploy)
NEXT_PUBLIC_CAMPAIGN_WASM_HASH=  # campaign wasm hash (after deploy)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=   # optional, enables WalletConnect
NEXT_PUBLIC_STATS_KEY=           # gates the private /stats dashboard
BLOB_READ_WRITE_TOKEN=           # Vercel Blob (campaign metadata)
```

## Documentation

- [`docs/SECURITY.md`](docs/SECURITY.md) — security review
- [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md) — end-user guide
- [`docs/GOOGLE_FORM.md`](docs/GOOGLE_FORM.md) — onboarding form spec
- [`docs/MARKETING.md`](docs/MARKETING.md) — launch/marketing kit
- [`docs/blog/`](docs/blog/milestone-escrow-on-soroban.md) — technical blog (ecosystem contribution)
- [`docs/SUBMISSION-L6.md`](docs/SUBMISSION-L6.md) — Level 6 submission tracker

## License

MIT — for the Stellar Journey to Mastery program.
