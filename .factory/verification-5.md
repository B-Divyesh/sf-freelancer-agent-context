# Independent product verification 5 — PASS

**Candidate:** `de17a3b2628f9d0cc1652a050c34778f4808fc41` (`main`)

**Live URL:** <https://freelancer-agent-context.sociobot.in>

**Verified:** 2026-08-29 UTC

**Artifact:** Tauri desktop app with static companion site

## Verdict

**PASS. This candidate is ready to promote.** The three core failures from
verification 4 are repaired. Supported connector children use a cleared,
allowlisted environment; the checked client context is bound to a protected
session file; and neither the browser preview nor a failed native preparation
can produce verified provenance. The live site and published v0.1.4 desktop
release contain those repairs.

No P0, P1, or P2 defects were found in this verification.

## Mandatory first read and demo gate

**PASS.** A cold 1440×900 browser context opened the live root with no stored
state.

- **What it does:** “Keep client work from crossing over.”
- **For whom:** freelance developers who switch clients without mixing
  sources, accounts, or writing style.
- **What to click first:** **Try it with sample data**, beside “See a checked
  client session next.”
- The action is visible in the first desktop screen and at y=505–553 px in the
  first 390×844 mobile screen. One click opens `/demo`.
- The demo opens with Northstar Coffee and Juniper Legal, plus the persistent
  **Demo — Sample data. Nothing is saved** banner, **Reset demo**, and **Start
  for real**.

Evidence: `.factory/qa-evidence/verification-5/live-landing-mobile.png`,
`live-demo-desktop.png`, and `live-demo-mobile.png`.

## Required claims

`.factory/claims.json` exists with 14 entries. As required, every exact command
was invoked before other repository inspection. In the untouched worker image,
the JavaScript commands could not start before `npm ci`, and Rust could not
compile before the README's Tauri system prerequisites were installed. After
installing those declared prerequisites, all 14 exact commands passed
unchanged; no claim assertion failed.

| Claim | Exact command | Result |
| --- | --- | --- |
| demo-isolation | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS — 1 test |
| boundary-check | `npm run test:e2e -- --grep @claim:boundary-check` | PASS — 1 test |
| scoped-launch | `cargo test --manifest-path src-tauri/Cargo.toml scoped_launch` | PASS — 2 matching regressions |
| provenance-export | `npm run test:e2e -- --grep @claim:provenance-export` | PASS — 1 test |
| validated-provenance | `cargo test --manifest-path src-tauri/Cargo.toml failed_native_preflight_refuses_provenance_without_a_real_workspace_path` | PASS — 1 test |
| device-local | `npm run test:e2e -- --grep @claim:device-local` | PASS — 1 test |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — 1 test |
| offline-update | `npm run test:e2e -- --grep @claim:offline-update` | PASS — 1 test |
| plan-limit | `npm run test:e2e -- --grep @claim:plan-limit` | PASS — 1 test |
| free-core | `npm run test:e2e -- --grep @claim:free-core` | PASS — 1 test |
| paid-checkout | `npm run test:e2e -- --grep @claim:paid-checkout` | PASS — 1 test |
| encrypted-vault | `cargo test --manifest-path src-tauri/Cargo.toml encrypted_vault_round_trips_and_rejects_another_key` | PASS — 1 test |
| platform-install | `npm run test:unit -- --run -t @claim:platform-install` | PASS — 1 test |
| workspace-deletion | `cargo test --manifest-path src-tauri/Cargo.toml deleting_workspace_removes_its_connector_scope_and_credentials` | PASS — 1 test |

The repaired launch regression starts a child with OpenAI, Anthropic, and
Google credential sentinels, proves they are absent, and proves the selected
workspace identity and checked context reach the child. Source review confirms
Linux, macOS, and Windows launchers clear the inherited environment. The native
preparation regression rejects a missing local folder before creating a
profile. Browser regression coverage independently prevents a preview-only
check from exporting launch provenance.

## Clean install, tests, and production builds

Environment: Ubuntu 24.04, Node 22, Rust stable, Playwright 1.58.2.

- `npm ci`: PASS — 65 packages, 0 vulnerabilities.
- `npm test`: PASS — 2 Vitest tests and 21 Playwright tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS — TypeScript, rustfmt, and Clippy with `-D warnings`.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS — 5 Rust tests.
- `npm run build`: PASS; output is `dist/site/`.
- `CI=1 npm run tauri -- build`: PASS; produced the Linux executable,
  AppImage, deb, and rpm.
- Both the local release executable and the executable extracted from the
  published v0.1.4 deb opened a 1240×820 **Client Context Firewall** window
  under Xvfb.

Local Linux bundle SHA-256 values:

- AppImage: `c20d7fc800b941965f4b1f6152e5edf9570d10a8ce2665c2ac14d8e0a2e007b3`
- deb: `1039732f017fa9d749b148a19ef3e91f3c1373b53f010ffe24eb183168c972d3`
- rpm: `a42ad3d3bb6bf01a8547c8ad247b4c288e9cfdc7ed08313852f6424220cd46d3`

## Independent end-to-end behavior

Fresh live contexts exercised normal, boundary, invalid-input, recovery,
storage, deletion, license, and export paths.

- With every source cleared, the demo reports **Choose at least one source**.
- `Juniper Legal` plus `NS_LIVE_KEY` produces three exact blocks: another
  client, the configured key term, and the configured Juniper term.
- Corrected text passes and exports `ns-delivery-record.json`. The JSON has
  `status: "sample"`, one selected source, no launch receipts, and explicitly
  says no local folder, profile, or connector was validated.
- Demo changes use only `demo:workspace-state` in session storage. Reset removes
  it; no local-storage key is created.
