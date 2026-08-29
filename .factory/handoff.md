# Client Context Firewall — venture planning handoff

Work order: `venture-freelancer-agent-context-plan`

Role: planner

Date: 2026-08-29

Outcome: **planning scaffold complete; no product milestone built**

## What was done

- Wrote `.factory/plan.md` as the venture contract: PRD, evidence and wedge,
  architecture/trust boundaries, local and cloud data models, Entra CIAM,
  Sociobot/Dodo subscription flow, optional Sociobot gateway use, operations,
  rate limits, backup/export, five milestone contracts, claims/tests/DoD, and
  risk-retiring experiments.
- Restored the supplied researched opportunity in `.factory/brief.json` and
  made the authoritative monetization **Free + Independent at $19/month**.
- Expanded `.factory/design.md` into the product-specific dithered boundary
  ledger system, including rationale, measured contrast, typography, spacing,
  motion, responsive behavior, accessibility, performance, and original asset
  provenance.
- Added `.factory/components.md` with exactly 20 shared components and their
  states/accessibility contracts.
- Added `src/styles/tokens.css` and moved the inherited palette out of the main
  stylesheet behind semantic tokens and compatibility aliases. Added
  `src/components`, `src/features`, and `src/services` boundary READMEs so M1
  can modularize without a framework migration.
- Reduced `.factory/claims.json` to the six M1 sandbox claims and kept each
  wired to one existing tagged Playwright test.
- Added `scripts/validate-plan.mjs` and made it part of `npm test`. It checks
  required planning artifacts, claim shape/tag/plan coverage, duplicate IDs,
  and core design tokens.
- Added `.github/workflows/ci.yml` with Node 22, pinned Playwright Chromium,
  plan validation, typecheck, full tests, production build, Rust format,
  Clippy, and native tests.
- Did not add account, subscription, AI, backend, or other product behavior.
  The broad implementation already present at base commit `759b150` was
  inherited and retained.

## How to run and verify

```sh
npm ci
npm run validate:plan
npm test
npm run typecheck
npm run lint
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
```

Observed locally:

- `npm ci`: 66 packages audited, 0 vulnerabilities.
- Plan validator: 6 required artifact groups and 6 M1 claims passed.
- Vitest: 6 passed.
- Playwright: 27 passed, 1 intentionally skipped legacy one-time checkout.
- TypeScript: passed with strict checking.
- Rust format/Clippy: passed with warnings denied.
- Rust native tests: 7 passed.
- Production build: `dist/site`; main JavaScript 43.94 KB raw / 13.79 KB gzip,
  lazy JavaScript 2.44 KB raw / 0.98 KB gzip, CSS 18.63 KB raw / 4.93 KB gzip.
- `git diff --check`: passed.

Linux native verification requires the Tauri packages listed in `README.md`;
this worker installed GTK 3, WebKitGTK 4.1, AppIndicator, librsvg, and libsecret
development packages before the successful Rust checks.

## Important baseline mismatch

The repository arrived with a completed-looking prototype and review history,
although this work order is the venture planning stage. That inherited product
currently advertises and tests a **$19 one-time Pro license**. The supplied
venture brief instead requires an **Independent $19/month subscription**.

The plan and brief are now authoritative. Product copy and billing behavior
were not changed because this order explicitly forbids building the product.
The obsolete live one-time checkout test is skipped with an inline reason; M2
must replace it with the real `monthly-checkout` claim after the pilot monthly
product exists. Do not present the current implementation as meeting this
venture plan merely because its legacy tests pass.

`.factory/claims.json` intentionally contains only M1 claims. The inherited
site and README still make later-stage prototype claims. M1's builder must
either remove those claims from shipped copy or add them only in the milestone
where the plan requires and verifies them.

## Needs operator action

- Register the **Independent monthly, $19/month** test and live products behind
  the Sociobot billing endpoint. Confirm checkout, renewal, cancellation,
  expiry, revoke, and verify response behavior before M2 begins. The attached
  paid-unlock reference describes one-time licenses, so the monthly contract
  cannot be assumed.
- Register
  `https://freelancer-agent-context.sociobot.in/auth/callback` on Entra SPA
  client `25c704f4-465a-47af-80ab-2c489466b697`, plus the production logout URI
  and desktop custom-scheme link required by M2.
- Provision the M2 PostgreSQL/Container Apps resources and signing/notarization
  credentials only when those milestones begin. No infra, DNS, billing, or
  secret changes were made here.

## Next step

Start M1 from `.factory/plan.md`. Reconcile the inherited prototype down to the
M1 routes and six claims, keep `?demo=1` isolated, run the full quality gates,
and write `.factory/handoff-m1.md`. M2 may start only after independent review
and polish record M1 PASS.
