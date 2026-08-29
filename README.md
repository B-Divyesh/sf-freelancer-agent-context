# Client Context Firewall

Keep each client’s sources, rules, and delivery record in one local workspace.

Client Context Firewall is for freelance developers who switch clients while
using coding agents. The desktop app validates each local folder, then opens
each agent with a separate client profile. A client profile is one sign-in and
settings folder for one client. It checks other client names and redaction
terms before launch. The app gives the launched agent the saved brief, writing
rule, redaction rules, and checked text from a temporary file on this device.

## Try the isolated demo

Open `?demo=1`, `/demo`, or
<https://freelancer-agent-context.sociobot.in/?demo=1>. It ships with
Northstar Coffee and Juniper Legal sample workspaces. Demo changes last only
in this tab and never change your real workspaces. Choose **Reset demo** at
any time.

## Privacy and limits

The desktop app encrypts its local workspace file with AES-256-GCM. Its random
key is stored in the operating system credential manager. The browser preview
stores workspaces in this browser and sends no workspace data to another site.

The desktop launcher supports Codex CLI, Claude Code, and Gemini CLI. Before
opening an agent, the app removes API keys inherited from its parent process.
Choose a local project folder, then sign in inside that client profile. Your
chosen coding agent may use its own online service.

A real delivery record appears only after every selected connector opens from
its validated local folder. The record names the client profile and confirms
which agents opened. Demo exports are marked sample data and never claim a
local launch.

Deleting a desktop workspace removes its workspace records and complete client
profile. Export a workspace backup to move it. Backups omit agent sign-ins,
license data, and delivery records. Confirm local folder paths after import.

The site works offline after the first visit. After an update, the site
replaces its old offline files.

## Plans

Free includes two client workspaces. Checks and delivery exports remain
available on the free plan. Pro costs $19 once and allows more than two
workspaces. Checkout is handled by Sociobot.

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
To publish desktop assets, push a `v*` tag through the included GitHub Actions
workflow. The landing page separates Intel and Apple silicon downloads. On Linux, run
`curl -fsSL https://freelancer-agent-context.sociobot.in/install.sh | sh` to
verify the AppImage and install it as `client-context-firewall` in your user
binary directory. A direct AppImage download needs `chmod +x` before use.

## Routes

- `/` — product site and downloads
- `/demo` — isolated sample workspace
- `/app` — browser workspace preview
- `/privacy` and `/terms` — data and purchase terms

## Deployment

Deploy `dist/site/` as the static root. The included hosting config keeps
direct links working and adds security headers. The factory owns DNS, billing
registration, and release signing.

Licensed under the MIT License. Built by Param Factory.
