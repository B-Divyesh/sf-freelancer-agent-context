# Independent product verification 3 — FAIL

**Candidate:** `4e3989164b37b360290932d6e7e7070f5e8c50e5` (`main`)
**Live URL:** <https://freelancer-agent-context.sociobot.in>
**Verified:** 2026-08-28 UTC
**Artifact:** desktop app with static companion site

## Verdict

**FAIL. Do not release or promote this candidate.** The web deployment is
healthy and its static files exactly match the candidate, but the desktop
download offered by that site is the older `v0.1.2` build from commit
`ffd2dfd9fcf074b0ea53fff35ba4848f131e7481`. It predates the candidate's
workspace-profile deletion repair and therefore retains deleted clients'
isolated credential/config profile directories. The current product also
silently presents failed local saves as successful and has serious WCAG
contrast failures in its shipped dark theme.

## Mandatory first-read and demo gate

Cold live desktop and 390×844 mobile loads passed this gate.

- **What it does:** “Keep client work from crossing over.” It separates client
  sources, accounts, and writing style before an agent starts.
- **For whom:** freelance developers who switch clients.
- **What to click first:** **Try it with sample data**, beside “See a checked
  client session next.” The action is visible in the first mobile viewport at
  y=505 px.
- One click opens `/demo` with Northstar Coffee and Juniper Legal. The
  persistent banner says “Demo — Sample data. Nothing is saved” and provides
  **Reset demo** and **Start for real**.

## Required claims

