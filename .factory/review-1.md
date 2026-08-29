# Adversarial first-read review 1 — FAIL

Date: 2026-08-29 UTC

Work order: `freelancer-agent-context-review-1`

Candidate: `9a74d496510d6fc6e52c8b5552a20ad082eb2253`

Live URL: <https://freelancer-agent-context.sociobot.in>

## Verdict

**FAIL.** The demo and all 14 declared claim tests pass, but this round is not
at zero findings. Eight reliance-worthy statements are absent from
`.factory/claims.json`. The landing page and README retain non-informative
headings, inconsistent security terms, and jargon. The deployed 404 omits the
standard skeleton and metadata, and Back navigation discards scroll position.

There are 8 blocking and 18 minor findings below. A PASS is unavailable while
any one remains.

## Cold first read

Fresh Chromium contexts opened `/` at 390×844 and 1440×900 before scrolling.

- **What it does:** keeps one client's work from entering another client's
  coding-agent session.
- **For whom:** freelance developers who switch clients.
- **What to click first:** **Try it with sample data**. The adjacent text says
  **See a checked client session next.**

This blocking gate passes. The exact first-screen text that supplied the
answers was:

> Keep client work from crossing over

> For freelance developers who switch clients without mixing sources,
> accounts, or writing style.

> Try it with sample data

At 390 px the action and all three facts are visible before the first image.

## Demo and sandbox

The one-click demo gate passes.

- The landing action opens `/demo` in one click.
- The first demo screen shows Northstar Coffee, Juniper Legal, a real client
  brief, writing rules, sources, local folders, and redaction terms.
- The persistent banner says **Demo — Sample data. Nothing is saved.** It has
  **Reset demo** and **Start for real**.
- Entering `Juniper Legal` and `NS_LIVE_KEY` produced three specific blocks.
  Replacing that text produced a sample session and export control.
- Changes appeared only in sessionStorage key `demo:workspace-state`; no
  localStorage key was written.
- **Reset demo** removed the key and restored the original delivery ledger.
- **Start for real** removed demo state, opened `/app`, and did not copy data
  to `ccf:workspace-state`.
- The complete live demo flow made only product-origin requests. A live
  offline reload returned 200 and restored **Check this client session** with
  **Offline · device local**.

## Declared claims

A clean remote clone resolved to the candidate SHA above. After `npm ci`, all
exact commands in `.factory/claims.json` were run. The four Rust commands first
reported the clean worker's missing GTK/WebKit libraries; after installing the
README-declared Tauri prerequisites, the same commands passed unchanged.

| Claim | Exact command | Result |
| --- | --- | --- |
| demo-isolation | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS — 1 test |
| boundary-check | `npm run test:e2e -- --grep @claim:boundary-check` | PASS — 1 test |
| scoped-launch | `cargo test --manifest-path src-tauri/Cargo.toml scoped_launch` | PASS — 2 tests |
| provenance-export | `npm run test:e2e -- --grep @claim:provenance-export` | PASS — 1 test |
| validated-provenance | `cargo test --manifest-path src-tauri/Cargo.toml failed_native_preflight_refuses_provenance_without_a_real_workspace_path` | PASS — 1 test |
| device-local | `npm run test:e2e -- --grep @claim:device-local` | PASS — 1 test |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — 1 test |
| offline-update | `npm run test:e2e -- --grep @claim:offline-update` | PASS — 1 test |
| plan-limit | `npm run test:e2e -- --grep @claim:plan-limit` | PASS — 1 test |
| free-core | `npm run test:e2e -- --grep @claim:free-core` | PASS — 1 test |
| paid-checkout | `npm run test:e2e -- --grep @claim:paid-checkout` | PASS — 1 test |
| encrypted-vault | `cargo test --manifest-path src-tauri/Cargo.toml encrypted_vault_round_trips_and_rejects_another_key` | PASS — 1 test |
| platform-install | `npm run test:unit -- --run -t @claim:platform-install` | PASS — 1 test |
| workspace-deletion | `cargo test --manifest-path src-tauri/Cargo.toml deleting_workspace_removes_its_connector_scope_and_credentials` | PASS — 1 test |

The declared matrix is green. F-1-1 through F-1-8 are statements outside it.

## Findings — blocking

### F-1-1 — “Set the boundary once” is an unlisted claim

