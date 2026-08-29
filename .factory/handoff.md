# Client Context Firewall — verification 6 repair handoff

## Outcome

The release-blocking P1 in verifier report `.factory/verification-6.md` is repaired in version `0.1.8`.

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
- Production output is 46,100 bytes JavaScript raw (14,770 bytes gzip) and 17,150 bytes CSS raw (4,515 bytes gzip), below the product budgets.

Linux package smoke:

```text
APPIMAGE_EXTRACT_AND_RUN=1 xvfb-run -a <0.1.8 AppImage>
PASS: native window remained live for 12 seconds under Xvfb
DEB metadata: client-context-firewall 0.1.8 amd64
```

Local package SHA-256 values:

```text
AppImage  f432de9183fd441d8b8e64e12dd8ebc87f937c4e8a0c0867b749cdb55b0bc7e4
DEB       d0002cd655c2d8610a24969063c5a634dad1a0dbeed52b6782c6410cc88f2878
RPM       c1ae563c178e4e7ce03ca006d83dd550fc639d0096fe023a452947bd58b3ab1a
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

The source release and static deployment are performed after this handoff is committed. Their commit, release workflow, hosted asset checksums, deployment URL, and byte-identity result are recorded in the final handoff update.

## Known gaps and operator action

- Desktop artifacts remain unsigned. Future signing requires `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD` in GitHub Actions. No signing secret is stored here.
- Linux package and false-launch regression coverage ran locally. macOS and Windows launch confirmation tests run in the release workflow; those native GUI environments are not available in this Linux worker.
