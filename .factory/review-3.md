# Adversarial first-read review 3 — FAIL

Date: 2026-08-29 UTC

Work order: `freelancer-agent-context-review-3`

Candidate: `884873ad910e0b988defa255e03ac2ca1b92c951`

Live URL: <https://freelancer-agent-context.sociobot.in>

## Verdict

**FAIL.** The cold first screen, one-click demo, sandbox isolation, declared
claim commands, route structure, accessibility checks, and build gates pass.
The product is not at zero findings. Two public data-lifecycle statements are
not represented by a claim test, one declared credential-manager claim is
tested only through a mock backend, the Privacy H1 is an absolute and unlisted
claim rather than a page heading, and two external actions do not identify
their destination.

There are three blocking and two minor findings. A PASS is unavailable while
any one remains.

## Cold first read

Fresh Chromium contexts opened `/` at 390×844 and 1440×900. Nothing was
scrolled before the first-screen record.

- **What it does:** keeps one client's work from entering another client's
  coding-agent session.
- **For whom:** freelance developers who switch clients while using coding
  agents.
- **What to click first:** **Try it with sample data**; the adjacent sentence
  says **See a checked client session next.**

The exact first-screen copy that supplied those answers was:

> Keep client work from crossing over

> For freelance developers who switch clients without mixing sources,
> accounts, or writing style.

> Try it with sample data

All three facts were visible without scrolling. The facts ended at y=742 of
844 on mobile and y=897 of 900 on desktop. Neither viewport overflowed
horizontally, and neither load produced an application console error. This
blocking gate passes.

## Demo and sandbox

The one-click demo gate passes.

- The primary action opens `/?demo=1` in one click.
- The first demo screen already shows Northstar Coffee and Juniper Legal,
  Northstar's brief and writing rule, two realistic source folders, agent
  choices, sign-in reminders, and two redaction terms.
- The persistent banner says **Demo — Sample data. Nothing is saved.** It has
  **Reset demo** and **Start for real**.
- Entering `Juniper Legal and NS_LIVE_KEY` produced three named blocks. A clean
  draft produced a sample-only session result.
- The successful sample check wrote only
  `sessionStorage["demo:workspace-state"]`. A pre-seeded
  `localStorage["ccf:sentinel"]` stayed unchanged, and no demo key entered
  local storage.
- **Reset demo** removed the session key and restored the empty delivery
  ledger. **Start for real** opened `/app` with an empty real workspace and did
  not copy sample data.
- The complete live demo flow made no off-origin request. After the service
  worker was ready, an offline reload returned the demo with **Offline · device
  local**.

## Findings — blocking

### F-3-1 — The “temporary file” claim is unlisted and does not match the implementation

**Exact quote/location:** README introduction:

> It uses a temporary file on this device.

The related live Privacy sentence says:

> The checked brief, writing rule, redaction rules, and draft are written
> inside that profile only for the prepared session.

No entry in `.factory/claims.json` promises or tests temporary deletion. In
`src-tauri/src/lib.rs`, `write_session_context` writes
`connector-scopes/<workspace>/<source>/sessions/<session>.json`; the launch
path returns that path and does not remove it. The file remains until the
whole workspace profile is deleted. A visitor can reasonably rely on
“temporary” and “only for the prepared session” as retention promises, but the
code implements longer retention.

**Concrete fix:** either delete each session context after the agent has read
it and add a claim test that observes deletion after both success and failure,
or say **The app saves the checked context in that client profile until you
delete the workspace.** Use the same retention wording in README and Privacy.

### F-3-2 — Backup exclusions are broader than the listed and tested claim

**Exact quote/location:** README, Privacy and limits:

> Backups omit agent sign-ins, license data, and delivery records.

The `workspace-backup` claim promises only that a backup omits agent sign-ins
and requires folder-path confirmation. Its Playwright test asserts only that
`workspace.sources[0].account` is absent, then checks the import confirmation.
It never seeds or asserts the absence of license data or delivery records.
Those two public privacy promises are therefore unlisted and untested even
though the implementation currently constructs the backup from a workspace
object.