**Location:** landing, How it works H2; `src/main.ts:68`.

“Once” promises one-time setup. No claim test proves later sessions reuse the
boundary without setup. The heading also does not name its section.

**Fix:** use **How the client check works**. If one-time setup is intended, add
a claim that closes and reopens the app and proves reuse.

### F-1-2 — “Current builds are unsigned” is an unlisted claim

**Location:** landing, Desktop app; `src/main.ts:70,96`.

Signing state changes what a visitor should expect from the OS. No claim checks
the published artifacts or the dynamic wording beside them.

**Fix:** add a release-artifact claim that inspects current macOS/Windows
artifacts and their shown signing state, or generate verified release wording.

### F-1-3 — “Sociobot is the merchant of record” is unlisted

**Location:** landing pricing; `src/main.ts:71`.

The checkout test proves a Dodo-hosted page and price, not the legal merchant
on the purchase agreement or receipt.

**Fix:** extend the paid claim to assert merchant identity, or remove the line.

### F-1-4 — “Manage refunds there” is unlisted and has no destination

**Location:** landing pricing; `src/main.ts:71`.

“There” has no linked antecedent, and no test exercises a refund route.

**Fix:** add a real **Request a refund from Sociobot** link and test that the
route resolves and states the process.

### F-1-5 — “Original generated art” is an unlisted provenance claim

**Location:** footer; `src/main.ts:40`.

The repo has provenance notes, but no claim entry ties shipped derivatives to
the source record.

**Fix:** link **Art provenance** to a plain page and test source records and
derivative hashes, or remove the public claim.

### F-1-6 — License routing is only half tested

**Location:** README, Plans:

> Checkout and license verification use the Sociobot billing API.

The paid claim checks checkout only, not license verification.

**Fix:** add a `license-verification` claim with a recorded Sociobot response
and request assertion, or say only **Checkout uses the Sociobot billing API.**

### F-1-7 — The “no embedded payment provider” claim is unlisted

**Location:** README, Plans:

> No product ID or payment provider is embedded in this repository.

No listed test scans source and production bundles for provider endpoints,
keys, or identifiers.

**Fix:** add a source/bundle scan claim with an allowlist, or remove the line.

### F-1-8 — The release workflow claim is unlisted

**Location:** README, Develop and verify:

> GitHub Actions builds macOS, Windows, and Linux assets from a v* tag.

The installer claim uses fixtures; it does not inspect the workflow or prove a
tag publishes all three platform families.

**Fix:** add a workflow/release-manifest claim, or rewrite this as a
non-promissory maintainer instruction.

## Findings — minor

### F-1-9 — Decorative label carries no information

**Quote/location:** `BOUNDARY / 01`, hero art; `src/main.ts:61`.

It is invented docket lore and adds no instruction or evidence.

**Fix:** delete it, or use **Two client folders kept separate**.

### F-1-10 — Preview heading is a mood line

**Quote/location:** `A boundary before the agent starts`; `src/main.ts:63`.

It does not name the preview when heard out of context.

**Fix:** **Preview a checked client session**.

### F-1-11 — Limits heading uses an unexplained metaphor

**Quote/location:** `A local launch boundary`; `src/main.ts:69`.

It does not say whether the section covers capability, limits, or privacy.

**Fix:** **What the app checks** or **What stays outside the app**.

### F-1-12 — Install heading names the wrong object

**Quote/location:** `Install your local workspace`; `src/main.ts:70`.

The visitor installs an app; a workspace is data created inside it.

**Fix:** **Install the desktop app**.

### F-1-13 — Pricing heading is a slogan

**Quote/location:** `More clients, same local boundary`; `src/main.ts:71`.

It hides the price and plan topic in a heading-list scan.

**Fix:** **Pro pricing**.

### F-1-14 — One security concept has six names

**Locations:** landing and README use `credential folder`, `isolated profile`,
`client profile`, `client-only profile`, `agent credentials and config`, and
`credential and config profile` for the same per-client state.

The visitor cannot tell whether these are separate protections. The design
voice specifies **profile**.

**Fix:** define **client profile** once as “a separate sign-in and settings
folder for one client,” then use it everywhere. For example: **The desktop app
opens each agent with a separate client profile.**

### F-1-15 — “device-local session file” is jargon

