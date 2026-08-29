# Adversarial first-read review 2 — FAIL

Date: 2026-08-29 UTC

Work order: `freelancer-agent-context-review-2`

Candidate: `0e7a5502a77af7ce6b983485c5c4df16df1690ac`

Live URL: <https://freelancer-agent-context.sociobot.in>

## Verdict

**FAIL.** The cold first screen, demo sandbox, accessibility checks, routing,
and all 17 declared claim commands pass. The product is still not at zero
findings. The live one-time price contradicts the source-of-truth brief, two
earlier unlisted claims remain live, and five more reliance-worthy statements
have no `claims.json` entry. Six copy/structure/test-traceability findings also
remain.

There are 8 blocking and 6 minor findings below. A PASS is unavailable while
any one remains.

## Cold first read

Fresh Chromium contexts opened `/` at 390×844 and 1440×900 without prior
storage. Nothing was scrolled before recording the first screen.

- **What it does:** keeps one client's work from entering another client's
  coding-agent session.
- **For whom:** freelance developers who switch between clients while using
  coding agents.
- **What to click first:** **Try it with sample data**. The adjacent line says
  **See a checked client session next.**

The exact copy supplying those answers was:

> Keep client work from crossing over

> For freelance developers who switch clients without mixing sources,
> accounts, or writing style.

> Try it with sample data

At 390 px, the H1, audience sentence, action, result sentence, and all three
facts ended at y=742 within the 844 px viewport. At 1440×900 they ended at
y=897. There was no horizontal overflow and no console error. This blocking
gate passes.

Evidence:

- `.factory/qa-evidence/review-2/cold-mobile.png`
- `.factory/qa-evidence/review-2/cold-desktop.png`
- `.factory/qa-evidence/review-2/live-audit.json`

## Demo and sandbox

The one-click demo gate passes.

- The landing action opens `/?demo=1` in one click.
- The first demo screen already shows Northstar Coffee and Juniper Legal,
  Northstar's brief and writing rule, two source folders, agent choices, and
  two redaction terms.
- The persistent banner says **Demo — Sample data. Nothing is saved.** It has
  **Reset demo** and **Start for real**.
- `Juniper Legal` plus `NS_LIVE_KEY` produced three specific blocks. A clean
  draft produced a sample delivery record.
- The successful sample check wrote only
  `sessionStorage["demo:workspace-state"]`. A pre-seeded
  `localStorage["ccf:sentinel"]` remained unchanged; no demo key entered local
  storage.
- **Reset demo** removed the session key and restored the original empty
  delivery ledger.
- **Start for real** opened `/app` with an empty real workspace, preserved the
  real sentinel, and copied no sample data.
- The complete demo flow made only same-origin requests. After first load, an
  offline reload restored **Check this client session** and showed
  **Offline · device local**.

Evidence:

- `.factory/qa-evidence/review-2/demo-initial-mobile.png`
- `.factory/qa-evidence/review-2/live-audit.json`
- `.factory/demo.md`

## Declared claims

A separate clean clone of the remote repository was checked out at the
candidate SHA. After `npm ci`, every exact command in
`.factory/claims.json` was run. The first Rust command initially stopped
before testing because the disposable image lacked the README-declared
GTK/WebKit libraries. After those build prerequisites were installed, all four
Rust commands passed unchanged.

