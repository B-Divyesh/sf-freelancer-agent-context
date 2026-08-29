# Landing copy audit

Checked 2026-08-29 after polish round 3. Counts are whitespace-delimited and treat hyphenated terms as one word.

| Kind | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| wordmark | Client Context Firewall | 3 | pass |
| nav | Demo | 1 | pass |
| nav | Workspace | 1 | pass |
| nav | Privacy | 1 | pass |
| label | A local desktop boundary for freelancers | 6 | pass |
| H1 | Keep client work from crossing over | 6 | pass |
| sentence | For freelance developers who switch clients without mixing sources, accounts, or writing style. | 13 | pass |
| action | Try it with sample data | 5 | pass |
| sentence | See a checked client session next. | 6 | pass |
| fact | Browser workspaces stay on this device. | 6 | `device-local` |
| fact | Works offline after your first visit. | 6 | `offline-reload` |
| fact | Free for two workspaces. | 4 | `plan-limit` |
| fact | Pro is $19 once. | 4 | `paid-checkout` |
| art label | Two client folders kept separate | 5 | pass |
| image alt | Two paper client folders sit on opposite sides of an orange divider. | 12 | pass |
| caption | Separate briefs, source accounts, and rules before work begins. | 9 | pass |
| label | Live product preview | 3 | pass |
| H2 | Preview a checked client session | 5 | pass |
| sentence | The desktop app opens each agent with a separate client profile: one sign-in and settings folder for that client. | 19 | `scoped-launch` |
| preview label | Northstar workspace with two allowed sources and three passed boundary checks | 11 | pass |
| status | Northstar / session ready | 3 | pass |
| H3 | Sources in this session | 4 | pass |
| status | Client profile is separate | 4 | `scoped-launch` |
| status | No other client names found | 5 | `boundary-check` |
| status | Two redaction rules loaded | 4 | pass |
| label | How it works | 3 | pass |
| H2 | How the client check works | 5 | pass |
| H3 | Name the workspace | 3 | pass |
| sentence | Add the brief and writing rules that belong to one client. | 11 | pass |
| image alt | The sample workspace lists two Northstar sources. | 7 | pass |
| caption | Start with the client brief and source folders. | 8 | pass |
| H3 | Choose each source | 3 | pass |
| sentence | Choose a local folder and agent for this client. | 9 | pass |
| image alt | A session is blocked after text checks fail. | 8 | pass |
| caption | Another client name or redaction term stops the session. | 9 | `boundary-check` |
| H3 | Launch and export | 3 | pass |
| sentence | Open every selected agent in its client profile, then export the delivery record. | 13 | `scoped-launch`, `provenance-export` |
| image alt | A clean session passes all boundary checks. | 7 | pass |
| caption | A delivery record appears after each selected agent confirms startup. | 10 | `validated-provenance` |
| label | Clear limits | 2 | pass |
| H2 | What the app checks | 4 | pass |
| sentence | The desktop app separates each client’s agent credentials and settings in a client profile. | 13 | `scoped-launch` |
| sentence | Your chosen agent may use its own online service. | 9 | limitation |
| sentence | The text check catches named clients and redaction terms before launch. | 11 | `boundary-check` |
| label | Desktop app | 2 | pass |
| H2 | Install the desktop app | 4 | pass |
| sentence | Choose the package for your system when releases are published. | 10 | pass |
| status | Checking the latest release… | 4 | pass |
| action | Download for Linux, macOS, or Windows from GitHub (external site) | 10 | `platform-install` |
| action | Download Apple silicon or Intel build from GitHub (external site) | 10 | `platform-install` |
| instruction | One-step install: curl -fsSL https://freelancer-agent-context.sociobot.in/install.sh \| sh | 7 | `platform-install` |
| sentence | For a direct AppImage download, run chmod +x before opening it. | 10 | pass |
| sentence | Choose Apple silicon or Intel when both builds are listed. | 10 | `platform-install` |
| fallback | Downloads are being published. | 4 | pass |
| action | Open the GitHub release page (external site) | 7 | pass |
| label | Pro license | 2 | pass |
| H2 | Pro pricing | 2 | pass |
| price | $19 once | 2 | `paid-checkout` |
| sentence | Pro lets you create more than two workspaces. | 8 | `plan-limit` |
| sentence | Checks and delivery exports remain available on the free plan. | 10 | `free-core` |
| action | Buy Pro on Sociobot (external site) | 6 | `paid-checkout` |
| action | Restore Pro license | 3 | `license-portability` |
| sentence | Checkout is handled by Sociobot. | 5 | `paid-checkout` |
| action | Request a refund from Sociobot | 5 | `refund-route` |
| action | Read purchase terms | 3 | pass |
| footer | Keep each client’s work in its own workspace. | 8 | pass |
| external link | Built by Param Factory (external site) | 6 | pass |

No landing sentence exceeds 22 words. No landing copy uses a banned marketing term. The first screen states the job, audience, next action, privacy, offline behavior, and price in one breath.

## Terminology

| Concept | One term used |
| --- | --- |
| One client boundary | workspace |
| A permitted agent and folder | source |
| A coding-agent sign-in and settings folder | client profile |
| Text to remove or replace | rule |
| One checked period of work | session |
| Exported JSON evidence | delivery record |
| Paid plan | Pro |
