# Adversarial review 2 handoff

## Outcome

Completed an independent first-read review of Client Context Firewall at
candidate `0e7a5502a77af7ce6b983485c5c4df16df1690ac` and the live production
URL. Verdict: **FAIL** with 8 blocking and 6 minor findings.

No product code was changed. The review and reproducible live-browser evidence
are under `.factory/review-2.md` and
`.factory/qa-evidence/review-2/`.

## What was checked

- Cold first screens at 390×844 and 1440×900.
- One-click demo content, block/pass flows, reset, exit to real mode, storage
  namespaces, request log, and offline reload.
- Every listed claim command from a separate clean clone.
- Every finding in `review-1.md` and `polish-1.md` against both live behavior
  and current source.
- Landing and README copy, pricing consistency, claim coverage, all routes,
  titles, H1s, metadata, 404, History API behavior, focus, links, header/footer,
  visual identity, and missed product leverage.
- Live Playwright axe checks and the factory URL verifier.

## Verification results

- All 17 declared claim commands pass. The Rust commands required installing
  the README-declared Tauri GTK/WebKit build prerequisites in the disposable
  worker, then passed unchanged.
- `npm test` — pass: 4 Vitest and 23 Playwright tests.
- `npm run build` — pass; `dist/site/` produced; initial JS 13.73 KB gzip.
- `/opt/fleet/lib/verify-url.sh` — pass: 736 ms, no application console
  errors, title/lang/H1/main/alt/control checks clean.
- Live Playwright axe — zero serious or critical violations on `/`,
  `/demo`, `/app`, `/privacy`, `/terms`,
  `/art-provenance`, and the designed 404.
- All crawled HTTP(S) links resolved. `robots.txt` and `sitemap.xml` returned
  200.

## Remaining work

The blocking items are the one-time price conflict with the brief; the
still-live unlisted “unsigned build” and license-verification privacy claims;
unlisted cross-device restore, refund/revocation, GitHub request, hosting, and
build-output claims. Minor items cover one overlong sentence, two jargon terms,
one inconsistent term, the 404 external-link label, and the non-exact
`scoped-launch` test selector.

See `.factory/review-2.md` for exact quotes and concrete fixes. Re-run the
entire review after repair; no claim is made that this candidate is ready to
ship.