**Concrete fix:** expand the `workspace-backup` claim text and sandbox to name
all three exclusions. Seed a license verdict and a delivery record, export the
backup, and assert that account/sign-in data, license values, and sessions or
delivery records are absent.

### F-3-3 — The credential-manager claim is tested only with an in-memory mock

**Exact quote/location:** `.factory/claims.json` `encrypted-vault`; README:

> Its random key is stored in the operating system credential manager.

The listed command passes, but
`encrypted_vault_round_trips_and_rejects_another_key` constructs
`keyring::mock::default_credential_builder()`. It never calls the production
`vault_key()` path or observes a key in an operating-system credential store.
The test proves AES-GCM round trips and the code's behavior against a mock; it
does not prove the public storage-location claim.

**Concrete fix:** add platform integration tests that call the production key
creation/load path against an isolated Secret Service/keychain/credential
manager in each release job. Assert that the vault file contains no plaintext
key and that a second process retrieves the same key. Narrow the public claim
if only adapter behavior can be tested.

## Findings — minor

### F-3-4 — The Privacy H1 is an absolute claim, not a page name

**Exact quote/location:** live `/privacy`; `src/main.ts` in `legal()`:

> Your client data stays under your control

Heard out of context, this does not identify the Privacy page. It is also
broader than the tested statements: the page itself says the selected coding
agent may use an online service and that license verification contacts
Sociobot. No claim entry defines or tests “under your control.”

**Concrete fix:** use **Privacy: what the app stores and sends**. This names the
page and avoids a new absolute promise.

### F-3-5 — External purchase and download actions do not name the destination

**Exact quote/location:** live landing download and pricing actions;
`src/main.ts` `loadDownload()` and `landing()`:

> Download for Linux

> Buy Pro

The first link leaves the product for a GitHub release asset. The second leaves
for a hosted Sociobot checkout. Neither link text nor an accessible suffix says
that it leaves the site, while the footer correctly labels its Sociobot link as
**(external site)**.

**Concrete fix:** use **Download for Linux from GitHub** and **Buy Pro on
Sociobot**, with equivalent wording for macOS, Windows, architecture choices,
and the release-page fallback.

## Landing-page copy audit

Counts are whitespace-delimited; hyphenated terms and paths count as one word.
No sentence exceeds 22 words and no banned marketing adjective appears.

| Exact sentence | Words | Result |
| --- | ---: | --- |
| For freelance developers who switch clients without mixing sources, accounts, or writing style. | 13 | pass |
| See a checked client session next. | 6 | pass |
| Browser workspaces stay on this device. | 6 | listed: `device-local` |
| Works offline after your first visit. | 6 | listed: `offline-reload` |
| Free for two workspaces. | 4 | listed: `plan-limit` |
| Pro is $19 once. | 4 | listed: `paid-checkout` |
| Two paper client folders sit on opposite sides of an orange divider. | 12 | pass; image alt |
| Separate briefs, source accounts, and rules before work begins. | 9 | pass |
| The desktop app opens each agent with a separate client profile: one sign-in and settings folder for that client. | 19 | listed: `scoped-launch` |
| Add the brief and writing rules that belong to one client. | 11 | pass |
| The sample workspace lists two Northstar sources. | 7 | pass; image alt |
| Start with the client brief and source folders. | 8 | pass |
| Choose a local folder and agent for this client. | 9 | pass |
| A session is blocked after text checks fail. | 8 | pass; image alt |
| Another client name or redaction term stops the session. | 9 | listed: `boundary-check` |
| Open every selected agent in its client profile, then export the delivery record. | 13 | listed: `scoped-launch`, `provenance-export` |
| A clean session passes all boundary checks. | 7 | pass; image alt |
| A delivery record appears after each selected agent confirms startup. | 10 | listed: `validated-provenance` |
| The desktop app separates each client’s agent credentials and settings in a client profile. | 14 | listed: `scoped-launch` |
| Your chosen agent may use its own online service. | 9 | pass; limitation |
| The text check catches named clients and redaction terms before launch. | 11 | listed: `boundary-check` |
| Choose the package for your system when releases are published. | 10 | pass |
| For a direct AppImage download, run `chmod +x Client.Context.Firewall_0.1.9_amd64.AppImage` before opening it. | 12 | pass |
| Choose Apple silicon or Intel when both builds are listed. | 10 | listed: `platform-install` |
| Downloads are being published. | 4 | pass; fallback |
| Pro lets you create more than two workspaces. | 8 | listed: `plan-limit` |
| Checks and delivery exports remain available on the free plan. | 10 | listed: `free-core` |
| Checkout is handled by Sociobot. | 5 | listed: `paid-checkout` |
| Keep each client’s work in its own workspace. | 8 | pass |