| Claim | Exact command | Result |
| --- | --- | --- |
| demo-isolation | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS — 1 test |
| boundary-check | `npm run test:e2e -- --grep @claim:boundary-check` | PASS — 1 test |
| scoped-launch | `cargo test --manifest-path src-tauri/Cargo.toml scoped_launch` | PASS — 2 tests; see F-2-12 |
| provenance-export | `npm run test:e2e -- --grep @claim:provenance-export` | PASS — 1 test |
| validated-provenance | `cargo test --manifest-path src-tauri/Cargo.toml failed_native_preflight_refuses_provenance_without_a_real_workspace_path` | PASS — 1 test |
| device-local | `npm run test:e2e -- --grep @claim:device-local` | PASS — 1 test |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — 1 test |
| offline-update | `npm run test:e2e -- --grep @claim:offline-update` | PASS — 1 test |
| plan-limit | `npm run test:e2e -- --grep @claim:plan-limit` | PASS — 1 test |
| free-core | `npm run test:e2e -- --grep @claim:free-core` | PASS — 1 test |
| paid-checkout | `npm run test:e2e -- --grep @claim:paid-checkout` | PASS — 1 test; live checkout says $19.00 and one-time |
| encrypted-vault | `cargo test --manifest-path src-tauri/Cargo.toml encrypted_vault_round_trips_and_rejects_another_key` | PASS — 1 test |
| platform-install | `npm run test:unit -- --run -t @claim:platform-install` | PASS — 1 test |
| workspace-deletion | `cargo test --manifest-path src-tauri/Cargo.toml deleting_workspace_removes_its_connector_scope_and_credentials` | PASS — 1 test |
| workspace-backup | `npm run test:e2e -- --grep @claim:workspace-backup` | PASS — 1 test |
| art-provenance | `npm run test:unit -- --run -t @claim:art-provenance` | PASS — 1 test |
| refund-route | `npm run test:unit -- --run -t @claim:refund-route` | PASS — 1 test |

The declared tests are green. F-1-2, F-1-6, and F-2-2 through F-2-6 are
statements outside that matrix.

## Findings — blocking

### F-2-1 — The sold price contradicts the source-of-truth brief

**Exact quote/location:** landing and README: **“Pro is $19 once.”** Terms:
**“Pro costs $19 once.”** The live hosted checkout says **“$19.00”** and
**“One-time Pro license.”** In contrast, `.factory/brief.json:6` says:
`"monetization": "subscription — $19/month"`.

The tests prove the implementation is one-time; they do not resolve the
contract contradiction. A buyer and the factory have different billing terms
for the same product.

**Concrete fix:** implement the brief's $19/month subscription through the
Sociobot billing API and update `paid-checkout` to assert recurring billing.
If one-time pricing is the intended business decision, first amend the brief
through the owner's approved process, then keep the current copy and test.

### F-1-2 — “unsigned build” remains an unlisted live claim

**Exact quote/location:** live landing download panel after release metadata
loads: `Client.Context.Firewall_0.1.5_amd64.AppImage · unsigned build`;
`src/main.ts:107`.

Review 1 required release-backed signing-state verification or removal. The
polish record says the copy was removed, but only the sentence “Current builds
are unsigned” disappeared. The dynamic asset label still makes the same
release-state claim. No claim inspects the current published artifacts'
signing state.

**Concrete fix:** remove **unsigned build** from every dynamic asset label, or
add a release-artifact claim that fetches each displayed artifact and verifies
the exact signing state before the page labels it.

### F-1-6 — The untested license-verification data claim remains live

**Exact quote/location:** `/privacy`; `src/main.ts:358`:

> License verification sends only your license token to Sociobot.

Review 1 identified this behavior as only half tested. The README sentence was
removed, but the same reliance-worthy privacy claim remains on the live
Privacy page. The paid-checkout claim does not exercise `/verify` or inspect
its request payload.

**Concrete fix:** add a `license-verification` claim that invokes a recorded
verification response and asserts the request sends only the token to
`api.sociobot.in`, or remove the sentence from Privacy.

### F-2-2 — Cross-device license restore is an unlisted claim

**Exact quote/location:** `/terms`; `src/main.ts:358`:

> You may restore a valid license on another device.

The untagged “license return verifies its token only once” test uses one
browser and a mocked invalid response. It does not prove another-device
restore.

**Concrete fix:** add a `license-portability` claim using two fresh browser
contexts and a recorded valid Sociobot response, then assert that Pro activates
in the second context; otherwise remove the sentence.

### F-2-3 — Refund/revocation enforcement is an unlisted claim

**Exact quote/location:** `/terms`; `src/main.ts:358`:

> A refunded or revoked license stops Pro features.

No listed test returns a refunded or revoked license verdict and confirms that
the third-workspace Pro capability is removed while free data remains.

