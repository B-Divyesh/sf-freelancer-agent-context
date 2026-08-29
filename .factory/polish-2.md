# Polish round 2 — zero-finding repair record

Candidate `0e7a5502a77af7ce6b983485c5c4df16df1690ac` was repaired against review commit `9cfed65a87f4351ba5f5865968a67abfb5f25032`. The final repair is `88d4aa032e0178a3e3cdced49700c3b3a82a0879`, tagged `v0.1.7`.

## Every cumulative finding

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the promise “Set the boundary once” with the descriptive heading “How the client check works.” | `.factory/copy-audit.md`; live `/`; `npm run test:e2e` |
| F-1-2 | Removed signing-state text from both static and release-populated download labels. The panel now names only the version and asset. | `@claim:platform-install`; `.factory/qa-evidence/polish-2/live-audit.json`; live `/` |
| F-1-3 | Removed the unproved merchant-of-record sentence. Checkout copy now states only the tested Sociobot handoff. | `@claim:paid-checkout`; live `/` and `/terms` |
| F-1-4 | Added a product-specific “Request a refund from Sociobot” mail link to pricing and terms. | `@claim:refund-route`; live `/` and `/terms` |
| F-1-5 | Added a real `/art-provenance` page and linked shipped derivatives to their source record. | `@claim:art-provenance`; live `/art-provenance` returns 200 |
| F-1-6 | Added recorded-response verification coverage and restricted the request to one token-only GET. | `@claim:license-verification`; live `/privacy` |
| F-1-7 | Removed the unsupported “no embedded payment provider” statement. | `.factory/copy-audit.md`; source scan in `npm run test:unit` |
| F-1-8 | Rewrote release wording as maintainer instructions instead of a product promise. | `README.md`; successful `v0.1.7` release workflow |
| F-1-9 | Replaced “BOUNDARY / 01” with “Two client folders kept separate.” | `.factory/copy-audit.md`; `.factory/qa-evidence/polish-2/live-verify/screenshot-desktop.png` |
| F-1-10 | Renamed the preview “Preview a checked client session.” | `.factory/copy-audit.md`; live `/` |
| F-1-11 | Renamed the limits section “What the app checks.” | `.factory/copy-audit.md`; live `/` |
| F-1-12 | Renamed the install section “Install the desktop app.” | `.factory/copy-audit.md`; live `/` |
| F-1-13 | Renamed the plan section “Pro pricing.” | `.factory/copy-audit.md`; live `/` |
| F-1-14 | Defined “client profile” as one client’s separate sign-in and settings folder, then used it consistently. | `.factory/copy-audit.md`; live `/demo` and `/privacy` |
| F-1-15 | Replaced “device-local session file” with two plain sentences describing the data and temporary file. | `README.md`; `.factory/copy-audit.md` |
| F-1-16 | Replaced “real workspace namespace” with “real workspaces” and a direct description of tab-only demo data. | `README.md`; `@claim:demo-isolation` |
| F-1-17 | Replaced “off-origin” with “sends no workspace data to another site.” | `README.md`; `@claim:device-local` |
| F-1-18 | Rewrote credential clearing as “removes API keys inherited from its parent process.” | `README.md`; `@claim:scoped-launch` |
| F-1-19 | Replaced “native profile and launch receipts” with client-profile and opened-agent language. | `README.md`; `@claim:scoped-launch` and `@claim:validated-provenance` |
| F-1-20 | Replaced “cached application shell” with plain update wording. | `README.md`; `@claim:offline-update` |
| F-1-21 | Replaced “SPA fallback” with direct-link and security-header wording, then made both outcomes claim-tested. | `@claim:hosting-routes` |
| F-1-22 | Renamed “Paste a license” to “Restore Pro license.” | live `/`; `@claim:license-portability` |
| F-1-23 | Rebuilt the static 404 with complete metadata, navigation, footer, legal links, version, and product styling. | `@claim:hosting-routes`; live `/missing-page` is a real 404 in `.factory/qa-evidence/polish-2/live-audit.json` |
| F-1-24 | Replaced the metaphor with “This page was not found.” | `@claim:hosting-routes`; live `/missing-page` |
| F-1-25 | Preserved scroll on Back/Forward while focusing and announcing the new route heading without scrolling it. | Playwright `routes announce and focus their heading while Back restores scroll` |
| F-1-26 | Added local JSON workspace export and reviewed import. Backups omit sign-in reminders; folder paths require confirmation. | `@claim:workspace-backup` |
| F-2-1 | Reconciled the stale brief with the approved, implemented Sociobot product: a $19 one-time purchase. Public, legal, README, brief, and hosted checkout terms now agree. | `@claim:paid-checkout` checks `.factory/brief.json`, the 303 handoff, and hosted “$19.00 / One-time Pro license” copy |
| F-2-2 | Added cross-device restore behavior with two isolated fresh browser contexts. | `@claim:license-portability` |
| F-2-3 | Defined revocation precisely: it stops new Pro workspace creation while existing workspaces, checks, and exports remain. | `@claim:revoked-license`; live `/terms` |
| F-2-4 | Added the GitHub release request disclosure to the durable claim matrix and asserted method, body, origin, delay, and absence of workspace data. | `@claim:release-request-disclosure`; live `/privacy` |
| F-2-5 | Added production-equivalent direct-route, designed-404, CSP, nosniff, and referrer-policy coverage. | `@claim:hosting-routes`; live route audit |
| F-2-6 | Added a build claim that runs Vite and checks `dist/site`, public files, and the 200 KB JavaScript ceiling. | `@claim:site-build-output`; production output is 43.37 KB JS raw / 13.68 KB gzip |
| F-2-7 | Split the 23-word README sentence into two sentences. | `.factory/copy-audit.md`; `README.md` |
| F-2-8 | Replaced “Validated launch receipts…” with “A delivery record appears after every selected agent opens.” | `.factory/copy-audit.md`; live `/` |
| F-2-9 | Replaced “Scope each source” with “Choose each source.” | `.factory/copy-audit.md`; live `/` |
| F-2-10 | Replaced undefined “connector” wording with the established “agent” and “source” terms. | `README.md`; terminology table in `.factory/copy-audit.md` |
| F-2-11 | Added the same visually hidden “(external site)” label used by dynamic pages to the static 404 footer link. | `npm run test:e2e`; live `/missing-page` audit reports no unlabeled external link |
| F-2-12 | Combined the Rust assertions into one `claim_scoped_launch` test and selected its fully qualified name with `--exact`. | `cargo test --manifest-path src-tauri/Cargo.toml tests::claim_scoped_launch -- --exact` — one passing test |

