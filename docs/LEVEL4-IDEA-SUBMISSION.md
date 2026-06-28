# Level 4 — Idea Submission: StellarFund

## What is your idea? (Essay)

**StellarFund** is a cross-border crowdfunding and SME micro-financing platform where
backers pay in their **local fiat currency** while everything settles on **Stellar in
USDC** behind the scenes. A supporter pays with a card or bank transfer; a Stellar
**anchor on-ramp (SEP-24/SEP-6)** converts that fiat into USDC; the funds are held in a
**Soroban escrow contract** that releases capital against **milestones**; when the goal
is met the creator withdraws and **off-ramps** to fiat in their own country; if the goal
fails, every backer is automatically refunded on-chain. Each campaign builds a
transparent, on-chain **reputation and disbursement history**.

In short: it takes the on-chain crowdfunding engine already built at the Orange Belt
level (factory-deployed campaign contracts, escrow, refunds, reputation) and turns it
into a real-world product by adding **fiat on/off ramps, USDC settlement, milestone-based
escrow, and compliance** — so a backer in Germany can fund a bakery in Kenya in seconds,
for cents, and the creator receives spendable local money.

## 1. Problem Statement
Cross-border fundraising and small-business financing are broken for everyone outside
major financial hubs:
- **High fees & slow rails:** card processors + PayPal + bank wires take 5–10%+ and days
  to settle internationally; remittance corridors are worse.
- **Exclusion:** millions of creators/SMEs in emerging markets can't access
  Kickstarter/GoFundMe (no supported payout country, no Stripe).
- **Trust gap:** backers can't verify how funds are used; "all-or-nothing" promises aren't
  enforced, and there's no portable reputation.

StellarFund makes global funding near-instant, sub-cent, transparent, and accessible to
creators who are currently locked out — with funds enforced by code, not promises.

## 2. Why Stellar?
- **Built for payments:** 3–5s finality, fractions of a cent in fees — the economics that
  make micro-contributions and global reach viable.
- **Anchors + SEP standards:** SEP-24/SEP-6 (on/off ramp), SEP-31 (cross-border), SEP-10
  (auth), SEP-12 (KYC) are exactly the fiat↔crypto bridge this needs.
- **USDC native:** stable settlement, no volatility exposure for creators/backers.
- **Soroban smart contracts:** programmable, auditable milestone escrow + refunds with
  real custody.
- **Compliance-ready:** SEP-8 regulated-asset tooling and anchor KYC enable a
  regulator-friendly product — unlike a pure-DeFi approach.

## 3. Target Users
- Creators / SMEs in emerging markets (Africa, LATAM, SE Asia) locked out of Western
  crowdfunding payout rails.
- Global backers/donors wanting low-fee, transparent giving across borders.
- Diaspora communities funding family businesses and community projects back home.
- Impact funds / NGOs wanting auditable, milestone-gated disbursement.

## 4. Technical Architecture
**Frontend (Next.js + TypeScript + Tailwind, mobile-first):** campaign discovery,
creation wizard, contribution flow with an embedded anchor on-ramp (SEP-24 interactive)
widget, creator dashboard with milestone submission + off-ramp withdrawal, KYC handoff
(SEP-12), live status from on-chain events.

**Contracts (Soroban / Rust):**
- `CampaignFactory` — deploys per-campaign escrow contracts (evolves the Orange Belt factory).
- `Escrow` — holds USDC, milestone schedule, release on milestone approval, automatic
  refund path on failure/deadline.
- `Reputation` — portable creator track record, gated to registered campaigns.
- (Phase 2) `Governance/Approval` — backer/curator milestone sign-off; optional yield on
  idle escrow via a Stellar DeFi pool.

**Data flow:**
1. Backer pays fiat → anchor on-ramp (SEP-24 + SEP-10 auth) delivers USDC.
2. `Escrow.contribute(USDC)` records the contribution and emits events.
3. Milestone met & approved → `Escrow.release()` sends a USDC tranche to creator →
   `Reputation.record_success()` (inter-contract call).
4. Creator off-ramps USDC → local fiat via anchor (SEP-24/SEP-6).
5. Goal/milestone fails → `Escrow.refund()` returns each backer's USDC; an indexer + RPC
   `getEvents` keep the UI real-time.

## 5. Complexity Evaluation
- **Anchor integration:** SEP-24/SEP-6/SEP-10/SEP-12 flows; async real-money settlement
  states (pending/KYC/failed).
- **Real custody of value (USDC):** audited escrow with milestone accounting, partial
  releases, bulletproof refunds — money-safety is non-negotiable.
- **Multi-contract orchestration:** factory → escrow → reputation + token (SAC/USDC)
  transfers with correct authorization.
- **Compliance & regulatory surface:** KYC/AML handoff, regulated-asset considerations,
  per-jurisdiction payout rules.
- **Production infra:** indexer, idempotent anchor-webhook handling, CI/CD, monitoring,
  security review of fund-handling code.

A genuine end-to-end fintech product: real money in, smart-contract custody, real money out.

## 6. Roadmap
**MVP (Level 4–5):** USDC-denominated campaigns on Stellar Testnet with a sandbox/test
anchor for on/off ramp; milestone escrow + refunds; reputation; mobile-first UI; CI/CD.
Demonstrates the full fiat→USDC→escrow→fiat loop in a testnet/sandbox environment.

**User acquisition:** start with one or two diaspora remittance corridors (e.g.,
EU→Kenya/Nigeria), partner with local creators/NGOs; wedge on low fees + "fund anyone,
anywhere"; content + community + referral incentives; integrate a live anchor for that
corridor.

**Mainnet vision:** production launch with a licensed/live anchor partner and USDC on
Stellar mainnet; curator/backer milestone governance; optional yield on idle escrow via
Stellar DeFi; multi-currency anchors; an SDK/embeddable widget so any NGO or marketplace
can drop in compliant, low-fee, milestone-based funding.
