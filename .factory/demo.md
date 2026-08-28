# Demo sandbox

- URL: `https://freelancer-agent-context.sociobot.in/demo` or local `http://localhost:5173/demo`.
- Sample data: Northstar Coffee and Juniper Legal workspaces, four scoped sources, four redaction rules, client briefs, and writing rules.
- Reset: choose **Reset demo** in the persistent demo banner.
- Leave: choose **Start for real**. Demo changes are discarded with the browser session and never copied into a real workspace.
- Storage: demo uses `sessionStorage` key `demo:workspace-state`. The browser preview uses `localStorage` prefix `ccf:`. The Tauri app uses its encrypted device vault instead.

The verifier can trigger a clean pass with the seeded account. Changing the account or adding “Juniper Legal” to the draft demonstrates a blocked session.