All landing headings name their section and are within the plain-words limits:
**Keep client work from crossing over** (6), **Preview a checked client
session** (5), **Sources in this session** (4), **How the client check works**
(5), **Name the workspace** (3), **Choose each source** (3), **Launch and
export** (3), **What the app checks** (4), **Install the desktop app** (4), and
**Pro pricing** (2). Actions are **Try it with sample data** (5), **Download
for Linux/macOS/Windows** (3), **Download Apple silicon build** (4), **Download
Intel build** (3), **Open the release page** (4), **Buy Pro** (2), **Restore Pro
license** (3), **Request a refund from Sociobot** (5), and **Read purchase
terms** (3). They name results; F-3-5 concerns their external destination.

## README copy audit

| Exact sentence | Words | Result |
| --- | ---: | --- |
| Keep each client’s sources, rules, and delivery record in one local workspace. | 12 | pass |
| Client Context Firewall is for freelance developers who switch clients while using coding agents. | 14 | pass |
| The desktop app validates each local folder, then opens each agent with a separate client profile. | 16 | listed: `scoped-launch` |
| A client profile is one sign-in and settings folder for one client. | 12 | pass; term definition |
| It checks other client names and redaction terms before launch. | 10 | listed: `boundary-check` |
| The app gives the launched agent the saved brief, writing rule, redaction rules, and checked text. | 16 | listed: `scoped-launch` |
| It uses a temporary file on this device. | 8 | **F-3-1** |
| Open `?demo=1`, `/demo`, or `https://freelancer-agent-context.sociobot.in/?demo=1`. | 5 | pass |
| It ships with Northstar Coffee and Juniper Legal sample workspaces. | 10 | pass |
| Demo changes last only in this tab and never change your real workspaces. | 13 | listed: `demo-isolation` |
| Choose **Reset demo** at any time. | 6 | pass |
| The desktop app encrypts its local workspace file with AES-256-GCM. | 10 | listed: `encrypted-vault`; see **F-3-3** |
| Its random key is stored in the operating system credential manager. | 11 | **F-3-3** |
| The browser preview stores workspaces in this browser and sends no workspace data to another site. | 16 | listed: `device-local` |
| The desktop launcher supports Codex CLI, Claude Code, and Gemini CLI. | 11 | listed: `scoped-launch` |
| Before opening an agent, the app removes API keys inherited from its parent process. | 14 | listed: `scoped-launch` |
| Choose a local project folder, then sign in inside that client profile. | 12 | pass; instruction |
| Your chosen coding agent may use its own online service. | 10 | pass; limitation |
| A real delivery record appears only after every selected agent confirms startup from its source’s saved local folder. | 18 | listed: `validated-provenance` |
| The record names the client profile and confirms which agents started. | 11 | listed: `validated-provenance` |
| A terminal wrapper that exits or an agent that ends before confirmation cannot create a delivery record. | 17 | listed: `validated-provenance` |
| Demo exports are marked sample data and never claim a local launch. | 12 | listed: `provenance-export` |
| Deleting a desktop workspace removes its workspace records and complete client profile. | 12 | listed: `workspace-deletion` |
| Export a workspace backup to move it. | 7 | listed: `workspace-backup` |
| Backups omit agent sign-ins, license data, and delivery records. | 9 | **F-3-2** |
| Confirm local folder paths after import. | 6 | listed: `workspace-backup` |
| The site works offline after the first visit. | 8 | listed: `offline-reload` |
| After an update, the site replaces its old offline files. | 10 | listed: `offline-update` |
| Free includes two client workspaces. | 5 | listed: `plan-limit` |
| Checks and delivery exports remain available on the free plan. | 10 | listed: `free-core` |
| Pro costs $19 once and allows more than two workspaces. | 10 | listed: `paid-checkout`, `plan-limit` |
| Checkout is handled by Sociobot. | 5 | listed: `paid-checkout` |
| Requirements: Node 22 and, for desktop builds, the current Rust toolchain plus the Tauri 2 system dependencies. | 17 | pass; maintainer requirement |
| Use `npm run build` to create the static site. | 9 | listed: `site-build-output` |
| Run `npm run tauri -- build` for the desktop package on a supported host. | 14 | pass; maintainer instruction |
| On Linux, install the Tauri 2 system packages, `libsecret-1-dev`, `libfuse2`, `file`, and `rpm`. | 13 | pass; maintainer instruction |
| To publish desktop assets, push a `v*` tag through the included GitHub Actions workflow. | 14 | pass; maintainer instruction |
| The landing page separates Intel and Apple silicon downloads. | 9 | listed: `platform-install` |
| On Linux, run `curl -fsSL https://freelancer-agent-context.sociobot.in/install.sh \| sh` to verify the AppImage and install it as `client-context-firewall` in your user binary directory. | 22 | listed: `platform-install` |
| A direct AppImage download needs `chmod +x` before use. | 9 | pass; instruction |
| Deploy `dist/site/` as the static root. | 6 | pass; maintainer instruction |
| Hosting rules are in `public/staticwebapp.config.json`. | 5 | pass; maintainer pointer |
| The factory owns DNS, billing registration, and release signing. | 9 | pass; responsibility statement |
| Licensed under the MIT License. | 5 | confirmed by `LICENSE` |
| Built by Param Factory. | 4 | pass |