**Location:** README introduction.

**Fix:** **The app gives the launched agent the saved brief, writing rule,
redaction rules, and checked text from a temporary file on this device.**

### F-1-16 — “real workspace namespace” is jargon

**Location:** README demo.

**Fix:** **Demo changes last only in this tab and never change your real
workspaces.**

### F-1-17 — “off-origin” is web-platform jargon

**Location:** README privacy.

**Fix:** **The browser preview stores workspaces in this browser and sends no
workspace data to another site.**

### F-1-18 — Credential-clearing copy is abstract

**Quote/location:** `It clears inherited provider and API credential variables
before it starts a connector.`, README privacy.

**Fix:** **Before opening an agent, the app removes API keys inherited from its
parent process.**

### F-1-19 — “native profile and launch receipts” is jargon

**Location:** README privacy.

**Fix:** **The record names the client profile and confirms which agents
opened.**

### F-1-20 — “cached application shell” is jargon

**Location:** README privacy.

**Fix:** **After an update, the site replaces its old offline files.**

### F-1-21 — “SPA fallback” is unexplained jargon

**Location:** README deployment.

**Fix:** **The included hosting config keeps direct links working and adds
security headers.**

### F-1-22 — License button does not name the result

**Quote/location:** `Paste a license`; `src/main.ts:71`.

The action describes input, not the result.

**Fix:** **Restore Pro license**.

### F-1-23 — The deployed 404 drops the skeleton and metadata

**Location:** any unknown live URL; `public/404.html`.

The response correctly returns 404, but has no description, canonical, Open
Graph/Twitter data, theme color, or touch icon. Its header omits navigation;
its footer omits the one-liner, Param Factory link, and version/build ID.

**Fix:** give `404.html` the same metadata, header, and full footer as the app
routes while retaining the real 404 response.

### F-1-24 — The 404 H1 is a metaphor

**Quote/location:** `This page crossed the wrong boundary`;
`public/404.html:15`.

It does not name the error out of context.

**Fix:** **This page was not found**.

### F-1-25 — Back navigation loses scroll position

**Location:** `src/main.ts:343-360`.

After scrolling to 1,200 px, opening Demo, and pressing Back, the landing
returned at 0 px. Focus correctly moved to the H1, but `route()` calls
`window.scrollTo(0,0)` on `popstate` too.

**Fix:** reset scroll only for push navigation. Preserve history scroll on
Back/Forward, then focus the H1 without moving the viewport.

### F-1-26 — Workspace setup has no import/export path

The product exports delivery records but cannot back up, move, or restore a
workspace. A freelancer changing machines must re-enter the brief, writing
rule, sources, and redaction rules.

**Fix:** add **Export workspace** and **Import workspace** for local JSON. Omit
credentials, preview the import, and require reconfirmation of device-specific
folder paths. This is more useful here than adding AI; no runtime AI feature is
otherwise missing from this privacy-sensitive job.

## Landing-page copy audit

Counts treat hyphenated terms and paths as one word. Headings, labels, actions,
alt text, and navigation are included. No item exceeds 22 words or contains a
banned marketing adjective. `Flag` points to a finding above.

