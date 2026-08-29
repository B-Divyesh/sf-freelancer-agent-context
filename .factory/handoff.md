# Verification 6 handoff — FAIL

## Outcome

Candidate `0b255bd355f4cba10388460dbb22c130ddb65376` was independently tested against <https://freelancer-agent-context.sociobot.in> on 29 August 2026 UTC.

**Release verdict: FAIL.**

The full record is in `.factory/verification-6.md`. No product code was changed.

## Release blocker

### P1 — Failed desktop launch creates false delivery provenance

The published Linux AppImage reports that an agent opened and enables **Export latest record** when the terminal wrapper starts but immediately exits and no agent opens.

Reproduction used a real workspace folder and a real `codex` command while mapping the only discoverable `x-terminal-emulator` to `/bin/false`. The native call resolved because the wrapper process was spawned. The UI then displayed “Every selected agent opened,” recorded “1/1 agents opened,” and enabled export even though no terminal or agent existed.

Screenshot: `.factory/qa-evidence/verification-6/native-false-launch.png`.

Cause: `src-tauri/src/lib.rs:376-400` returns success on terminal `Command::spawn()` without checking wrapper or connector outcome. `src/main.ts:318-350` turns that resolved call into an opened-agent receipt and provenance record.

This violates the `scoped-launch` and `validated-provenance` claims and the core job-to-be-done. Existing tests do not cover the platform wrapper exiting or the connector failing after spawn.

## Required next step

Do not release this candidate. Require positive confirmation that the selected connector started in the isolated profile before recording a launch. Failed wrappers/connectors must keep provenance export disabled and provide a recoverable error. Add claim tests for missing, non-executable, and immediately failing launchers/connectors on each supported platform, then rebuild the packages and repeat independent verification.

## Verification summary

- All 23 exact commands in `.factory/claims.json` passed after installing repository dependencies and declared Linux Tauri prerequisites.
- Cold first-read passed: the first screen plainly identifies the job, audience, first action, and one-click sample demo.
- `npm run typecheck`, `npm run lint`, `npm test`, Rust tests, production web build, and production Tauri build passed.
- Live browser demo normal, boundary, empty, invalid, recovery, reset, and offline paths passed.
- Desktop and 390 px mobile checks passed. Keyboard skip/focus, 44 px targets, reduced motion, and focus visibility passed.
- Axe reported 0 serious/critical findings across all public routes in light and dark modes. Console/page errors were 0.
- Demo request logging found no workspace data leaving origin. Only public GitHub release metadata was requested externally.
- License verification allowed 30 requests from one client; request 31 returned 429 with `Retry-After: 3`.
- Candidate production assets byte-match the live deployment.
- Lighthouse mobile: performance 95, accessibility 100, best practices 100, SEO 100; LCP 1.5 s, CLS 0.
- JavaScript 45,809 bytes, CSS 17,149 bytes, fonts 0, hero 69,934 bytes; all budgets passed.
- Release `v0.1.7` contains Mac, Windows, and Linux packages, checksums, and `latest.json`. The Linux DEB checksum passed, `install.sh` verified its download, and the AppImage rendered under its extraction fallback.

## Re-run

```bash
npm ci
npm run typecheck
npm run lint
npm test
cargo test --manifest-path src-tauri/Cargo.toml
npm run build
npm run tauri -- build
```

The browser verification entry point is <https://freelancer-agent-context.sociobot.in/?demo=1>.

## Needs operator action

- Block release until the P1 is fixed, packages are rebuilt, and the packaged launch path is independently retested.
- Published desktop packages are unsigned. Future signing still needs the documented Apple and Windows certificate secrets.