No README sentence exceeds 22 words or uses a banned marketing adjective.
Headings are **Client Context Firewall** (3), **Try the isolated demo** (4),
**Privacy and limits** (3), **Plans** (1), **Develop and verify** (3),
**Routes** (1), and **Deployment** (1); each names its content. Route bullets
are plain fragments, not sentences. The terminology remains consistent:
workspace, source, rule, session, client profile, delivery record, and Pro.

## Declared claims

A fresh remote clone at the candidate SHA was installed with `npm ci`. The
four Rust commands initially stopped before running because the worker lacked
the README-declared GTK/WebKit development packages. After installing those
system prerequisites, the same commands passed unchanged. Every exact command
was run independently.

| Claim | Exact command | Result |
| --- | --- | --- |
| demo-isolation | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS — 1 test |
| boundary-check | `npm run test:e2e -- --grep @claim:boundary-check` | PASS — 1 test |
| scoped-launch | `cargo test --manifest-path src-tauri/Cargo.toml tests::claim_scoped_launch -- --exact` | PASS — 1 test |
| provenance-export | `npm run test:e2e -- --grep @claim:provenance-export` | PASS — 1 test |
| validated-provenance | `cargo test --manifest-path src-tauri/Cargo.toml tests::claim_validated_provenance_refuses_failed_launchers_and_connectors -- --exact` | PASS — 1 test |
| device-local | `npm run test:e2e -- --grep @claim:device-local` | PASS — 1 test |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — 1 test |
| offline-update | `npm run test:e2e -- --grep @claim:offline-update` | PASS — 1 test |
| plan-limit | `npm run test:e2e -- --grep @claim:plan-limit` | PASS — 1 test |
| free-core | `npm run test:e2e -- --grep @claim:free-core` | PASS — 1 test |
| paid-checkout | `npm run test:e2e -- --grep @claim:paid-checkout` | PASS — 1 test |
| license-verification | `npm run test:e2e -- --grep @claim:license-verification` | PASS — 1 test |
| license-portability | `npm run test:e2e -- --grep @claim:license-portability` | PASS — 1 test |
| revoked-license | `npm run test:e2e -- --grep @claim:revoked-license` | PASS — 1 test |
| encrypted-vault | `cargo test --manifest-path src-tauri/Cargo.toml tests::encrypted_vault_round_trips_and_rejects_another_key -- --exact` | PASS — 1 test; inadequate coverage in **F-3-3** |
| platform-install | `npm run test:unit -- --run -t @claim:platform-install` | PASS — 1 test |
| workspace-deletion | `cargo test --manifest-path src-tauri/Cargo.toml tests::deleting_workspace_removes_its_connector_scope_and_credentials -- --exact` | PASS — 1 test |
| workspace-backup | `npm run test:e2e -- --grep @claim:workspace-backup` | PASS — 1 test; README adds untested exclusions in **F-3-2** |
| art-provenance | `npm run test:unit -- --run -t @claim:art-provenance` | PASS — 1 test |
| refund-route | `npm run test:unit -- --run -t @claim:refund-route` | PASS — 1 test |
| release-request-disclosure | `npm run test:e2e -- --grep @claim:release-request-disclosure` | PASS — 1 test |
| hosting-routes | `npm run test:e2e -- --grep @claim:hosting-routes` | PASS — 1 test |
| site-build-output | `npm run test:unit -- --run -t @claim:site-build-output` | PASS — 1 test |

