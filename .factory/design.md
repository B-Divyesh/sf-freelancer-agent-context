# Client Context Firewall — visual thesis

## Direction

**Dithered boundary ledger.** The interface borrows the restraint of a security
logbook and the imperfect ink of a small print studio. Dense halftone fields
make each client boundary visible without turning security into alarmist
theatre. Hard rules, stamped status marks, and a split redaction motif give the
product a recognisable working character.

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

## Type and spacing

- Display: **Arial Narrow**, with `Roboto Condensed` and system sans fallbacks.
  Narrow uppercase labels recall docket stamps without downloading a font.
- Body: **Charter**, `Bitstream Charter`, Georgia, serif. It makes client briefs
  feel like working papers rather than a dashboard.
- Utility and data: `ui-monospace`, SFMono-Regular, Consolas, monospace.
- Type scale: 14, 16, 18, 24, 36, and clamp(44–72) px.
- Spacing follows an 8 px base: 4, 8, 16, 24, 32, 48, 64, 96.
- Text measure stops at 68 characters. Controls are at least 44 px tall.

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

The repaired launch action remains part of the same ledger grammar. A passed
check exposes one labelled agent-launch control per selected source. Status
text reports the client-only profile path without adding a modal or a second
visual system.

## Motion policy

The signature motion is a 220 ms print-pass reveal: a fine dot layer settles
as a client session opens. Session results enter once from their source by
eight pixels. Nothing loops. With `prefers-reduced-motion`, transforms and
animated texture are removed and state changes are immediate.

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

## Voice

Short, factual, calm. “Blocked” names a rule result, not a catastrophe. The
same nouns are used throughout: **workspace**, **source**, **rule**, **session**,
and **delivery record**.
