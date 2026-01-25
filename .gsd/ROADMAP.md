---
milestone: Refactor & E2E Deep Dive
version: 1.2.0
updated: 2026-01-25
---

# Roadmap

> **Current Phase:** 3 - Tactical Advisory Layer
> **Status:** planning

## Must-Haves (from SPEC)

- [x] Core E2E stability (100% pass)
- [x] Decomposed `characterSlice` (modular architecture)
- [x] Visual regression testing integrated
- [ ] "Kyoto Noir" aesthetic audit complete

---

## Phases

### Phase 1: Infrastructure Audit

**Status:** ✅ Complete
**Objective:** Establish baseline stability and identify technical debt.
**Plans:**

- [x] Plan 1.1: Run baseline E2E suite
- [x] Plan 1.2: Identify "God Slices" and debt

---

### Phase 2: Structural Refactor

**Status:** ✅ Complete
**Objective:** Decomposed character state into modular slices (health, warlock, stats, inventory).
**Depends on:** Phase 1
**Plans:**

- [x] Plan 2.1: Implement `healthSlice` and `warlockSlice`
- [x] Plan 2.2: Implement `statSlice` and `inventorySlice`
- [x] Plan 2.3: Update UI components to use new selectors

---

### Phase 3: Tactical Advisory Layer (NEW)

**Status:** 🔄 In Progress
**Objective:** Implement the "Morphic" logic for Mental Load Reduction in combat.
**Depends on:** Phase 2
**Plans:**

- [ ] Plan 3.1: Implement recent action parsing in `combatSlice`
- [ ] Plan 3.2: Create `TacticalWidget` for suggested actions
- [ ] Plan 3.3: Integrate "Undead Command" logic into the advisor

---

### Phase 4: Kyoto Noir Polish

**Status:** ⬜ Not Started
**Objective:** Audit interactivity, haptics, and animations.
**Depends on:** Phase 3
**Plans:**

- [ ] Plan 4.1: Perform "Kyoto Noir" interaction/haptic audit
- [ ] Plan 4.2: Verify mobile responsiveness (Fitts's Law)
- [ ] Plan 4.3: Implement staggered transitions for all views

---

### Phase 5: E2E Enhancement & Visual Testing

**Status:** ⬜ Not Started
**Objective:** Add visual regression and accessibility automation.
**Depends on:** Phase 4
**Plans:**

- [ ] Plan 5.1: Add `visual.spec.ts` for Kyoto Noir regression
- [ ] Plan 5.2: Expand `accessibility.spec.ts`

---

## Progress Summary

| Phase | Status | Plans | Complete |
| ------- | -------- | ------- | ---------- |
| 1 | ✅ | 2/2 | 100% |
| 2 | ✅ | 3/3 | 100% |
| 3 | 🔄 | 0/3 | 0% |
| 4 | ⬜ | 0/3 | 0% |
| 5 | ⬜ | 0/2 | 0% |

---

## Status Icons

- ⬜ Not Started
- 🔄 In Progress
- ✅ Complete
- ⏸️ Paused
- ❌ Blocked
