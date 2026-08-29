# Client Context Firewall — venture plan

Status: **planned**

Owner: founding product and engineering lead

Last updated: 2026-08-29

Product URL: `https://freelancer-agent-context.sociobot.in`

Artifact: Tauri desktop app with a public web companion

This document is the build contract. A builder reads it with the latest
handoff and review notes before changing code. A milestone is complete only
after its claims pass in the demo sandbox and its review/polish loop records a
PASS.

> Baseline note: commit `759b150` already contains a broad product prototype.
> It predates this venture plan and uses a one-time license. Treat it as
> inherited implementation evidence, not as accepted milestone scope. Preserve
> useful work, but reconcile behavior and copy with this subscription plan as
> each milestone is built. Do not claim inherited behavior without the tests
> listed here.

## 1. Product requirements

### Customer and situation

The primary customer is an independent developer serving two or more clients
while using Codex, Claude Code, Gemini CLI, or similar coding agents. They
switch repositories, client accounts, writing styles, confidential terms, and
delivery obligations several times a day. A wrong account or pasted client
name can expose information before the developer notices.

Today they use browser profiles, shell aliases, manually swapped API keys,
separate notes, and memory. These tools separate individual pieces, but no tool
binds the client brief, allowed folders, account reminder, redaction rules,
agent profile, and final delivery record into one working boundary.

### Promise

**Start each client session with the right sources, account, rules, and delivery record kept in one device-local workspace.**

This is a guardrail, not absolute data-loss prevention. Copy and documentation
must never claim that every possible leak is detected or prevented.

### The three jobs the product must nail

1. **Set the client boundary.** Create a named workspace, add the client brief
   and writing rule, choose allowed local folders and agent connectors, and add
   terms that must be blocked or redacted. The setup is reusable and encrypted
   on the device.
2. **Start the right agent session.** Select sources, review exactly what will
   be passed, run a preflight for other-client names and configured terms, then
   open each selected agent with that client's isolated profile. Failure is
   explicit and no delivery record is created for an unconfirmed launch.
3. **Prove and close the engagement.** Export a plain, inspectable delivery
   record for confirmed sessions. Export or delete the whole client workspace
   during offboarding without leaving hosted source code or hidden copies.

### First-run and activation

- The landing first screen says **“Keep client work from crossing over”**.
- The primary action is **“Try it with sample data”**. One click opens
  `/demo` (and `?demo=1` remains an equivalent catalog entry point).
- The seeded Northstar Coffee and Juniper Legal workspaces make a clean check,
  a blocked check, reset, and sample delivery export possible without an
  account, network call, or local folder picker.
- The first real action is **“Create a client workspace”**. The desktop app
  asks for only name, brief, writing rule, one local folder, connector, and one
  optional blocked term. Advanced rules stay collapsed.
- Activation is one completed boundary check within ten minutes of first open.

### Success and product metrics

Primary validation: recruit ten freelancers to complete thirty client
sessions with zero cross-client connector use and report at least 25% lower
median setup time than their current workflow.

Device-local session counts and timing are shown to the user, not transmitted.
The only default aggregate telemetry permitted is a privacy-respecting page
view at the public site. Product analytics, content logging, fingerprinting,
and session replay are forbidden. Research measurements use explicit,
consented interviews and a user-exported study summary.

### Plans and monetization

| Tier | Price | Included |
| --- | ---: | --- |
| **Free** | $0 | Demo; two real client workspaces; unlimited boundary checks; delivery export; accessibility, privacy, and offboarding features |
| **Independent** | **$19/month** | Unlimited client workspaces and devices; connector profiles; optional rule suggestions; subscription restore |

Sociobot is the billing boundary and Dodo is its merchant of record. The app
links to
`https://api.sociobot.in/api/v1/products/freelancer-agent-context/checkout`;
staging uses the matching `pilot-api.sociobot.in` test product. The factory
must register the product as the **Independent monthly** subscription before
M2 acceptance. The return license token is verified through Sociobot, never
through Dodo directly. Cancellation or expiry stops creation of new paid-limit
workspaces; existing workspaces, checks, export, deletion, and accessibility
remain available.

### Deliberate non-goals

- Employee monitoring, productivity scoring, screen capture, or keystroke
  recording.
- Hosted source-code, prompt, brief, credential, or deliverable storage.
- A new IDE, coding agent, password manager, source-control host, or full DLP
  system.
- Automatic scanning of every process, clipboard event, file, or network
  packet.
- Team administration, manager dashboards, or hidden policy enforcement in
  the first five milestones.
- Silent AI calls. Rule suggestions are optional, explicit, reviewable, and
  have a manual path.
- Claims of perfect isolation or prevention.

## 2. Evidence and wedge

### Demand signals

