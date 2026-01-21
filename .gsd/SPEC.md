# SPEC.md — Project Specification

> **Status**: `FINALIZED`
>
> ⚠️ **Planning Lock**: No code may be written until this spec is marked `FINALIZED`.

## Vision

**Fuyuki** is a "Best-in-Class" Progressive Web App (PWA) designed specifically for high-level **Warlock/Necromancer** play in Dungeons & Dragons 5th Edition.

## Goals

1. **Mental Load Reduction** — Focus on roleplay while the app handles complex RAW math.
2. **Visual Excellence** — "Kyoto Noir" aesthetic (Gold/Void) with premium animations.
3. **Rock-Solid Stability** — Industry-standard E2E coverage for all core combat/spell logic.
4. **Modularity** — Clean Redux state structure to avoid "God Slices".

## Non-Goals (Out of Scope)

- Full character creation engine (Focus is on play/tracking).
- Multi-user real-time syncing (Current focus is local session storage).
- Support for non-SRD content without manual input.

## Constraints

- **Performance** — Must remain fluid with 50+ minions (undead horde).
- **Aesthetics** — Must adhere strictly to "Kyoto Noir" (Outfit/Inter, parchment/gold).
- **Standards** — No `any` type, zero console errors, semantic HTML.

## Success Criteria

- [ ] 100% pass rate on core E2E combat specs.
- [ ] Visual regression tests passing for mobile/tablet/desktop.
- [ ] Accessibility score > 90 on Lighthouse.
- [ ] `characterSlice.ts` decomposed into < 150 line sub-slices.

## Technical Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| React 19 + Vite 7 | Must-have | Latest stable ecosystem. |
| Redux Toolkit | Must-have | Centralized state with validation. |
| Playwright E2E | Must-have | Visual and functional testing. |
| Tailwind CSS 4 | Must-have | Modern variable-driven styling. |

---

*Last updated: 2026-01-20*
