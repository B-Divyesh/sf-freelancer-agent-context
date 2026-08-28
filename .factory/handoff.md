# Independent verification handoff — FAIL

**Candidate:** `4e3989164b37b360290932d6e7e7070f5e8c50e5`
**Live URL:** <https://freelancer-agent-context.sociobot.in>
**Date:** 2026-08-28 UTC

## Outcome

**FAIL — do not promote or release.** Fresh evidence is in
`.factory/verification-3.md`. No product code was changed.

The static deployment is available and exactly matches the candidate, so this
is not a deployment outage. The release remains blocked because:

1. The site downloads desktop `v0.1.2` built from old commit `ffd2dfd…`, not
   candidate `4e398916…`. That package predates the workspace-profile deletion
   fix and leaves deleted client connector credentials/configuration on disk.
2. A failed browser/Tauri state save is swallowed; the UI presents the
   workspace as saved, then it disappears on reload.
3. Dark mode has serious axe contrast failures (6 nodes on the landing page,
   4 on the demo, with ratios as low as 1.08:1).
4. A successful session check does not expose its delivery export until an
   undocumented reload.
5. Intel macOS is offered the arm64 DMG, while the Linux install script leaves
   its AppImage non-executable at mode 0644 in `/tmp`.

Additional P2 defects: duplicate license verification on a return URL, mobile
hit areas below 44×44, missing arrow-key behavior for the tab widget, unknown
routes returning HTTP 200, and two claim tests narrower than their claim text.

## What passed

- Mandatory cold first-read and one-click isolated demo.
- All 12 exact `.factory/claims.json` commands after clean dependency install.
- `npm test` (1 Vitest + 15 Playwright), `npm run typecheck`, `npm run lint`,
  and all 3 Rust tests.
- `npm run build` and `npm run tauri -- build`; current local AppImage, deb,
  and rpm were produced and the native window opened under Xvfb.
- Live normal/block/recovery/reset/deletion flows, export after reload,
  keyboard traversal, reduced motion, 390 px layout, light-theme axe, offline
  reload, and console/page-error checks.
- Live/static candidate hashes match. Headers, caching, metadata, link crawl,
  privacy request log, release checksum, and hosted $19 one-time checkout pass.
- License endpoint allowance: 30 requests; request 31 returned 429 with
  `Retry-After: 4`.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.31 s, TBT 70 ms, CLS 0.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
cargo test --manifest-path src-tauri/Cargo.toml
npm run build
npm run tauri -- build
```

Run every command in `.factory/claims.json` individually. For live checks use
`/demo`, both light and dark color schemes, and a 390×844 viewport. Compare
`git rev-parse v0.1.2^{}` with the candidate before accepting downloadable
artifacts.

## Next steps

- Version, tag, and publish repaired desktop binaries from the accepted commit.
- Propagate storage errors and keep failed edits retryable.
- Fix dark colors and add dark-mode axe coverage.
- Rerender the delivery ledger immediately after a successful check.
- Offer the correct macOS architecture and make the Linux installer executable
  or install it on PATH with checksum verification.
- Add regression coverage for the remaining P2 findings.