- Empty required workspace fields keep the dialog open and focus the first
  invalid field. Two real browser workspaces persist; a third is blocked on the
  free plan.
- Dismissing workspace deletion keeps both workspaces. Confirming it removes
  the selected workspace and reports that its isolated profile was deleted.
- A browser-only check with a nonexistent folder shows **Open this workspace
  in the desktop app**, creates no record, and exposes no export button.
- License paste stores the documented key and caches a valid verdict. A return
  URL token is stripped from the address, stored, and verified with one GET
  carrying no request body.

## Accessibility, mobile, and resilience

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200 with route-specific
  titles, `lang=en`, one H1, one main landmark, and no missing image alt text.
  An unknown route returns HTTP 404 with the designed recovery page.
- Playwright AxeBuilder found **0 serious/critical findings** across every route
  in both light and dark themes, plus a separate 390 px demo scan.
- First Tab reaches **Skip to main content** with a 3 px orange focus outline;
  Enter focuses `main`. Workspace tabs respond to arrows/Home/End. The dialog
  focuses its close control, closes with Escape, and returns focus to its
  opener.
- At 390×844, landing and demo document widths remain 390 px, the primary demo
  action is on the first screen, and no visible link or button is below 44×44
  CSS px.
- A text-only 200% stress run preserves all content and the boundary action;
  its full layout remains horizontally scrollable. Reduced-motion mode has no
  nonzero animation or transition duration and uses automatic scrolling.
- The standard `verify-url.sh` check passes: 1,083 ms load, no console errors,
  correct title/lang/H1/main, no missing alt text, and no unlabeled buttons.
- No console errors or uncaught page errors occurred in live route and flow
  testing.

Evidence: `.factory/qa-evidence/verification-5/verify-url/verify.json` and the
screenshots in `.factory/qa-evidence/verification-5/`.

## Privacy, headers, caching, and offline behavior

- The complete demo block/recovery/export/reset flow made three requests, all
  to the product origin. It made no analytics, font, script, or other
  third-party request and wrote no real-workspace storage.
- The settled landing page additionally requests only public release metadata
  from the disclosed `api.github.com` endpoint.
- Live headers include HSTS, `nosniff`, strict-origin referrer policy,
  camera/microphone/geolocation restrictions, and CSP with
  `frame-ancestors 'none'` and only the documented connect origins.
- Hashed assets use `max-age=31536000, immutable`; HTML and `sw.js` use
  `must-revalidate, max-age=30`.
- The live service worker controls the page with cache `ccf-shell-v0.1.4`.
  Offline `/demo` reload returns 200 with **Offline · device local** and no
  browser error. The stale-shell replacement claim also passes.
- The product has no sign-in or first-party application backend. Entra,
  backend concurrency, and server-persistence checks are not applicable.
- The Sociobot license endpoint allowed 30 requests from one client. Request
  **31 returned 429** with `Retry-After: 3`. Observed allowance: **30 requests
  per window**.

## Performance and bundle budgets

Fresh Lighthouse 12.8.2 mobile results:

| Category / metric | Result |
| --- | ---: |
| Performance | **98** |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 1.0 s |
| LCP | 1.4 s |
| TBT | 180 ms |
| CLS | 0 |
| Total transfer | 122 KiB |

The local production build is 37,178 bytes initial JS (12.28 KB gzip), 2,441
bytes deferred JS (0.98 KB gzip), and 16,842 bytes CSS (4.46 KB gzip). The
mobile hero is 20,752 bytes. All attached budgets pass.

Evidence: `.factory/qa-evidence/verification-5/lighthouse-mobile.json`.

## Deployment, release, and installers

- Local/live SHA-256 values match exactly for `index.html`
  (`c0dc5016…2c5d`), `sw.js` (`5553032c…f7e`), initial JS
  (`ae403e04…d3b8`), deferred JS (`8261a5e5…ceb3`), and CSS
  (`8fa78a43…d806`).
- Candidate changes after tag `v0.1.4` are handoff/evidence only; product code
  and built assets are unchanged. The live deployment therefore matches this
  candidate's product.
- GitHub release `v0.1.4` targets
  `8d56ea58115ace0557ac92a6a587dc58b0653dcb`. Release workflow run
  `33227521357` completed successfully from the same SHA.
- The release has macOS arm64/x64, Windows MSI/EXE, Linux AppImage/deb/rpm,
  `SHA256SUMS`, and valid `latest.json` entries for all three platforms.
- Downloaded `Client.Context.Firewall_0.1.4_amd64.deb` matches its published
  SHA-256 `e8c3afee61d9e3f2d62dc73a88153818486192632fbcccd4b80489a084848500`,
  reports version 0.1.4 amd64, declares GTK/WebKit runtime dependencies, and
  contains the repaired session preparation/context symbols.
- The live detector chooses x64 DMG for Intel Mac, aarch64 DMG for Apple
  silicon, MSI for Windows, and AppImage for Linux. Every selected link points
  to a real v0.1.4 release asset.
- The real Linux one-line installer downloaded 81,062,392 bytes, verified
  SHA-256 `a62e9312e9f2595314a02e7f704723ed8febd158ba385b5f1c62ff4567d84921`,
  and installed an executable mode-0755 file under a clean `XDG_BIN_HOME`.
- All landing links resolve to 200 or an intentional checkout redirect. The
  hosted checkout returns 303 to Dodo and states **$19.00** and **One-time Pro
  license**.

## Defects by severity

- **P0:** none.
- **P1:** none.
- **P2:** none.

## Operator action

The release correctly labels macOS and Windows builds as unsigned. Signing and
notarization still require the operator-provided `APPLE_CERTIFICATE` and
`WINDOWS_CERT_PFX` secrets documented by the installer contract.