| Kind | Copy | Words | Flag |
| --- | --- | ---: | --- |
| mark | CF | 1 | — |
| wordmark | Client Context Firewall | 3 | — |
| nav | Demo | 1 | — |
| nav | Workspace | 1 | — |
| nav | Privacy | 1 | — |
| label | A local desktop boundary for freelancers | 6 | — |
| H1 | Keep client work from crossing over | 6 | — |
| sentence | For freelance developers who switch clients without mixing sources, accounts, or writing style. | 13 | — |
| action | Try it with sample data | 5 | — |
| sentence | See a checked client session next. | 6 | — |
| sentence | Browser workspaces stay on this device. | 6 | — |
| sentence | Works offline after your first visit. | 6 | — |
| sentence | Free for two workspaces. | 4 | — |
| sentence | Pro is $19 once. | 4 | — |
| label | BOUNDARY / 01 | 2 | F-1-9 |
| alt | Two paper client folders sit on opposite sides of an orange divider. | 12 | — |
| sentence | Separate briefs, source accounts, and rules before work begins. | 9 | — |
| label | Live product preview | 3 | — |
| H2 | A boundary before the agent starts | 6 | F-1-10 |
| sentence | The desktop app opens each agent with a separate credential folder for that client. | 14 | F-1-14 |
| aria-label | Northstar workspace with two allowed sources and three passed boundary checks | 11 | — |
| preview tab | NS | 1 | — |
| preview tab | JL | 1 | — |
| status | NORTHSTAR / SESSION READY | 3 | — |
| H3 | Sources in this session | 4 | — |
| label | Codex · northstar/reorder isolated profile | 4 | F-1-14 |
| label | Claude · Wholesale briefs isolated profile | 5 | F-1-14 |
| status | Client profile is separate | 4 | F-1-14 |
| status | No other client names found | 5 | — |
| status | Two redaction rules loaded | 4 | — |
| label | How it works | 3 | — |
| H2 | Set the boundary once | 4 | F-1-1 |
| step | 01 | 1 | — |
| H3 | Name the workspace | 3 | — |
| sentence | Add the brief and writing rules that belong to one client. | 11 | — |
| alt | The sample workspace lists two Northstar sources. | 7 | — |
| sentence | Start with the client brief and source folders. | 8 | — |
| step | 02 | 1 | — |
| H3 | Scope each connector | 3 | F-1-14 |
| sentence | Choose a local folder and agent for this client. | 9 | — |
| alt | A session is blocked after text checks fail. | 8 | — |
| sentence | Another client name or redaction term stops the session. | 9 | — |
| step | 03 | 1 | — |
| H3 | Launch and export | 3 | — |
| sentence | Open every selected agent in its client-only profile, then export the delivery record. | 13 | F-1-14 |
| alt | A clean session passes all boundary checks. | 7 | — |
| sentence | Validated launch receipts enable a verified delivery record. | 8 | F-1-14 |
| label | Clear limits | 2 | — |
| H2 | A local launch boundary | 4 | F-1-11 |
| sentence | The desktop app separates each client’s agent credentials and config. | 10 | F-1-14 |
| sentence | Your chosen agent may use its own online service. | 9 | — |
| sentence | The text check catches named clients and redaction terms before launch. | 11 | — |
| label | Desktop app | 2 | — |
| H2 | Install your local workspace | 4 | F-1-12 |
| sentence | Choose the package for your system when releases are published. | 10 | — |
| sentence | Current builds are unsigned. | 4 | F-1-2 |
| status | DETECTED · LINUX | 2 | — |
| action | Download for Linux | 3 | — |
| label | Client.Context.Firewall_0.1.4_amd64.AppImage · unsigned build | 5 | F-1-2 |
| instruction | One-step install: curl -fsSL https://freelancer-agent-context.sociobot.in/install.sh \| sh | 7 | — |
| sentence | For a direct AppImage download, run chmod +x Client.Context.Firewall_0.1.4_amd64.AppImage before opening it. | 14 | — |
| loading state | Checking the latest release… | 4 | — |
| conditional action | Download for macOS | 3 | — |
| conditional action | Download for Windows | 3 | — |
| conditional action | Download Apple silicon build | 4 | — |
| conditional action | Download Intel build | 3 | — |
| conditional sentence | Choose Apple silicon or Intel when both builds are listed. | 10 | — |
| fallback sentence | Downloads are being published. | 4 | — |
| fallback action | Open the release page | 4 | — |
| label | Pro license | 2 | — |
| H2 | More clients, same local boundary | 5 | F-1-13 |
| price | $19 once | 2 | — |
| sentence | Pro lets you create more than two workspaces. | 8 | — |
| sentence | Checks and delivery exports remain available on the free plan. | 10 | — |
| action | Buy Pro | 2 | — |
| action | Paste a license | 3 | F-1-22 |
| sentence | Sociobot is the merchant of record. | 6 | F-1-3 |
| sentence | Manage refunds there. | 3 | F-1-4 |
| link | Read purchase terms | 3 | — |
| sentence | Keep each client’s work in its own boundary. | 8 | — |
| link | Privacy | 1 | — |
| link | Terms | 1 | — |
| link | Built by Param Factory (external site) | 6 | — |
| label | v0.1.4 · Original generated art | 4 | F-1-5 |

## README copy audit

The README has 40 prose sentences, an 11.3-word average, and a 22-word
maximum. Command-block lines are commands, not sentences, and are not counted.

