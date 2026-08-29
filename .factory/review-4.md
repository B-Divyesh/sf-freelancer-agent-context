# Adversarial first-read review 4 — PASS

Date: 2026-08-29 UTC

Work order: `freelancer-agent-context-review-4`

Candidate: `cda0e4cc7701b2709974f2677697e5aa6ec97e00`

Live URL: <https://freelancer-agent-context.sociobot.in>

## Verdict

**PASS.** This review found zero blocking findings, zero minor findings, zero
untested claims, and zero regressions from Reviews 1–3. The deployed JavaScript
has the same SHA-256 hash as the clean candidate build. The cold first screen,
one-click demo, sandbox isolation, all 24 declared claim commands, routing,
links, accessibility checks, and quality gates pass.

## Cold first read

Fresh Chromium contexts opened `/` at 390×844 and 1440×900. Nothing was
scrolled before recording the first screen.

- **What it does:** keeps one client's work from entering another client's
  coding-agent session.
- **For whom:** freelance developers who switch clients while using coding
  agents.
- **What to click first:** **Try it with sample data**. The adjacent sentence
  says **See a checked client session next.**

The exact text supplying those answers was:

> Keep client work from crossing over

> For freelance developers who switch clients without mixing sources,
> accounts, or writing style.

> Try it with sample data

The three facts ended at y=742 of 844 on mobile and y=897 of 900 on desktop.
Both viewports had one H1, no horizontal overflow, and no console or page
error. Evidence:

- `.factory/qa-evidence/review-4/cold-mobile.png`
- `.factory/qa-evidence/review-4/cold-desktop.png`
- `.factory/qa-evidence/review-4/verify/verify.json`

## Copy audit

Counts are whitespace-delimited. Hyphenated terms, URLs, paths, and filenames
count as one word. Parenthetical accessible labels count as their visible
words. No sentence exceeds 22 words, no banned marketing adjective appears,
terminology is consistent, headings name their sections, and actions use
result-naming verbs. There are no copy findings.

### Landing page: every sentence

| Exact sentence | Words | Result |
| --- | ---: | --- |
| For freelance developers who switch clients without mixing sources, accounts, or writing style. | 13 | pass |
| See a checked client session next. | 6 | pass |
| Browser workspaces stay on this device. | 6 | `device-local` |
| Works offline after your first visit. | 6 | `offline-reload` |
| Free for two workspaces. | 4 | `plan-limit` |
| Pro is $19 once. | 4 | `paid-checkout` |
| Two paper client folders sit on opposite sides of an orange divider. | 12 | pass; image alt |
| Separate briefs, source accounts, and rules before work begins. | 9 | pass |
| The desktop app opens each agent with a separate client profile: one sign-in and settings folder for that client. | 19 | `scoped-launch` |
| Add the brief and writing rules that belong to one client. | 11 | pass |
| The sample workspace lists two Northstar sources. | 7 | pass; image alt |
| Start with the client brief and source folders. | 8 | pass |
| Choose a local folder and agent for this client. | 9 | pass |
| A session is blocked after text checks fail. | 8 | pass; image alt |
| Another client name or redaction term stops the session. | 9 | `boundary-check` |
| Open every selected agent in its client profile, then export the delivery record. | 13 | `scoped-launch`, `provenance-export` |
| A clean session passes all boundary checks. | 7 | pass; image alt |
| A delivery record appears after each selected agent confirms startup. | 10 | `validated-provenance` |
| The desktop app separates each client’s agent credentials and settings in a client profile. | 13 | `scoped-launch` |
| Your chosen agent may use its own online service. | 9 | pass; limitation |
| The text check catches named clients and redaction terms before launch. | 11 | `boundary-check` |
| Choose the package for your system when releases are published. | 10 | pass |
| For a direct AppImage download, run `chmod +x Client.Context.Firewall_0.1.10_amd64.AppImage` before opening it. | 12 | pass |
| Choose Apple silicon or Intel when both builds are listed. | 10 | `platform-install` |
| Downloads are being published. | 4 | pass; fallback state |
| Pro lets you create more than two workspaces. | 8 | `plan-limit` |
| Checks and delivery exports remain available on the free plan. | 10 | `free-core` |
| Checkout is handled by Sociobot. | 5 | `paid-checkout` |
| Keep each client’s work in its own workspace. | 8 | pass |

