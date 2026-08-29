# Independent verification handoff — FAIL

Date: 2026-08-29 UTC

Work order: `freelancer-agent-context-verify-4`

Candidate: `52a6e7e2be1ca49c4f4c44eeac2ba1cd21650a43`

Live URL: <https://freelancer-agent-context.sociobot.in>

Full report: `.factory/verification-4.md`

## Outcome

**FAIL — do not release or promote.** The live static deployment and published
`v0.1.3` desktop release now match the candidate, so the earlier deployment-only
failure is resolved. The candidate still fails the real client-boundary job:

- launched connectors inherit parent API-key environment variables;
- saved brief, writing rule, redaction rules, and checked draft are not passed
  to the launched agent session; and
- a delivery record can claim a scoped profile exists before launch or folder
  validation. A live workspace using a provably nonexistent folder exported
  that false passed check.

These are P1 defects in credential isolation, session context binding, and
provenance integrity.

## Verification completed

- Mandatory first-read and one-click demo gate: PASS.
- All 13 `.factory/claims.json` commands: PASS after installing the README's
  declared Tauri system prerequisites.
- `npm ci`: PASS, 65 packages, 0 vulnerabilities.
- `npm test`: PASS, 2 Vitest and 20 Playwright tests.
- `npm run typecheck`, `npm run lint`, and full `cargo test`: PASS.
- `npm run build`: PASS; `dist/site/` produced.
- `CI=1 npm run tauri -- build`: PASS; AppImage/deb/rpm produced.
- Live desktop/mobile, keyboard, dark/light axe, reduced motion, invalid input,
  recovery, delete, plan limit, license, export, privacy, offline, and links:
  exercised. Axe found 0 serious/critical issues.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.3 s, TBT 130 ms, CLS 0, 121 KiB transfer.
- Live/local static SHA-256 values match. Release workflow head SHA matches the
  candidate. Published deb checksum passes and both local/published binaries
  open under Xvfb.
- Linux installer installs mode 0755 and matches the published AppImage hash.
- Billing verify allowance observed: 30 responses per window; request 31 was
  HTTP 429 with `Retry-After: 3`.

## How to reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
cargo test --manifest-path src-tauri/Cargo.toml
npm run build
CI=1 npm run tauri -- build
```

On Linux, first install the Tauri 2 packages listed in `README.md`.

False provenance: open live `/app`, create a workspace with a nonempty path
that does not exist, run **Check boundary**, then export. The record says the
source has a scoped agent profile even though the profile is created only by
the later Tauri launch command.

Credential bleed: inspect `src-tauri/src/lib.rs` launch paths. They overlay
profile-directory variables but never clear the inherited environment, so
provider API keys remain available to the child connector.

## Operator action

No infrastructure, DNS, billing, or product code was changed. Repair the three
P1 defects and publish a new candidate/release before another verification.
Packages remain unsigned; signing credentials are still an operator concern.
