# Independent product verification 7 — PASS

## Candidate and verdict

- Candidate: `6295c41f04829c4a2c8db6e03ee55d145a5fca8b`
- Live URL: <https://freelancer-agent-context.sociobot.in>
- Verified: 29 August 2026 UTC
- Artifact: Tauri desktop app, static companion and isolated browser demo
- Verdict: **PASS**

This is a fresh verification of the repaired v0.1.9 product. The native
false-launch defect reported in verification 6 is covered by the revised
claim test and the current candidate has no product release-blocking defect.

## Mandatory first checks

`.factory/claims.json` is present and declares 23 claims. From the clean
candidate checkout, after `npm ci`, every command in that file was invoked
exactly as declared. The four Rust commands initially could not compile until
the normal Linux Tauri GTK/GLib prerequisites were installed; they then passed.
No claim assertion failed.

| Result | Claims |
| --- | --- |
| PASS | `demo-isolation`, `boundary-check`, `scoped-launch`, `provenance-export`, `validated-provenance`, `device-local`, `offline-reload`, `offline-update` |
| PASS | `plan-limit`, `free-core`, `paid-checkout`, `license-verification`, `license-portability`, `revoked-license`, `encrypted-vault`, `platform-install` |
| PASS | `workspace-deletion`, `workspace-backup`, `art-provenance`, `refund-route`, `release-request-disclosure`, `hosting-routes`, `site-build-output` |

The cold live first-read test passed. The first screen says what it does:
“Keep client work from crossing over”; who it is for: freelance developers
switching clients without mixing sources, accounts, or writing style; and what
to do first: the visible one-click **Try it with sample data** action, with the
plain result “See a checked client session next.” The click opens populated
Northstar sample data and its persistent “Demo — Sample data. Nothing is
saved.” banner.

## Build and test evidence

- `npm ci` — PASS; 65 packages installed, audit reported 0 vulnerabilities.
- `npm test` — PASS; 6 Vitest and 27 Playwright tests.
- `npm run typecheck` — PASS.
- `npm run lint` — PASS; TypeScript, rustfmt, and Clippy with warnings denied.
- `npm run build` — PASS; `dist/site` created. Initial JS is 46,101 bytes raw
  (14,770 bytes gzip across two chunks) and CSS is 17,149 bytes raw (4,515
  bytes gzip), within the 200 KB/50 KB budgets.
- `cargo test --manifest-path src-tauri/Cargo.toml` — PASS; all 6 Rust tests,
  including the new failed-wrapper and immediately-failing-connector paths.
- `npm run tauri -- build` built the release binary, DEB, and RPM. Its AppImage
  stage exits 1 in this disposable Ubuntu 24 container because the Tauri
  `linuxdeploy` AppImage requires `/dev/fuse`, which the container does not
  expose (`fuse: device not found`). Installing the documented FUSE 2 runtime
  and using `APPIMAGE_EXTRACT_AND_RUN=1` did not change Tauri's child-process
  invocation. This is a worker-host limitation, not a product failure: the
  current v0.1.9 GitHub Actions release contains the AppImage and all platform
  packages. The local native executable itself stayed live for 12 seconds
  under Xvfb with a fresh profile (timeout exit 124, no product crash).

## End-to-end behavior

On the live 390 × 844 demo, a Juniper Legal name plus a configured term
produced “Fix 2 boundary checks”; replacing it with Northstar text completed
the sample check. The demo had no horizontal overflow (390 px document width),
used session-only `demo:` data, and left real workspace storage null. A fresh
real browser workspace accepted a valid Acorn form and then correctly required
the desktop app before a delivery record could exist. This exercises normal,
invalid, recovery, and native-boundary paths without real client data.

## Accessibility, privacy, deployment, and release

- `/opt/fleet/lib/verify-url.sh` — PASS: HTTP 200, title, `lang=en`, one H1,
  main landmark, image alternatives, named buttons, and zero console errors.
- Independent Playwright + axe audit — 0 serious/critical findings and 0
  console/page errors on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and
  `/art-provenance` in both light and dark treatments.
- Keyboard smoke passed: first Tab focuses the skip link, Enter focuses main,
  the create-workspace dialog opens by Enter, and Escape closes it. Reduced
  motion yields `0s` transitions. On the live 390 px landing page, job,
  audience, sample action, and facts fit above 844 px with no overflow.
- The demo and real-workspace request logs contained no off-origin request.
  Landing made exactly one documented external request after initial render:
  `GET https://api.github.com/repos/B-Divyesh/sf-freelancer-agent-context/releases?per_page=1`, with no body or workspace data. No analytics, third-party
  font, or third-party script request was observed.
- Live root, public routes, service worker, and assets return CSP with
  `frame-ancestors 'none'`, `nosniff`, strict-origin referrer policy, HSTS,
  and permissions policy. Unknown routes return the designed HTTP 404. Hashed
  JS/CSS responses are `max-age=31536000, immutable`; HTML and service worker
  are revalidated after 30 seconds.
- Candidate `dist/site` and live `index.html`, service worker, JS, CSS, art,
  icons, and walkthrough images have identical SHA-256 values. Live runtime is
  therefore the candidate's runtime; the candidate commit itself changes only
  handoff documentation.
- Live release metadata reports v0.1.9 with Mac arm64/x64 DMGs, Windows MSI/
  EXE, and Linux AppImage/DEB/RPM plus `SHA256SUMS` and `latest.json`.
  Downloaded `Client.Context.Firewall_0.1.9_amd64.deb` SHA-256 was
  `cfbbb05346f99ea1489a074a20f33b0772c3984b900628ea311c998a1e9bfb03`,
  matching the published sum; package metadata is version 0.1.9 amd64.
- License verification request allowance was observed freshly from one client:
  requests 1–30 returned 200; request 31 returned 429 with `Retry-After: 1`
  and `x-ratelimit-after: 1`. There is no product sign-in, so an Entra tenant
  check is not applicable.

## Defect summary

- P0: 0
- P1: 0
- P2: 0
- P3: 0

## Known verification limitation

The disposable worker does not provide `/dev/fuse`, preventing its local
`linuxdeploy` AppImage assembly even after the declared runtime prerequisites
are installed. The published GitHub Actions v0.1.9 AppImage and the locally
smoked native binary provide the relevant release evidence. No product code
was modified during this verification.