### Landing page: headings, labels, controls, and other text

| Kind | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| skip link | Skip to main content | 4 | pass |
| wordmark | Client Context Firewall | 3 | pass |
| nav | Demo | 1 | pass |
| nav | Workspace | 1 | pass |
| nav | Privacy | 1 | pass |
| label | A local desktop boundary for freelancers | 6 | pass |
| H1 | Keep client work from crossing over | 6 | pass |
| action | Try it with sample data | 5 | pass |
| art label | Two client folders kept separate | 5 | pass |
| label | Live product preview | 3 | pass |
| H2 | Preview a checked client session | 5 | pass |
| preview label | Northstar workspace with two allowed sources and three passed boundary checks | 11 | pass |
| status | Northstar / session ready | 3 | pass |
| H3 | Sources in this session | 4 | pass |
| source | Codex · northstar/reorder · client profile | 4 | pass |
| source | Claude · Wholesale briefs · client profile | 5 | pass |
| status | Client profile is separate | 4 | `scoped-launch` |
| status | No other client names found | 5 | `boundary-check` |
| status | Two redaction rules loaded | 4 | pass; sample state |
| label | How it works | 3 | pass |
| H2 | How the client check works | 5 | pass |
| H3 | Name the workspace | 3 | pass |
| H3 | Choose each source | 3 | pass |
| H3 | Launch and export | 3 | pass |
| label | Clear limits | 2 | pass |
| H2 | What the app checks | 4 | pass |
| label | Desktop app | 2 | pass |
| H2 | Install the desktop app | 4 | pass |
| status | Checking the latest release… | 4 | pass |
| status | Detected · Linux | 2 | pass |
| action | Download for Linux from GitHub (external site) | 7 | `platform-install` |
| action | Download for macOS from GitHub (external site) | 7 | `platform-install` |
| action | Download for Windows from GitHub (external site) | 7 | `platform-install` |
| action | Download Apple silicon build from GitHub (external site) | 8 | `platform-install` |
| action | Download Intel build from GitHub (external site) | 7 | `platform-install` |
| instruction | One-step install: `curl -fsSL https://freelancer-agent-context.sociobot.in/install.sh \| sh` | 7 | `platform-install` |
| action | Open the GitHub release page (external site) | 7 | pass; fallback action |
| label | Pro license | 2 | pass |
| H2 | Pro pricing | 2 | pass |
| price | $19 once | 2 | `paid-checkout` |
| action | Buy Pro on Sociobot (external site) | 6 | `paid-checkout` |
| action | Restore Pro license | 3 | `license-portability` |
| action | Request a refund from Sociobot | 5 | `refund-route` |
| action | Read purchase terms | 3 | pass |
| footer link | Terms | 1 | pass |
| footer link | Art provenance | 2 | `art-provenance` |
| external link | Built by Param Factory (external site) | 6 | pass |
| build | v0.1.10 | 1 | pass |

### README: every sentence