**Concrete fix:** add a `revoked-license` claim with recorded revoked and
refunded responses, then assert Pro is disabled and existing free workspaces
remain accessible; otherwise remove the sentence.

### F-2-4 — The disclosed GitHub request is absent from the claim matrix

**Exact quote/location:** `/privacy`; `src/main.ts:358`:

> The landing page asks GitHub for public release details.

An untagged local test observes the request delay, and this review observed the
live request, but `claims.json` has no entry for this network disclosure.
Privacy statements must remain test-mapped as the implementation changes.

**Concrete fix:** add a `release-request-disclosure` entry mapped to the
existing test after renaming it `@claim:release-request-disclosure`. Assert
that GitHub is the only off-origin landing request and that it contains no
workspace data.

### F-2-5 — The hosting behavior statement is an unlisted README claim

**Exact quote/location:** `README.md:81-82`:

> The included hosting config keeps direct links working and adds security headers.

The statement promises two deployment outcomes. Route checks exist elsewhere,
but no claim entry builds the site, serves the hosting configuration, opens
each deep link, and asserts the named response headers.

**Concrete fix:** add a `hosting-routes` claim that verifies every sitemap
route and the CSP, `X-Content-Type-Options`, and `Referrer-Policy` headers
against a production-equivalent server; otherwise rewrite this as a limited
file-location note without promising behavior.

### F-2-6 — The build-output statement is an unlisted README claim

**Exact quote/location:** `README.md:63`:

> `npm run build` produces the static site at `dist/site/`.

The command passed in this review, but it remains a reliance-worthy statement
without a `claims.json` entry. A passing manual check is not durable claim
coverage.

**Concrete fix:** add a `site-build-output` claim that runs the build from a
clean checkout and asserts `dist/site/index.html` plus the required public
assets, or change the sentence to an explicitly non-promissory maintainer note
and cover the output under a documented quality gate.

## Findings — minor

### F-2-7 — One README sentence exceeds the 22-word hard cap

**Exact quote/location:** `README.md:9-10`, 23 words:

> The app gives the launched agent the saved brief, writing rule, redaction rules, and checked text from a temporary file on this device.

The sentence combines what is passed with how it is passed.

**Concrete rewrite:** **“The app gives the launched agent the saved brief,
writing rule, redaction rules, and checked text. It uses a temporary file on
this device.”**

### F-2-8 — “Validated launch receipts” is unexplained jargon

**Exact quote/location:** landing step-three caption; `src/main.ts:79`:

> Validated launch receipts enable a verified delivery record.

A first-time freelancer cannot distinguish a launch receipt from the delivery
record. The sentence describes implementation evidence instead of the visible
rule.

**Concrete rewrite:** **“A delivery record appears after every selected agent
opens.”**

### F-2-9 — “Scope each source” uses specialist jargon as a heading

**Exact quote/location:** landing step-two H3; `src/main.ts:79`:

> Scope each source

“Scope” does not say what the visitor does; the paragraph below says “Choose.”

**Concrete rewrite:** **“Choose each source.”**

### F-2-10 — README switches from “source” and “agent” to “connector”

**Exact quote/location:** `README.md:31-32`:

> A real delivery record appears only after every selected connector opens from its validated local folder.

The UI selects **sources** and opens coding **agents**. “Connector” is not
defined in the README and breaks the product's stated terminology.

**Concrete rewrite:** **“A real delivery record appears only after every
selected agent opens from its source’s saved local folder.”**

### F-2-11 — The static 404 does not identify its external footer link

**Exact quote/location:** live unknown route and `public/404.html:31`:
**“Built by Param Factory”** links to `https://sociobot.in`. Dynamic routes
append screen-reader text **“(external site)”**; the static 404 does not.

The standard skeleton requires external links to say they are external, and
the supposedly shared footer is inconsistent on this route.

**Concrete fix:** add the same visually hidden **“(external site)”** text used
by `src/main.ts:40` to `public/404.html`.

### F-2-12 — One claim selector runs two tests instead of one traceable test