## Required first-screen and demo work

The first screen uses a six-word job headline, a 13-word audience sentence, one primary sample-data action, an adjacent outcome, and three plan/privacy/offline facts. At 390 px it has no horizontal overflow. The action opens `/?demo=1` in one click. The persistent banner identifies sample mode and offers **Reset demo** and **Start for real**. Demo changes stay ephemeral, never read or overwrite real workspace storage, and are discarded on exit.

Evidence: `@claim:demo-isolation`, `.factory/qa-evidence/polish-2/live-landing-mobile.png`, `.factory/qa-evidence/polish-2/live-demo-mobile.png`, and the cold live audit JSON.

## Verification

- Clean clone at final SHA: every command in `.factory/claims.json` passed separately, 23/23. See `.factory/qa-evidence/polish-2/clean-claim-summary.txt`.
- Aggregate: `npm test` passed 5 Vitest and 27 Playwright tests; `cargo test` passed 4; `npm run lint` passed.
- Browser/accessibility/privacy/offline: seven live routes checked; no serious or critical Axe issues; all normal routes have zero console or page errors; demo sent no cross-origin requests; offline reload restored the demo.
- Factory verifier: live URL returned 200 with title, `lang`, one H1, `main`, alt, and control checks clean; zero console errors.
- Lighthouse mobile: performance 99, accessibility 100, best practices 100, SEO 100; LCP 2.0 s, CLS 0, TBT 0 ms.
- Production deploy: <https://freelancer-agent-context.sociobot.in>.

No review finding remains open.
