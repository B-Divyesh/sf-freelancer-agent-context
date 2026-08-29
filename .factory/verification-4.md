# Independent product verification 4 — FAIL

**Candidate:** `52a6e7e2be1ca49c4f4c44eeac2ba1cd21650a43` (`main`, tag `v0.1.3`)

**Live URL:** <https://freelancer-agent-context.sociobot.in>

**Verified:** 2026-08-29 UTC

**Artifact:** Tauri desktop app with static companion site

## Verdict

**FAIL. Do not release or promote this candidate.** The previous deployment
and release-artifact failure is repaired: the live site byte-matches this
candidate, and the published desktop release was built successfully from this
candidate. However, fresh inspection and runtime reproduction found three
release-blocking failures in the core client boundary:

1. launched agents inherit arbitrary parent-process API credentials;
2. stored client brief, writing rule, redaction rules, and checked text never
   reach the launched agent session; and
3. the app exports a passed delivery record claiming a scoped profile exists
   before launch or folder validation.

The candidate therefore does not safely complete the researched job of
binding client context and accounts to an agent session, and its provenance
record can attest to a boundary that was never created.

## Mandatory first-read and demo gate

**PASS.** A fresh browser context opened the live root at 1440×900 with no
stored state.

- **What it does:** “Keep client work from crossing over”; it separates client
  sources, accounts, and writing style.
- **For whom:** freelance developers who switch clients.
- **What to click first:** **Try it with sample data**, followed by “See a
  checked client session next.”
- The action is visible in the first desktop screen and at y=505–553 px in the
  first 390×844 mobile screen.
- One click opens `/demo` with Northstar Coffee and Juniper Legal. The
  persistent banner says **Demo — Sample data. Nothing is saved** and includes
  **Reset demo** and **Start for real**.

Evidence: `.factory/qa-evidence/first-read-desktop.png` and
`.factory/qa-evidence/live-landing-mobile.png`.

## Required claims

`.factory/claims.json` exists with 13 entries. I ran every listed command
separately. The first bare-image Rust invocation stopped at compilation because
GLib/WebKit development libraries were absent. After installing the Tauri
system prerequisites explicitly required by the README, all exact claim
commands passed unchanged. No claim assertion failed.

| Claim | Exact command | Result |
| --- | --- | --- |
| demo-isolation | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS — 1 test |
| boundary-check | `npm run test:e2e -- --grep @claim:boundary-check` | PASS — 1 test |
| scoped-launch | `cargo test --manifest-path src-tauri/Cargo.toml scoped_launch_separates_connector_credentials` | PASS — 1 test after prerequisites |
| provenance-export | `npm run test:e2e -- --grep @claim:provenance-export` | PASS — 1 test |
| device-local | `npm run test:e2e -- --grep @claim:device-local` | PASS — 1 test |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — 1 test |
| offline-update | `npm run test:e2e -- --grep @claim:offline-update` | PASS — 1 test |
| plan-limit | `npm run test:e2e -- --grep @claim:plan-limit` | PASS — 1 test |
| free-core | `npm run test:e2e -- --grep @claim:free-core` | PASS — 1 test |
| paid-checkout | `npm run test:e2e -- --grep @claim:paid-checkout` | PASS — 1 test |
| encrypted-vault | `cargo test --manifest-path src-tauri/Cargo.toml encrypted_vault_round_trips_and_rejects_another_key` | PASS — 1 test after prerequisites |
| platform-install | `npm run test:unit -- --run -t @claim:platform-install` | PASS — 1 test |
| workspace-deletion | `cargo test --manifest-path src-tauri/Cargo.toml deleting_workspace_removes_its_connector_scope_and_credentials` | PASS — 1 test after prerequisites |

The `scoped-launch` test does not prove its full user-facing outcome. It calls
the internal scope-plan constructor and compares profile paths, but does not
launch a child process or assert that credentials inherited from the parent
are absent. Fresh source inspection demonstrates the resulting leak; see P1-1.

## Clean install, tests, and exact production builds

Environment: Ubuntu 24.04, Node 22, Rust stable, Playwright 1.58.2.

- `npm ci`: PASS — 65 packages, 0 vulnerabilities.
- `npm test`: PASS — 2 Vitest tests and 20 Playwright tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS — TypeScript, Rust format, and Clippy with
  `-D warnings`.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS — 3 Rust tests.
- `npm run build`: PASS; output is `dist/site/`.
- `CI=1 npm run tauri -- build`: PASS; produced the Linux executable,
  AppImage, deb, and rpm.
- Both the local release executable and the published `v0.1.3` deb executable
  opened a 1240×820 **Client Context Firewall** native window under Xvfb.

Local bundle SHA-256 values (expected to differ from Ubuntu 22.04 CI output):