**Exact location:** `claims.json` entry `scoped-launch`; command
`cargo test --manifest-path src-tauri/Cargo.toml scoped_launch`.

The command runs both
`scoped_launch_separates_connector_credentials` and
`scoped_launch_clears_parent_provider_credentials_and_binds_checked_context`.
Both pass, but the claims contract requires exactly one test mapped to each
claim. A substring selector can silently include future tests.

**Concrete fix:** combine the assertions into one
`claim_scoped_launch` test and select that exact name, or split the public
claim and `claims.json` entry into two independently named claims.

## Landing-page copy audit

Counts use whitespace-delimited words, treat hyphenated terms and paths as one
word, and omit punctuation-only marks. Non-sentence headings, controls,
status labels, navigation, and alt text are included so every landing string
is accounted for. No landing sentence exceeds 22 words and no banned
marketing adjective appears.

| Kind | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| mark | CF | 1 | pass |
| wordmark | Client Context Firewall | 3 | pass |
| nav | Demo | 1 | pass |
| nav | Workspace | 1 | pass |
| nav | Privacy | 1 | pass |
| label | A local desktop boundary for freelancers | 6 | pass |
| H1 | Keep client work from crossing over | 6 | pass |
| sentence | For freelance developers who switch clients without mixing sources, accounts, or writing style. | 13 | pass |
| action | Try it with sample data | 5 | pass |
| sentence | See a checked client session next. | 6 | pass |
| sentence | Browser workspaces stay on this device. | 6 | listed: device-local |
| sentence | Works offline after your first visit. | 6 | listed: offline-reload |
| sentence | Free for two workspaces. | 4 | listed: plan-limit |
| sentence | Pro is $19 once. | 4 | F-2-1 |
| art label | Two client folders kept separate | 5 | pass |
| image alt | Two paper client folders sit on opposite sides of an orange divider. | 12 | pass |
| sentence | Separate briefs, source accounts, and rules before work begins. | 9 | pass |
| label | Live product preview | 3 | pass |
| H2 | Preview a checked client session | 5 | pass |
| sentence | The desktop app opens each agent with a separate client profile: one sign-in and settings folder for that client. | 19 | listed: scoped-launch |
| preview aria-label | Northstar workspace with two allowed sources and three passed boundary checks | 11 | pass |
| tabs | NS / JL | 2 | pass |
| status | Northstar / session ready | 3 | pass |
| H3 | Sources in this session | 4 | pass |
| source | Codex · northstar/reorder · client profile | 4 | pass |
| source | Claude · Wholesale briefs · client profile | 5 | pass |
| status | Client profile is separate | 4 | listed: scoped-launch |
| status | No other client names found | 5 | listed: boundary-check |
| status | Two redaction rules loaded | 4 | pass |
| label | How it works | 3 | pass |
| H2 | How the client check works | 5 | pass |
| H3 | Name the workspace | 3 | pass |
| sentence | Add the brief and writing rules that belong to one client. | 11 | pass |
| image alt | The sample workspace lists two Northstar sources. | 7 | pass |
| sentence | Start with the client brief and source folders. | 8 | pass |
| H3 | Scope each source | 3 | F-2-9 |
| sentence | Choose a local folder and agent for this client. | 9 | pass |
| image alt | A session is blocked after text checks fail. | 8 | pass |
| sentence | Another client name or redaction term stops the session. | 9 | listed: boundary-check |
| H3 | Launch and export | 3 | pass |
| sentence | Open every selected agent in its client profile, then export the delivery record. | 13 | listed: scoped-launch/provenance-export |
| image alt | A clean session passes all boundary checks. | 7 | pass |
| sentence | Validated launch receipts enable a verified delivery record. | 8 | F-2-8 |
| label | Clear limits | 2 | pass |
| H2 | What the app checks | 4 | pass |
| sentence | The desktop app separates each client’s agent credentials and settings in a client profile. | 13 | listed: scoped-launch |
| sentence | Your chosen agent may use its own online service. | 9 | pass; limitation |
| sentence | The text check catches named clients and redaction terms before launch. | 11 | listed: boundary-check |
| label | Desktop app | 2 | pass |
| H2 | Install the desktop app | 4 | pass |
| sentence | Choose the package for your system when releases are published. | 10 | pass |
| loading state | Checking the latest release… | 4 | pass |
| status | Detected · Linux | 2 | pass |
| action | Download for Linux | 3 | pass |
| asset label | Client.Context.Firewall_0.1.5_amd64.AppImage · unsigned build | 4 | F-1-2 |
| instruction | One-step install: curl -fsSL https://freelancer-agent-context.sociobot.in/install.sh \| sh | 7 | listed: platform-install |
| sentence | For a direct AppImage download, run chmod +x Client.Context.Firewall_0.1.5_amd64.AppImage before opening it. | 14 | pass |
| conditional action | Download for macOS | 3 | pass |
| conditional action | Download for Windows | 3 | pass |
| conditional action | Download Apple silicon build | 4 | pass |
| conditional action | Download Intel build | 3 | pass |
| conditional sentence | Choose Apple silicon or Intel when both builds are listed. | 10 | listed: platform-install |
| fallback sentence | Downloads are being published. | 4 | pass |
| fallback action | Open the release page | 4 | pass |
| label | Pro license | 2 | pass |
| H2 | Pro pricing | 2 | pass |
| price | $19 once | 2 | F-2-1 |
| sentence | Pro lets you create more than two workspaces. | 8 | listed: plan-limit |
| sentence | Checks and delivery exports remain available on the free plan. | 10 | listed: free-core |
| action | Buy Pro | 2 | listed: paid-checkout |
| action | Restore Pro license | 3 | F-2-2 |
| sentence | Checkout is handled by Sociobot. | 5 | listed: paid-checkout |
| action | Request a refund from Sociobot | 5 | listed: refund-route |
| action | Read purchase terms | 3 | pass |
| sentence | Keep each client’s work in its own workspace. | 8 | pass |
| footer link | Privacy | 1 | pass |
| footer link | Terms | 1 | pass |
| footer link | Art provenance | 2 | listed: art-provenance |
| footer link | Built by Param Factory (external site) | 6 | pass |
| build label | v0.1.5 | 1 | pass |