The command matrix is green. F-3-1 and F-3-2 are public claims outside it;
F-3-3 is not proved by its nominal test.

## Earlier finding verification

Every finding from Reviews 1 and 2 was rechecked on the live deployment and in
the current code, not accepted from the polish records.

| Earlier ID | Round 3 result | Live and code evidence |
| --- | --- | --- |
| F-1-1 | fixed | Landing H2 is **How the client check works**; the one-time promise is absent. |
| F-1-2 | fixed | Live v0.1.9 download labels name version and asset only; “unsigned build” is absent from source. |
| F-1-3 | fixed | Merchant-of-record copy is absent. |
| F-1-4 | fixed | Landing and Terms link an addressed, product-specific Sociobot refund email; `refund-route` passes. |
| F-1-5 | fixed | `/art-provenance`, the source record, and shipped derivatives exist; `art-provenance` passes. |
| F-1-6 | fixed | `license-verification` records and asserts the token-only request. |
| F-1-7 | fixed | The embedded-provider assertion remains absent. |
| F-1-8 | fixed | README states a maintainer instruction, not a platform-output promise. |
| F-1-9 | fixed | Art label is **Two client folders kept separate**. |
| F-1-10 | fixed | H2 is **Preview a checked client session**. |
| F-1-11 | fixed | H2 is **What the app checks**. |
| F-1-12 | fixed | H2 is **Install the desktop app**. |
| F-1-13 | fixed | H2 is **Pro pricing**. |
| F-1-14 | fixed | **Client profile** is defined once and used consistently. |
| F-1-15 | fixed | The old “device-local session file” wording is absent; F-3-1 separately covers the new retention claim. |
| F-1-16 | fixed | README says demo changes remain in the tab and do not change real workspaces; isolation passed live. |
| F-1-17 | fixed | “Off-origin” is absent from public copy. |
| F-1-18 | fixed | README plainly says inherited API keys are removed. |
| F-1-19 | fixed | README names the client profile and agents that started. |
| F-1-20 | fixed | README says an update replaces old offline files; `offline-update` passes. |
| F-1-21 | fixed | “SPA fallback” is absent; direct-route and header behavior pass. |
| F-1-22 | fixed | Action is **Restore Pro license**. |
| F-1-23 | fixed | Live unknown URL returns 404 with full metadata, common navigation/footer, legal links, and build ID. |
| F-1-24 | fixed | 404 H1 is **This page was not found**. |
| F-1-25 | fixed | From the visible footer, Back restored landing y=3337 from y=3341 and focused/announced the H1. |
| F-1-26 | fixed | Real workspace has export/import; `workspace-backup` passes for sign-in omission and path confirmation. |

