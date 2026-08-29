# Client Context Firewall — polish round 2 handoff

## Outcome

All 40 entries from the two cumulative adversarial reports were rechecked and resolved. The first release candidate `0e7a5502a77af7ce6b983485c5c4df16df1690ac` is superseded by final repair commit `88d4aa032e0178a3e3cdced49700c3b3a82a0879` and desktop tag `v0.1.7`.

The static site is deployed at <https://freelancer-agent-context.sociobot.in>. Deployment `cc033c27-ec91-4c37-acd8-89443e61dc3e` completed successfully in Azure Static Web Apps. The detailed finding-by-finding record is `.factory/polish-2.md`.

## What changed

- Kept the distinctive printed field-dossier visual system while replacing every flagged metaphor, jargon term, and inconsistent product term with plain task language.
- Kept the first screen to a six-word job headline, a 13-word audience sentence, one sample-data action with its outcome, and three tested facts.
- Made the first-screen action enter the isolated `/?demo=1` sandbox. Its persistent banner exposes reset and real-start actions; leaving discards sample state and never copies it to real storage.
- Expanded `.factory/claims.json` from 17 to 23 independently selectable claims. Added verification privacy, license portability, revocation behavior, GitHub release disclosure, hosting routes/headers, and build-output coverage.
- Reconciled the stale brief price with the existing approved Sociobot product and paid-unlock contract: Pro is a $19 one-time purchase everywhere.
- Removed all signing-state copy from runtime download labels, completed route titles/metadata/canonicals/focus/history, repaired the real 404 skeleton and external-link label, and added `/art-provenance` as a real route.
- Preserved the client-profile import dialog across renders and clarified that revocation blocks new Pro workspace creation without taking existing workspace tools away.
- Updated the catalog description to an 80-character verb-first sentence and bumped the product to 0.1.7.

## Exact verification evidence

Clean clone `/tmp/ccf-final-verify-CRWfOD` resolved to remote commit `88d4aa032e0178a3e3cdced49700c3b3a82a0879`. After `npm ci`, every `test` command in `.factory/claims.json` was run separately. All 23 passed, and every selector executed exactly one test. The result list is `.factory/qa-evidence/polish-2/clean-claim-summary.txt`.

Local aggregate gates on the same production code:

- `npm test` — PASS: 5 Vitest tests and 27 Playwright tests.
- `cargo test --manifest-path src-tauri/Cargo.toml` — PASS: 4 Rust tests.
- `npm run lint` — PASS: TypeScript, Rust formatting, and Clippy with warnings denied.
- `npm run build` — PASS: `dist/site/` produced. Emitted JavaScript is 45.81 KB raw and 14.66 KB gzip across both chunks; CSS is 17.03 KB raw and 4.49 KB gzip.
- Lighthouse mobile — performance 99, accessibility 100, best practices 100, SEO 100; LCP 2.0 s, CLS 0, TBT 0 ms. Report: `.factory/qa-evidence/polish-2/lighthouse-mobile.json`.

Cold production evidence after deployment:

- `/opt/fleet/lib/verify-url.sh https://freelancer-agent-context.sociobot.in .factory/qa-evidence/polish-2/live-verify` — PASS: HTTP 200, 653 ms, no console errors, correct title/lang, one H1, `main`, no missing alt text, no unnamed buttons.
- Live Playwright audit covered `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/art-provenance`, and a real unknown-path 404. All have route-specific metadata, one H1, and a main landmark; normal routes have zero console/page errors; all routes have zero serious/critical Axe violations.
- At 390 px, the landing has no horizontal overflow. Screenshots: `.factory/qa-evidence/polish-2/live-landing-mobile.png` and `.factory/qa-evidence/polish-2/live-verify/screenshot-desktop.png`.
- `/?demo=1` preserved a seeded real-data sentinel through enter, reset, and exit; sample changes were discarded; the full check made no cross-origin request. Offline reload restored “Check this client session” and “Offline · device local.” Screenshot: `.factory/qa-evidence/polish-2/live-demo-mobile.png`.
- Live audit JSON: `.factory/qa-evidence/polish-2/live-audit.json`. The only console message recorded anywhere was Chromium’s expected failed-resource message for the deliberately requested HTTP 404 document itself; there were no application errors.

## Run locally

```bash
npm ci
npm test
npm run lint
cargo test --manifest-path src-tauri/Cargo.toml
npm run build
npm run dev
```

Linux desktop prerequisites are listed in `README.md`. The direct verifier entry point is `http://localhost:5173/?demo=1` in development and <https://freelancer-agent-context.sociobot.in/?demo=1> in production.

## Release and deployment

- Source: <https://github.com/B-Divyesh/sf-freelancer-agent-context/commit/88d4aa032e0178a3e3cdced49700c3b3a82a0879>
- Desktop tag: <https://github.com/B-Divyesh/sf-freelancer-agent-context/releases/tag/v0.1.7>
- Static production: <https://freelancer-agent-context.sociobot.in>

## Known gaps

None in the reviewed product scope.

## Needs operator action

The published desktop packages are not code-signed. Signing a future release requires owner certificates. Use the conventional secret names `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD` when wiring signing into the release workflow. No signing secret is present or committed now.
