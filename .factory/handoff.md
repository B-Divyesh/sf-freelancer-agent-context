# Client Context Firewall — polish round 3 handoff

## Outcome

**PASS.** The repair of candidate
`884873ad910e0b988defa255e03ac2ca1b92c951` is committed as
`074aa0238967d3c7a21a1ad57cf792ae8e2caf8e`, released as `v0.1.10`, pushed to
`main`, and deployed to
<https://freelancer-agent-context.sociobot.in>.

Round 3 closes all five current findings and re-verifies every earlier review
finding. The complete id-to-change-to-evidence map is
`.factory/polish-3.md`; there are no remaining product findings or known
product gaps.

## What changed

- Corrected the checked-context lifecycle: README and Privacy now state that
  the checked context remains in its client profile until workspace deletion.
  The new `session-context-retention` claim verifies both retention and
  deletion.
- Strengthened the workspace-backup claim and browser test to seed and prove
  the absence of agent sign-ins, license token/verdict data, and delivery
  records, as well as required path review before import.
- Removed the unsupported operating-system credential-manager assertion. The
  remaining, public AES-256-GCM file-encryption statement has a real
  write/read/no-plaintext/wrong-key test.
- Replaced the Privacy H1 with the page-identifying
  “Privacy: what the app stores and sends.”
- Made all GitHub-download and Sociobot-checkout actions name their external
  destination in visible and accessible text; added a browser regression.
- Bumped the desktop/site release to `0.1.10`, including cache and footer
  versioning, and fixed the Linux release runner’s GTK prerequisite.

## Verification

From a fresh remote clone at the repair commit (the worker requires
`npm ci --include=dev` because its default npm configuration omits test tools):

- Every exact command in `.factory/claims.json` passed separately: **24/24**.
- `npm test` passed: **6 Vitest** and **28 Playwright** tests.
- `npm run lint` passed: TypeScript, Rust format, and Clippy with warnings
  denied.
- `cargo test --manifest-path src-tauri/Cargo.toml` passed: **7** native tests.
- `npm run build` passed and produced `dist/site`; emitted JavaScript is
  **46.38 KB raw / 14.77 KB gzip**.

The durable clean-clone record is
`.factory/qa-evidence/polish-3/clean-claim-summary.txt`.

Live deployment checks:

- The factory URL verifier passed for the production URL: HTTPS 200, title,
  language, one H1, `main`, alt text, control labels, and zero application
  console errors. Evidence:
  `.factory/qa-evidence/polish-3/live/verify.json`.
- Direct live routes `/`, `/demo`, `/app`, `/privacy`, `/terms`, and
  `/art-provenance` return 200. An unknown route returns the designed 404.
- Live Playwright Axe checks found zero serious/critical issues on every route
  above plus the 404. Cold desktop/mobile and demo screenshots are in
  `.factory/qa-evidence/polish-3/live/`.
- Mobile Lighthouse: performance **100**, accessibility **100**, LCP **1.47
  s**, CLS **0**. Evidence:
  `.factory/qa-evidence/polish-3/live/lighthouse-mobile.json`.
- GitHub Actions release run succeeded:
  <https://github.com/B-Divyesh/sf-freelancer-agent-context/actions/runs/33258677032>.
  Release assets include macOS Intel/Apple silicon, Windows MSI/EXE, Linux
  AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`; a downloaded Linux DEB
  passed `sha256sum -c`.

## Run and deploy

```sh
npm ci --include=dev
npm test
npm run lint
cargo test --manifest-path src-tauri/Cargo.toml
npm run build
```

Deploy the generated `dist/site/` static root with the checked-in hosting
configuration. Desktop release builds run from `.github/workflows/release.yml`
when a `v*` tag is pushed.
