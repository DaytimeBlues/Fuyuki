---
milestone: Refactor & E2E Deep Dive
version: 1.1.0
updated: 2026-01-20
---

# Roadmap

> **Current Phase:** 1 - Infrastructure Audit
> **Status:** executing

## Must-Haves (from SPEC)

- [ ] Core E2E stability (100% pass)
- [ ] Decomposed `characterSlice` (modular architecture)
- [ ] Visual regression testing integrated
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

**Status:** 🔄 In Progress
**Objective:** Decompose `characterSlice` and optimize state logic.
**Depends on:** Phase 1
**Plans:**

- [ ] Plan 2.1: Implement `healthSlice` and `warlockSlice`
- [ ] Plan 2.2: Implement `statSlice` and `inventorySlice`
- [ ] Plan 2.3: Update UI components to use new selectors

---

### Phase 3: E2E Enhancement

**Status:** ⬜ Not Started
**Objective:** Add visual regression and accessibility automation.
**Depends on:** Phase 2
**Plans:**

- [ ] Plan 3.1: Add `visual.spec.ts`
- [ ] Plan 3.2: Expand `accessibility.spec.ts`

---

### Phase 4: Final Audit & Polish

**Status:** ⬜ Not Started
**Objective:** Verify aesthetics and performance under load.
**Depends on:** Phase 3
**Plans:**

- [ ] Plan 4.1: Perform "Kyoto Noir" interaction audit
- [ ] Plan 4.2: Verify mobile responsiveness

---

## Progress Summary

| Phase | Status | Plans | Complete |
| ------- | -------- | ------- | ---------- |
| 1 | ✅ | 2/2 | 100% |
| 2 | 🔄 | 0/3 | 0% |
| 3 | ⬜ | 0/2 | 0% |
| 4 | ⬜ | 0/2 | 0% |

---

## Status Icons

- ⬜ Not Started
- 🔄 In Progress
- ✅ Complete
- ⏸️ Paused
- ❌ Blocked