| Exact sentence | Words | Result |
| --- | ---: | --- |
| Keep each client’s sources, rules, and delivery record in one local workspace. | 12 | pass |
| Client Context Firewall is for freelance developers who switch clients while using coding agents. | 14 | pass |
| The desktop app validates each local folder, then opens each agent with a separate client profile. | 16 | `scoped-launch` |
| A client profile is one sign-in and settings folder for one client. | 12 | pass; definition |
| It checks other client names and redaction terms before launch. | 10 | `boundary-check` |
| Each checked context includes the saved brief, writing rule, redaction rules, and checked text. | 14 | `scoped-launch` |
| The app keeps it in the client profile until you delete that workspace. | 13 | `session-context-retention` |
| Open `?demo=1`, `/demo`, or `https://freelancer-agent-context.sociobot.in/?demo=1`. | 5 | pass; instruction |
| It ships with Northstar Coffee and Juniper Legal sample workspaces. | 10 | pass; observed demo fixture |
| Demo changes last only in this tab and never change your real workspaces. | 13 | `demo-isolation` |
| Choose **Reset demo** at any time. | 6 | pass; instruction |
| The desktop app uses AES-256-GCM authenticated encryption for its local workspace file. | 12 | `encrypted-vault` |
| The browser preview stores workspaces in this browser and sends no workspace data to another site. | 16 | `device-local` |
| The desktop launcher supports Codex CLI, Claude Code, and Gemini CLI. | 11 | `scoped-launch` |
| Before opening an agent, the app removes API keys inherited from its parent process. | 14 | `scoped-launch` |
| Choose a local project folder, then sign in inside that client profile. | 12 | pass; instruction |
| Your chosen coding agent may use its own online service. | 10 | pass; limitation |
| A real delivery record appears only after every selected agent confirms startup from its source’s saved local folder. | 18 | `validated-provenance` |
| The record names the client profile and confirms which agents started. | 11 | `validated-provenance` |
| A terminal wrapper that exits or an agent that ends before confirmation cannot create a delivery record. | 17 | `validated-provenance` |
| Demo exports are marked sample data and never claim a local launch. | 12 | `provenance-export` |
| Deleting a desktop workspace removes its workspace records and complete client profile. | 12 | `workspace-deletion` |
| Export a workspace backup to move it. | 7 | `workspace-backup` |
| Backups omit agent sign-ins, license data, and delivery records. | 9 | `workspace-backup` |
| Confirm local folder paths after import. | 6 | `workspace-backup` |
| The site works offline after the first visit. | 8 | `offline-reload` |
| After an update, the site replaces its old offline files. | 10 | `offline-update` |
| Free includes two client workspaces. | 5 | `plan-limit` |
| Checks and delivery exports remain available on the free plan. | 10 | `free-core` |
| Pro costs $19 once and allows more than two workspaces. | 10 | `paid-checkout`, `plan-limit` |
| Checkout is handled by Sociobot. | 5 | `paid-checkout` |
| Requirements: Node 22 and, for desktop builds, the current Rust toolchain plus the Tauri 2 system dependencies. | 17 | pass; maintainer requirement |
| Use `npm run build` to create the static site. | 9 | `site-build-output` |
| Run `npm run tauri -- build` for the desktop package on a supported host. | 14 | pass; maintainer instruction |
| On Linux, install the Tauri 2 system packages, `libgtk-3-dev`, `libsecret-1-dev`, `libfuse2`, `file`, and `rpm`. | 14 | pass; maintainer instruction |
| To publish desktop assets, push a `v*` tag through the included GitHub Actions workflow. | 14 | pass; maintainer instruction |
| The landing page separates Intel and Apple silicon downloads. | 9 | `platform-install` |
| On Linux, run `curl -fsSL https://freelancer-agent-context.sociobot.in/install.sh \| sh` to verify the AppImage and install it as `client-context-firewall` in your user binary directory. | 22 | `platform-install` |
| A direct AppImage download needs `chmod +x` before use. | 9 | pass; instruction |
| Deploy `dist/site/` as the static root. | 6 | pass; maintainer instruction |
| Hosting rules are in `public/staticwebapp.config.json`. | 5 | pass; maintainer pointer |
| The factory owns DNS, billing registration, and release signing. | 9 | pass; responsibility statement |
| Licensed under the MIT License. | 5 | confirmed by `LICENSE` |
| Built by Param Factory. | 4 | pass |

