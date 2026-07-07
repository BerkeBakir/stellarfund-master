# StellarFund — Level 7 (Founder Belt / Master Track) Submission

Founder track: sustainable growth, retention, product-market fit, and real adoption on
Stellar mainnet — built on the L6 (Black Belt) mainnet app.

## Links
- **Public GitHub repo:** https://github.com/BerkeBakir/stellarfund-master
- **Live production app:** https://stellarfund-master.vercel.app
- **Monthly growth report:** https://stellarfund-master.vercel.app/growth · [`docs/GROWTH-REPORT.md`](GROWTH-REPORT.md)
- **Build-in-public metrics:** https://stellarfund-master.vercel.app/metrics
- **Changelog / product updates:** https://stellarfund-master.vercel.app/changelog
- **On-chain proof:** https://stellarfund-master.vercel.app/proof
- **Feedback form:** in-app (config `FEEDBACK_FORM_URL`) → exports to [`docs/feedback/`](feedback/)
- **Demo video:** `<add link>`
- **Twitter/X:** https://x.com/Berkebey001 — product-update posts `<add permalinks>`
- **Community contribution:** https://dev.to/berkebey01/building-milestone-escrow-crowdfunding-on-soroban-5hc

Mainnet contracts are **shared with L6** (Factory `CBUAZAAH7R7WXP3PIBKVPHYJ3XIHUTDOYBNUPPTLDVUWI6ZK6X33ZPN2`,
Reputation `CCXGJUE6UXPMU27WKJZJS7XXV2NA5ZQPWLPQUJ2XNGDH5TD7L4DMAT5X`, native XLM SAC).

## Requirements checklist
- [x] Public GitHub repository
- [x] **30+ meaningful commits** (see git log; L7 adds 19+ feature commits on top of the L6 history)
- [x] Live production application (Vercel)
- [x] Mainnet transaction proof — `/proof` board + stellar.expert (on-chain, verifiable)
- [x] **Monthly growth report** — `/growth` + `docs/GROWTH-REPORT.md`
- [x] Product analytics & retention — first-party funnel + weekly cohorts in `/stats` and `/metrics`
- [x] Product update posts surface — `/changelog`
- [x] Updated documentation — README, this doc, `docs/GROWTH-REPORT.md`, `docs/feedback/`
- [ ] **Proof of 50+ new mainnet users** — user-driven; tracked honestly on `/proof` + `/metrics` (no fabrication)
- [ ] **Social media growth (50+ followers)** — user-driven; self-reported in `growthReport.ts`, backed by proof links
- [ ] User feedback sheet — export the Google Form CSV to `docs/feedback/responses.csv`
- [ ] Product-improvement commit links — add to README "Feedback-driven improvements" as feedback arrives
- [ ] Community contribution (new) — publish + link the update posts / tutorial

## Growth engineering shipped this level
**Foundation:** first-party privacy-light analytics (visit/connect/contribute/share/referral),
SEO (sitemap/robots/OG cards).
**Grading essentials:** `/metrics` live KPI board, `/growth` monthly report, retention/cohort +
funnel in `/stats`, feedback-sheet import, `/changelog`.
**Growth levers:** creator dashboard (`/creator`) + campaign updates, referral share cards
(`ShareBar`, `?ref=`), dynamic OG images, email capture + weekly digest (Resend), onboarding tour.
**Retention & reach:** `/me` dashboard, follow/watch + notifications groundwork, embeddable
widget (`/embed/<id>`), installable PWA, testnet free-try funnel (`/try`).
**Trust & PMF:** campaign comments, transparency badges, creator verification, testimonial wall.

## Honesty note
On-chain figures are computed live from the contracts and independently verifiable. Social /
community figures are **self-reported and labeled**; user/follower counts are never fabricated —
consistent with the L5/L6 approach.
