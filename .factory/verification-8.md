# Independent verification 8 — Client Context Firewall

**Result: PASS**

Verified candidate commit `78e78d983e4a0a25155a38d320f0879cbfd748ce` on
2026-08-29 against <https://freelancer-agent-context.sociobot.in>. No product
code was changed. The live hashed JavaScript bundle
`assets/index-CmgpsiQX.js` has SHA-256
`472a164f1db1804bcc337826fee874fcebd4494c337a7bf4e5d2055339bccce5`,
identical to the fresh candidate build; the live footer is `v0.1.10`.

## Cold first read

The first screen says: **“Keep client work from crossing over.”** It says this
is for freelance developers switching clients without mixing sources,
accounts, or writing style. It clearly directs the visitor to **“Try it with
sample data”** and says a checked client session will appear next. The control
links directly to `/?demo=1`; it is one click and passed the required first
read/demo-sandbox gate.

## Clean checkout and claims

Installed with `npm ci --include=dev`. The initial bare native command could
not find `glib-2.0.pc`; that is an expected host prerequisite, not a failed
claim assertion. README documents Tauri system dependencies and the release
workflow installs `libgtk-3-dev`, `libwebkit2gtk-4.1-dev`,
`libappindicator3-dev`, `librsvg2-dev`, `libsecret-1-dev`, `libfuse2`, `file`,
`rpm`, and `patchelf`. After installing those documented Linux prerequisites,
every exact command in `.factory/claims.json` passed independently: **24/24**.

- Browser/unit: `demo-isolation`, `boundary-check`, `provenance-export`,
  `device-local`, `offline-reload`, `offline-update`, `plan-limit`,
  `free-core`, `paid-checkout`, `license-verification`,
  `license-portability`, `revoked-license`, `platform-install`,
  `workspace-backup`, `art-provenance`, `refund-route`,
  `release-request-disclosure`, `hosting-routes`, and `site-build-output`.
- Native: `scoped-launch`, `session-context-retention`,
  `validated-provenance`, `encrypted-vault`, and `workspace-deletion`.

`.factory/claims.json` is present. Landing, README, privacy, terms, and demo
copy were cross-checked against the registry; no material unlisted claim was
found.

Additional clean-checkout gates passed:

```sh
npm test                                      # 6 Vitest + 28 Playwright
npm run lint                                  # TypeScript, rustfmt, Clippy -D warnings
cargo test --manifest-path src-tauri/Cargo.toml # 7 native tests
npm run build                                 # produced dist/site
```

The production build emitted 46,379 bytes raw JavaScript (13,688 bytes gzip)
and 17,149 bytes CSS (4,523 bytes gzip), within the 200 KB/50 KB budgets.

## End-to-end, accessibility, and responsive checks

- Live `/demo` blocked a Northstar session containing “Juniper Legal” with
  both the other-client and redaction-term failures. Reset then produced
  “Sample check complete for Northstar Coffee”; the exported download was
  `ns-delivery-record.json`.
- Real-mode creation, required-field errors/recovery, free two-workspace
  boundary, license restoration/revocation, backup path confirmation, offline
  reload/update, and delivery-record preconditions are covered by the passing
  independent claim tests above.
- Keyboard: first Tab focuses the visible skip link (solid outline); Enter
  moves focus to `main`. The workspace dialog is covered by the passing
  keyboard test. Reduced-motion computed transition duration is `0s`.
- At 390×844 `/demo` had `scrollWidth === clientWidth === 390`; the demo reset
  control remained visible.
- Fresh live Axe scans found **0 serious/critical** violations on `/`, `/demo`,
  `/app`, `/privacy`, `/terms`, `/art-provenance`, and the designed 404.
  Normal public routes had no console or page errors. Navigating to the HTTP
  404 naturally logs Chrome’s generic failed-resource diagnostic for the 404
  response; it is not an application error.
- Lighthouse mobile report: performance **100**, accessibility **100**, LCP
  **1.406 s**, CLS **0**. The Chromium process exited while Lighthouse was
  collecting an optional final screenshot after the scored report had been
  written; the report scores and core metrics were present.

## Privacy, security, and deployment

- From a fresh live demo context, the entire demo flow made **zero**
  off-origin requests. A landing context with a `WORKSPACE_SECRET_9f6c`
  local-storage sentinel made exactly one delayed off-origin request:
  `GET https://api.github.com/repos/B-Divyesh/sf-freelancer-agent-context/releases?per_page=1`, with an empty body and no sentinel.
- Live headers include CSP with `frame-ancestors 'none'`, `X-Content-Type-Options:
  nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive
  Permissions-Policy, and HSTS. Hashed JS serves
  `Cache-Control: public, max-age=31536000, immutable`; HTML uses a 30-second
  revalidation policy. `/`, `/demo`, `/app`, `/privacy`, `/terms`, and
  `/art-provenance` return 200; an unknown path returns the designed 404.
- There is no product sign-in. The external license verification endpoint was
  rate tested with invalid tokens from one client: requests 1–30 returned 200;
  request 31 returned **429**, `Retry-After: 4`, and `x-ratelimit-after: 4`.
  Observed allowance: **30 requests per window**.
- GitHub release `v0.1.10` exists with macOS arm64/x64, Windows MSI/EXE,
  Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`. Downloaded
  `Client.Context.Firewall_0.1.10_amd64.deb` verified `OK` against
  `SHA256SUMS`; package metadata is version `0.1.10` and depends on the
  expected GTK/WebKit runtime.

## Defects

None found.