| Kind | Copy | Words | Flag |
| --- | --- | ---: | --- |
| H1 | Client Context Firewall | 3 | — |
| sentence | Keep each client’s sources, rules, and delivery record in one local workspace. | 12 | — |
| sentence | Client Context Firewall is for freelance developers who switch between client accounts while using coding agents. | 16 | — |
| sentence | The desktop app validates each local folder, then opens each agent with a separate credential and config profile for that client. | 21 | F-1-14 |
| sentence | It checks other client names and redaction terms before launch. | 10 | — |
| sentence | The launched agent receives the saved brief, writing rule, redaction rules, and the checked text from a device-local session file. | 20 | F-1-15 |
| H2 | Try the isolated demo | 4 | — |
| sentence | Open /demo or https://freelancer-agent-context.sociobot.in/demo. | 5 | — |
| sentence | It ships with Northstar Coffee and Juniper Legal sample workspaces. | 10 | — |
| sentence | Demo changes use session storage and never touch the real workspace namespace. | 12 | F-1-16 |
| sentence | Choose Reset demo at any time. | 6 | — |
| H2 | Privacy and limits | 3 | — |
| sentence | The desktop app encrypts its local workspace file with AES-256-GCM. | 10 | — |
| sentence | Its random key is stored in the operating system credential manager. | 11 | — |
| sentence | The browser preview stores workspaces locally and does not send workspace data off-origin. | 13 | F-1-17 |
| sentence | The desktop launcher supports Codex CLI, Claude Code, and Gemini CLI. | 11 | — |
| sentence | It clears inherited provider and API credential variables before it starts a connector. | 13 | F-1-18 |
| sentence | Choose a local project folder, then sign in inside that client’s isolated profile. | 13 | F-1-14 |
| sentence | Your chosen coding agent may use its own online service. | 10 | — |
| sentence | A real delivery record appears only after every selected connector opens from its validated local folder. | 16 | — |
| sentence | The record lists the native profile and launch receipts. | 9 | F-1-19 |
| sentence | Demo exports are marked sample data and never claim a local launch. | 12 | — |
| sentence | Deleting a desktop workspace removes its workspace records and the complete isolated connector credential and config profile for that client. | 20 | F-1-14 |
| sentence | The site works offline after the first visit. | 8 | — |
| sentence | A new release replaces the previous cached application shell. | 9 | F-1-20 |
| H2 | Plans | 1 | — |
| sentence | Free includes two client workspaces. | 5 | — |
| sentence | Checks and delivery exports remain available on the free plan. | 10 | — |
| sentence | Pro costs $19 once and allows more than two workspaces. | 10 | — |
| sentence | Checkout and license verification use the Sociobot billing API. | 9 | F-1-6 |
| sentence | No product ID or payment provider is embedded in this repository. | 11 | F-1-7 |
| H2 | Develop and verify | 3 | — |
| sentence | Requirements: Node 22 and, for desktop builds, the current Rust toolchain plus the Tauri 2 system dependencies. | 17 | — |
| sentence | npm run build produces the static site at dist/site/. | 9 | — |
| sentence | Run npm run tauri -- build for the desktop package on a supported host. | 13 | — |
| sentence | On Linux, install the Tauri 2 system packages, libsecret-1-dev, libfuse2, file, and rpm. | 13 | — |
| sentence | GitHub Actions builds macOS, Windows, and Linux assets from a v* tag. | 12 | F-1-8 |
| sentence | The landing page separates Intel and Apple silicon downloads. | 9 | — |
| sentence | On Linux, run curl -fsSL https://freelancer-agent-context.sociobot.in/install.sh \| sh to verify the AppImage and install it as client-context-firewall in your user binary directory. | 22 | — |
| sentence | A direct AppImage download needs chmod +x before use. | 9 | — |
| H2 | Routes | 1 | — |
| route | / — product site and downloads | 4 | — |
| route | /demo — isolated sample workspace | 4 | — |
| route | /app — browser workspace preview | 4 | — |
| route | /privacy and /terms — data and purchase terms | 7 | — |
| H2 | Deployment | 1 | — |
| sentence | Deploy dist/site/ as the static root. | 6 | — |
| sentence | The included Static Web Apps config adds SPA fallback and security headers. | 12 | F-1-21 |
| sentence | The factory owns DNS, billing registration, and release signing. | 9 | — |
| sentence | Licensed under the MIT License. | 5 | — |
| sentence | Built by Param Factory. | 4 | — |

