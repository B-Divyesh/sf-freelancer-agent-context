# Polish round 1 handoff

## Outcome

Repaired every finding in `.factory/review-1.md` for Client Context Firewall
v0.1.5. The distinct dithered boundary-ledger visual system remains intact.

Repair commit: `6e32af5c245310e8ac3b868dc855c69a47c3e9e4` (tag `v0.1.5`).
Evidence commit: `e5bf0c5`.

## Delivered

- First screen now uses plain job language; headings, labels, terminology, README, and legal copy were rewritten.
- `/?demo=1` directly opens the isolated sample namespace with banner, reset, and real-start controls; `/demo` remains valid.
- Added JSON workspace backup/export and reviewable import. Backups omit sign-in reminders, license data, and delivery records; import requires saved-path confirmation.
- Added missing claim records/tests, art provenance route, direct refund request link, route metadata, 404 skeleton, sitemap route, and Back/Forward scroll preservation.
- Updated site and desktop version to 0.1.5, including the service-worker cache version.

## Verification

- `npm ci` — pass.
- `npm run typecheck` — pass.
- `npm run test:unit -- --run` — 4 tests passed.
- Browser claim batch for demo isolation, boundary checking, export, privacy, offline reload/update, plan limit, free core, and backup import — 9 passed.
- `npm run test:e2e -- --grep @claim:paid-checkout` — pass.
- `npm run test:unit -- --run -t '@claim:(art-provenance|refund-route|platform-install)'` — 3 claim tests passed.
- `npx playwright test --grep 'workspace-backup|Back navigation'` — pass after the final import and history changes.
- `npm run lint` — pass after installing the README-declared GTK/WebKit prerequisites.
- Four Rust claim commands — pass: scoped launch (2 tests), failed preflight, encrypted vault, and workspace deletion.
- `npm test` — 4 Vitest and 23 Playwright tests pass.
- `npm run build` — pass; output `dist/site/`; initial JS 13.73 KB gzip and CSS 4.49 KB gzip.

## Deployment

Static site deployed with `/opt/fleet/lib/deploy-static.sh freelancer-agent-context dist/site`.

- Cold live `verify-url.sh` passed at <https://freelancer-agent-context.sociobot.in>: 1,095 ms, no console errors, title/lang/one H1/main/alt/button checks pass. Evidence: `.factory/qa-evidence/polish-1/verify.json`.
- Cold mobile live checks passed for `/?demo=1`, `/privacy`, `/terms`, `/art-provenance`, and 404. Each normal route has one H1, zero serious/critical Axe findings, and zero console errors. `/?demo=1` showed the demo banner with Reset demo and Start for real. Evidence: `.factory/qa-evidence/polish-1/live-demo-mobile.png`.
- Static 404 correctly returned HTTP 404 with the shared skeleton and metadata. Its browser’s expected failed-navigation console line is a network status report, not an application exception.
- Desktop release workflow is triggered by pushed tag `v0.1.5`.

## Known gaps

No product gaps remain. macOS and Windows desktop installers remain intentionally unsigned until the operator provides `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` for release signing/notarization.
