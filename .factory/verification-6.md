# Independent product verification 6 — FAIL

## Candidate and verdict

- Candidate: `0b255bd355f4cba10388460dbb22c130ddb65376`
- Live URL: <https://freelancer-agent-context.sociobot.in>
- Verified: 29 August 2026 UTC
- Artifact: static landing/demo plus Tauri desktop release `v0.1.7`
- Verdict: **FAIL**

The site, demo, build, accessibility, privacy, performance, rate limiting, and published installers passed their checks. The desktop app has one release-blocking P1 defect: it can certify a failed agent launch as successful and enable a delivery provenance export.

## Release-blocking finding

### P1 — A failed terminal launch creates false provenance

The Linux desktop backend treats creation of the terminal wrapper process as proof that the coding agent opened. It does not wait for that wrapper, check its exit status, or establish a connector handshake. The frontend then records the launch and enables export solely because the native invocation resolved.

Fresh end-to-end reproduction against the published `v0.1.7` AppImage:

1. Run the AppImage with a fresh app-data directory and operating-system credential store.
2. Put a real `codex` command on `PATH`, but map the only discoverable `x-terminal-emulator` to `/bin/false`.
3. Create a real workspace that points to an existing local folder.
4. Pass the boundary check and select **Open codex**.
5. `/bin/false` exits immediately. No terminal or Codex agent opens.
6. The UI nevertheless says: “codex opened. Every selected agent opened, and the delivery record is ready.” The ledger shows “1/1 agents opened” and enables **Export latest record**.

Evidence: [native-false-launch.png](qa-evidence/verification-6/native-false-launch.png).

Relevant implementation evidence:

- `src-tauri/src/lib.rs:376-400` returns success after `Command::spawn()` succeeds for the terminal wrapper.
- `src/main.ts:318-350` converts any resolved native call into an opened-agent receipt and an exportable provenance record.
- `src-tauri/src/lib.rs:344-355` checks only that a Unix command path is a file, not that it is executable.

This violates the smallest useful product and two listed claims: `scoped-launch` and `validated-provenance`. Their tests pass because the scoped-launch test invokes a shell directly rather than the platform launch path, while the provenance test covers a missing folder but not a launcher or connector that exits immediately.

Required release fix: obtain affirmative confirmation that the selected connector actually started in the isolated profile before recording a launch. A wrapper-exit failure must keep export disabled and show a recoverable error. Add claim-level coverage for a missing, non-executable, and immediately failing terminal/connector on every supported platform.

## Mandatory first checks

### Claims

`.factory/claims.json` exists and lists 23 claims. Every exact command was run separately from this clean checkout through the documented demo/test entry points. The first attempt correctly stopped before product execution because dependencies were not installed. After `npm ci`, 19 commands passed; four Rust commands required the same Linux Tauri packages declared by the release workflow. After those prerequisites were installed, all four passed. No claim assertion failed.

| Claim | Exact test result |
|---|---|
| `demo-isolation` | PASS |
| `boundary-check` | PASS |
| `scoped-launch` | PASS, but insufficient for the platform-launch behavior above |
| `provenance-export` | PASS |
| `validated-provenance` | PASS, but insufficient for failed launcher/connector behavior |
| `device-local` | PASS |
| `offline-reload` | PASS |
| `offline-update` | PASS |
| `plan-limit` | PASS |
| `free-core` | PASS |
| `paid-checkout` | PASS |
| `license-verification` | PASS |
| `license-portability` | PASS |
| `revoked-license` | PASS |
| `encrypted-vault` | PASS |
| `platform-install` | PASS |
| `workspace-deletion` | PASS |
| `workspace-backup` | PASS |
| `art-provenance` | PASS |
| `refund-route` | PASS |
| `release-request-disclosure` | PASS |
| `hosting-routes` | PASS |
| `site-build-output` | PASS |

### Cold first-read test

PASS. At 1440 × 1000, the first live screen states:

- What: “Keep client work from crossing over.”
- For whom: “For freelance developers who switch clients without mixing sources, accounts, or writing style.”
- First click: **Try it with sample data**, next to “See a checked client session next.”

The button enters the populated demo in one click, and the demo banner states that sample data is not saved.

## Clean checkout and build gates

The checkout resolved to the requested candidate before testing. The runtime paths are byte-identical between candidate `0b255bd...` and release tag `v0.1.7`; candidate-only changes do not alter the product runtime.

- `npm ci` — PASS, 65 packages, 0 vulnerabilities.
- `npm audit --audit-level=high` — PASS, 0 vulnerabilities.
- `npm run typecheck` — PASS.
- `npm run lint` — PASS: TypeScript, Rust formatting, and Clippy with warnings denied.
- `npm test` — PASS: 5 Vitest and 27 Playwright tests.
- `cargo test --manifest-path src-tauri/Cargo.toml` — PASS: 4 Rust tests.
- `npm run build` — PASS; exact production site created in `dist/site/`.
- `npm run tauri -- build` — PASS; `.deb`, `.rpm`, and `.AppImage` bundles created.

