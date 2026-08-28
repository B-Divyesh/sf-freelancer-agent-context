# Independent verification — FAIL

**Candidate:** `2e53d94772c6de7b1efd90a75dc6660e1a967779` (`main`)  
**Live URL:** https://freelancer-agent-context.sociobot.in  
**Verified:** 2026-08-28

## Verdict

**FAIL. Do not release or promote this candidate.** The live **Buy Pro** control
returns HTTP 404, so the advertised paid path is unusable. The product also does
not implement the brief's connector-scoping/launching boundary; its only check is
against text the user types. Additional release-blocking contract failures are
listed below.

## First-read result

Cold live landing page, desktop browser:

- **What it does:** “Keep client work from crossing over”; it checks a client
  session's source, account, and draft text.
- **For whom:** freelance developers switching between clients.
- **What to click first:** the visible **Try it with sample data** link, with
  the adjacent explanation “See a checked client session next.”

This passes the plain-words and one-click-demo gate. `/demo` opens a realistic
Northstar Coffee / Juniper Legal sample and shows the persistent “Demo — Sample
data. Nothing is saved.” banner, Reset demo, and Start for real controls.

## Required claim tests

Ran every command in `.factory/claims.json` after `npm ci`. All seven passed.
The Rust claim initially could not compile on the bare image because its
documented Tauri Linux libraries were absent; after installing the documented
GTK/WebKit prerequisites it passed unchanged.

| Claim | Exact command | Result |
| --- | --- | --- |
| demo-isolation | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS |
| boundary-check | `npm run test:e2e -- --grep @claim:boundary-check` | PASS |
| provenance-export | `npm run test:e2e -- --grep @claim:provenance-export` | PASS |
| device-local | `npm run test:e2e -- --grep @claim:device-local` | PASS |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| plan-limit | `npm run test:e2e -- --grep @claim:plan-limit` | PASS |
| encrypted-vault | `cargo test --manifest-path src-tauri/Cargo.toml encrypted_vault_round_trips_and_rejects_another_key` | PASS |

The claim suite is not sufficient to substantiate all copy; see finding P1-3.

## Build and automated tests

- `npm ci`: PASS, 0 reported vulnerabilities.
- `npm run test:unit`: PASS (1 Vitest test).
- `npm run test:e2e`: PASS (8 Playwright tests).
- `npm test`: its unit and browser components passed.
- `npm run build`: PASS. `dist/site/` contains 9.04 KB gzip JS and 4.30 KB
  gzip CSS; the 600px hero image is 20,752 bytes.
- No separate lint or type-check script is declared in `package.json`.
- `npm run tauri build` with the inherited `CI=1`: **FAIL** immediately:
  `invalid value '1' for '--ci'`.
- Retrying the same production Tauri build with `CI=true` compiled the release
  executable and produced `.deb` and `.rpm`, then **FAILed** bundling the
  `.AppImage`: `failed to bundle project: failed to run linuxdeploy`.

## Live behaviour, privacy, accessibility, and deployment identity

- Normal demo preflight: PASS, records a clean Northstar Coffee session.
- Boundary/recovery: PASS for wrong connector account, Juniper client text,
  redaction term, and no selected source. The UI returns specific corrective
  messages and can be reset.
- Mobile: PASS at 390×844; document width remained 390px and Check session was
  usable.
- Keyboard: controls are operable and have a visible 3px focus outline.
  Reduced-motion media query removes transitions/animations.
- Axe on live `/`, `/demo`, `/privacy`, and `/terms`: 0 serious/critical
  violations. Browser console and page errors: 0 during the tested flows.
- Privacy request log: a full fresh `/demo` flow made no external requests;
  all were product-origin. The landing's GitHub release lookup is disclosed on
  the privacy page. CSP permits only self plus GitHub/Sociobot connections;
  HTTPS, `nosniff`, referrer policy, and `frame-ancestors 'none'` are present.
- Offline reload: PASS after first visit (active service worker, offline
  `/demo` reload HTTP 200, “OFFLINE · DEVICE LOCAL”).
- Static deployment identity: local production and live SHA-256 match exactly
  for `index.html`, `assets/index-omVjrmUp.js`, and
  `assets/index-ChYyq7hc.css`.
- Live hashed JS uses `max-age=31536000, immutable`; HTML uses 30 seconds.
- Release v0.1.1 has macOS, Windows, and Linux assets. Downloaded
  `Client.Context.Firewall_0.1.1_amd64.deb` SHA-256
  `401fb19678b8a54e3839ceead82cabafbdc7d43980af3a0c42d1684735366249`,
  matching `SHA256SUMS`.
- Sociobot license verification rate limiting was observed: 30 consecutive
  invalid-license requests were HTTP 200; the 31st was HTTP 429 with
  `Retry-After: 4`. No product documentation states this allowance.

## Defects

### P0 — Paid checkout is a dead live link

**Evidence:** Crawling the visible **Buy Pro** link,
`https://api.sociobot.in/api/v1/products/freelancer-agent-context/checkout`,
returns HTTP 404. The page advertises a $19/month Pro tier, but checkout cannot
begin. This violates the no-dead-links requirement and makes the paid feature
unusable. Register/configure the production Sociobot product and reverify the
redirect/return-license flow before release.

### P1 — The core connector boundary is not implemented

The researched smallest useful product requires named workspaces with **scoped
connectors**. The app stores a source label and expected account, then compares
the manually entered `Active account` string. Tauri exposes only encrypted
vault load/save/delete commands; it neither launches a connector/agent session
nor binds to or verifies an authenticated connector account. A user can enter
the expected value while using a different account, so this does not deliver
the brief's zero-cross-client-connector-use job to be done. The app's own
handoff acknowledges this limitation. Implement actual scoped connector launch
or an honest, enforceable integration before claiming the boundary.

### P1 — Service-worker updates can serve stale application code

`public/sw.js` uses a fixed cache name, `ccf-shell-v1`, and cache-first
responses. A later deployment with the same cache name retains old cached `/`
and route responses; activation deletes only *other* cache names. The current
offline reload works, but a client with this service worker is not guaranteed
to receive an update. Version the cache from the build/revision and verify an
old client updates to the new shell.

### P1 — Claim coverage does not meet the claims contract

Several reliance-worthy statements have no exact observable claim test. In
particular, the landing says “It does not read other apps or monitor your
screen” and “Pro adds unlimited workspaces”; the latter's listed test only
proves a third workspace can be created, not unlimited workspaces. “Safety
checks and delivery exports stay free” is also unlisted. The `device-local`
test records only a browser-demo flow, while its page claim says all workspace
data is not sent off-device. Add scoped claims/tests or remove/narrow the copy.

### P2 — Cold-load skip link is bypassed by scripted focus

The document contains a skip link, but on initial landing load `route()`
programmatically focuses the H1. The first forward Tab lands on **Try it with
sample data**, not “Skip to main content”; header navigation and the skip link
are therefore skipped in normal forward keyboard order. Only move focus to the
new H1 after client-side navigation, not the initial page load.

### P2 — Local desktop package command is not cleanly reproducible

The declared `tauri build` command rejects the common `CI=1` environment value.
With `CI=true` it builds native code but fails the AppImage package at
`linuxdeploy`. Debian/RPM outputs exist from the attempt, but this was not a
successful all-target local production build. Pin/normalize CI handling and
make the documented Linux packaging prerequisites sufficient, or document that
the all-platform build is CI-only and test it there.

