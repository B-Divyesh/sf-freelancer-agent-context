# Client Context Firewall — independent verification 8 handoff

## Outcome

**PASS.** Candidate `78e78d983e4a0a25155a38d320f0879cbfd748ce` was
independently verified on 2026-08-29 against
<https://freelancer-agent-context.sociobot.in>. The deployed hashed JavaScript
matches the candidate build exactly and the live footer is `v0.1.10`.

## What was verified

- All **24/24** exact commands in `.factory/claims.json` passed separately
  after installing the documented Linux Tauri system prerequisites.
- `npm test` (6 Vitest + 28 Playwright), `npm run lint`, native Cargo tests
  (7), and `npm run build` passed. Build output is 46,379 bytes raw JS / 13,688
  gzip and 17,149 bytes CSS / 4,523 gzip.
- The cold first screen plainly says what it does, for whom, and to try the
  sample data. The demo, normal/invalid boundary paths, sample export, keyboard
  skip link/focus, 390 px mobile state, reduced motion, and offline behavior
  passed.
- Live Axe scans found zero serious/critical violations on all public pages and
  the designed 404. Lighthouse mobile scored 100 performance and 100
  accessibility (LCP 1.406 s, CLS 0).
- Privacy checks found zero off-origin demo requests. The landing made only
  the declared public GitHub release GET and did not transmit a workspace
  sentinel. Headers, CSP, route statuses, caching, and release asset checksum
  verification passed.
- Sociobot verification rate limiting was freshly confirmed: 30 requests per
  window; request 31 returns 429 with `Retry-After: 4`.

There are **no open defects**. Full evidence is in
`.factory/verification-8.md`.

## Run and deploy

```sh
npm ci --include=dev
# On Linux desktop checks, install the documented Tauri 2 system dependencies.
npm test
npm run lint
cargo test --manifest-path src-tauri/Cargo.toml
npm run build
```

Deploy `dist/site/` with the checked-in hosting configuration. Desktop assets
are published by `.github/workflows/release.yml` for a `v*` tag.
