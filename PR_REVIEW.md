# PR Review: Fuyuki (Aramancia Tracker) — Ideas, Risks, and Conceptual Maps

> Scope: This review focuses on the technical rundown provided for the Fuyuki tracker. It assumes SRD 5.1 compliance, a PWA/Capacitor delivery target, and a Kyoto Noir theme. The document is written as a PR-style review with actionable suggestions.

## Executive Summary

The stack (React 19 + Vite 7 + TS + RTK + Tailwind 4) is solid for a high‑performance PWA. The SRD math layer, Zod validation, and listener middleware persistence are strong foundations. The biggest opportunities are:

1. **Stability**: Add a global error boundary and hard input bounds to prevent runtime crashes and data corruption.
2. **Performance**: Virtualize any long lists and aggressively memoize derived stats with selectors.
3. **Rules Compliance**: Centralize SRD rule logic in a pure function layer with strict unit tests and invariants.
4. **Native Bridge**: Initialize Capacitor early and integrate haptics/camera carefully to avoid web-only regressions.

## High-Level Architecture Map (Conceptual)

```
 UI (React + Tailwind + HeadlessUI)
   ├── Character Panel (HP, AC, Stats, Pact Slots)
   ├── Combat Panel (Initiative, Round)
   ├── Spellbook + Arcanum
   ├── MinionList (virtualized)
   └── Ritual/Invocations
         ↓
 Redux Toolkit (Slices + Selectors)
   ├── characterSlice (stats, HP, AC, pact slots)
   ├── combatSlice (initiative, rounds)
   ├── spellbookSlice (spells, usage)
   └── minionSlice (future, for virtualized list)
         ↓
 SRD Rules Engine (src/utils/srdRules.ts)
   ├── AC rules
   ├── HP rules
   ├── Ability mods + proficiency
   └── Warlock pact magic rules
         ↓
 Persistence (listener middleware)
   ├── debounce writes
   ├── Zod validation
   └── migrations
         ↓
 Native Bridge (Capacitor)
   ├── Haptics
   ├── Camera
   └── Filesystem (future)
```

## Review Comments (Comprehensive & Exhaustive)

### ✅ Architecture & Data Flow
**Observation:** The proposed layering is clean. SRD logic isolated into pure functions, Redux for state, UI consumes via selectors.  
**Recommendation:** Add a clear interface contract between UI and rules engine to prevent UI-driven rule changes.

- Define a `RulesService` interface (pure functions + deterministic input/output).
- Use RTK selectors to derive computed values from minimal stored state (e.g., AC derived from armor + dex + shield).
- Keep `characterSlice` minimal; computed values should live in selectors to avoid stale state.

### ✅ SRD 5.1 Rules Compliance
**Observation:** SRD math is foundational.  
**Recommendation:** Create explicit test matrices for all AC/HP rules with canonical SRD examples.

- **AC**: Unarmored, light, medium, heavy, mage armor, shield interactions.
- **HP**: First level max, subsequent average, min 1/level. Explicitly document rounding.
- **Warlock**: Pact magic slots scale by level; ensure short rest resets.

### ✅ Input Sanitization & Bounds
**Observation:** Input bounds (1–9999) is prioritized.  
**Recommendation:** Centralize numeric coercion and validation in a single utility function.

```
sanitizeNumber(input, { min: 1, max: 9999, fallback: 1 })
```

Use it everywhere to avoid per-component drift.

### ✅ State & Persistence
**Observation:** Listener middleware with debounce and Zod hydration is excellent.  
**Recommendation:** Include schema versioning and explicit migration paths.

- `schemaVersion` field in root state.
- Migrations as pure functions.
- If validation fails, fall back to defaults + error toast, not silent failure.

### ✅ Error Handling
**Observation:** Global error boundary is in Phase A.  
**Recommendation:** Add a `GlobalErrorBoundary.tsx` and wrap the entire app in `main.tsx` or `App.tsx`.

- Provide a soft recovery button (reset state to defaults).
- Log error to console only in dev.

### ✅ Performance & Virtualization
**Observation:** Minion list virtualization planned.  
**Recommendation:** Extend virtualization to any list > 20 items.

- Use `tanstack-virtual`.
- Keep item heights fixed if possible for performance.
- Memoize list item renderers using `React.memo`.

### ✅ Redux Selectors & Memoization
**Observation:** useCallback/useMemo strategy is in place.  
**Recommendation:** Prefer selector memoization with `reselect` and keep UI hooks thin.

