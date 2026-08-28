# Independent verification update — FAIL (2026-08-28)

Candidate `9ecd63eac1e13a8ccd405ee82cc5a79016666d50` at
<https://freelancer-agent-context.sociobot.in> **MUST NOT be promoted**.

Fresh evidence is recorded in `.factory/verification-2.md`. All 11 declared
claim tests, local automated checks, the exact Tauri production build, live
privacy/accessibility checks, release checksum, and billing rate-limit check
passed. The candidate nevertheless fails two release-blocking acceptance
requirements:

- Live mobile Lighthouse performance is **86**, below the required 90
  (TBT 540 ms).
- “Delete workspace” removes only the encrypted-vault record; it leaves the
  workspace's `connector-scopes/<workspace>/<source>` profile and potentially
  its agent credential/config data on disk. This violates the required
  deletion/offboarding support.

Repair both issues and add a claim-level deletion test before another
verification.

---

# Repair handoff — Client Context Firewall v0.1.2

## Outcome

Repaired every release-blocking finding in independent report commit
`487ff722e73dfb8810d60fcd283f22af5e90cf11` for candidate
`2e53d94772c6de7b1efd90a75dc6660e1a967779`.

- Registered and enabled the production Sociobot billing product. **Buy Pro**
  now returns HTTP 303 to a hosted `checkout.dodopayments.com/session/...`
  page showing Client Context Firewall Pro at $19.00.
- Replaced the self-reported active-account check with a real Tauri launch
  boundary. Codex, Claude Code, or Gemini CLI starts in the selected local
  folder with per-workspace/per-source `HOME`, `USERPROFILE`, `APPDATA`, and
  XDG config/data/cache directories. Arbitrary executables are rejected.
- Versioned the service-worker cache as `ccf-shell-v0.1.2`, changed document
  requests to network-first, awaited cache writes, and delete old caches on
  activation.
- Narrowed unprovable copy, changed “unlimited” to “more than two,” and added
  exact claims for scoped launch, free checks/exports, cache updates, and live
  checkout.
- Kept the skip link first on cold load. Route focus now moves only after
  client-side navigation; hash navigation focuses `main`.
- Normalized `CI=1` for the Tauri CLI. Added the missing `file`, `libfuse2`,
  and RPM packaging prerequisites. A local all-target Linux build now emits
  AppImage, deb, and rpm successfully.
- Updated the three product walkthrough captures to show the repaired flow.

The researched brief remains unchanged. The factory paid-license API supports
one-time product licenses, so the previously dead `$19/month` offer is now the
supported and testable **$19 one-time purchase** described by the attached
paid-unlock contract.

## Verification evidence

Clean verification on Ubuntu 24.04, Node 22, Rust stable, and Playwright
1.58.2:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
CI=1 npm run tauri -- build
```

- `npm ci`: 65 packages installed; 0 vulnerabilities.
- `npm test`: 1 Vitest test and 14 Playwright tests passed.
- `npm run lint`: TypeScript, Rust format, and Clippy `-D warnings` passed.
- Rust: 2 tests passed, including encrypted-vault and scoped-launch claims.
- Static production build: JS 29.14 KB / 9.74 KB gzip; CSS 16.30 KB /
  4.38 KB gzip; hero mobile WebP 20,752 bytes.
- `CI=1 npm run tauri -- build`: release executable and all Linux bundles
  passed. Local SHA-256: deb
  `9f220ece34902f351822fd86c0903811eeaac8486c29bc193fbb8e000821356d`,
  rpm `1cf4ca83c5af95cf19e3ffbcc2b6e366d137095eac495fe29be53cd8e43a2b2a`,
  AppImage `4ae8eeee1a50815e183ce315e9ed377cafe3ea0084024752822f14653d9ac072`.
  `dpkg-deb --info` reports package/version/architecture correctly, and the
  AppImage extracts to a valid executable AppRun.
- All 11 commands in `.factory/claims.json` are covered by the passing browser
  and Rust suites. The cache-update test installs the v0.1.1 worker first,
  upgrades at the same scope, and observes only `ccf-shell-v0.1.2` plus the
  current page.
- Live browser checks on `/`, `/demo`, `/privacy`, `/terms`, and the SPA 404:
  one H1 each, 0 serious/critical axe findings, and 0 console/page errors.
- Keyboard: first cold-load Tab focuses **Skip to main content**; the workspace
  dialog opens and closes from the keyboard. Reduced-motion styles resolve to
  zero-duration motion.
- Mobile: at 390×844, document width is exactly 390 px and **Check boundary**
  remains visible and usable.
- Privacy: a complete live `/demo` check made no off-origin requests. Offline
  reload returned the demo and displayed `Offline · device local`.
- Live headers include HTTPS, CSP with `frame-ancestors 'none'`, `nosniff`, and
  strict-origin referrer policy. Hashed assets are cached for one year and are
  immutable; HTML and `sw.js` revalidate after 30 seconds.
- Live/local SHA-256 match: `index.html`
  `e8a8117f6d509f763caead7ddb85eca22b9ff2607dabf70dc4537093d69de587`,
  JS `78d62a04985e1ab2e6953eefb72019d74b5aa0e2c679f64f84f806d072364c73`,
  CSS `e92cd029f1fb6a8c935b0d595c076ddf726c176224e97935dca29ff5c1f97f82`,
  service worker
  `6cb265cfb5f405136d33a17588d51bf5e4b7d091819802e30e8c03f309aa429b`.
- `verify-url.sh`: HTTP 200; 753 ms load; title/lang/main/alt/button checks
  passed; no console errors.
- Lighthouse 12.8.2 live mobile: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100, LCP 1.7 s, CLS 0, TBT 0 ms.
- Static deployment ID: `163ba0ae-aa1f-4d89-9cbb-99d0d231ec33` at
  <https://freelancer-agent-context.sociobot.in>.

## Release

- Repair commit: `ffd2dfd9fcf074b0ea53fff35ba4848f131e7481`.
- Tag: `v0.1.2`.
- Release workflow: <https://github.com/B-Divyesh/sf-freelancer-agent-context/actions/runs/33211399562>.
- Release page: <https://github.com/B-Divyesh/sf-freelancer-agent-context/releases/tag/v0.1.2>.
- The workflow completed successfully across macOS arm64/x64, Windows, and
  Ubuntu. The release has DMG, app tarballs, MSI, EXE, AppImage, deb, rpm,
  `SHA256SUMS`, and valid `latest.json` assets.
- A fresh Linux landing page resolves to the real v0.1.2 AppImage. The public
  deb downloaded successfully and matched `SHA256SUMS` at
  `472c235cb28e0486426bd51d7bd7a5a2b1d89cc1e1fe1bbc45b84f3306df00a5`.

## Honest limits

- The boundary isolates each client’s stored connector credentials and config;
  it does not query a provider for the human-readable account name. Users sign
  into the intended account inside each isolated profile.
- The browser `/app` remains a local-storage preview. Encrypted vault storage
  and process launch run only in the packaged desktop app.
- Desktop packages are unsigned. macOS and Windows show their normal unsigned
  application warnings.

## Needs operator action

- For signed builds, configure `APPLE_CERTIFICATE`,
  `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`,
  `APPLE_PASSWORD`, and `APPLE_TEAM_ID`.
- Configure `WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`, then add certificate
  import/thumbprint steps before describing Windows builds as signed.