README headings are **Client Context Firewall** (3), **Try the isolated demo**
(4), **Privacy and limits** (3), **Plans** (1), **Develop and verify** (3),
**Routes** (1), and **Deployment** (1). Route fragments are **product site and
downloads** (4), **isolated sample workspace** (3), **browser workspace
preview** (3), and **data and purchase terms** (4). All name their content.

The terminology table is unchanged and consistent:

| Concept | Term |
| --- | --- |
| One client boundary | workspace |
| A permitted agent and folder | source |
| A coding-agent sign-in and settings folder | client profile |
| Text to remove or replace | rule |
| One checked period of work | session |
| Exported JSON evidence | delivery record |
| Paid plan | Pro |

## Demo and sandbox

The one-click demo gate passes.

- The landing action opens `/?demo=1` in one click.
- Its first screen already shows Northstar Coffee and Juniper Legal, a client
  brief, writing rule, two Northstar sources with local folders and agents,
  sign-in reminders, and two redaction terms.
- The persistent banner says **Demo — Sample data. Nothing is saved.** It has
  **Reset demo** and **Start for real**.
- Entering `Juniper Legal` and `NS_LIVE_KEY` produced three named blocks. A
  clean draft produced a sample-only session result.
- A pre-seeded `localStorage["ccf:sentinel"]` remained unchanged. The demo
  wrote only `sessionStorage["demo:workspace-state"]`; it wrote no demo key to
  local storage.
- **Reset demo** removed the session key and restored the empty delivery
  ledger. **Start for real** opened `/app` with an empty real workspace and
  copied no sample data.
- The complete live demo flow made no off-origin request. After the service
  worker was ready, an offline reload returned 200, restored the sample
  workspace, and showed **Offline · device local**.

Evidence: `.factory/qa-evidence/review-4/demo-initial-mobile.png` and
`.factory/demo.md`.

## Declared claims

A fresh clone at the candidate SHA was installed with `npm ci`. Every exact
command in `.factory/claims.json` was run independently. The disposable image
initially lacked the README-declared GTK/WebKit development packages, so the
five Cargo invocations stopped at dependency discovery before running a test.
After installing those documented system prerequisites, each same exact Cargo
command ran one test and passed. The final clean-clone matrix is 24/24 PASS.

| Claim | Exact command | Result |
| --- | --- | --- |
| demo-isolation | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS — 1 test |
| boundary-check | `npm run test:e2e -- --grep @claim:boundary-check` | PASS — 1 test |
| scoped-launch | `cargo test --manifest-path src-tauri/Cargo.toml tests::claim_scoped_launch -- --exact` | PASS — 1 test |
| session-context-retention | `cargo test --manifest-path src-tauri/Cargo.toml tests::claim_session_context_retention -- --exact` | PASS — 1 test |
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
| encrypted-vault | `cargo test --manifest-path src-tauri/Cargo.toml tests::claim_encrypted_vault_file -- --exact` | PASS — 1 test |
| platform-install | `npm run test:unit -- --run -t @claim:platform-install` | PASS — 1 test |
| workspace-deletion | `cargo test --manifest-path src-tauri/Cargo.toml tests::deleting_workspace_removes_its_connector_scope_and_credentials -- --exact` | PASS — 1 test |
| workspace-backup | `npm run test:e2e -- --grep @claim:workspace-backup` | PASS — 1 test |
| art-provenance | `npm run test:unit -- --run -t @claim:art-provenance` | PASS — 1 test |
| refund-route | `npm run test:unit -- --run -t @claim:refund-route` | PASS — 1 test |
| release-request-disclosure | `npm run test:e2e -- --grep @claim:release-request-disclosure` | PASS — 1 test |
| hosting-routes | `npm run test:e2e -- --grep @claim:hosting-routes` | PASS — 1 test |
| site-build-output | `npm run test:unit -- --run -t @claim:site-build-output` | PASS — 1 test |