- Don’t compute derived stats in component render.
- Use `createSelector` to compute AC, DC, and spell slots.

### ✅ Theming & UX
**Observation:** Kyoto Noir theme is defined by tokens.  
**Recommendation:** Create a `theme.ts` file exporting tokens, and stick to Tailwind class tokens.

- `bg-zinc-950` for deep charcoal.
- `text-gold-400` or similar for accents.
- Avoid custom hex in component files; keep it centralized.

### ✅ Warlock Pro Features
**Observation:** Mystic Arcanum and Eldritch Invocations are core.  
**Recommendation:** Model them as distinct systems to avoid slot confusion.

- **Mystic Arcanum**: Track each spell level 6–9 separately (once/long rest).
- **Invocations**: Use toggleable features with active/passive flags.
- Create a `WarlockFeaturesPanel` to consolidate pact slots, arcanum, and invocations.

### ✅ Concentration Middleware
**Observation:** Concentration prompts on damage are planned.  
**Recommendation:** Implement as middleware to avoid UI duplication.

- On damage action, prompt if any spell is marked as concentrating.
- Save last damage taken to compute DC (max(10, damage/2)).
- Provide an override/skip toggle for house rules.

### ✅ Capacitor & Native
**Observation:** Capacitor setup is in Phase A.  
**Recommendation:** Add `capacitor.config.ts`, but guard all native calls.

- Check `Capacitor.isNativePlatform()` before using Haptics or Camera.
- Provide web fallbacks (no‑op or toast).

### ✅ Testing Strategy
**Observation:** Preflight is required.  
**Recommendation:** Expand tests to cover SRD logic with pure functions.

- `srdRules.test.ts` with clear cases.
- Snapshot test UI theme tokens (optional).

## Detailed Conceptual Maps

### 1) SRD Rules Engine Map
```
Input: characterState
  ├─ level
  ├─ armorType
  ├─ dexMod
  ├─ conMod
  └─ class (warlock)
       ↓
Rules Engine
  ├─ AC rules
  ├─ HP rules
  ├─ Proficiency
  └─ Pact Magic rules
       ↓
Output:
  ├─ armorClass
  ├─ maxHP
  ├─ proficiencyBonus
  └─ pactSlots
```

### 2) State Derivation Map
```
Redux Store (source of truth)
  ├─ characterSlice (raw stats)
  ├─ combatSlice (initiative, round)
  └─ spellbookSlice (prepared, used)
       ↓
Selectors (reselect)
  ├─ selectArmorClass
  ├─ selectSpellSaveDC
  └─ selectPactSlotsRemaining
       ↓
UI Components
  ├─ CharacterPanel
  ├─ CombatPanel
  └─ SpellbookPanel
```

### 3) Persistence Flow Map
```
User Input → Redux Action → Listener Middleware (debounced)
  └─ serialize state
      └─ Zod validation
          ├─ ok → localStorage
          └─ fail → log + fallback to defaults
```

### 4) Runtime Safety Map
```
App Root
  └─ GlobalErrorBoundary
      ├─ shows fallback UI
      ├─ reset state
      └─ provides error details (dev only)
```

## Exhaustive Suggestions Checklist

### Phase A (Stability & Bridge)
- [ ] Add `GlobalErrorBoundary.tsx`, wrap app root.
- [ ] Add `capacitor.config.ts` with appId/appName.
- [ ] Sanitize numeric inputs (min/max).
- [ ] Create migration layer for state hydration.
- [ ] Add unit tests for SRD rule edge cases.

### Phase B (Warlock Pro Features)
- [ ] Mystic Arcanum panel (6th–9th).
- [ ] Eldritch Invocation toggles.
- [ ] Concentration prompt middleware.

### Phase C (Performance + Experience)
- [ ] Virtualize MinionList using tanstack-virtual.
- [ ] Memoize list renderers with `React.memo`.
- [ ] Use selectors for all derived stats.
- [ ] Add optional haptic feedback with Capacitor.

## Potential Risks & Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| SRD misimplementation | Rule accuracy errors | Centralized rules + tests |
| Input coercion bugs | Data corruption | Shared sanitize function |
| Over-rendering | Performance drop on device | Reselect + virtualization |
| Native API failure | Crash on web | Guard with platform checks |

## Final Recommendation

Proceed with Phase A changes immediately (error boundary, Capacitor init, input sanitization). Then lock down the SRD rules engine with tests before expanding Warlock Pro features.