1. [Hacker News discussion, 2026-08-28](https://hn.algolia.com/api/v1/items/49481969):
   a freelancer reports that AI-assisted speed has reset market expectations
   and asks how to retain a professional identity. This supports the repeated
   need to keep a personal working voice while serving different clients.
2. [Claude Code issue #27302, 2026-02-21](https://github.com/anthropics/claude-code/issues/27302):
   a 505-reaction request asks for multiple accounts for the same connector.
   The reaction count is a concrete signal that account switching is not an
   isolated complaint.

These signals are directional, not proof of willingness to pay. M1 usability
sessions test the problem and M2 checkout intent tests the price.

### Alternatives and gap

| Alternative | What it handles | Missing boundary |
| --- | --- | --- |
| Browser or OS profiles | Login and cookie separation | No client brief, folder allowlist, rules, launch check, or delivery record |
| 1Password and keychains | Credential storage | No binding between a credential, source folder, brief, and session |
| Vendor workspaces | One vendor's account context | No cross-agent workspace or local offboarding trail |
| Shell scripts and aliases | Repeatable commands | Hard to review; no shared policy model, redaction preview, or export trail |
| Notes beside each repository | Brief and style memory | No enforcement at launch and no account separation |

### Wedge

The switch is not “organize AI chats.” It is **open a client-safe working
boundary in one action**. Client Context Firewall joins the pieces freelancers
already separate manually, keeps sensitive content device-local, and gives the
developer an inspectable record of what was checked and opened. The one-click
demo proves the interaction before sign-up; the Free tier proves it on two real
clients before payment.

## 3. Architecture

### Stack decision

- **Public companion and desktop UI:** Vite 7, strict TypeScript, and semantic
  HTML/CSS. Keep the existing framework-free runtime for the first milestones:
  the sensitive work lives behind a small number of screens and Tauri commands,
  the current bundle is small, and a framework migration would add risk without
  improving the core boundary. Split code by feature before adding state
  machinery. Revisit Svelte only if M3 demonstrates repeated view-state bugs.
- **Desktop shell:** Tauri 2 with stable Rust 2021. Rust owns filesystem access,
  process launch, crypto, keychain integration, and the local database. Web
  code never receives raw provider credentials.
- **Local persistence:** SQLite for relational metadata plus AES-256-GCM
  application-encrypted sensitive fields. A random workspace data-encryption
  key is wrapped by a device key in the OS keychain. Migrations are reversible.
- **Account and entitlement API (M2):** Rust `axum` + `tokio` + `sqlx` +
  PostgreSQL. This service stores identity, entitlement, device-link, and
  operational metadata only. It never accepts client content or source code.
- **Hosting:** static companion on Azure Static Web Apps; API on Azure
  Container Apps. Deployment, DNS, signing, billing registration, and cloud
  resources remain factory responsibilities.
- **Tests:** Vitest for policy/domain logic, Rust unit/integration tests for
  native and API boundaries, Playwright 1.58.2 for every claim and route, and
  Playwright Axe for serious/critical accessibility findings.

The repository structure evolves without a flag day:

```text
src/
  components/       semantic view primitives and inventory
  features/         landing, demo, workspace, session, delivery, account
  services/         storage, billing, auth, routing, gateway clients
  styles/           tokens.css and feature styles
src-tauri/
  src/commands/     narrow Tauri command boundary
  src/crypto/       envelope encryption and keychain adapters
  src/db/           SQLite models and migrations
  src/launch/       connector process plans and confirmation
server/             added in M2; axum account/entitlement service
tests/              unit, browser, fixtures, and claim tests
```

### Trust boundaries and data flow

1. The browser demo loads static sample data into a `demo:` session-storage
   namespace. It does not read real storage. Reset recreates the fixture; leave
   discards it.
2. The desktop renderer requests operations through typed Tauri commands.
   Rust validates IDs, paths, sizes, connector allowlists, and state transitions.
3. The local database stores identifiers and indexes. Briefs, writing rules,
   account reminders, blocked terms, checked excerpts, and delivery payloads
   are encrypted before writing. Provider sign-ins live only in per-client
   connector profiles and the connector's own secure store.
4. Launch plans start an allowlisted binary in an allowed local folder, remove
   inherited provider credential variables, set the client-specific profile,
   and require a connector-specific startup confirmation. Shell strings from
   the renderer are never executed.
5. The account API sees an Entra object ID, subscription status, opaque device
   ID/public key, timestamps, and rate-limit metadata. It never sees a client
   name, path, brief, prompt, rule, source, provider token, or delivery record.
6. Optional rule suggestions send only the user-approved excerpt directly to
   the Sociobot gateway. The review screen names every field before the user
   sends it. Demo responses are fixtures and spend nothing.

### Data model

#### Device-local

| Entity | Important fields | Ownership and retention |
| --- | --- | --- |
| `workspace` | UUID, encrypted name/brief/writing rule, color-safe code, created/updated | One local user/device; delete cascades everything below |
| `source` | UUID, workspace ID, encrypted label/path/account reminder, connector kind, enabled | Belongs to one workspace; paths must be re-confirmed after import |
| `rule` | UUID, workspace ID, encrypted term/replacement, mode (`block` or `redact`), enabled | Belongs to one workspace; exact deterministic matching in M1 |
| `connector_profile` | UUID, workspace ID, connector kind, profile directory, last verified | Directory is outside export; credentials are never copied into app data |
| `session` | UUID, workspace ID, start/end, state, selected-source IDs, policy version | Encrypted; interrupted sessions cannot become confirmed |
| `launch_receipt` | session/source IDs, connector, binary digest/version, start confirmation, timestamp | No command arguments or credentials; required for a real delivery record |
| `delivery_record` | UUID, session ID, canonical JSON, signature/hash, sample flag | User-exportable and deletable; sample records state they are simulated |
| `local_setting` | schema version, theme, reduced-data choice, last license check | Never contains an Entra token or raw Sociobot key |

Workspace export is a versioned encrypted archive containing workspace,
sources, and rules. It omits connector sign-ins, provider tokens, licenses,
device keys, session excerpts, and delivery records. Import requires the user
to re-confirm every local path and connector profile.

#### Cloud account service

| Entity | Important fields | Tenancy |
| --- | --- | --- |
| `account` | Entra `oid` primary key, created/last-seen, deletion state | Keyed only by stable `oid`, never email |
| `entitlement` | `oid`, tier, Sociobot license digest, status, checked/expires timestamps | One active subscription per account; raw token not logged |
| `device_link` | hashed one-time code, `oid`, device public key, expiry, consumed timestamp | Five-minute TTL; single use |
| `device` | UUID, `oid`, public key, label, created/revoked timestamps | Per-account, tenant-filtered on every query |
| `operation_event` | request ID, route class, result code, duration, coarse client version | No IP persistence, client data, token, path, or prompt |

Every query includes the authenticated `oid`. Cross-tenant tests create two
accounts and assert that reads, writes, device links, and entitlement responses
cannot cross that boundary.

### Authentication

- Landing, demo, privacy, terms, downloads, and the two-workspace local Free
  tier remain public.
- The hosted `/account` and `/auth/callback` routes use
  `@azure/msal-browser` with authorization code + PKCE, `loginRedirect`, scopes
  `openid profile email`, and `sessionStorage` cache.
- Authority:
  `https://sociobotcustomers.ciamlogin.com/35c6fe40-0ec0-46b6-98c6-213ad4de6650/`.
  Client ID: `25c704f4-465a-47af-80ab-2c489466b697`. Redirect:
  `https://freelancer-agent-context.sociobot.in/auth/callback`.
- Desktop sign-in opens the system browser to a hosted device-link page with a
  locally generated nonce and PKCE challenge. After Entra returns, the API
  issues a five-minute, one-use exchange code and opens the registered desktop
  deep link. The desktop exchanges it and stores the refreshable session in the
  OS keychain. Tokens never pass through page query strings or logs.
- The API reads OIDC discovery at startup, takes `issuer` and `jwks_uri` from
  it, and caches JWKS for one hour. It validates RS256, audience, tenant ID,
  discovered issuer, `exp`, and `nbf`; failures return 401 with
  `WWW-Authenticate: Bearer`.
- Optional configuration uses exactly `ENTRA_TENANT_ID`,
  `ENTRA_TENANT_SUBDOMAIN`, and `ENTRA_CLIENT_ID`, defaulting to the values
  above. Email is display-only; authorization keys on `oid`.

The redirect URI, desktop custom scheme, and production logout URI require
operator registration before M2 release.

### Billing

- The web account page starts the Sociobot-hosted checkout. No Dodo SDK, Dodo
  endpoint, price ID, or secret enters this repository.
- On return, the web bridge saves `license` under
  `sb_license:freelancer-agent-context`, strips it with
  `history.replaceState`, verifies it, then transfers it to the signed-in
  desktop through the one-time device link. The desktop stores it in the OS
  keychain, not SQLite.
- Verify with
  `GET https://api.sociobot.in/api/v1/products/freelancer-agent-context/verify?license=<token>`.
  Use a cached valid verdict for first paint and reconcile in the background at
  most once per day. Invalid, expired, revoked, or wrong-product responses
  remove paid creation rights without touching existing data.
- “Restore subscription” accepts a token and follows the same verify path.
  It never echoes or logs the token.
- M2 API write routes are authenticated. Checkout, restore, and verify actions
  have stricter rate limits and idempotency keys.
- Terms name $19/month, renewal, cancellation, what Independent adds, and
  Sociobot/Dodo as merchant of record. No countdowns, forced modals, or gated
  safety/export/accessibility.

### AI feature policy

M5 may add **Suggest rules from this brief** because turning an existing brief
into reviewable client-name and sensitive-term candidates removes repetitive
setup. It is not part of the safety decision and cannot launch a session.

- BYOK is default. A user pastes a Sociobot `sbk_…` key, stored only in the OS
  keychain, removable at any time, and sent only to `api.sociobot.in`.
- Before sending, show the exact brief excerpt, model purpose, gateway origin,
  and current cost estimate. Sending requires an explicit click.
- Query `/v1/models`, choose the first available `gpt-5.6-*` model (prefer
  `gpt-5.6-sol`), then call `/v1/responses`. Stream candidate rules.
- Candidates are untrusted suggestions. Nothing changes until the user checks
  individual items and selects **Add selected rules**. Undo is available.
- Manual rules work offline and without a key. Demo uses a recorded response;
  automated tests never spend money. A missing gateway or key preserves the
  manual form and explains the next step.
- If a server-side factory key is ever added, it uses
  `FACTORY_SOCIOBOT_KEY`, daily spend caps, per-account and per-IP limits, and
  canned demo responses. M1–M5 do not require that key.

### API, rate limits, and operations

The M2 server starts with only `PORT` (default 8080). Missing secrets generate
and persist safe local development defaults under `/data`; startup logs which
values were generated without printing them. `/health` returns status and
`BUILD_SHA`. The Dockerfile is multi-stage, uses `rust:1-slim`, accepts
`ARG BUILD_SHA=dev`, runs non-root, exposes 8080, and never reads `.git`.

All server routes except liveness are rate limited by the first validated
`X-Forwarded-For` hop, with socket IP fallback:

| Route class | Allowance | Response after limit |
| --- | --- | --- |
| Normal authenticated reads | 20 requests/second, burst 40 | 429 + `Retry-After` |
| Account/device-link writes | 5/minute, burst 3 | 429 + `Retry-After` |
| Checkout/restore/verify | 5/minute per account and IP | 429 + `Retry-After` |
| Optional AI proxy | 5/minute and daily spend cap | 429 + `Retry-After` |
| `/health` liveness | Exempt | Minimal build/status only |

Logs are structured JSON with request ID, route template, status, latency,
build SHA, and coarse app version. They exclude authorization headers, query
strings, IP addresses after the request, client content, paths, and license
tokens. Metrics cover request count/latency, 401/429/5xx, entitlement check
age, device-link failures, and database health. Targets: 99.9% monthly API
availability, p95 authenticated read below 300 ms, and under 1% non-user 5xx.

Background work is limited to expired device-link cleanup, daily entitlement
reconciliation, and operational retention cleanup. Sociobot/Dodo sends billing
receipts; the product sends no marketing email. Any future transactional email
is opt-in and contains no client data.

PostgreSQL receives encrypted daily backups with 14-day retention and a
quarterly restore test. These backups contain account/entitlement metadata
only. Local client data is backed up only through an explicit user export.

### Security and privacy controls

- CSP and security headers permit only self-hosted scripts/fonts/assets plus
  the exact Entra and Sociobot origins needed by account or optional AI flows.
  `frame-ancestors` is a response header, never a meta tag.
- Tauri capabilities expose only named commands. Path canonicalization blocks
  traversal and symlink surprises; connector binaries are allowlisted and
  never invoked through a shell.
- Inputs have length and count limits. Encrypted records use random 96-bit
  nonces and authenticated associated data containing schema/workspace IDs.
- Exports are written to a temporary file, fsynced, renamed atomically, and
  cleaned after failure. Destructive deletion names the workspace and offers a
  short undo only while the encrypted tombstone remains local.
- Dependency, Rust advisory, and secret scans run in CI. Release artifacts are
  signed per platform and published with SHA-256 checksums.
- Privacy and terms use plain words. `/privacy` includes a table of what stays
  local, what reaches Entra/Sociobot, retention, export, and deletion.

## 4. Design system

The full visual thesis and token rationale live in
[`.factory/design.md`](./design.md). The component contract lives in
[`.factory/components.md`](./components.md), and executable CSS variables live
in [`src/styles/tokens.css`](../src/styles/tokens.css).

### Direction

**Dithered boundary ledger:** cream paper, dense charcoal rules, vermilion
boundary marks, forest-green passed stamps, squared sheets with one clipped
corner, and halftone fields that mark sample or transitional material. It
looks like a working security docket made in a small print studio, not a SaaS
dashboard or cyber-security neon scene.

### Tokens

- Light palette: paper `#f3eedf`, sheet `#fffaf0`, ink `#1b211d`, muted
  `#545e56`, rule `#788378`, signal `#ad351a`, safe `#286a4b`, warning
  `#8b5a00`, danger `#a52e2e`.
- Dark palette: paper `#171916`, sheet `#222720`, ink `#f1eddf`, muted
  `#adb7ad`, rule `#778276`, signal `#f77a50`, safe `#69c692`, warning
  `#f1bd58`, danger `#ff8c84`.
- Typography: Arial Narrow/system condensed for display, Charter/Georgia for
  reading, system monospace for IDs and state. No runtime font downloads.
- Type steps: 14, 16, 18, 24, 36, clamp(44–72) px; body 17 px desktop and
  16 px minimum web/mobile; 1.5 line height.
- Spacing: 4, 8, 16, 24, 32, 48, 64, 96 px. Touch targets are at least 44 px.
- Radius: 0 for work sheets and controls; the clipped corner distinguishes an
  independent record. Shadow is a hard 3 px ink offset, never a soft glow.
- Motion: one 220 ms print-pass reveal and 8 px source-to-result movement.
  Animate only opacity/transform. Nothing loops. Reduced motion is immediate.

### Component set and required states

The 20-component shared set is: app frame, demo banner, boundary sheet,
workspace tabs, source row, connector badge, rule row, state stamp, action
control, field, disclosure, dialog, feedback panel, preflight checklist, result
panel, delivery ledger, empty state, loading placeholder, pricing row, and
provenance viewer. Components
must implement default, hover, focus-visible, pressed, disabled, loading,
success, warning, and error states where meaningful. State always uses text or
shape in addition to color.

### Five key screens

1. **Landing:** asymmetric two-column first screen. The job and sample action
   occupy the broad paper column; an original still of two folders separated by
   a physical divider fills the narrower column. Three facts cover local data,
   offline demo, and Free/$19 pricing. Live preview, three steps, limits,
   pricing, and download follow the standard site order.
2. **Demo/workspace rail:** numbered client tabs at left, active boundary sheet
   in the center, delivery ledger at right. A persistent ochre banner says
   “Demo — sample data, nothing is saved” with Reset and Start for real.
3. **Boundary editor:** brief and writing rule read like a docket. Sources and
   rules use dense rows, visible labels, plain help, and an explicit Save. An
   empty editor says what will appear and offers Create a workspace.
4. **Session preflight:** selected sources flow left-to-right into a checklist.
   Blocks use a red split mark and name the matching rule; pass uses a green
   stamp. The launch button appears only after pass and says which agent opens.
5. **Delivery and offboarding:** a chronological ledger shows checked sources,
   confirmed launches, hash, and sample/real status. Export, workspace backup,
   and delete are separate actions. Delete confirmation names local data that
   will disappear and what is excluded from backup.

### Empty, loading, error, and offline behavior

- Empty: state what will live here and offer one concrete action. Never show an
  empty white card grid.
- Loading: reserve final dimensions; show at most three static halftone bars and
  a plain status. No indefinite animated shimmer under reduced motion.
- Error: say what failed, why if known, and the next action. User input remains
  intact. Connector failure names the connector and keeps export unavailable.
- Offline: demo, existing local workspaces, checks, manual rules, export, and
  deletion remain available. Account, subscription refresh, downloads, and AI
  suggestions explain that they need a connection and offer Retry.

### Responsive and accessibility rules

- Design at 390 px first. Below 640 px, the client rail becomes a horizontal
  picker, the ledger follows the session, nonessential art captions collapse,
  and no fixed control obscures safe areas. Desktop supports 1280–1600 px
  three-column workbench layouts.
- Exactly one `<h1>` and one `<main>` per route; headings do not skip levels.
  Route changes update title/canonical metadata, announce in a polite live
  region, and focus the new `<h1>`. Back/forward restores route and focus.
- All actions work with keyboard alone. Tabs support arrows/Home/End. Dialogs
  trap focus, close with Escape, restore the opener, and name destructive
  consequences. Focus rings are three pixels and meet 3:1.
- Text contrast is at least 4.5:1 in both themes; measured primary pairs are
  recorded in `design.md`. UI cannot rely on color, halftone, or motion.
- At 200% text size there is no lost action or two-axis page scroll. Controls
  are at least 44×44 px with eight pixels between adjacent targets.
- Meaningful images have useful alt text; texture is decorative. No required
  text is baked into art. Axe serious/critical findings block a milestone.

### Performance budgets

Public first load: JavaScript ≤150 KB gzip (hard ceiling 200 KB), CSS ≤50 KB,
self-hosted fonts ≤120 KB, and mobile hero ≤300 KB. On a throttled mid-range
phone: LCP <2.5 s, INP <200 ms, CLS <0.1, Lighthouse performance ≥90 and
accessibility ≥95. Hashed assets cache for one year; HTML and service worker do
not. The PWA shell versions and deletes old caches during activation.

## 5. Milestones

Every milestone is sized for one focused 3–4 hour builder session because it
builds on the inherited scaffold. If the review finds broader work, split the
implementation before adding scope; do not waive tests. Each builder updates
this plan status, `.factory/claims.json`, `.factory/demo.md`, copy audit,
README, and `.factory/handoff-m<N>.md`.

### M1 — Public site and isolated boundary demo

**Status:** planned

**Outcome:** A stranger understands the product, opens realistic sample data in
one click, performs a clean or blocked boundary check, and exports a sample
delivery record without an account or network dependency.

**Routes/screens added:** `/`, `/demo`, `/?demo=1`, `/privacy`, `/terms`,
`/art-provenance`, and designed `/404`; demo workspace, preflight result, and
sample delivery viewer/download.

**Scope:**

- Implement the standard landing order and the dithered boundary-ledger system.
- Seed Northstar Coffee and Juniper Legal with distinct briefs, writing rules,
  four sources, and rules that produce both clean and blocked paths.
- Store demo state only in `sessionStorage` under `demo:`. Reset restores the
  fixture; Start for real discards demo state before entering the real shell.
- Implement a deterministic, case-normalized boundary engine for other-client
  names and configured block terms. Show the matched rule and no false claim of
  comprehensive prevention.
- Export canonical JSON marked `sample: true`, with selected source labels,
  checks, timestamp, policy version, and a statement that no agent launched.
- Install the app shell for offline reload after first visit. Keep all assets
  same-origin and self-hosted.
- Finish route titles, metadata, sitemap, robots, SWA headers/fallback, 404,
  privacy/terms, original-art disclosure, mobile/keyboard states, and docs.

**Claims:** the exact records are in `.factory/claims.json`.

| ID | Visitor-facing claim | Evidence command |
| --- | --- | --- |
| `demo-isolation` | Demo changes never touch real workspace data. | `npm run test:e2e -- --grep @claim:demo-isolation` |
| `boundary-check` | The preflight blocks another client name or a configured redaction term. | `npm run test:e2e -- --grep @claim:boundary-check` |
| `provenance-export` | The demo exports a clearly marked sample record with each checked source. | `npm run test:e2e -- --grep @claim:provenance-export` |
| `device-local` | The browser workspace does not send workspace data off-origin. | `npm run test:e2e -- --grep @claim:device-local` |
| `offline-reload` | Works offline after the first visit. | `npm run test:e2e -- --grep @claim:offline-reload` |
| `hosting-routes` | Every public route opens directly with security headers, and unknown routes return the designed 404. | `npm run test:e2e -- --grep @claim:hosting-routes` |

**Tests:**

- Vitest: normalization, match boundaries, rule precedence, deterministic
  export ordering, fixture reset, and demo/real storage adapter separation.
- Playwright: exactly one tagged test per claim from a fresh context; both
  clean and blocked flows; reset; download JSON schema; no off-origin requests;
  offline reload; deep links/back/focus; 404 and response headers.
- Accessibility: keyboard-only happy and blocked paths, 200% text, 390×844 and
  1440×900 screenshots, Axe on every route, reduced-motion media emulation.
- Build/performance: `npm test`, `npm run typecheck`, `npm run build`; inspect
  gzip sizes and run mobile Lighthouse.

**Definition of done:**

- All six claim commands pass in a clean clone using only `/demo` and fixtures.
- No account, billing, live agent, source-code upload, or AI call exists in M1.
- `npm test` passes; `npm run build` creates `dist/`; initial budgets and
  Lighthouse thresholds pass; no load-time console error.
- First screen passes the plain-words/copy audit; all public routes meet titles,
  one-H1, landmarks, contrast, focus, mobile, CSP, and no-dead-link checks.
- Demo documentation names data, reset, exit, and namespace. Review and polish
  record PASS before M2.

### M2 — Accounts, encrypted persistence, and subscription

**Status:** planned; starts only after M1 PASS

**Outcome:** A freelancer can create two encrypted local workspaces for free,
sign in through Sociobot Entra CIAM, subscribe to Independent for $19/month,
restore that subscription, and create additional workspaces. Client content
never enters the account service.

**Routes/screens added:** `/app`, `/app/workspaces/new`, `/account`, `/plans`,
`/auth/callback`, desktop device-link callback, account/subscription settings;
API `/health`, `/v1/me`, `/v1/device-links`, `/v1/devices`, and
`/v1/entitlement`.

**Claims to add to `.factory/claims.json`:**

- `encrypted-local-workspace`: encrypted local records contain no client
  plaintext and decrypt only through the device key.
- `tenant-isolation`: two Entra users cannot read or mutate each other's
  account, device, or entitlement rows.
- `monthly-checkout`: Independent checkout is Sociobot-hosted and states
  $19/month before payment.
- `subscription-limit`: Free creates two workspaces; a valid Independent
  subscription creates more; an expired subscription blocks only new
  over-limit workspaces.
- `license-data-minimization`: verification sends only the opaque license token
  to the documented Sociobot endpoint and logs no token.
- `rate-limit-api`: every non-health API route returns 429 with `Retry-After`
  after its documented allowance.

**Tests:** crypto known-answer/tamper tests; reversible SQLite/Postgres
migrations; API auth/JWKS fixtures; wrong aud/tid/iss/exp/nbf; cross-tenant
integration; rate-limit load smoke; mocked checkout return/verify/restore;
Playwright sign-in callback and plan limits; existing M1 claims unchanged.

**Definition of done:** Free needs no sign-in; account routes use MSAL PKCE and
session storage; API validates discovered issuer/JWKS; local key resides in the
OS keychain; the server starts with only `PORT`; Docker is non-root and reports
build SHA; monthly test checkout and restore work; privacy/terms/copy name every
external data flow; operator actions are recorded; all M1+M2 claims pass.

### M3 — Scoped agent launch and verified delivery records

**Status:** planned; starts only after M2 PASS

**Outcome:** A desktop user chooses client sources, passes preflight, opens each
supported agent in a client-specific profile with inherited provider secrets
removed, and receives a real delivery record only after startup confirmation.

**Routes/screens added:** `/app/workspaces/:workspaceId`,
`/app/workspaces/:workspaceId/session`, `/app/sessions/:sessionId`, and
`/app/deliveries/:deliveryId`; connector setup and launch-failure states.

**Claims to add:**

- `scoped-launch`: Codex, Claude Code, and Gemini CLI start only through typed,
  allowlisted plans in the selected folder and client profile.
- `credential-scrub`: inherited provider credential variables do not reach the
  child agent process.
- `launch-confirmation`: a missing, failing, or unconfirmed agent cannot create
  a real delivery record.
- `session-context-retention`: the exact reviewed context stays only in the
  encrypted client profile until that workspace is deleted.
- `verified-delivery`: exported canonical JSON names every checked source and
  confirmed launch, includes a content hash, and distinguishes real from sample.

**Tests:** Rust connector plan table tests on every platform; executable/path
validation; malicious label/path fixtures; credential sentinel child process;
failed binary, failed terminal wrapper, timeout, and partial-launch tests;
canonical export/hash tests; Playwright keyboard flow with native adapter
fixtures; regression of every prior claim.

**Definition of done:** no shell interpolation; capabilities expose only named
commands; every supported connector has a profile and confirmation adapter;
cancel/timeout is recoverable; a real record is cryptographically tied to the
checked session; free users retain checks and export; signed dev builds launch
on Windows, macOS Intel/ARM, and Linux; M1–M3 claims pass.

### M4 — Offboarding and operations

**Status:** planned; starts only after M3 PASS

**Outcome:** A freelancer can inspect, back up, restore, or delete all local
client data, while an operator can diagnose the account service without seeing
client content.

**Routes/screens added:** `/settings/data`, `/settings/devices`,
`/settings/diagnostics`, `/app/workspaces/:workspaceId/offboard`; protected
operator `/admin/health`; API `/v1/account/export`, `/v1/account/delete`,
`/metrics` (internal only).

**Claims to add:**

- `workspace-backup`: versioned workspace backup omits connector sign-ins,
  licenses, device keys, session excerpts, and delivery records and requires
  path confirmation after import.
- `workspace-deletion`: confirmed deletion removes the complete workspace,
  connector profile, encrypted records, and derived index entries.
- `account-export-delete`: account export contains only documented cloud
  metadata and deletion removes/revokes it within the stated window.
- `operational-redaction`: structured logs, metrics, and diagnostics contain no
  client content, paths, provider secrets, or license tokens.
- `backup-restore`: a documented Postgres backup restores into an isolated
  environment and passes integrity checks.

**Tests:** archive version/tamper/import tests; filesystem and database cascade;
two-workspace noninterference; account deletion idempotency; log capture with
sentinel secrets; backup restore drill; API 100 rps smoke; offline offboarding;
screen-reader destructive-dialog smoke; all earlier claims.

**Definition of done:** export and delete are never paid; confirmations name
the scope; interrupted operations recover; admin is CIAM-authorized and
contains no client content; health, metrics, JSON logs, alerts, SLO/runbook,
backup retention, and restore evidence are documented; M1–M4 claims pass.

### M5 — Assisted setup, sharing, and installable growth

**Status:** planned; starts only after M4 PASS

**Outcome:** A new freelancer installs a signed desktop build, imports or sets
up a boundary faster with optional reviewed suggestions, and can share a
sanitized delivery record without exposing the workspace.

**Routes/screens added:** `/download`, `/install`,
`/app/workspaces/:workspaceId/rules/suggest`, and
`/app/deliveries/:deliveryId/share`; signed platform installers, custom deep
link, and sanitized record viewer.

**Claims to add:**

- `signed-installers`: published Windows, macOS Intel/ARM, and Linux artifacts
  have checksums and valid platform signatures/notarization where supported.
- `ai-rule-suggestions`: an explicit Sociobot gateway action returns fixture-
  backed candidate rules and changes nothing until selected.
- `ai-data-control`: the review screen shows the exact outbound text; cancel,
  missing key, offline, and gateway error leave manual setup working.
- `sanitized-share`: shared delivery output contains only user-selected fields,
  no client path/account/token/excerpt, and can be revoked locally before upload
  because M5 sharing defaults to a downloaded file, not hosted content.
- `install-to-demo`: a fresh install reaches the bundled sample project without
  account or network and can reset it.

**Tests:** recorded gateway stream and schema errors; request-body disclosure
comparison; no live test spend; undo; signed manifest/checksum fixtures;
installer smoke per OS; protocol-handler validation; sanitizer property tests;
fresh-install Playwright/Tauri flow; full cumulative claim suite.

**Definition of done:** gateway uses only Sociobot and BYOK keychain storage;
manual/offline path remains complete; output is reviewed and undoable; demo is
bundled in installers; release notes and provenance are current; catalog links
to `?demo=1`; all claims pass; review/polish records final PASS.

## 6. Risks and experiments

| Risk or unknown | Why it matters | Experiment that retires it | Decision threshold / owner |
| --- | --- | --- | --- |
| Freelancers feel the switching pain but will not pay $19/month | Venture economics fail | After M1, run ten observed sessions; at M2 show exact monthly checkout to qualified users without charging during interview | Proceed if ≥4/10 attempt checkout and median setup falls ≥25%; product lead |
| Deterministic term matching causes noise | Users bypass a noisy guardrail | M1 fixture corpus plus five users' redacted rule lists; record false block/allow decisions locally | Ship M1 if 100% explicit terms match and <10% reviewed checks are false blocks; policy owner |
| Agent CLIs do not expose reliable startup confirmation | Provenance could overstate what opened | M3 connector spike starts each supported agent in a disposable profile and tests success, early exit, timeout, and wrapper failure | Label a connector beta or omit it unless success and failure are distinguishable; native lead |
| Per-client profiles may not fully isolate vendor credentials | Core promise could be misleading | Inspect each connector's documented profile/config behavior; use sentinel credentials and process-environment tests | Copy names exactly what is isolated; unsupported credential stores require user confirmation or connector removal; security owner |
| Tauri + Entra desktop linking is brittle | Paid activation could strand buyers | M2 vertical spike across Windows/macOS/Linux using system browser, PKCE, one-use link, cancel, replay, and expiry | ≥95% success in 60 scripted attempts, zero replay acceptance; auth owner |
| Sociobot product may not yet support the requested monthly contract | Billing scope differs from attached one-time unlock contract | Before M2 code, operator registers a pilot monthly product and captures checkout, renewal, expiry, revoke, and verify responses | Do not present monthly checkout until pilot contract is verified; operator/product lead |
| Local encryption/keychain recovery can cause unrecoverable loss | Privacy and usability conflict | M2 threat model and recovery drill using export/import, missing keychain entry, corrupt ciphertext, and OS migration | Never claim recoverability without an export; provide clear failure and backup guidance; native lead |
| Users may assume comprehensive DLP | Unsafe reliance and legal risk | Five-person copy comprehension test after demo; ask what the product does not catch | ≥4/5 correctly say it checks configured boundaries only; otherwise rewrite before release; product lead |
| Optional AI sends more brief text than users expect | Violates local-first trust | M5 outbound-diff test and moderated consent screen: participant predicts exact payload before send | 5/5 can identify sent fields; otherwise feature stays behind an experimental flag; AI owner |
| Vanilla view code becomes hard to maintain | Milestone speed and accessibility regress | At M3 review defect history and feature module coupling | Migrate to Svelte only if two or more state bugs cross features or view tests require repeated manual DOM synchronization; tech lead |
| Desktop signing/notarization delays install growth | Users cannot safely install | M5 dry-run unsigned artifacts early, then factory signing spike on all OS targets | All three OS families install from a clean VM with published checksum/signature before download copy goes live; release owner |
| Device-local data is lost with a laptop | No server backup by design | M4 test of explicit encrypted export and restore on another device; usability interview | 9/10 complete export and restore without help; improve flow, never silently upload; product lead |

## 7. Release gates shared by every milestone

- `npm ci`, `npm test`, `npm run typecheck`, and `npm run build` pass from a
  clean clone. Native/server milestones also pass `cargo fmt --check`, Clippy
  with warnings denied, all Rust tests, reversible migrations, and container
  startup with only `PORT`.
- Every public claim has exactly one `@claim:<id>` test and a matching
  `.factory/claims.json` entry. Tests use `/demo`, fixtures, temp directories,
  or temp databases and make no paid model call.
- Demo stays isolated and one click away. It remains useful offline and is
  resettable from a clean state through every milestone.
- Route crawl, no-dead-link check, title/canonical/one-H1/main checks, browser
  console check, Axe, keyboard, 390 px, 200% text, dark treatment, and reduced
  motion pass.
- Bundle and Web Vitals budgets pass. No third-party font/script CDN, hidden
  analytics, client-content logging, embedded provider secret, or raw Dodo
  integration is introduced.
- README, privacy, terms, demo docs, copy audit, design/component inventory,
  migrations, runbook, claim matrix, plan status, and milestone handoff match
  shipped behavior.
- The builder leaves a reviewable commit. Independent review then polish must
  record PASS before the next milestone starts.