The landing, README, Privacy, Terms, download state, demo banner, workspace
controls, and provenance page were cross-checked against this matrix. No
claim-like sentence lacks an entry, and no public sentence is broader than its
test.

## Earlier finding verification

Every earlier finding was checked again on the live site and in the candidate
code. The polish records were not accepted as proof.

| Earlier ID | Round 4 result | Live and code evidence |
| --- | --- | --- |
| F-1-1 | fixed | Landing H2 remains **How the client check works**; no one-time setup promise is present. |
| F-1-2 | fixed | Live download text names only the v0.1.10 asset; `unsigned` is absent from public source. |
| F-1-3 | fixed | Merchant-of-record copy remains absent. |
| F-1-4 | fixed | Landing and Terms expose the product-addressed Sociobot refund email; `refund-route` passes. |
| F-1-5 | fixed | `/art-provenance`, its source record, and shipped derivatives exist; `art-provenance` passes. |
| F-1-6 | fixed | `license-verification` proves the sole token-only GET. |
| F-1-7 | fixed | The unsupported embedded-provider assertion remains absent. |
| F-1-8 | fixed | README gives a maintainer instruction, not a release-output promise. |
| F-1-9 | fixed | Art label is **Two client folders kept separate**. |
| F-1-10 | fixed | H2 is **Preview a checked client session**. |
| F-1-11 | fixed | H2 is **What the app checks**. |
| F-1-12 | fixed | H2 is **Install the desktop app**. |
| F-1-13 | fixed | H2 is **Pro pricing**. |
| F-1-14 | fixed | **Client profile** is defined once and used consistently in public copy. |
| F-1-15 | fixed | Temporary-file jargon is absent; retention now has `session-context-retention`. |
| F-1-16 | fixed | Live demo uses only its session key and does not change real workspace storage. |
| F-1-17 | fixed | Public copy says “another site”; `off-origin` is absent. |
| F-1-18 | fixed | README directly states that inherited API keys are removed. |
| F-1-19 | fixed | Public copy names the client profile and agents that started. |
| F-1-20 | fixed | README uses plain offline-update wording; `offline-update` passes. |
| F-1-21 | fixed | `SPA fallback` is absent; direct routes and security headers pass. |
| F-1-22 | fixed | Action remains **Restore Pro license**. |
| F-1-23 | fixed | Unknown live URL returns a styled 404 with metadata, common header/footer, legal links, and build ID. |
| F-1-24 | fixed | 404 H1 remains **This page was not found**. |
| F-1-25 | fixed | Back restored y=4942 from y=4926 and focused/announced the landing H1. |
| F-1-26 | fixed | `/app` exposes workspace export/import; `workspace-backup` passes. |
| F-2-1 | fixed | Brief, landing, README, Terms, and hosted checkout agree on a $19 one-time purchase. |
| F-2-2 | fixed | `license-portability` passes in two fresh browser contexts. |
| F-2-3 | fixed | Revocation blocks only new Pro capacity and preserves existing tools; `revoked-license` passes. |
| F-2-4 | fixed | The delayed GitHub GET is disclosed and covered by `release-request-disclosure`. |
| F-2-5 | fixed | All sitemap routes, headers, and the real 404 pass `hosting-routes`. |
| F-2-6 | fixed | `site-build-output` produced the complete `dist/site/`. |
| F-2-7 | fixed | No README sentence exceeds 22 words. |
| F-2-8 | fixed | Landing says each selected agent confirms startup; launch-receipt jargon is absent. |
| F-2-9 | fixed | Heading remains **Choose each source**. |
| F-2-10 | fixed | Public copy consistently uses **source** and **agent**, not connector. |
| F-2-11 | fixed | Static 404 labels the Param Factory destination as external. |
| F-2-12 | fixed | `scoped-launch` selects one fully qualified exact Rust test. |
| F-3-1 | fixed | README and Privacy state retention until workspace deletion; the native retention test observes deletion. |
| F-3-2 | fixed | Backup claim and test seed and reject sign-ins, license data, and delivery records, then require path confirmation. |
| F-3-3 | fixed | Public claim is narrowed to the encrypted workspace file; the test writes ciphertext, proves no plaintext, decrypts, and rejects another key. |
| F-3-4 | fixed | Privacy H1 is **Privacy: what the app stores and sends**. |
| F-3-5 | fixed | Live download actions name GitHub and the purchase action names Sociobot, with accessible external-site labels. |

