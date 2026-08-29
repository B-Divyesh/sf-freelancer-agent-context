# Client Context Firewall — review 3 handoff

## Outcome

**FAIL** for candidate `884873ad910e0b988defa255e03ac2ca1b92c951`.
The complete adversarial report is `.factory/review-3.md`. No product code was
changed.

The cold first screen and one-click demo pass. All 23 declared claim commands
pass from a fresh remote clone after installing the documented Tauri Linux
prerequisites. The aggregate 6 Vitest and 27 Playwright tests, typecheck, lint,
and production build also pass. Live route metadata, the designed 404,
same-origin demo traffic, offline reload, focus/history behavior, link
availability, and Axe serious/critical checks pass.

## Remaining findings

- **F-3-1, blocking:** README/Privacy imply the session context is temporary,
  but the native file remains in the client profile until workspace deletion
  and no claim tests its lifecycle.
- **F-3-2, blocking:** README says backups omit license data and delivery
  records, but the listed backup claim and test cover only sign-in omission and
  folder-path confirmation.
- **F-3-3, blocking:** the credential-manager claim test uses
  `keyring::mock::default_credential_builder()` rather than an operating-system
  credential store.
- **F-3-4, minor:** the Privacy H1 is an absolute, unlisted claim instead of a
  page-identifying heading.
- **F-3-5, minor:** the GitHub download and Sociobot checkout actions do not
  identify their external destinations.

## Verification

From a clean clone:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Every exact command in `.factory/claims.json` was also run separately. The
four Rust claim commands require GTK/WebKit/Tauri development packages on
Linux; after those prerequisites were installed, all four passed unchanged.

Live checks used fresh Chromium contexts at 390×844 and 1440×900. The factory
URL verifier passed against
<https://freelancer-agent-context.sociobot.in>, and live Axe checks reported no
serious or critical violations on `/`, `/demo`, `/app`, `/privacy`, `/terms`,
`/art-provenance`, or the designed 404.