- AppImage: `3a58722b729ba480c0c7cb78d3b9af5b65f03141d0c5a29db4246744100fa687`
- deb: `0ba2f9184a249c6a008d4ad7e4ce0bc30598b7fd071fa4513243060dd783c69d`
- rpm: `f893d3b782df8ab10a0ec1447f231ac051f81c37a38fc70b29e1d4f7a2610530`

## Independent end-to-end behavior

Fresh live contexts exercised normal, boundary, invalid, recovery, reset,
storage-failure, deletion, free-limit, license, and export paths.

- Sample state loads two realistic workspaces and writes no storage until an
  action occurs.
- No selected source blocks with **Choose at least one source**.
- `Juniper Legal` plus `NS_LIVE_KEY` produces three exact blocks: another
  client, the named key, and the configured Juniper term.
- Corrected Northstar text passes, creates the ledger entry immediately, and
  exposes export without reload.
- Exported `ns-delivery-record.json` contains Northstar Coffee, one selected
  source, three checks, and the non-guarantee statement.
- The demo launch action clearly says it does not open local apps.
- Reset clears `demo:workspace-state`; no `ccf:` local-storage key is created.
- Empty required workspace fields remain in the dialog with native validation
  messages. A 61-character name is limited to 60 characters.
- A first and second real workspace persist; a third is blocked on free with
  the documented notice.
- Cancelled deletion preserves both workspaces; confirmed deletion leaves one
  and reports that the workspace/profile were deleted.
- A forced `QuotaExceededError` keeps the dialog and form values open, shows
  the recovery message, and persists nothing.
- A returned invalid license is removed from the URL, stored under the
  documented key, verified exactly once, and cached as invalid.

### False provenance reproduction

In a fresh live `/app` context I created **Impossible Path Client** with local
folder `/definitely/not/a/real/folder/qa-52a6e7e`. **Check boundary** reported:

> BOUNDARY PASSED — Each selected source has a scoped agent profile

It immediately exported the same sentence in `checks`. Clicking launch then
said to install the desktop app; no profile had been created. The identical
desktop frontend also records the pass first; only the later Tauri launch
command canonicalizes the folder and creates the profile. This is P1-3.

## Accessibility, keyboard, mobile, and motion

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` each return 200, set
  `lang=en`, have one route-specific H1 and one main landmark, and have no
  missing image alt text or console/page errors.
- An unknown route returns HTTP 404 with the designed not-found page.
- Playwright axe on every product route in both light and dark schemes found
  **0 serious/critical findings**. A separate 390 px `/demo` run also found 0.
- First Tab reaches **Skip to main content** with a visible 3 px orange focus
  outline; Enter focuses `main`.
- Workspace tabs support ArrowLeft/ArrowRight/Home/End with focus and selection
  movement.
- The workspace dialog opens from the keyboard, focuses its close control,
  closes with Escape, and returns focus to its opener.
- At 390×844, landing and demo widths remain 390 px. The primary demo action is
  visible on the first screen. No visible link or button measured below
  44×44 CSS pixels.
- With `prefers-reduced-motion: reduce`, computed scroll behavior is `auto` and
  no element has nonzero animation or transition duration.
- `/opt/fleet/lib/verify-url.sh`: PASS — 682 ms load, correct title/lang/main,
  one H1, all image alt text, labelled buttons, and zero errors.

Evidence: `.factory/qa-evidence/verify-url/verify.json` and the desktop/mobile
screenshots under `.factory/qa-evidence/`.

## Privacy, requests, headers, caching, and offline behavior

- The complete live demo block/recovery/check/export/launch/reset flow made
  only three requests, all to the product origin (document, JS, CSS). It made
  no off-origin request and left no local-storage key.
- A settled landing load made one disclosed off-origin request, to
  `api.github.com` for public release metadata. No analytics, external fonts,
  or third-party scripts were observed.
- Live response headers include HSTS, `nosniff`, strict-origin referrer policy,
  restricted camera/microphone/geolocation permissions, and CSP with
  `frame-ancestors 'none'` and the two documented connect origins.
- Hashed JS/CSS use `max-age=31536000, immutable`; HTML and `sw.js` use
  `must-revalidate, max-age=30`.
- The service worker controls the site with cache `ccf-shell-v0.1.3`. Offline
  `/demo` reload returns 200 and shows **Offline · device local** with no
  errors. The stale-shell replacement claim also passed locally.
- The product has no sign-in and no first-party application backend. Entra,
  backend concurrency, and server persistence tests are not applicable.
- The only product server endpoint is Sociobot billing verification. One
  client received 30 consecutive HTTP 200 invalid-license responses; request
  **31 returned 429** with `Retry-After: 3`. Observed allowance: 30 requests per
  window.

## Performance and bundle budgets

Fresh Lighthouse 12.8.2 mobile results:

| Category / metric | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 1.0 s |
| LCP | 1.3 s |
| TBT | 130 ms |
| CLS | 0 |
| Total transfer | 121 KiB |

Lab INP is not available without user interaction; TBT is below the 200 ms
interaction proxy. Local production assets are 33,483 bytes initial JS
(11,248 gzip), 2,441 bytes deferred desktop JS (997 gzip), 16,842 bytes CSS
(4,478 gzip), and 20,752 bytes for the mobile hero. All budgets pass.

Evidence: `.factory/qa-evidence/lighthouse-mobile.json`.

## Deployment, release, links, and installers

- Local/live SHA-256 values match exactly for `index.html`
  (`0302b065…9e4c`), `sw.js` (`5185669c…e1ea`), initial JS
  (`e07f544c…fca6`), deferred JS (`8261a5e5…ceb3`), and CSS
  (`8fa78a43…d806`). The static deployment is this candidate.
- GitHub release `v0.1.3` targets
  `52a6e7e2be1ca49c4f4c44eeac2ba1cd21650a43`. Release workflow run
  `33222882784` completed successfully at the same `head_sha`.
- The release contains macOS arm64/x64, Windows MSI/EXE, Linux
  AppImage/deb/rpm, `SHA256SUMS`, and valid `latest.json`.
- Downloaded `Client.Context.Firewall_0.1.3_amd64.deb` passes published
  `SHA256SUMS`, reports version 0.1.3 amd64, and contains
  `delete_workspace_scope` and `launch_scoped_agent`.
- The live detector selects the x64 DMG for Intel Mac, aarch64 DMG for Apple
  silicon, MSI for Windows, and AppImage for Linux. All selected asset links
  resolve to release downloads.
- The real Linux one-line installer downloaded 81,009,144 bytes, verified
  SHA-256 `609ac779b47723758b24c689378061f6d8405e25765f5c026357afa07a079540`,
  installed mode 0755 under a clean `XDG_BIN_HOME`, and printed PATH guidance.
- Every live site link resolves as 200 or an intentional 302/303 download or
  checkout redirect. Mail links are explicit.
- Hosted checkout redirects to Dodo and the claim test verifies `$19.00` and
  **One-time Pro license**.

## Defects by severity

### P1 — The launcher inherits cross-client API credentials

The product's core promise is separate connector credentials per client, and
the researched workaround specifically includes manually swapping API keys.
The launch code only overlays `HOME`, XDG/AppData paths, and three CCF IDs.
Linux invokes `env` without `-i` (`src-tauri/src/lib.rs:133-152`); macOS writes
ordinary `export` statements (`:167-177`); Windows sets only those same values
in inherited PowerShell (`:195-205`). None clears or scopes parent variables
such as `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, or other
connector tokens.

