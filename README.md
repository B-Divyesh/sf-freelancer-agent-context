# Client Context Firewall

Keep each client’s sources, rules, and delivery record in one local workspace.

Client Context Firewall is for freelance developers who switch between client
accounts while using coding agents. It checks the selected source account,
other client names, and redaction terms before a session starts. A finished
check can be exported as a JSON delivery record.

## Try the isolated demo

Open `/demo` or <https://freelancer-agent-context.sociobot.in/demo>. It ships
with Northstar Coffee and Juniper Legal sample workspaces. Demo changes use
session storage and never touch the real workspace namespace. Choose **Reset
demo** at any time.

## Privacy and limits

The desktop app encrypts its local workspace file with AES-256-GCM. Its random
key is stored in the operating system credential manager. Workspace data is
not sent off the device. The browser preview uses local storage.

Client Context Firewall is a guardrail. It does not inspect other apps and
cannot prevent every disclosure. It works offline after the first site visit.

## Plans

Free includes two client workspaces, all boundary checks, and delivery exports.
Pro costs $19 per month and adds unlimited workspaces. Checkout and license
verification use the Sociobot billing API.
No product ID or payment provider is embedded in this repository.

## Develop and verify

Requirements: Node 22 and, for desktop builds, the current Rust toolchain plus
the [Tauri 2 system dependencies](https://v2.tauri.app/start/prerequisites/).

```sh
npm install
npm run dev
npm test
npm run build
```

`npm run build` produces the static site at `dist/site/`. Run
`npm run tauri build` for the desktop package on a supported host. GitHub
Actions builds macOS, Windows, and Linux release assets from a `v*` tag.

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
