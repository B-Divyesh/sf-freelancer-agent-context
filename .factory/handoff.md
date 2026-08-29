# Repair handoff — Client Context Firewall v0.1.4

Date: 2026-08-29 UTC

Work order: `freelancer-agent-context-repair-4`

Base verifier report: `.factory/verification-4.md` for candidate
`52a6e7e2be1ca49c4f4c44eeac2ba1cd21650a43`.

## Outcome

All three release-blocking P1 findings are repaired.

- Connector children now start from an explicit runtime allowlist. The launch
  code calls `env_clear` and keeps only display, locale, terminal, path, and
  Windows runtime variables. Provider/API credentials inherited from the app,
  shell, or desktop session cannot reach Codex, Claude Code, or Gemini CLI.
- A native preparation step canonicalizes the selected folder, confirms the
  connector exists, creates the client profile, and writes a mode-600
  device-local session file. It contains the saved brief, writing rule,
  redaction rules, selected sources, and checked draft. Each connector receives
  a non-sensitive initial instruction to read that file before acting.
- Browser preview checks now stop at **Desktop validation required**. They do
  not create a passed delivery record. The installed app saves a verified record
  only after every selected agent returns a launch receipt. Demo exports remain
  available, but are marked `sample` and explicitly say that no local folder,
  profile, or connector was validated. Existing pre-repair records migrate to
  `legacy-unverified` and cannot be exported as launch provenance.

## Regression coverage

- `scoped_launch_clears_parent_provider_credentials_and_binds_checked_context`
  starts a real child process with `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and
  `GOOGLE_API_KEY` sentinels. It proves all three are absent, while the selected
  workspace ID, protected context file, connector instruction, brief, writing
  rule, redaction rule, and checked draft reach the child.
- `failed_native_preflight_refuses_provenance_without_a_real_workspace_path`
  reproduces the verifier's nonexistent-folder failure. It proves preparation
  fails before a profile directory exists.
- Browser regression `browser preview never exports a passing record before
  native folder and profile validation` proves `/app` cannot export the former
  false pass.

## Verification

Clean install and quality gates completed locally:

```sh
npm ci
npm test                         # 2 Vitest + 21 Playwright tests passed
npm run typecheck
npm run lint                     # TypeScript, rustfmt, Clippy -D warnings
cargo test --manifest-path src-tauri/Cargo.toml  # 5 passed
npm run build                    # dist/site/
CI=1 npm run tauri -- build
```

All 14 `.factory/claims.json` commands passed. The updated `scoped-launch`
claim runs both the profile-isolation and spawned-child credential/context
regressions. The new `validated-provenance` claim runs the absent-folder native
regression.

Browser coverage includes desktop, 390 px mobile, keyboard skip link/dialog/
tabs, reduced motion, dark/light axe scans, offline reload, stale-shell update,
privacy request inspection, billing response behavior, and the release
installer fixture. The Playwright AxeBuilder checks found zero serious or
critical violations. `verify-url.sh http://127.0.0.1:4173` wrote
`.factory/qa-evidence/repair-4/verify.json`: 588 ms load, no console errors,
one H1/main, `lang=en`, and no missing image alt text or unlabeled buttons.

The local Tauri executable opened a 1240×820 **Client Context Firewall** window
under Xvfb. The native v0.1.4 build produced Linux packages with these local
SHA-256 values:

- AppImage: `e1bfe2b62ebe11e5d83bb60bf75e1c44a02aa95354b1523702187d0f18a4a8b7`
- deb: `0813ce87c815c2aee44df87845892f0f4253562aedea7d27e45c850d36cbc2b8`
- rpm: `1a4ea6dc5bc37d6f56bcf245ac833a457a307cb48f711a22fb3b4459c45f55a8`

The deb reports package `client-context-firewall`, version `0.1.4`, architecture
`amd64`, and includes `/usr/bin/client-context-firewall`.

## Release and deployment

GitHub release `v0.1.4` is published from
`8d56ea58115ace0557ac92a6a587dc58b0653dcb`. Workflow
`33227521357` completed successfully. It contains macOS arm64/x64, Windows
MSI/EXE, Linux AppImage/deb/rpm, `SHA256SUMS`, and `latest.json`; the published
amd64 deb passes its `SHA256SUMS` entry and `latest.json` declares v0.1.4 with
all three platform groups.

The static production site was deployed to Azure Static Web Apps from
`dist/site/`. The custom URL and Azure hostname both byte-match local
`index.html` (`c0dc5016687bb3387148d949f03e2846ecdd71d43f1a72a218dba8cf94a62c5d`),
and production `sw.js` byte-matches local v0.1.4
(`5553032c61d1233bb64656671a2d63414f8653db505223fb7409138112f24f7e`). Live
`verify-url.sh` evidence is under `.factory/qa-evidence/live-repair-4/`: 815 ms
load, no browser errors, and the expected title/lang/H1/main/alt checks.

## Known gaps / operator action

Desktop packages are unsigned. macOS notarization and Windows Authenticode need
operator-provided `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` secrets. No
analytics or third-party client data transport was added.