## End-to-end behavior

### Browser demo and recovery paths

- One-click demo loads Juniper Legal sample data and the persistent isolated-demo banner.
- Another-client text blocks the boundary; a configured secret blocks it; safe text recovers and passes.
- No selected source produces “Choose at least one source”; selecting both sources exports both.
- Sample export clearly identifies itself as sample data and does not claim a native launch.
- Demo storage uses session storage only. Reset clears the demo key without reading or modifying a seeded real-data sentinel.
- Offline reload after service-worker activation restores the app and reports “Offline · device local.”
- Local real-mode checks cover missing required fields, valid creation, redaction failure and recovery, false native provenance refusal in the browser preview, and the two-workspace free limit.

### Desktop release

- The published Linux package launches via `APPIMAGE_EXTRACT_AND_RUN=1` under Xvfb. Direct FUSE mounting is unavailable in this container, which is an environment limitation rather than a product failure.
- The first-run desktop UI rendered and accepted a real local folder.
- The native false-launch reproduction above fails the core delivery-record contract.

## Accessibility and responsive checks

- `/opt/fleet/lib/verify-url.sh` — PASS: HTTP 200, title, `lang=en`, one H1, main landmark, no missing alt text, no unnamed buttons, and no console error.
- Axe serious/critical findings: 0 on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/art-provenance`, in both light and dark modes.
- Desktop and 390 × 844 mobile: no horizontal overflow; the job, audience, demo action, and three facts fit on the first mobile screen.
- Keyboard: first Tab reveals the skip link; Enter moves focus to main; controls are reachable and operable; focus outline is a visible 3 px designed ring.
- Touch targets checked on mobile are at least 44 px.
- Reduced motion changes interactive transition duration to `0s`.
- Route semantics: one H1 and one main landmark per route, route-specific title, no missing alt text.
- Console and page errors: 0 in tested routes and flows.

## Privacy, network, headers, and limits

- A fresh delayed request trace through the full demo recorded one external request only: public GitHub release metadata. No workspace or seeded sentinel value left origin.
- The site does not load third-party fonts, scripts, analytics, or trackers.
- License checkout redirects to hosted Sociobot/Dodo checkout. The live product asks $19 once and the checkout reports a $19 one-time Pro license.
- Security headers include CSP with `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, HSTS on the root response, and permissions policy.
- Unknown routes return the designed HTTP 404.
- License verification allowance observed from one client: requests 1–30 returned 200; request 31 returned 429 with `Retry-After: 3`. The 429 body instructed the client to wait 3 seconds.
- No product sign-in or first-party application backend exists; Entra authority, backend concurrency, persistence, and health/build identity checks are not applicable.

## Live deployment identity

Live `index.html`, both JavaScript chunks, CSS, service worker, hero image, and all three walkthrough images exactly match the candidate production build by byte comparison and SHA-256. The service worker controls the demo and uses cache `ccf-shell-v0.1.7`.

All discovered live links were crawled. Same-origin links returned 200; the checkout redirected to hosted checkout; release assets redirected to valid downloads; intentional `mailto:` links were excluded from HTTP crawling.

## Performance and caching

Candidate production assets:

- Initial JavaScript: 45,809 bytes raw — PASS against 200 KB.
- CSS: 17,149 bytes raw — PASS against 50 KB.
- Fonts: 0 bytes — PASS against 120 KB.
- Hero image: 69,934 bytes — PASS against 300 KB.

Live Lighthouse mobile: performance 95, accessibility 100, best practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, speed index 1.1 s, TBT 260 ms, CLS 0, transfer 124 KiB across 8 requests. Synthetic Lighthouse did not produce a field INP value.

Hashed JS/CSS use one-year immutable caching. HTML and the service worker use short revalidation; the hero uses a seven-day cache.

## Release and installation

- Latest public release: `v0.1.7` with Mac arm64/x64, Windows MSI/EXE, and Linux DEB/RPM/AppImage assets plus `SHA256SUMS` and valid `latest.json`.
- Downloaded Linux DEB: 3,540,596 bytes; SHA-256 matched the published checksum; package metadata reports version 0.1.7 amd64.
- The live Linux download resolves to the real `v0.1.7` AppImage.
- `install.sh` downloaded, checksum-verified, installed with executable mode, and produced a valid ELF AppImage.
- Published desktop packages are unsigned, as documented; signing remains an operator action.

## Defect summary

- P0: 0
- P1: 1 — failed native launch is falsely recorded as an opened agent and exportable delivery provenance.
- P2: 0
- P3: 0

The candidate must not be released until the P1 is fixed and independently retested against an actual packaged desktop build.
