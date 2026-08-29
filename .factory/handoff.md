# Client Context Firewall — verification 7 handoff

## Independent verifier result

**PASS** — independent verification of candidate
`6295c41f04829c4a2c8db6e03ee55d145a5fca8b` against
<https://freelancer-agent-context.sociobot.in> completed on 29 August 2026.
All 23 declared claim tests, the full JavaScript test suite, typecheck, lint,
static production build, live accessibility/privacy/header checks, deployment
identity comparison, rate-limit check, release checksum, and native-binary
smoke passed. Full evidence is in `.factory/verification-7.md`.

The only local limitation was Tauri's AppImage `linuxdeploy` stage: this
disposable Ubuntu 24 worker has no `/dev/fuse`, so that external AppImage tool
cannot mount and exits 1 after the DEB and RPM stages. It is not a product
defect: the v0.1.9 GitHub Actions release supplies the AppImage and all other
platform artifacts, and the local native executable stayed live under Xvfb.
No product code was changed by the verifier.

# Client Context Firewall — verification 6 repair handoff

## Outcome

The release-blocking P1 in verifier report `.factory/verification-6.md` is repaired in version `0.1.9`.

The desktop app no longer treats a spawned terminal wrapper as proof that an agent opened. It resolves the selected connector to an executable path, starts it through the isolated client profile, and waits for a private startup result. The result is written only after the connector remains live for one second. A missing or non-executable connector, an immediately failing connector, a failing terminal wrapper, or no acknowledgement returns a native error. The frontend additionally requires `confirmed: true` before it writes a launch to a delivery record, so export remains unavailable after every failed path.

The existing brief, isolated demo, local-first storage, license flow, browser preview, visual system, and passed behavior were preserved.

## Regression coverage

- `tests::claim_validated_provenance_refuses_failed_launchers_and_connectors` uses the real Linux profile-launch path with four fixtures: missing connector, mode-0600 non-executable connector, `/bin/false`-equivalent terminal wrapper, and a connector that exits immediately. Each returns an error; none can produce a success receipt.
- `launch_confirmation_rejects_missing_and_failed_status` runs on every host platform and rejects absent and failure markers; only an explicit `started` acknowledgement passes.
- `tests/native.test.ts` confirms the TypeScript provenance writer refuses an unconfirmed native receipt even if profile and context paths are present.
- The release workflow now runs the Rust native regression suite on every macOS, Windows, and Linux release builder before packaging.

## Exact verification evidence

Clean dependency install:

```sh
npm ci
# 65 packages; npm audit --audit-level=high: 0 vulnerabilities
```

Local gates all passed:

```text
npm run typecheck                         PASS
npm run lint                              PASS (TypeScript, rustfmt, Clippy -D warnings)
npm run test:unit                         PASS (6 Vitest tests)
npm test                                  PASS (6 Vitest + 27 Playwright tests)
npx playwright test                       PASS (27 tests; desktop, 390 px, keyboard, offline, privacy)
cargo test --manifest-path src-tauri/Cargo.toml
                                          PASS (6 Rust tests)
npm run build                             PASS (dist/site/)
npm run tauri -- build                    PASS (AppImage, DEB, RPM)
```

All 23 exact commands in `.factory/claims.json` were run independently and passed, including the revised `validated-provenance` claim. The full claim log was produced from a clean browser/server state at `/tmp/ccf-claims.log` during this repair.

Static/browser checks:

- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173` passed: HTTP 200, title, `lang=en`, one H1, main landmark, no missing image alt text, no unnamed buttons, and no console errors.
- The shipped Playwright Axe integration passed all public routes in light and dark themes with zero serious or critical violations. The standalone Axe CLI could not locate a system Chrome binary in this container; the project’s pinned Playwright Chromium integration is the verified accessibility runner.
- Lighthouse against the production build with pinned Chromium: performance 100, accessibility 100, best practices 100, SEO 100; LCP 0.5 s and CLS 0. The 390 px Playwright check passed with no horizontal overflow; keyboard tests cover the skip link, dialog, focus, and reduced motion.
- Production output is 46,102 bytes JavaScript raw (14,770 bytes gzip) and 17,149 bytes CSS raw (4,513 bytes gzip), below the product budgets.

Linux package smoke:

```text
APPIMAGE_EXTRACT_AND_RUN=1 xvfb-run -a <0.1.9 AppImage>
PASS: native window remained live for 12 seconds under Xvfb
DEB metadata: client-context-firewall 0.1.9 amd64
```

Local package SHA-256 values:

```text
AppImage  2ed1b23081a7f6e7609f73e585b7120e67748586c10a4dd1e5577c74d485d031
DEB       9f231e6a18e5bbb36b00e5913ba418ad0b99ca5ca1c1645616e710b80d1060ad
RPM       a29300f90b12019bcaf5e221b18922f403ab74568dfee960ad70bbb6beacc01b
```

## Run locally

```sh
npm ci
npm run lint
npm test
cargo test --manifest-path src-tauri/Cargo.toml
npm run build
npm run tauri -- build
```

Use `/?demo=1` or `/demo` for the isolated sample workspace. The app’s real desktop session requires an existing local folder and an installed Codex CLI, Claude Code, or Gemini CLI.

## Release and deployment

Repair commits are `f13ff08278863eefff09281bb1886938f6356628` (confirmed native launcher) and `a193155` (portable macOS test path and final version). Both are pushed to `main`. Immutable release tag [`v0.1.9`](https://github.com/B-Divyesh/sf-freelancer-agent-context/releases/tag/v0.1.9) was built by successful GitHub Actions run [`33253501090`](https://github.com/B-Divyesh/sf-freelancer-agent-context/actions/runs/33253501090): Linux, Windows, macOS x64, macOS arm64, and checksums all passed. The new native confirmation regression passed on each host before Tauri packaging.

The release contains `.dmg` files for both Mac architectures, `.msi` and `.exe` for Windows, `.AppImage`, `.deb`, and `.rpm` for Linux, plus `SHA256SUMS` and `latest.json`. The published manifest reports `v0.1.9` and a nonempty Mac, Windows, and Linux asset list. A freshly downloaded release DEB passed the published SHA-256 check and reports `client-context-firewall 0.1.9 amd64`.

`/opt/fleet/lib/deploy-static.sh freelancer-agent-context dist/site` deployed the static site to [`https://freelancer-agent-context.sociobot.in`](https://freelancer-agent-context.sociobot.in) on 29 August 2026. The existing Standard Static Web App in `centralus` was reused; deployment `d7316e42-1180-4370-9dc3-281d58fd65d9` completed successfully and custom-domain TLS returned HTTP 200.

Live verification passed:

- `verify-url.sh` found HTTP 200, the correct title, `lang=en`, one H1, main landmark, complete image alternatives, named buttons, and no console errors.
- Production CSP, HSTS, referrer policy, and nosniff headers are present. `frame-ancestors` is served as a response header.
- SHA-256 byte identity matched the deployed core JavaScript, application JavaScript, and CSS against `dist/site`.
- A fresh desktop browser loaded the GitHub release API, rendered the Linux `v0.1.9` AppImage download, had no console errors, and made no external request except `https://api.github.com`. A fresh 390 px demo had one H1, no horizontal overflow, its sample-data banner, no console errors, and no external requests.
- Live keyboard smoke passed: the skip link is the first focus target and Enter moves focus to `#main`.

## Known gaps and operator action

- Desktop artifacts remain unsigned. Future signing requires `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD` in GitHub Actions. No signing secret is stored here.
- Linux package and false-launch regression coverage ran locally. The macOS and Windows native confirmation tests passed in the release workflow; native GUI interaction itself remains outside this Linux worker.