## README copy audit

| Exact sentence | Words | Result |
| --- | ---: | --- |
| Keep each client’s sources, rules, and delivery record in one local workspace. | 12 | pass |
| Client Context Firewall is for freelance developers who switch clients while using coding agents. | 14 | pass |
| The desktop app validates each local folder, then opens each agent with a separate client profile. | 16 | listed: scoped-launch |
| A client profile is one sign-in and settings folder for one client. | 12 | pass; term definition |
| It checks other client names and redaction terms before launch. | 10 | listed: boundary-check |
| The app gives the launched agent the saved brief, writing rule, redaction rules, and checked text from a temporary file on this device. | 23 | F-2-7 |
| Open `?demo=1`, `/demo`, or `https://freelancer-agent-context.sociobot.in/?demo=1`. | 5 | pass |
| It ships with Northstar Coffee and Juniper Legal sample workspaces. | 10 | pass |
| Demo changes last only in this tab and never change your real workspaces. | 13 | listed: demo-isolation |
| Choose **Reset demo** at any time. | 6 | pass |
| The desktop app encrypts its local workspace file with AES-256-GCM. | 10 | listed: encrypted-vault |
| Its random key is stored in the operating system credential manager. | 11 | listed: encrypted-vault |
| The browser preview stores workspaces in this browser and sends no workspace data to another site. | 16 | listed: device-local |
| The desktop launcher supports Codex CLI, Claude Code, and Gemini CLI. | 11 | listed: scoped-launch |
| Before opening an agent, the app removes API keys inherited from its parent process. | 14 | listed: scoped-launch |
| Choose a local project folder, then sign in inside that client profile. | 12 | pass |
| Your chosen coding agent may use its own online service. | 10 | pass; limitation |
| A real delivery record appears only after every selected connector opens from its validated local folder. | 16 | F-2-10 |
| The record names the client profile and confirms which agents opened. | 11 | listed: validated-provenance |
| Demo exports are marked sample data and never claim a local launch. | 12 | listed: provenance-export |
| Deleting a desktop workspace removes its workspace records and complete client profile. | 12 | listed: workspace-deletion |
| Export a workspace backup to move it. | 7 | listed: workspace-backup |
| Backups omit agent sign-ins, license data, and delivery records. | 9 | listed: workspace-backup |
| Confirm local folder paths after import. | 6 | listed: workspace-backup |
| The site works offline after the first visit. | 8 | listed: offline-reload |
| After an update, the site replaces its old offline files. | 10 | listed: offline-update |
| Free includes two client workspaces. | 5 | listed: plan-limit |
| Checks and delivery exports remain available on the free plan. | 10 | listed: free-core |
| Pro costs $19 once and allows more than two workspaces. | 10 | F-2-1; listed behavior conflicts with brief |
| Checkout is handled by Sociobot. | 5 | listed: paid-checkout |
| Requirements: Node 22 and, for desktop builds, the current Rust toolchain plus the Tauri 2 system dependencies. | 17 | pass |
| `npm run build` produces the static site at `dist/site/`. | 9 | F-2-6 |
| Run `npm run tauri -- build` for the desktop package on a supported host. | 14 | pass; maintainer instruction |
| On Linux, install the Tauri 2 system packages, `libsecret-1-dev`, `libfuse2`, `file`, and `rpm`. | 13 | pass |
| To publish desktop assets, push a `v*` tag through the included GitHub Actions workflow. | 14 | pass; maintainer instruction |
| The landing page separates Intel and Apple silicon downloads. | 9 | listed: platform-install |
| On Linux, run `curl -fsSL https://freelancer-agent-context.sociobot.in/install.sh \| sh` to verify the AppImage and install it as `client-context-firewall` in your user binary directory. | 22 | listed: platform-install |
| A direct AppImage download needs `chmod +x` before use. | 9 | pass |
| Deploy `dist/site/` as the static root. | 6 | pass; instruction |
| The included hosting config keeps direct links working and adds security headers. | 12 | F-2-5 |
| The factory owns DNS, billing registration, and release signing. | 9 | pass; responsibility statement |
| Licensed under the MIT License. | 5 | confirmed by `LICENSE` |
| Built by Param Factory. | 4 | pass |

