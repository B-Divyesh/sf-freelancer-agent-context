# Client Context Firewall

Keep each client’s sources, rules, and delivery record in one local workspace.

Client Context Firewall is for freelance developers who switch between client
accounts while using coding agents. The desktop app opens each agent with
separate credential and config folders for that client. It also checks other
client names and redaction terms before launch. A finished check can be
exported as a JSON delivery record.

## Try the isolated demo

Open `/demo` or <https://freelancer-agent-context.sociobot.in/demo>. It ships
with Northstar Coffee and Juniper Legal sample workspaces. Demo changes use
session storage and never touch the real workspace namespace. Choose **Reset
demo** at any time.

## Privacy and limits

The desktop app encrypts its local workspace file with AES-256-GCM. Its random
key is stored in the operating system credential manager. The browser preview
stores workspaces locally and does not send workspace data off-origin.

The desktop launcher supports Codex CLI, Claude Code, and Gemini CLI. Choose a
local project folder, then sign in inside that client’s isolated profile. Your
chosen coding agent may use its own online service.

The site works offline after the first visit. A new release replaces the
previous cached application shell.

## Plans

Free includes two client workspaces. Checks and delivery exports remain
available on the free plan. Pro costs $19 once and allows more than two
workspaces. Checkout and license verification use the Sociobot billing API.
No product ID or payment provider is embedded in this repository.

## Develop and verify

Requirements: Node 22 and, for desktop builds, the current Rust toolchain plus
the [Tauri 2 system dependencies](https://v2.tauri.app/start/prerequisites/).

```sh
npm ci
npm run dev
npm test
npm run typecheck
npm run lint
npm run build
```

`npm run build` produces the static site at `dist/site/`. Run
`npm run tauri -- build` for the desktop package on a supported host. On Linux,
install the Tauri 2 system packages, `libsecret-1-dev`, `libfuse2`, `file`, and `rpm`.
GitHub Actions builds macOS, Windows, and Linux assets from a `v*` tag.

## Routes

- `/` — product site and downloads
- `/demo` — isolated sample workspace
- `/app` — browser workspace preview
- `/privacy` and `/terms` — data and purchase terms

## Deployment

Deploy `dist/site/` as the static root. The included Static Web Apps config
adds SPA fallback and security headers. The factory owns DNS, billing
registration, and release signing.

Licensed under the MIT License. Built by Param Factory.
