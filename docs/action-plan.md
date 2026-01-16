# Aramancia Tracker: Action Plan

## Objectives
1. Stabilize and decouple core state management to eliminate the App.tsx “God component” anti-pattern.
2. Improve runtime safety with schema validation at persistence and API boundaries.
3. Fix performance bottlenecks in large minion lists.
4. Encode domain rules (reassertion cycle, concentration checks, equipment/AC derivation) as deterministic, testable logic.
5. Ensure offline-first behavior and reliable persistence.

## Phased Delivery Plan

### Phase 0 — Baseline Audit & Safety Net (1–2 days)
- Inventory current state shape, persistence locations, and API usage.
- Add/verify lint + typecheck + test commands in CI (or document local equivalents).
- Identify top offenders in render time (MinionList, CombatOverlay) and add profiling notes.

**Exit criteria**
- Baseline performance and current behavior documented.
- Clear list of components slated for refactor.

### Phase 1 — State Foundation (Redux Toolkit + Feature Slices) (3–5 days)
- Introduce Redux Toolkit store and feature slices:
  - `necroSlice` for character state (HP, slots, concentration, stats).
  - `minionSlice` using entity adapter for normalized minions.
  - `combatSlice` for initiative/rounds.
  - `configSlice` for app settings.
- Wire Provider and move App.tsx to a thin layout shell.

**Exit criteria**
- Core state in Redux slices with selectors.
- App renders with no functional regression.

### Phase 2 — Unified Persistence + Zod Validation (3–5 days)
- Implement central persistence in listener middleware with debounced writes.
- Add Zod schemas for local storage hydration and API payloads.
- Add versioned migration path for save data.

**Exit criteria**
- Only one persistence pathway.
- Invalid/legacy data handled gracefully.

### Phase 3 — Performance: Virtualized Minion List (2–4 days)
- Replace MinionList render loop with TanStack Virtual.
- Ensure React 19-compatible ref handling for measurement.
- Validate dynamic height measurement for expandable minion cards.

**Exit criteria**
- Smooth scroll at 20–50 minions.
- No noticeable input lag on rapid updates.

### Phase 4 — Rules Engine & Middleware Logic (3–6 days)
- Implement concentration check middleware triggered by damage events.
- Build reassertion cycle logic (grouped expirations, slot availability warnings).
- Add equipment-based AC derivation and polymorphic minion stats.

**Exit criteria**
- Concentration checks enforced automatically.
- Reassertion warnings are accurate.
- Derived stats are consistent and type-safe.

### Phase 5 — Offline-First & API Integration (2–4 days)
- Use RTK Query for Open5e data with local cache fallback.
- Validate API input with Zod sanitizers (dirty numeric fields).
- Ensure PWA caches the app shell and key data payloads.

**Exit criteria**
- App bootstraps with cached data offline.
- API schema validation errors are surfaced cleanly.

### Phase 6 — Testing & QA (ongoing; dedicated 2–3 days final pass)
- Unit tests for reducers and middleware (concentration, slot recovery, reassertion).
- Schema tests for Zod transformations.
- Performance checks with DevTools and scripted interactions.

**Exit criteria**
- Critical domain logic covered by tests.
- No regressions on key user flows.

## Risk Management
- **Risk:** Data migration bugs. **Mitigation:** Versioned migrations + Zod validation.
- **Risk:** Performance regressions. **Mitigation:** Virtualization + profiling gates.
- **Risk:** Rule logic complexity. **Mitigation:** Middleware + unit tests.

## Prioritized Backlog (First 2 Weeks)
1. Create Redux store and slices.
2. Move persistence to listener middleware.
3. Add Zod validation for storage and API.
4. Virtualize MinionList.
5. Concentration checks middleware.

## Success Metrics
- <10ms scripting time per frame when scrolling minion list.
- Zero crashes on malformed local storage or API data.
- Automated concentration checks and accurate reassertion warnings.

## Deliverables Summary
- Redux Toolkit store + feature slices.
- Unified persistence + Zod validation + migration utilities.
- TanStack Virtual minion list.
- Middleware-based rules engine.
- Test coverage for core domain logic.