`.factory/claims.json` exists and contains 12 claims. On the untouched clone,
the browser commands first reported the expected missing `node_modules`, and
the Rust commands reported missing Tauri system libraries. After the clean
installation steps (`npm ci` and the README's Tauri prerequisites), every
exact command below passed unchanged.

| Claim | Exact command | Result |
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
| workspace-deletion | `cargo test --manifest-path src-tauri/Cargo.toml deleting_workspace_removes_its_connector_scope_and_credentials` | PASS |

Two claim tests are materially narrower than their claim text; see P2 below.

## Clean install, tests, and production builds

- `npm ci`: PASS — 65 packages, 0 vulnerabilities.
- `npm test`: PASS — 1 Vitest test and 15 Playwright tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS — TypeScript, Rust format, and Clippy with
  `-D warnings`.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS — 3 tests.
- `npm run build`: PASS; output is `dist/site/`.
- `npm run tauri -- build`: PASS; produced the release executable, AppImage,
  deb, and rpm. Both the current local release executable and the downloaded
  published executable opened a 1240×820 native window under Xvfb.

Current local Linux bundle SHA-256 values:

- AppImage: `2b11ab0a89ae9686558d5843f5e05f7815d782ef12238205aedd50c530aa2504`
- deb: `9d44febfb5be62e98e99c7656d5acb3c408ebd6e190a56e1a59be7d71a07a139`
- rpm: `e8afc2ef182f95f94e2044af6b13f90b2ced745d398276b8d4d363f0cd38409b`

## End-to-end behavior

Fresh live browser contexts exercised normal, boundary, invalid, recovery,
reset, deletion, and export paths.

- Empty demo input with one source: PASS; Northstar session is ready.
- No selected source: PASS; “Choose at least one source.”
- `Juniper Legal` plus `NS_LIVE_KEY`: PASS; the UI reports three exact blocks.
- Corrected text: PASS; the same session becomes ready and offers the scoped
  Codex launch step.
- Demo launch: PASS; it states that demo mode does not open local apps.
- Export after reload: PASS; `ns-delivery-record.json` contained Northstar,
  one checked source, and three checks.
- Demo reset: PASS; the session record and `demo:workspace-state` were removed,
  with no real/local namespace data created.
- Required workspace fields use native validation; a 61-character client name
  is limited to 60 characters. Cancelled deletion preserves the workspace;
  confirmed deletion returns to the empty state.
- **Defect:** immediately after a successful check, the delivery ledger still
  says “No delivery records yet” and no export control exists. Reloading is an
  undocumented requirement (P1).

## Accessibility and responsive behavior

- `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the client-rendered not-found
  screen each have `lang=en`, one H1, one main landmark, route-specific titles,
  no missing image alt text, and no console/page errors.
- Light-theme axe: 0 serious/critical findings on all routes.
- **Dark-theme axe:** FAIL. The landing page has 6 serious contrast nodes and
  `/demo` has 4. Ratios include 1.08:1 for dark rail/limits text and 2.67:1 for
  white client initials on orange; required ratios are 4.5:1 (or 3:1 for large
  text).
- Keyboard traversal reaches all demo controls with a visible 3 px focus ring.
  The first Tab reaches the skip link, Enter focuses `main`, and the native
  workspace dialog opens, traps focus, closes with Escape, and returns control.
- **Tab widget defect:** ArrowRight on the selected workspace tab does not move
  focus or selection to the next tab.
- At 390×844 there is no page overflow and the full workbench remains usable.
  Several real mobile hit areas are below 44×44: header links are as small as
  39×21, the wordmark is 38×38, and demo-banner actions are 39 px tall.
- `prefers-reduced-motion: reduce` resolves transitions and animations to 0 s
  and smooth scrolling to `auto`.
- `/opt/fleet/lib/verify-url.sh`: PASS — HTTP 200, 855 ms load, title/lang/main/
  alt/button checks passed, and 0 console errors.

## Privacy, networking, headers, and offline behavior

- A complete fresh `/demo` block/recovery/check/export/reset flow made no
  off-origin requests and left no local-storage keys.
- The landing loads only first-party JS/CSS/images, then makes the disclosed
  GitHub release request after 3 seconds. No analytics, CDN fonts, or other
  third-party scripts were observed.
- The live service worker controls the site with cache `ccf-shell-v0.1.2`.
  Offline `/demo` reload returned HTTP 200 and showed “Offline · device local”.
  The declared stale-worker replacement test also passed locally.
- Response headers include HSTS, `nosniff`, strict-origin referrer policy,
  restrictive permissions policy, and CSP with `frame-ancestors 'none'`.
  Hashed JS/CSS use `max-age=31536000, immutable`; HTML and `sw.js` use
  `must-revalidate, max-age=30`.
- License verification permits 30 invalid requests from one client in the
  observed window. Request 31 returned HTTP 429 with `Retry-After: 4`.
- A license-return URL correctly strips the token and stores it locally, but it
  sent two simultaneous verification requests for the same token (P2).

## Performance and bundle budgets

Fresh Lighthouse 12.8.2 mobile results:

| Category / metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 0.95 s |
| LCP | 1.31 s |
| TBT | 70 ms |
| CLS | 0 |

A separate performance-only run scored 98 with LCP 1.81 s and TBT 0 ms. Total
transfer was 114,938 bytes. Initial JS is 30,862 bytes (10,362 gzip), deferred
desktop JS is 2,441 bytes (997 gzip), CSS is 16,295 bytes (4,398 gzip), and the
mobile hero is 20,752 bytes. All stated budgets pass.

## Deployment, releases, links, and installability

- Live/local SHA-256 values match exactly for current candidate `index.html`
  (`5b30d4ed…ee84`), initial JS (`b2dad3e5…e97d3`), deferred JS
  (`8261a5e5…ceb3`), CSS (`e92cd029…f97f82`), and service worker
  (`6cb265cf…429b`). The static deployment matches the candidate.
- All internal/site links return 200; the checkout returns 303 to Dodo; the
  detected release asset returns the expected GitHub 302 download redirect;
  mail links are explicit. The hosted checkout showed “Client Context Firewall
  Pro,” `$19.00`, and “One-time Pro license.”
- Release `v0.1.2` contains macOS arm64/x64, Windows MSI/EXE, Linux
  AppImage/deb/rpm, `latest.json`, and `SHA256SUMS`. The downloaded deb hash
  `472c235cb28e0486426bd51d7bd7a5a2b1d89cc1e1fe1bbc45b84f3306df00a5`
  matches the published checksum.
- The release tag resolves to old commit `ffd2dfd…`, not this candidate. The
  published executable Build ID (`56487b73…`) differs from the current local
  candidate Build ID (`fc07484a…`), and the tag's source lacks
  `delete_workspace_scope`.
- Linux `public/install.sh` verifies the 77.2 MB AppImage but leaves it at
  `/tmp/client-context-firewall-AppImage` with mode `0644`; it neither makes it
  executable nor installs it on PATH. An Intel Mac user agent is offered the
  first `.dmg`, which is the arm64 build.
- `robots.txt`, the five-route sitemap, canonical metadata, social image,
  favicon, MIT license, privacy page, and terms page are present. An unknown
  route renders the designed 404 UI but responds HTTP 200 rather than 404.

No product sign-in or first-party application backend exists. Entra identity,
backend concurrency, and backend persistence checks are therefore not
applicable. The only server-side product dependency is the tested Sociobot
billing endpoint.

## Defects by severity

### P1 — Downloadable desktop app is not the candidate and retains deleted profiles

The live site advertises and downloads release `v0.1.2`, whose annotated tag
targets `ffd2dfd…`. Candidate `4e398916…` adds the deletion command and UI at
later commit `e3df965…`, but no new desktop release was built. The old tagged
source only removes the workspace record; it does not remove
`connector-scopes/<workspace>/`. This directly contradicts the live privacy
page and candidate claim that deleting a workspace removes its isolated
credential/config profile. Publish candidate-built assets under a new version,
then verify their build provenance and deletion behavior.

### P1 — Failed saves are displayed as successful and lose the workspace

With `Storage.setItem('ccf:workspace-state', …)` forced to throw a realistic
`QuotaExceededError`, **Save workspace** closed the dialog and displayed the new
client with no error notice, even though storage remained null. Reload returned
to “Create your first client workspace.” `saveState` catches and suppresses the
failure, while callers render success without reading `getStorageError`. The
same control flow covers Tauri vault/keyring/disk failures. A save must remain
unsuccessful, announce the problem, and retain a retryable form/state.

### P1 — Shipped dark theme has serious contrast failures

Fresh dark-scheme axe found 6 serious nodes on `/` and 4 on `/demo`.
Dark `.client-rail` and `.limits` surfaces inherit near-black `--paper` text on
near-black backgrounds (1.08:1); white client initials on orange are 2.67:1.
The contract requires 0 serious/critical axe findings and compliant contrast
in both themes.

### P1 — Delivery export is absent after the check that creates it

After a clean check, the result says the session is ready, but the adjacent
ledger still says no record exists and has no export button. The state is saved,
but the ledger is not rerendered. Only an undocumented reload exposes **Export
latest record**, interrupting the core check-to-delivery workflow.

### P1 — Advertised installers do not give each platform a working obvious step

An Intel Mac user agent is linked to the arm64 DMG because the site selects the
first `.dmg` without architecture handling. The Linux installer downloads a
valid AppImage but leaves mode 0644 in `/tmp`, does not put it on PATH, and tells
the user to open it. The landing page also omits the required `chmod +x` step.

### P2 — License return verifies the same token twice

Opening `/?license=qa-invalid-return` stripped and stored the token correctly
but logged two concurrent `/verify?license=…` requests. This violates the paid
unlock rule to verify on first unlock and then at most once per day and consumes
two of the observed 30-request allowance.

### P2 — Mobile and tab-widget keyboard details miss the accessibility baseline

Header/footer links and demo controls have hit areas below 44×44 CSS pixels.
The workspace picker declares `role=tablist`/`role=tab`, but ArrowLeft/ArrowRight
do not move focus or selection.

### P2 — Unknown URLs return HTTP 200

`/not-a-page` renders a useful not-found screen but the network response is 200.
The site-structure contract calls for a real 404 response.

### P2 — Two claim tests do not prove their complete claim text

`paid-checkout` asserts only a 303 Dodo redirect, not the claim's `$19`
one-time price. `encrypted-vault` uses two fixed in-memory keys and does not
exercise creation/retrieval in the operating-system credential manager, even
though the claim explicitly includes that integration. Both live/code reviews
were consistent with the copy, but the claims contract requires the observable
promise itself to be asserted in the sandbox.

## Required next verification

Publish a new desktop version from the repaired commit; fix save failure
propagation, dark contrast, immediate ledger refresh, and platform installer
selection/permissions. Add dark-theme axe, storage-failure, export-without-
reload, architecture-selection, and complete claim assertions before rerunning
all gates.