## Structure, accessibility, and links

The normal routes `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200,
set `lang=en`, contain one H1 and one main, and use the expected title pattern.
Canonicals update on navigation. The landing has description, canonical, Open
Graph/Twitter image, favicon, touch icon, and theme color. The unknown route
returns a real 404; its failures are F-1-23 and F-1-24.

All visible landing links were crawled. Internal routes and Sociobot returned
200, the AppImage returned the expected GitHub 302, and checkout returned 303.
No dead link was found.

Fresh live Axe scans found zero serious/critical violations on all normal
routes in light and dark schemes at 390 px. No console or page error occurred.
Route changes and Back focus the new H1. Back scroll fails per F-1-25.

The dithered boundary-ledger art, clipped paper shapes, serif/condensed type,
hard rules, and red stamp color are product-specific. The asymmetric layout is
not a generic centered SaaS hero or three-card grid. Visual identity passes.

## Earlier-finding recheck

No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. The prior
handoff says PASS and lists unsigned packages as an operator action. For
completeness, every earlier verification finding was rechecked live and in
current code.

| Earlier finding | Current result | Evidence |
| --- | --- | --- |
| Paid checkout returned 404 | Fixed | Live endpoint returns 303; checkout claim passes. |
| Core connector boundary absent | Fixed | Scoped-launch tests clear credentials and bind context. |
| Stale service-worker shell | Fixed | `offline-update` passes; cache is versioned. |
| Claim coverage incomplete | **Not fully fixed** | F-1-1 through F-1-8 are current unlisted claims; this remains blocking. |
| Cold-load skip link bypassed | Fixed | Full suite confirms first Tab reaches the skip link. |
| Desktop build not reproducible | Fixed | Prior v0.1.4 packages and current clean gates pass with documented dependencies. |
| Mobile Lighthouse 86 | Fixed | Prior v0.1.4 run recorded 98; current JS is 12.28 KB gzip. |
| Workspace deletion left profiles | Fixed | Deletion claim passes; code invokes native scope deletion. |
| Deletion had no claim | Fixed | `workspace-deletion` is listed and passes. |
| Downloadable app was older | Fixed | Live download is repaired v0.1.4. |
| Save failures appeared successful | Fixed | Regression preserves the retryable dialog. |
| Dark contrast failures | Fixed | Fresh live light/dark Axe scans are clear. |
| Delivery export needed reload | Fixed | Ledger and export update immediately. |
| Wrong Mac build/Linux permissions | Fixed | Platform claim passes; live Linux link resolves. |
| License return verified twice | Fixed | Regression asserts one request. |
| Small targets/tab keyboard failure | Fixed | Suite checks 44 px and Arrow/Home/End behavior. |
| Unknown URLs returned 200 | Fixed | Unknown live URL returns 404. |
| Checkout/vault tests too narrow | Fixed | Price/one-time and credential-manager assertions pass. |
| Launcher inherited credentials | Fixed | Child-process regression removes provider sentinels. |
| Stored context was not bound | Fixed | Scoped launch proves checked context reaches the child. |
| False pre-launch provenance | Fixed | Missing-folder and browser no-export regressions pass. |

## Other verification

- `npm test`: PASS — 2 Vitest and 21 Playwright tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS — TypeScript, rustfmt, and Clippy with warnings denied.
- `npm run build`: PASS; `dist/site/` exists.
- Initial JS: 37.18 KB, 12.28 KB gzip; CSS: 16.84 KB, 4.46 KB gzip.
- No analytics, third-party fonts, or third-party scripts were observed.
- No decorative AI or embedded provider key exists.

## What would make this perfect

Resolve every finding: test, narrow, or remove all eight unlisted claims;
apply the exact plain-word rewrites; give the real 404 the complete metadata
and site skeleton; preserve Back/Forward scroll; and add safe workspace
import/export. Then rerun the entire cold-read, demo isolation, claim, copy,
route, link, accessibility, offline, history, and clean-build checklist. After
those items, the already-passing demo, declared behavior, visual identity,
accessibility, links, and build leave nothing else to do.
