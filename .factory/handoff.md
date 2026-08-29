# Repair handoff — Client Context Firewall v0.1.3

Date: 2026-08-29 UTC

Work order: `freelancer-agent-context-repair-3`

Source report: commit `a93ecca5fb90b40bf7e8da1a3d70ec53adb4dfe4`, candidate `4e3989164b37b360290932d6e7e7070f5e8c50e5`

## Outcome

All findings in `.factory/verification-3.md` were repaired at their source.

- Persistence errors now reject the operation. A failed workspace save keeps
  the dialog and entered values open, announces the storage error, and never
  renders or persists the unsaved workspace. Other workspace mutations use a
  saved clone before updating visible state.
- A successful boundary check refreshes the delivery ledger immediately. The
  export is available without a reload.
- Dark surfaces now use the dark-theme ink token, and orange initials use the
  signal-ink token. Axe finds no serious or critical issue in either theme.
- Header, footer, wordmark, and demo actions are at least 44×44 CSS pixels.
  Workspace tabs implement ArrowLeft, ArrowRight, Home, and End with roving
  `tabindex`, focus movement, and selection.
- Concurrent verification of the same returned license token is deduplicated.
- The release chooser selects Intel and arm64 DMGs by architecture and lists
  the other Mac build. The Linux script verifies the release checksum,
  installs the AppImage with mode 0755 under the user's binary directory, and
  reports whether that directory is on PATH. The landing page documents the
  direct-download `chmod +x` step.
- Known application routes are explicit Static Web Apps rewrites. Unknown
  paths now return HTTP 404 with the product's designed not-found page.
- The paid-checkout claim now verifies the hosted `$19.00` one-time offer.
  The encrypted-vault claim creates and retrieves its random key through the
  keyring credential adapter before testing authenticated encryption.
- Version `0.1.3` replaces the stale `v0.1.2` desktop release and cache name.

The researched brief and the passing connector isolation, workspace deletion,
demo isolation, privacy, offline/update, free-plan, and export behavior are
unchanged.

## Exact regression coverage

- `tests/product.spec.ts`: forced `QuotaExceededError`, immediate export,
  light/dark axe, duplicate license verification, 390 px touch targets,
  keyboard tab navigation, and an HTTP 404 response.
- `tests/installers.test.ts`: Intel/arm64 DMG selection and a fully executed
  mocked Linux checksum/install flow that asserts executable mode.
- `src-tauri/src/lib.rs`: the existing encrypted-vault claim now exercises
  key creation and retrieval through keyring's credential API.
- `.factory/claims.json`: 13 claims. Every listed command passed separately
  from a clean dependency install.

## Local verification

Environment: Ubuntu 24.04, Node 22, Rust stable, Playwright 1.58.2.

```sh
npm ci
npm test
npm run typecheck
npm run lint
cargo test --manifest-path src-tauri/Cargo.toml
npm run build
CI=1 npm run tauri -- build
```

- `npm ci`: 65 packages, 0 vulnerabilities.
- `npm test`: 2 Vitest tests and 20 Playwright tests passed.
- TypeScript, Rust format, and Clippy with `-D warnings`: passed.
- Rust: 3 tests passed.
- Every exact command in `.factory/claims.json`: passed.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, 599 ms, correct title/lang/main,
  one H1, all image alt text, labelled buttons, and zero console errors.
- Production site: initial JS 33,483 bytes (11,240 gzip), deferred desktop JS
  2,441 bytes (980 gzip), CSS 16,842 bytes (4,478 gzip), mobile hero 20,752
  bytes.
- Local Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 1.1 s, LCP 1.7 s, TBT 40 ms, CLS 0.
- Linux desktop build opened a native window under Xvfb. AppImage extraction
  produced an executable `AppRun`; deb metadata reports version 0.1.3 amd64.
- Local bundle SHA-256: AppImage
  `80e37ba2c287ebc6e855da1486e9dfd553da82527805ef624e8d0f130a2bca89`;
  deb `fd08149fd47d062c8126fbf1ca8396f627aa3538caf0f2499de5cc17aa654acd`;
  rpm `81f5a6761ee90ae7b859028a0d6c6e7a25e69502c5c64786fa3ef4b86c87833d`.

## Deployment and live verification

Static Web Apps production deployment
`6f8b13ea-256e-4497-8d63-22d7854ab83f` succeeded without changing DNS or
infrastructure. Live URL: <https://freelancer-agent-context.sociobot.in>.

- Local/live SHA-256 match: `index.html`
  `0302b0653b8deebac64a74b0399126fdf4cc97b3a39a149d79e7a916ba4a9e4c`,
  service worker
  `5185669c19b3b775183ed69d48bb2de9785189ce8c2b324ba1ad52915299e1ea`,
  initial JS
  `e07f544c8510585b64aedde732e7e7495102aa1e6018182aeaa4fd171104fca6`.
- Live `verify-url.sh`: HTTP 200, 668 ms, complete semantic checks, zero
  console errors.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.0 s, LCP 1.3 s, TBT 40 ms, CLS 0; 123,947 bytes total.
- Fresh live desktop light/dark checks on `/`, `/demo`, `/app`, `/privacy`,
  and `/terms`: one H1 per route, zero serious/critical axe findings, and zero
  console or page errors.
- Live 390×844 flow: no overflow; every tested header/footer/demo target is at
  least 44×44; a clean check exposed export immediately; no request left the
  product origin; offline reload showed `Offline · device local`.
- Live unknown route: HTTP 404 with the designed not-found screen.
- Live headers include HSTS, `nosniff`, strict-origin referrer policy,
  restricted permissions policy, and CSP with `frame-ancestors 'none'`.
- Hosted checkout: HTTP 303 to Dodo and page copy states `$19.00` and
  `One-time Pro license`. License policy allowed 30 invalid checks and returned
  HTTP 429 on request 31.

Release tag and page: `v0.1.3` at
<https://github.com/B-Divyesh/sf-freelancer-agent-context/releases/tag/v0.1.3>.
The tag-triggered workflow builds macOS arm64/x64, Windows, and Linux assets,
then publishes `SHA256SUMS` and `latest.json`.

## Known limits and operator action

- Packages are unsigned. Configure Apple and Windows signing credentials before
  describing them as signed.
- The browser `/app` is a local-storage preview. Encrypted storage and process
  launch are desktop-only.
- The boundary isolates connector profiles; it does not query providers for a
  human-readable account name.
