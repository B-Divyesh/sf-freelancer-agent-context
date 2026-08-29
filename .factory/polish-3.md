# Polish round 3 — cumulative zero-finding record

Candidate `884873ad910e0b988defa255e03ac2ca1b92c951` was repaired against
review commit `06ed5975db4898d2d36491a92dafd29a526f33a6`. Product repair commit:
`074aa0238967d3c7a21a1ad57cf792ae8e2caf8e`; release tag: `v0.1.10`.

The deployed build is <https://freelancer-agent-context.sociobot.in>. All
normal routes returned 200 and the designed unknown route returned 404. Cold
desktop and mobile proof is under
`.factory/qa-evidence/polish-3/live/`; the complete clean-clone claim record is
`.factory/qa-evidence/polish-3/clean-claim-summary.txt`.

## Every cumulative finding

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the factual heading “How the client check works,” with no one-time-boundary promise. | `.factory/copy-audit.md`; live `/`; `npm test` |
| F-1-2 | Kept signing state out of public download and release labels. | `@claim:platform-install`; live `/` screenshot `live-external-links-mobile.png` |
| F-1-3 | Kept billing text to the tested Sociobot checkout handoff. | `@claim:paid-checkout`; live `/terms` |
| F-1-4 | Kept the product-addressed Sociobot refund mail link. | `@claim:refund-route`; live `/terms` |
| F-1-5 | Kept the linked art-provenance page and shipped-source record. | `@claim:art-provenance`; live `/art-provenance` 200 |
| F-1-6 | Kept the token-only recorded license-verification coverage. | `@claim:license-verification`; live `/privacy` |
| F-1-7 | Kept the unsupported embedded-payment assertion removed. | `.factory/copy-audit.md`; `npm run test:unit` |
| F-1-8 | Kept release language as a maintainer instruction, not a visitor promise. | `README.md`; successful `v0.1.10` workflow |
| F-1-9 | Kept the informative folder-divider label. | `.factory/copy-audit.md`; live landing screenshots |
| F-1-10 | Kept “Preview a checked client session” as the preview heading. | `.factory/copy-audit.md`; live `/` |
| F-1-11 | Kept “What the app checks” as the limits heading. | `.factory/copy-audit.md`; live `/` |
| F-1-12 | Kept “Install the desktop app” as the install heading. | `.factory/copy-audit.md`; live `/` |
| F-1-13 | Kept “Pro pricing” as the price heading. | `.factory/copy-audit.md`; live `/` |
| F-1-14 | Kept “client profile” defined consistently as a client’s sign-in and settings folder. | terminology table; live `/demo` and `/privacy` |
| F-1-15 | Replaced stale temporary-file wording with the tested retention lifetime: checked context stays in the profile until workspace deletion. | `@claim:session-context-retention`; live `/privacy` |
| F-1-16 | Kept plain “real workspaces” and session-only demo wording. | `@claim:demo-isolation`; live `/?demo=1` |
| F-1-17 | Kept plain “does not send workspace data to another site” wording. | `@claim:device-local`; live `/privacy` |
| F-1-18 | Kept direct API-key-removal wording. | `@claim:scoped-launch`; `README.md` |
| F-1-19 | Kept client-profile and opened-agent wording instead of receipt jargon. | `@claim:validated-provenance`; live `/` |
| F-1-20 | Kept plain offline-update wording. | `@claim:offline-update`; `README.md` |
| F-1-21 | Kept direct-route and security-header behavior claim-tested. | `@claim:hosting-routes`; live route check |
| F-1-22 | Kept “Restore Pro license” as the action name. | `@claim:license-portability`; live `/` |
| F-1-23 | Kept the styled static 404 with metadata, skeleton, legal links, and version. | `@claim:hosting-routes`; live `/does-not-exist` 404 |
| F-1-24 | Kept “This page was not found” as the factual 404 H1. | `@claim:hosting-routes`; live `/does-not-exist` |
| F-1-25 | Kept history scroll restoration plus focused, announced route headings. | Playwright `routes announce and focus their heading while Back restores scroll` |
| F-1-26 | Strengthened the local backup flow to prove every stated exclusion and path confirmation. | `@claim:workspace-backup`; live `/app` |
| F-2-1 | Kept all $19 one-time-purchase sources and checkout in agreement. | `@claim:paid-checkout`; live `/` and `/terms` |
| F-2-2 | Kept cross-context Pro restore behavior. | `@claim:license-portability`; live `/terms` |
| F-2-3 | Kept revocation limited to new Pro workspace creation while free tools remain. | `@claim:revoked-license`; live `/terms` |
| F-2-4 | Kept GitHub release-request disclosure in the claim matrix. | `@claim:release-request-disclosure`; live `/privacy` |
| F-2-5 | Kept direct routes, headers, and real 404 under production-equivalent coverage. | `@claim:hosting-routes`; live route check |
| F-2-6 | Kept a build-output and JavaScript-budget claim. | `@claim:site-build-output`; clean build 46.38 KB JS raw |
| F-2-7 | Kept README sentences within the copy limit. | `.factory/copy-audit.md`; `README.md` |
| F-2-8 | Kept delivery-record wording in place of launch-receipt jargon. | `.factory/copy-audit.md`; live `/` |
| F-2-9 | Kept “Choose each source” as the direct heading. | `.factory/copy-audit.md`; live `/` |
| F-2-10 | Kept established source and agent terminology in public copy. | `.factory/copy-audit.md`; `README.md` |
| F-2-11 | Kept the static 404’s visible/accessible external-site label. | `npm test`; live `/does-not-exist` |
| F-2-12 | Kept one fully-qualified exact Rust selector for scoped launch. | `@claim:scoped-launch` runs one native test |
| F-3-1 | Removed the false temporary/prepared-session wording; added explicit retention copy and a deletion-observing claim. | `@claim:session-context-retention`; live `/privacy`; `README.md` |
| F-3-2 | Expanded backup copy, claim text, seed data, and assertions to cover sign-ins, license data, and delivery records. | `@claim:workspace-backup`; live `/privacy`; `README.md` |
| F-3-3 | Narrowed the public claim to the AES-256-GCM workspace file that the test can observe; the test now writes ciphertext, checks it contains no plaintext, decrypts it, and rejects another key. | `@claim:encrypted-vault`; live `/privacy`; `README.md` |
| F-3-4 | Replaced the absolute Privacy H1 with “Privacy: what the app stores and sends.” | Playwright routing/focus test; live `/privacy` |
| F-3-5 | Named GitHub and Sociobot in every dynamic download/checkout action, added external-site accessible text, and added a browser regression. | Playwright `external download and checkout links name their destinations`; live screenshot `live-external-links-mobile.png` |

## Required product checks

The landing’s cold mobile proof is
`.factory/qa-evidence/polish-3/live/landing-mobile-cold.png`; it has one
plain-language H1, the one-click sample action, and no horizontal overflow at
390 px. `?demo=1` opens a seeded Northstar sample with the persistent Demo
mode banner, Reset demo, and Start for real; proof is
`.factory/qa-evidence/polish-3/live/demo-mobile-cold.png` and
`@claim:demo-isolation`.

The URL verifier’s proof is
`.factory/qa-evidence/polish-3/live/verify.json`: title, `lang`, one H1,
`main`, image alt text, control labels, and normal-route console checks pass.
The live Playwright Axe integration found zero serious or critical violations
on `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/art-provenance`, and the
designed 404. Mobile Lighthouse is recorded in
`.factory/qa-evidence/polish-3/live/lighthouse-mobile.json`: performance 100,
accessibility 100, LCP 1.47 s, CLS 0.

The `v0.1.10` release workflow succeeded and published macOS Intel/Apple
silicon, Windows MSI/EXE, and Linux AppImage/DEB/RPM artifacts plus
`SHA256SUMS` and `latest.json`. A downloaded Linux DEB passed `sha256sum -c`.

No finding remains open.
