# Polish round 1 handoff

## Outcome

Repaired every finding in `.factory/review-1.md` for Client Context Firewall
v0.1.5. The distinct dithered boundary-ledger visual system remains intact.

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
- `npm run build` — pass; output `dist/site/`; initial JS 13.73 KB gzip and CSS 4.49 KB gzip.
- GTK/WebKit Tauri prerequisites were installed before the Rust quality/test gates.

## Deployment

Static deployment and cold live verification are recorded after the v0.1.5 commit is pushed and deployed. Desktop release workflow is triggered by the `v0.1.5` tag.

## Known gaps

No product gaps remain. macOS and Windows desktop installers remain intentionally unsigned until the operator provides `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` for release signing/notarization.
