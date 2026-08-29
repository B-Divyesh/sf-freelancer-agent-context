# Client Context Firewall — component inventory

This inventory is the UI contract for the public companion and Tauri renderer.
Builders reuse these components before inventing a new pattern. Names describe
purpose, not appearance. Tokens come from `src/styles/tokens.css`.

| Component | Purpose | Required variants and states | Accessibility contract |
| --- | --- | --- | --- |
| `AppFrame` | Shared header, footer, page landmarks, and route announcement | web, desktop, demo, offline, compact mobile | skip link; one `main`; labelled nav; polite route live region; real footer links |
| `DemoBanner` | Makes sandbox mode persistent and explicit | active, resetting, offline | `aside` with label; Reset button; Start for real link |
| `BoundarySheet` | Holds one client's brief and rules | read, edit, empty, loading, error | labelled section; heading owns sheet; no card nesting |
| `WorkspaceTabs` | Selects one client workspace | active, inactive, overflow mobile, keyboard focus | `tablist`; arrows/Home/End; roving tabindex |
| `SourceRow` | Selects a folder/connector for a session | unchecked, checked, unavailable, path-error | real checkbox; label includes connector and folder state |
| `ConnectorBadge` | Names connector and profile status | Codex, Claude, Gemini; ready, needs sign-in, unavailable | visible text, never icon/color alone |
| `RuleRow` | Shows or edits one block/redact rule | enabled, disabled, editing, invalid, removable | bound fields; mode described in text; remove names target |
| `StateStamp` | Compact sample/pass/block/real marker | sample, passed, blocked, unconfirmed, offline | state word in DOM; shape and color are supplemental |
| `ActionControl` | Performs an action or navigates | primary, secondary, text, danger; button/link; hover, pressed, disabled, busy | native element by behavior; 44 px; busy announced; focus visible |
| `Field` | Label, control, help, and error unit | input, textarea, select; required, optional, invalid, disabled | explicit label; `aria-describedby`; error live when submitted |
| `Disclosure` | Hides advanced boundary editing | closed, open, error-containing | native `details/summary`; 44 px summary; state announced |
| `Dialog` | Create, import, delete, or confirm | default, destructive, busy, form-error | native dialog; focus trap/restore; Escape; labelled title |
| `FeedbackPanel` | Reports recoverable page, storage, auth, connector, or offline state | information, success, warning, retryable error, terminal error, offline | `status` or `alert` chosen by urgency; plain cause and next action; preserves input |
| `PreflightChecklist` | Explains every check before launch | ready, checking, passed, blocked, partial error | ordered result list; active state announced without focus theft |
| `ResultPanel` | Shows pass/block and launch choices | passed, blocked, launcher error, canceled | receives focus after submit; heading names outcome and scope |
| `DeliveryLedger` | Lists confirmed or sample records | empty, sample, confirmed, unconfirmed, export error | ordered list; dates and status are readable text |
| `EmptyState` | Explains absent work and first action | first workspace, no records, no rules, no search result | heading + plain reason + one result-named action |
| `LoadingPlaceholder` | Reserves final layout while loading | row, sheet, ledger; reduced motion | `aria-busy`; static halftone under reduced motion |
| `PricingRow` | Compares Free and Independent | current, available, checking, expired | semantic list/table; price and renewal are text; no fake urgency |
| `ProvenanceViewer` | Shows canonical sample/real delivery data | sample, verified, invalid, sanitized share | text alternative for hash/state; copy and download are separate |

## Composition rules

- Landing uses `AppFrame`, one editorial hero, a live `BoundarySheet` preview,
  steps, limits, and `PricingRow`. It is
  not composed from a generic card grid.
- Demo uses `AppFrame` + `DemoBanner` + `WorkspaceTabs` + `BoundarySheet` +
  `PreflightChecklist` + `DeliveryLedger`. Demo components receive a demo
  storage adapter; they never choose a namespace themselves.
- The desktop session uses the same composition with a native adapter. Only a
  passed `ResultPanel` may expose connector launch actions.
- `StateStamp` can support a heading but never replace it. `InlineNotice` does
  not replace a field error. `Dialog` is not used for routine reading.
- A component may accept content and callbacks, but storage, billing, auth,
  gateway, filesystem, and process calls belong in services or native commands.

## Review checklist

For each component changed in a milestone, capture the applicable states at
390 px and desktop width; exercise keyboard behavior; emulate dark and reduced
motion; verify 200% text; run Axe; and check every state uses the words in the
terminology table. New shared patterns must be added here and to the design
review before use.