Review 2's repeated F-1-2 and F-1-6 instances are covered by their original
rows above and were independently rechecked in this round.

## Structure, accessibility, links, and build

| Check | Result |
| --- | --- |
| Titles | PASS: home uses **Product — what it does**; Demo, Workspace, Privacy, Terms, provenance, and 404 have route-specific titles under 60 characters. |
| H1 and outline | PASS: one H1 on every route; no heading-level skip. |
| Metadata | PASS: descriptions, canonicals, OG/Twitter text, 1200×630 product art, SVG favicon, touch icon, language, and theme color are present. |
| 404 | PASS: unknown URL returns HTTP 404 with the designed ledger style, common skeleton, metadata, and return action. |
| Deep links | PASS: `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/art-provenance` open directly in the correct state. |
| History and focus | PASS: push navigation focuses and announces the new H1; Back restores the prior scroll position without moving it to the H1. |
| Link crawl | PASS: all same-origin links return 200, the unknown route returns 404 by design, the v0.1.10 AppImage resolves to 200, Sociobot home returns 200, and checkout returns the expected 303. Mail links are explicitly addressed. |
| Header/footer | PASS: wordmark, three-link main nav, skip link, one-liner, Privacy, Terms, provenance, factory credit, and v0.1.10 are consistent. |
| Accessibility | PASS: Playwright Axe found zero serious/critical issues on all six routes and the 404. The factory URL verifier found one H1, `lang`, main, alt text, labeled controls, and zero console errors. Keyboard, reduced motion, 200% text, and 44 px mobile targets pass the suite. |
| Mobile | PASS at 390 px: no overflow; first-screen facts and demo controls are visible and operable. |
| Visual identity | PASS: asymmetric paper-ledger layout, vermilion divider, halftone texture, clipped sheets, docket controls, serif/narrow-sans pairing, and original folder art are product-specific rather than a generic SaaS template. |
| Privacy/offline | PASS: live demo made no off-origin request; offline reload restored the sample. The only landing external request is the disclosed delayed GitHub release GET. |
| Security/static files | PASS: CSP is delivered as a header with `frame-ancestors`; nosniff, referrer and permissions policies, robots, sitemap, service worker, installers, and 404 assets are present. |
| Build budget | PASS: 43.94 KB raw / 13.79 KB gzip main JS plus 2.44 KB raw / 0.98 KB gzip lazy core JS; below 200 KB and 150 KB limits. |

Aggregate clean-clone gates pass: `npm test` (6 Vitest and 28 Playwright),
`npm run typecheck`, `npm run lint`, `npm run build`, and native `cargo test`
(7 tests). The live and built main JavaScript both hash to
`472a164f1db1804bcc337826fee874fcebd4494c337a7bf4e5d2055339bccce5`.

## Missed leverage

No leverage finding is warranted. Workspace backup/import and delivery-record
export cover the obvious portability needs. Sync would weaken the stated
local-first boundary. The brief does not imply an AI transformation that
justifies sending client material to the Sociobot gateway. No decorative AI
control, provider key, or Azure endpoint is present.

## What would make this perfect

No product, copy, demo, claim, structure, accessibility, or leverage change
was identified. The product is at the owner's “actually nothing left to do”
standard for this review. Future releases should keep the 24-claim matrix,
cold 390 px check, live sandbox isolation check, route crawl, and prior-finding
regression audit as release gates.