| Review 2 ID | Round 3 result | Live and code evidence |
| --- | --- | --- |
| F-2-1 | fixed | Brief, landing, README, Terms, and hosted checkout agree on a $19 one-time purchase. |
| F-1-2 (repeated) | fixed | No static or release-populated label says “unsigned.” |
| F-1-6 (repeated) | fixed | Token-only verification has a dedicated passing claim test. |
| F-2-2 | fixed | `license-portability` passes in two fresh contexts. |
| F-2-3 | fixed | Revocation behavior is defined in Terms and passes `revoked-license`. |
| F-2-4 | fixed | GitHub release lookup is listed and its delayed GET passed. |
| F-2-5 | fixed | `hosting-routes` passed for every sitemap route, headers, and the real 404. |
| F-2-6 | fixed | `site-build-output` passed and `dist/site/` was produced. |
| F-2-7 | fixed | The former 23-word sentence is now two sentences of 16 and 8 words. |
| F-2-8 | fixed | Copy says each selected agent confirms startup. |
| F-2-9 | fixed | Heading is **Choose each source**. |
| F-2-10 | fixed | Public copy consistently uses **source** and **agent**, not connector. |
| F-2-11 | fixed | Static 404 identifies the Param Factory destination as external. |
| F-2-12 | fixed | `scoped-launch` selects one exact Rust test and ran one test. |

## Structure, accessibility, and links

| Check | Result |
| --- | --- |
| Titles | PASS: home uses **Product — what it does**; Demo, Workspace, Privacy, Terms, provenance, and 404 use route-specific titles. All are under 60 characters. |
| H1 and outline | PASS: one H1 on every live route and no heading-level skips. F-3-4 concerns the Privacy H1's wording. |
| Metadata | PASS: descriptions, canonicals, OG/Twitter text and 1200×630 image, SVG favicon, 180×180 touch icon, language, and theme color are present. |
| 404 | PASS: an unknown route returns HTTP 404 with the designed paper-ledger page, common skeleton, metadata, and return action. The browser's main-document 404 log is expected. |
| Deep links | PASS: `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/art-provenance` open directly with the correct state. |
| History and focus | PASS: push navigation focuses and announces the new H1; Back from a visible footer link restored y=3337 from y=3341 and focused the landing H1. |
| Link crawl | PASS for availability: every same-origin link and Sociobot home returned 200; the v0.1.9 AppImage resolved to 200; checkout redirected through Sociobot to a live Dodo page. F-3-5 covers disclosure. |
| Header/footer | PASS except F-3-5: common wordmark/nav, Privacy, Terms, provenance, factory credit, and v0.1.9 are present. |
| Accessibility | PASS: live Axe checks found zero serious/critical violations on all seven routes. The factory URL verifier found title, `lang`, one H1, main, alt text, named buttons, and zero application console errors. Keyboard, reduced-motion, 200% text, and 44 px checks pass in the suite. |
| Mobile | PASS at 390 px: the first screen and demo do not overflow; core controls remain visible and operable. |
| Visual identity | PASS: the asymmetric paper ledger, vermilion divider, halftone texture, square docket controls, serif/narrow-sans pairing, and generated folder artwork are specific to this product, not a generic SaaS template. |
| Requests/privacy | PASS for the tested browser scope: demo made only same-origin requests; real workspace behavior and the disclosed delayed GitHub request have passing tests. |
| Static assets | PASS: `robots.txt`, `sitemap.xml`, security headers, service worker, installers, and all listed routes are present. |
| Size/build | PASS: 46.10 KB JavaScript raw and 14.77 KB gzip; `npm run build` produced `dist/site/`. |

Aggregate clean-clone gates also pass: `npm test` (6 Vitest and 27
Playwright tests), `npm run typecheck`, `npm run lint`, and `npm run build`.

## Missed leverage

No additional feature finding is warranted. Workspace JSON export/import and
delivery-record export cover the obvious portability needs. Sync would weaken
the local-first boundary, and the brief does not imply an AI transformation
that justifies sending client material to the Sociobot gateway. No decorative
AI control, embedded provider credential, or Azure endpoint was found.

## What would make this perfect

Resolve the two retention/export claim gaps, prove the operating-system
credential-manager behavior without a mock, replace the Privacy H1 with a
section-naming heading, and identify GitHub/Sociobot on the external actions.
Then rerun the full claim matrix and this complete cold mobile/desktop review.
Nothing else identified in this round remains to do.
