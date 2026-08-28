# Independent verification — FAIL

**Candidate:** `9ecd63eac1e13a8ccd405ee82cc5a79016666d50` (`main`)
**Live URL:** <https://freelancer-agent-context.sociobot.in>
**Verified:** 2026-08-28

## Verdict

**FAIL. Do not promote this candidate.** The fresh, successful mobile
Lighthouse run scores **86 performance**, below the required 90, with **540 ms
total blocking time**. This is a release-blocking performance-budget failure.
The desktop deletion flow also leaves the workspace's isolated connector
profile and its credentials/configuration behind, so offboarding deletion is
not complete.

## First read and demo gate

Cold live landing page passes the first-read gate.

- **What it does:** “Keep client work from crossing over”; it keeps sources,
  accounts, and writing style separate.
- **For whom:** freelance developers switching clients.
- **What to do first:** the first primary action is **Try it with sample data**
  and says “See a checked client session next.”

`/demo` opens Northstar Coffee and Juniper Legal sample workspaces in one click.
It keeps the persistent **Demo — Sample data. Nothing is saved** banner,
**Reset demo**, and **Start for real**. A fresh live demo check passed;
unselecting every source gave “Choose at least one source”, and text naming
Juniper gave the specific blocking/recovery message.

## Required claims

Installed the lockfile with `npm ci` (65 packages; 0 vulnerabilities), then
ran every command listed in `.factory/claims.json`. The two Rust commands need
the documented Tauri Linux prerequisites; after installing those documented
packages, all eleven commands passed from the clean checkout.

| Claim | Command | Result |
| --- | --- | --- |
| demo-isolation | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS |
| boundary-check | `npm run test:e2e -- --grep @claim:boundary-check` | PASS |
| scoped-launch | `cargo test --manifest-path src-tauri/Cargo.toml scoped_launch_separates_connector_credentials` | PASS |
| provenance-export | `npm run test:e2e -- --grep @claim:provenance-export` | PASS |
| device-local | `npm run test:e2e -- --grep @claim:device-local` | PASS |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| offline-update | `npm run test:e2e -- --grep @claim:offline-update` | PASS |
| plan-limit | `npm run test:e2e -- --grep @claim:plan-limit` | PASS |
| free-core | `npm run test:e2e -- --grep @claim:free-core` | PASS |
| paid-checkout | `npm run test:e2e -- --grep @claim:paid-checkout` | PASS |
| encrypted-vault | `cargo test --manifest-path src-tauri/Cargo.toml encrypted_vault_round_trips_and_rejects_another_key` | PASS |

## Local build and automated tests

- `npm test`: PASS — 1 Vitest test and 14 Playwright tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS — TypeScript, Rust format, and Clippy with `-D warnings`.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS — 2 Rust tests.
- `npm run build`: PASS. Initial JS is 29.14 KB (9.74 KB gzip); CSS is
  16.30 KB (4.38 KB gzip), within the static-product budgets.
- `CI=1 npm run tauri -- build`: PASS after the README's documented Linux
  prerequisites. It produced AppImage, deb, and rpm. Local bundle SHA-256:
  AppImage `4af185d16484b74cbef6db199327292f87d34a4aead317e4a28f2332da01ebc`,
  deb `eaf839fa3c50cf477b3ce55040e243757504dd57a73cf8b0c0e2f088c129c57c`,
  rpm `a6814a4f81acd07554f39e7d9aac38860678ece246c524059f7115e94bfe33fc`.

## Live deployment, privacy, and accessibility

- Live `index.html`, JS, and CSS SHA-256 exactly equal the local production
  files: `e8a8117f…de587`, `78d62a04…364c73`, and `e92cd029…f97f82`.
- Fresh Playwright checks on `/`, `/demo`, `/privacy`, `/terms`, and an unknown
  route found one H1 each, no console/page errors, and zero axe serious/critical
  findings.
- Keyboard: the first Tab lands on **Skip to main content**, Enter focuses
  `main`, and the workspace dialog opens with Enter and closes with Escape.
  Focus has a visible `rgb(173, 53, 26)` 3px outline. Reduced motion resolves
  transitions to `0s`.
- At 390×844 the demo's document width is 390px and **Check boundary** remains
  visible and operable.
- A fresh Playwright request log for the complete `/demo` check recorded no
  off-origin requests. The landing page's release lookup goes only to the
  disclosed `api.github.com`; workspace data was not sent there.
- Live headers include HSTS, `nosniff`, `strict-origin-when-cross-origin`, CSP
  with `frame-ancestors 'none'`, and a restricted `connect-src`. Hashed JS is
  `max-age=31536000, immutable`; HTML and `sw.js` revalidate after 30 seconds.
- The live service worker/cache claim passed, including replacement of the
  legacy shell. There is no repository `verify-url.sh` to run.
- The live checkout claim passed: the product checkout endpoint returned 303
  to a `checkout.dodopayments.com/session/...` URL. Its license-verify endpoint
  accepted 30 consecutive invalid requests, then returned **429** on request
  31 with `Retry-After: 4`; observed allowance: **30 requests per window**.
- Release `v0.1.2` has macOS, Windows, and Linux assets plus `SHA256SUMS` and
  valid `latest.json`. Downloaded
  `Client.Context.Firewall_0.1.2_amd64.deb` SHA-256 was
  `472c235cb28e0486426bd51d7bd7a5a2b1d89cc1e1fe1bbc45b84f3306df00a5`,
  matching the published checksum.

## Performance

Fresh Lighthouse mobile retry (Chromium with `--disable-dev-shm-usage`)
completed without runtime error:

| Category | Score |
| --- | --- |
| Performance | **86** |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

FCP was 0.9 s, LCP 2.0 s, CLS 0, and TBT 540 ms. The performance score is
below the attached performance requirement of 90, so this is not a pass.

## Defects

### P1 — Mobile Lighthouse performance budget fails

The clean live Lighthouse run is 86/100 performance with 540 ms TBT, below the
required 90 performance score and 200 ms INP/TBT-class responsiveness target.
Investigate the blocking main-thread work in the cold landing path and re-run a
successful mobile Lighthouse audit at 90+ before promotion.

### P1 — Deleting a workspace leaves its client connector profile behind

The product promises workspace deletion for offboarding, but the UI handler at
`src/main.ts:144` only removes the workspace from in-memory state and saves the
remaining vault. Scoped profiles are created at
`connector-scopes/<workspace-id>/<source-id>` in `src-tauri/src/lib.rs:66`.
There is no frontend invoke or Rust command that removes that per-workspace
directory; `delete_vault` only deletes the whole vault and is not called by the
workspace deletion handler. A former client's isolated agent credentials and
configuration can therefore remain on disk after “Delete workspace”. Delete
the workspace-specific profile directory and related local credentials with a
clear confirmation, then add a claim-level regression test.

### P2 — Deletion/offboarding statement has no claim test

README/privacy copy says a workspace can be deleted for offboarding, but no
entry in `.factory/claims.json` asserts that the workspace data *and scoped
profile* are actually removed. The existing export claim does not cover
deletion. Add an observable demo/desktop test once deletion is complete.