README headings and route fragments are also plain and within the cap:
**Client Context Firewall** (3), **Try the isolated demo** (4),
**Privacy and limits** (3), **Plans** (1), **Develop and verify** (3),
**Routes** (1), **Deployment** (1), **product site and downloads** (4),
**isolated sample workspace** (3), **browser workspace preview** (3), and
**data and purchase terms** (4).

## Earlier finding verification

Every Review 1 finding was checked against the live site and source at the
candidate SHA.

| Earlier ID | Result in round 2 | Live and code evidence |
| --- | --- | --- |
| F-1-1 | fixed | H2 is **How the client check works**; “once” is absent. |
| F-1-2 | **BLOCKING: half-fixed** | The sentence was removed, but the live dynamic asset label still says **unsigned build** at `src/main.ts:107`. |
| F-1-3 | fixed | Merchant-of-record copy is absent; pricing says checkout is handled by Sociobot. |
| F-1-4 | fixed | Product-specific refund mail link exists on landing and Terms; `refund-route` passes. |
| F-1-5 | fixed | Footer links `/art-provenance`; route and source record exist; `art-provenance` passes. |
| F-1-6 | **BLOCKING: half-fixed** | README wording was removed, but Privacy still says verification sends only the token; no claim covers it. |
| F-1-7 | fixed | The “no embedded payment provider” sentence is absent. |
| F-1-8 | fixed | README now gives a maintainer instruction rather than promising three release families. |
| F-1-9 | fixed | Art label is **Two client folders kept separate**. |
| F-1-10 | fixed | H2 is **Preview a checked client session**. |
| F-1-11 | fixed | H2 is **What the app checks**. |
| F-1-12 | fixed | H2 is **Install the desktop app**. |
| F-1-13 | fixed | H2 is **Pro pricing**. |
| F-1-14 | fixed | Security state is defined and consistently called **client profile**. |
| F-1-15 | fixed | README now explains the temporary file; its length issue is separately F-2-7. |
| F-1-16 | fixed | README says demo changes stay only in the tab and never change real workspaces. |
| F-1-17 | fixed | “Off-origin” is absent from public copy. |
| F-1-18 | fixed | README says the app removes inherited API keys before opening an agent. |
| F-1-19 | fixed | README explains that the record names the profile and opened agents. |
| F-1-20 | fixed | README says an update replaces old offline files. |
| F-1-21 | fixed | “SPA fallback” is absent; the remaining hosting assertion is separately F-2-5. |
| F-1-22 | fixed | Action is **Restore Pro license**. |
| F-1-23 | fixed | Live 404 returns 404 with title, description, canonical, OG/Twitter, icon, header, legal links, factory credit, and build ID. |
| F-1-24 | fixed | 404 H1 is **This page was not found**. |
| F-1-25 | fixed | Back restored y=1021 from y=1025 and focused the landing H1 without moving it into view. |
| F-1-26 | fixed | Real workspace has export/import; `workspace-backup` passes and requires path review. |

