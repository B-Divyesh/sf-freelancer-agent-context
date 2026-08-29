# Polish round 1 — repair record

Candidate repaired from `de17a3b2628f9d0cc1652a050c34778f4808fc41` using review `2feb6a7ff2bb126ca8cc2e4ea8801c91c74de596`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the untestable “Set the boundary once” heading with “How the client check works.” | `npm run test:e2e`; landing screenshot on local browser |
| F-1-2 | Removed unsigned-build copy from the landing. | `npm run test:e2e`; download panel source review |
| F-1-3 | Narrowed public billing copy to the tested Sociobot checkout path. | `@claim:paid-checkout` |
| F-1-4 | Added product-specific “Request a refund from Sociobot” mail link on pricing and terms. | `@claim:refund-route` |
| F-1-5 | Added `/art-provenance`, a footer link, and source/derivative record test. | `@claim:art-provenance` |
| F-1-6 | Removed the untested license-verification sentence from README. | README copy audit |
| F-1-7 | Removed the untested embedded-provider assertion from README. | README copy audit |
| F-1-8 | Recast release workflow text as maintainer instructions. | README copy audit |
| F-1-9 | Replaced decorative label with informative folder label. | landing browser check |
| F-1-10 | Renamed preview heading to “Preview a checked client session.” | landing browser check |
| F-1-11 | Renamed limits heading to “What the app checks.” | landing browser check |
| F-1-12 | Renamed install heading to “Install the desktop app.” | landing browser check |
| F-1-13 | Renamed pricing heading to “Pro pricing.” | landing browser check |
| F-1-14 | Defined and consistently used “client profile.” | README and `.factory/copy-audit.md` |
| F-1-15–F-1-21 | Rewrote the documented device, browser, credential, record, update, and hosting jargon in plain language. | README copy audit |
| F-1-22 | Renamed the license action “Restore Pro license.” | landing browser check |
| F-1-23 | Added full metadata, navigation, footer, build version, and legal links to static 404. | `npm run test:e2e`; `/not-a-real-page` route test |
| F-1-24 | Replaced the metaphorical 404 heading with “This page was not found.” | 404 route test |
| F-1-25 | Save scroll before push navigation; restore it after Back/Forward without moving focus into view. | `Back navigation preserves landing scroll position` |
| F-1-26 | Added local JSON backup/export and reviewed import with saved-path confirmation; backups omit sign-in reminders, license data, and delivery records. | `@claim:workspace-backup` |

The requested direct demo route is now `/?demo=1`; it enters the separate `demo:workspace-state` namespace and shows the persistent banner, reset, and real-start controls. `/demo` remains supported.
