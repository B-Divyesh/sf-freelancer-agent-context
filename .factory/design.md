# Client Context Firewall — visual thesis and system

Status: **authoritative for M1–M5**

Direction: **dithered/halftone print system**

Executable tokens: `src/styles/tokens.css`

Component contract: `.factory/components.md`

## Direction

**Dithered boundary ledger.** The interface borrows the restraint of a security
logbook and the imperfect ink of a small print studio. Dense halftone fields
make each client boundary visible without turning security into alarmist
theatre. Hard rules, stamped status marks, numbered paper tabs, and a split
redaction motif give the product a recognisable working character.

This fits the product because the user is separating accountable client work,
not watching an abstract security dashboard. The ledger makes scope and proof
feel concrete. Halftone marks sample and transitional material; solid ink marks
real boundaries. The visual distinction reinforces the demo sandbox without
carrying meaning alone.

The site must not become a generic centered hero, three-card feature grid,
gradient blob page, or neon cyber-security scene. Decoration explains a
boundary, source flow, or record; otherwise it is removed.

## Palette

The light treatment is the primary product surface. A dark desktop treatment
is available through `prefers-color-scheme`.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| Paper | `#f3eedf` | `#171916` | page |
| Ink | `#1b211d` | `#f1eddf` | text |
| Muted ink | `#545e56` | `#adb7ad` | supporting text |
| Sheet | `#fffaf0` | `#222720` | raised work areas |
| Rule | `#788378` | `#778276` | borders |
| Signal | `#ad351a` | `#f77a50` | primary action and active marks |
| Signal ink | `#ffffff` | `#171916` | text on signal |
| Safe | `#286a4b` | `#69c692` | passed checks |
| Warning | `#8b5a00` | `#f1bd58` | attention |
| Danger | `#a52e2e` | `#ff8c84` | blocking result |

Every state pairs colour with a word or shape. Text and controls meet WCAG AA.

Measured contrast ratios are 14.12:1 for ink on light paper, 5.82:1 for muted
ink on light paper, 6.36:1 for white on signal, 5.09:1 for warning on light
paper, 15.10:1 for dark-theme ink on dark paper, and 8.55:1 for dark-theme
muted ink. Borders and focus indicators must meet 3:1 against adjacent colors.

## Type and spacing

- Display: **Arial Narrow**, with `Roboto Condensed` and system sans fallbacks.
  Narrow uppercase labels recall docket stamps without downloading a font.
- Body: **Charter**, `Bitstream Charter`, Georgia, serif. It makes client briefs
  feel like working papers rather than a dashboard.
- Utility and data: `ui-monospace`, SFMono-Regular, Consolas, monospace.
- Type scale: 14, 16, 18, 24, 36, and clamp(44–72) px.
- Spacing follows an 8 px base: 4, 8, 16, 24, 32, 48, 64, 96.
- Text measure stops at 68 characters. Controls are at least 44 px tall.
- Sheets and controls use zero radius. A single clipped upper-right corner is
  reserved for records and independent sheets.
- Shadows are a hard 3 px ink offset. There are no soft glows or glass panels.

The chosen stacks are system fonts, so the product makes no font request and
has no flash of invisible text. If a future release self-hosts a face, it may
replace only one family, must use OFL or equivalent licensing, `font-display:
swap`, a unicode subset, and stay inside the 120 KB font budget.

## Shape and interaction grammar

Sheets use squared corners with one clipped upper-right corner. Buttons use a
two-pixel ink shadow and move one pixel when pressed. Client workspaces are
represented by numbered paper tabs. Scoped sources, redaction rules, and
delivery records form a left-to-right boundary check. Dotted halftone fills
mark demo data and never carry essential information.

The desktop app favours a workbench: client rail, active session, and check
ledger. On a phone, the rail becomes a horizontal client picker and the ledger
stacks. The landing page is editorial and asymmetric, not a centred hero or a
feature-card grid.

A passed check exposes one labelled agent-launch control per selected source.
Status text reports the client profile without adding a modal or a second
visual system. A blocked check interrupts the left-to-right source flow with a
split vermilion rule, names the match, and keeps the typed text available.

## Motion policy

The signature motion is a 220 ms print-pass reveal: a fine dot layer settles
as a client session opens. Session results enter once from their source by
eight pixels. Nothing loops. With `prefers-reduced-motion`, transforms and
animated texture are removed and state changes are immediate.

Hover and press feedback takes 150 ms; sheet transitions take 220 ms. Only
`opacity` and `transform` animate. Loading indicators are static under reduced
motion, and no decorative texture receives `will-change`.

## Stack and rendering decision

The public companion and Tauri renderer use Vite with strict, framework-free
TypeScript and semantic HTML/CSS. The existing interaction surface is bounded,
the inherited bundle is small, and sensitive operations already belong behind
typed Rust commands. Keeping the runtime framework-free protects startup time
and avoids a migration before the core workflow is validated.

