# Handoff — Client Context Firewall v0.1.1

## What was built

- A Tauri 2 desktop companion with an AES-256-GCM local vault. The random vault
  key lives in the operating system credential manager.
- Client workspaces containing a brief, writing rule, scoped source accounts,
  and redaction rules. Users can add and update each part after setup.
- A preflight that blocks missing sources, wrong connector accounts, other
  client names, and configured redaction terms.
- Local session history and a JSON delivery record export with the checked
  sources and results.
- A one-click demo at `/demo` with two realistic clients. It uses only
  `sessionStorage` under `demo:` and never reads or writes the `ccf:` namespace.
- A free two-workspace tier and a $19/month Pro license flow through Sociobot.
  Returned licenses are stored under `sb_license:freelancer-agent-context`,
  verified on receipt, and rechecked at most once each day.
- A responsive static product site with the dithered boundary-ledger identity,
  original generated art, three real product walkthrough frames, install
  fallback states, privacy, terms, 404 handling, and offline shell caching.
- GitHub Actions packaging for macOS arm64/x86_64, Windows MSI/EXE, and Linux
  AppImage/deb. A final job publishes `SHA256SUMS` and `latest.json`.

## How to run and verify

```sh
npm install
npm test
npm run build
cargo test --manifest-path src-tauri/Cargo.toml encrypted_vault_round_trips_and_rejects_another_key
```

`npm run build` writes `dist/site/index.html`. The full browser suite has eight
passing tests, plus one Vitest unit test. The Rust encryption test passes.
Every command in `.factory/claims.json` was run locally.

Production Lighthouse 12.8.2 mobile results against `vite preview`:

- Performance: 100
- Accessibility: 100
- Best practices: 100
- SEO: 100
- LCP: 1.7 s
- CLS: 0
- Total blocking time: 0 ms

The production entry bundle is 9.04 KB gzip JavaScript and 4.30 KB gzip CSS.
The mobile hero is 20.3 KB WebP. `npm audit` reports zero vulnerabilities.
The browser console was empty during the Lighthouse run.

## Known gaps and honest limits

- The app records the expected connector account but cannot inspect another
  app’s authenticated account. The preflight relies on the account the user
  enters and makes this limit clear in the interface.
- The browser `/app` preview uses local storage. The packaged desktop app uses
  the encrypted vault and credential manager.
- No release was present when the landing fallback was tested. The page reads
  the CORS-safe GitHub releases API and shows a calm release-page link until an
  asset exists.
- Desktop packages are unsigned until operator certificates are configured.
  This is stated beside the download control.

## Needs operator action

1. Register `freelancer-agent-context` as a $19/month product in the Sociobot
   billing system before production checkout.
2. Add Apple signing secrets `APPLE_CERTIFICATE`,
   `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`,
   `APPLE_PASSWORD`, and `APPLE_TEAM_ID` when notarised macOS builds are ready.
3. Add `WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`, then add the certificate
   import/thumbprint step before claiming signed Windows builds.
4. Dispatch the release workflow or push tag `v0.1.1`. Verify one downloaded
   asset against `SHA256SUMS` before changing the site’s unsigned-build copy.