## Structure, accessibility, and visual identity

| Check | Result |
| --- | --- |
| Route titles | PASS: product/job title on `/`; route/product titles on Demo, Workspace, Privacy, Terms, Art provenance, and 404. |
| One H1 and heading order | PASS on all seven audited routes. |
| Metadata | PASS: description, canonical, OG title/description/image, Twitter card, SVG favicon, 180×180 touch icon, and theme color exist. Social art is 1200×630. |
| Designed 404 | PASS with a real HTTP 404; F-2-11 remains for its external-link label. The browser's resource-status console line is the expected main-document 404, not an application exception. |
| Deep links | PASS: all declared routes returned the intended state on a cold navigation. |
| Back/Forward and focus | PASS: route changes focus/announce the H1; Back restored scroll within 4 px. |
| Link crawl | PASS: every HTTP(S) link found across the audited routes resolved; mail links were syntax-checked. |
| Header/footer | PASS except F-2-11. Privacy, Terms, provenance, factory credit, and v0.1.5 are present. |
| Accessibility | PASS: live Playwright axe found zero serious/critical violations on every route; `verify-url.sh` found title/lang/one H1/main/alt/control checks clean; skip-link and reduced-motion tests pass. |
| Mobile | PASS at 390 px: no horizontal overflow, demo controls remain operable, and tested navigation/banner/footer targets are at least 44 px. |
| Visual identity | PASS: the asymmetric paper-ledger layout, vermilion divider art, clipped sheets, halftone field, serif working-copy type, and stamped states are product-specific rather than a generic SaaS template. |
| Network/privacy | PASS for declared scope: demo and real workspace flows send no workspace data off-origin; the disclosed delayed landing request goes to GitHub. |
| Static assets | PASS: `robots.txt` and `sitemap.xml` return 200; the sitemap lists all real routes. |
| Build size | PASS: initial JS is 13.73 KB gzip and CSS is 4.49 KB gzip. |

Local gates also pass: `npm test` (4 Vitest + 23 Playwright), `npm run
build` (output `dist/site/`), and live `verify-url.sh` (736 ms, no
application console errors).

## Missed leverage

No new feature finding is warranted. The earlier obvious gap—moving a client
workspace between devices—now has reviewed JSON export/import, excludes
sign-ins/license/delivery records, and requires path confirmation. Delivery
record export is present. Sync would weaken the local-first boundary, and the
brief does not imply an AI task that would justify sending client context to
the Sociobot gateway. No decorative AI feature or embedded provider key was
found.

## What would make this perfect

Reconcile billing with the brief; remove or test every unlisted release,
license, network, build, and hosting statement; split the 23-word README
sentence; replace the two jargon phrases; label the 404's external link; and
give `scoped-launch` one exact claim test. Then rerun this entire checklist
from fresh mobile/desktop contexts and a new clean clone. A subsequent PASS
requires zero findings, not only a green declared test matrix.