UI code is split by feature and uses the component contracts below. Revisit
Svelte only after M3 if review evidence shows cross-feature state defects or
repeated manual DOM synchronization. The account API begins in M2 as Rust axum
with PostgreSQL; it has no influence on visual rendering.

## Information architecture and key screens

1. **Landing** — asymmetric job statement and sample action beside the original
   boundary still; then live product preview, three verb-led steps, limits,
   Free/Independent pricing, download, and footer.
2. **Demo and workspace** — numbered client rail, active boundary sheet, and
   delivery ledger. The persistent demo banner owns Reset and Start for real.
3. **Boundary editor** — brief, writing rule, source folders, connector profile,
   and redaction rules read as one docket. Advanced editing sits in a disclosure.
4. **Session preflight** — chosen sources lead into checks, then a clearly
   blocked or passed result. Launch controls name the exact connector.
5. **Delivery and offboarding** — chronological records, sample/real stamp,
   export, backup, and deletion with specific consequences.

## Component and state policy

`.factory/components.md` is the implementation inventory. Components use the
same vocabulary on web and desktop. Every applicable component covers default,
hover, focus-visible, pressed, disabled, loading, empty, success, warning,
error, and offline states. Status combines color with a word, icon, border, or
shape. Buttons are verbs; links navigate; a card is used only for independent
content.

Empty states say what will appear and provide one next action. Loading reserves
the final geometry. Errors preserve user input, say what failed, and name the
next action. Offline mode keeps demo, local workspaces, checks, manual rules,
export, and deletion available; only account, billing refresh, downloads, and
optional rule suggestions ask for a connection.

## Responsive and accessibility rules

- Start at 390 px. Below 640 px the client rail becomes a horizontal tablist,
  the delivery ledger follows the boundary sheet, the first-screen art stacks,
  and safe-area padding protects fixed or sticky controls.
- At 980 px the three-column workbench becomes two columns. At 1280 px and
  above it shows rail, working sheet, and ledger together.
- One `<h1>` and one `<main>` per route. Route changes update metadata, announce
  the page, and focus the new heading. Back and forward restore the route.
- Tabs support arrows, Home, and End. Dialogs trap and restore focus. Every
  action is reachable by keyboard and has a visible three-pixel focus ring.
- Text survives 200% zoom without lost actions or two-axis page scrolling.
  Targets are at least 44×44 px with 8 px between adjacent targets.
- Meaningful images receive purpose-focused alt text. Texture is decorative.
  No required words appear inside an image.
- Axe serious/critical findings, contrast below the stated threshold, keyboard
  traps, and reduced-motion violations block release.

## Performance and asset treatment

The public first load stays at or below 150 KB JavaScript gzip (200 KB hard
limit), 50 KB CSS, 120 KB fonts, and 300 KB mobile hero art. Images declare
dimensions and responsive sources; below-fold captures lazy-load. The hero may
be the only high-priority image. Target LCP is under 2.5 s, INP under 200 ms,
CLS under 0.1, Lighthouse performance at least 90, and accessibility at least
95 on a throttled mobile profile.

## Original asset plan and provenance

The hero is a generated editorial still: two client folders separated by a
physical orange firewall plate, with halftone ink texture. It explains the
boundary without pretending to show the live app. The same source supplies a
1200×630 social crop. Interface icons are hand-authored SVG strokes.

Prompt sheet: “Editorial tabletop still life of two clearly separate project
folders, abstract documents and connector plugs held apart by a thin vermilion
metal divider, cream recycled paper, charcoal ink, muted forest green, coarse
two-colour risograph halftone, tactile print registration, hard side light,
slightly overhead 50mm lens, large quiet negative space, sophisticated
independent magazine art direction; no people, no readable text, no brands, no
logos, no watermark, no gradients, no glowing cyber imagery, no UI mockup.”

Generated with the factory image model (`factory-image`) on 2026-08-28. The
asset is original to this product. Source PNG and prompt sidecar are retained
under `assets/src/`; optimised WebP derivatives ship in `public/art/`.
The three walkthrough images are captures of the product’s own demo, made with
Playwright on 2026-08-28. The touch icon is a crop of the generated hero.

Generated imagery is disclosed on `/art-provenance` and in the footer. It is
never used as evidence of the live product. No third-party stock art, icon
pack, remote font, or template asset is permitted.

## Voice

Short, factual, calm. “Blocked” names a rule result, not a catastrophe. The
same nouns are used throughout: **workspace**, **source**, **rule**, **session**,
**client profile**, and **delivery record**. “Prevents every leak,” “secure,”
and “isolated” never appear without a precise, tested scope. Sentence case is
the default; uppercase belongs only to compact printed state stamps.