A freelancer who starts the desktop app from a shell or desktop session that
already has client A's token will pass that token into client B's connector.
Separate HOME/config folders do not prevent that bleed. Clear the child
environment to a documented allowlist, explicitly remove provider credential
variables on all platforms, and add a spawned-process claim test with sentinel
client-A secrets.

### P1 — Stored client context is not bound to the launched agent

The researched contract calls for the client brief, allowed sources, style
guide, connectors, and delivery trail to form one agent-session boundary.
`LaunchRequest` contains only workspace/source IDs and name, connector, and
folder (`src-tauri/src/lib.rs:20-27`). The frontend launch payload likewise
omits the saved brief, writing rule, redaction rules, and checked draft
(`src/main.ts:234-242`). The Rust launcher passes only CCF IDs and profile-path
variables (`src-tauri/src/lib.rs:76-101`).

The agent therefore opens with no stored brief or writing rule, and the text
that passed redaction checks is never the text delivered to it. All subsequent
agent prompts bypass the check. This leaves the user manually transferring the
context that the product is supposed to bind and breaks the smallest useful
end-to-end job. Provide a connector-supported, device-local context handoff
and make the checked content/session identity inseparable from launch.

### P1 — Delivery records can attest to a profile that does not exist

`runPreflight` checks only that the folder string is nonempty, then stores
“Each selected source has a scoped agent profile” and enables export
(`src/main.ts:203-221`). The profile is created and the folder is canonicalized
only after the later launch action (`src-tauri/src/lib.rs:218-238`). Launch can
fail because the folder does not exist, the connector is absent, or no terminal
exists, but the already-exported record remains passed.

The fresh live nonexistent-folder reproduction above proves the false record.
Create/validate the profile before recording success, require a successful
launch receipt for launch provenance, and export actual outcomes rather than a
pre-launch assertion.

## Required next verification

Repair the session boundary and provenance order first. Add a claim test that
launches a fake connector with sentinel parent credentials and proves only the
selected workspace credential/context reaches it. Add a failure-path test that
an absent folder or failed connector cannot produce a passed delivery record.
Then rerun all 13 claims, full builds, published installers, privacy requests,
rate limiting, accessibility, mobile, offline update, and deployment identity.
