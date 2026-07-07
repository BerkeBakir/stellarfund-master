# StellarFund L7 — Tier 1: Grading Essentials Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: subagent-driven-development or executing-plans. Checkbox steps track progress.

**Goal:** Ship the L7-graded deliverables that read the Tier-0 analytics + on-chain proof: retention/funnel in `/stats`, a public `/metrics` KPI board, a `/growth` monthly report (+ `docs/GROWTH-REPORT.md`), a `/changelog`, and a feedback-sheet import path.

**Architecture:** A server module lists Tier-0 `events/<date>/…` blobs; a pure `retention.ts` aggregates them into funnel + new-vs-returning + weekly cohorts. `/api/analytics` exposes the aggregate (counts only, no PII). Pages render on-chain proof (`getProofData`) plus the analytics aggregate. Growth report figures for off-chain social metrics live in an editable `growthReport.ts` (self-reported, labeled).

**Tech Stack:** Next.js App Router, `@vercel/blob`, vitest, existing `proof.ts`/`format.ts`/glass UI.

## Global Constraints

- Reuse Blob (`list`/`fetch`), `token = process.env.BLOB_READ_WRITE_TOKEN`; degrade to empty aggregate if unset.
- No PII: analytics aggregate exposes counts + public wallet sets only.
- Honesty: on-chain numbers from `getProofData`; social/community figures are **self-reported and labeled** in `growthReport.ts`.
- i18n: user-facing strings TR+EN where the surrounding page is localized; `/metrics` + `/growth` may be EN (public reports) to match README voice.
- `npm test` + `npm run build` green each task.

---

### Task 1: `retention.ts` — pure aggregation
**Files:** Create `src/lib/retention.ts`, `src/lib/retention.test.ts`.
**Produces:**
- `funnel(events): { visits; connects; contributeIntents; shares; referrals }`
- `newVsReturning(events, sinceIso): { newWallets: number; returningWallets: number }`
- `weeklyCohorts(events): { week: string; wallets: number }[]`
- `referralLeaders(events): { ref: string; count: number }[]`

TDD: test funnel counts by type; new-vs-returning by wallet first-seen vs sinceIso; weekly cohort bucketing (ISO week start); referral tally sorted desc. Then implement pure reducers over `AnalyticsEvent[]`.

### Task 2: `eventsRead.ts` — Blob reader (server)
**Files:** Create `src/lib/eventsRead.ts`, `src/lib/eventsRead.test.ts`.
**Produces:** `readEvents(opts?: { sinceDays?: number }): Promise<AnalyticsEvent[]>` — `list({prefix:'events/'})`, fetch each blob JSON, filter valid via `sanitizeEvent`-shape guard, sort by ts. Returns `[]` if no token or on error.
TDD: mock `@vercel/blob` `list` + global `fetch`; assert it parses N events and returns [] when token unset. Use `vi.hoisted` for the blob mock.

### Task 3: `/api/analytics` route
**Files:** Create `src/app/api/analytics/route.ts`, `src/app/api/analytics/route.test.ts`.
**Produces:** `GET` → `{ funnel, cohorts, referralLeaders, totalEvents }` from `readEvents` + `retention`. No PII.
TDD: mock `readEvents` to return fixture events; assert response shape + numbers.

### Task 4: `/metrics` public KPI board
**Files:** Create `src/app/metrics/page.tsx`.
Client page (build-in-public): fetches `getProofData()` (on-chain) + `/api/analytics`. Renders KPI tiles (unique backers, contributions, volume XLM, total visits, this-week new wallets, funnel visit→connect→contribute) using existing glass/gradient tiles. Public — no key gate. Adds a “self-reported” labeled row for followers pulled from `growthReport.ts`.

### Task 5: `growthReport.ts` + `/growth` page + `docs/GROWTH-REPORT.md`
**Files:** Create `src/lib/growthReport.ts` (editable social/community figures + month range + narrative bullets, all labeled self-reported), `src/app/growth/page.tsx`, `docs/GROWTH-REPORT.md`.
`/growth` renders on-chain proof + analytics + the self-reported figures into a monthly report layout. `docs/GROWTH-REPORT.md` is the committed report doc mirroring the page (filled with the live-at-writing figures + placeholders for user’s social proof screenshots).

### Task 6: retention/cohort panel in `/stats`
**Files:** Modify `src/app/stats/page.tsx`.
Add a funnel bar (visit→connect→contribute_intent) + weekly-cohort mini list from `/api/analytics`, below existing category chart. Key-gated (unchanged).

### Task 7: `/changelog` page
**Files:** Create `src/lib/changelog.ts` (typed entries array: date, title, items[], commit?), `src/app/changelog/page.tsx`, `src/lib/changelog.test.ts` (entries sorted desc, no empty titles).
Renders product-update posts / roadmap. Seed with the real L7 tier entries.

### Task 8: feedback-sheet import path
**Files:** Create `src/lib/feedback-import.ts` (`parseFeedbackCsv(text): FeedbackEntry[]` with `{wallet,email,name,rating,comment,at}`, tolerant CSV), `src/lib/feedback-import.test.ts`, `docs/feedback/README.md` (how to export the Google Form → CSV here), `docs/feedback/responses.sample.csv`.
`FeedbackEntry` is consumed later by the Tier-4 testimonial wall.

---

## Self-Review
- Retention/funnel + cohort → Tasks 1,3,6. `/metrics` (G) → Task 4. `/growth` report → Task 5. `/changelog` (E) → Task 7. Feedback sheet → Task 8. All Tier-1 spec items covered.
- Types: `AnalyticsEvent` from Tier 0 reused; `readEvents` output feeds `retention` fns feeds `/api/analytics` feeds pages — consistent.
- No placeholders in code tasks; social figures explicitly labeled self-reported (honesty gate).
