# Fuyuki Implementation Tasks

## Phase 0: Planning
- [x] Audit aramancia-tracker repository
- [x] Document module classification (keep/modify/replace)
- [x] Define warlock domain model (Pact Magic, Arcanum, Invocations)
- [x] Create Kyoto minimalist UX specification
- [x] Design data schema for WarlockCharacterData
- [x] Create Mermaid diagrams (mindmap, ER, state, flow, architecture, migration)
- [x] Plan 8-PR implementation chunks
- [x] Define test inventory
- [x] Create day-by-day execution schedule
- [x] **User review of implementation plan** ✓ Approved

---

## Phase 1: Fork & Rename (PR0)
- [x] Create fuyuki directory/repo
- [x] Update `package.json` name and metadata
- [x] Update `index.html` title and branding
- [x] Change sessionStorage keys to `fuyuki-*`
- [x] Apply Kyoto color palette to `index.css`
- [x] Update `README.md` for Fuyuki

## Phase 2: Data Model (PR1)
- [x] Add WarlockCharacterData interface to `types/index.ts`
- [x] Add Invocation interface
- [x] Create `initialState.ts` for warlock defaults
- [x] TypeScript compiles without errors

## Phase 3: Pact Magic Slots (PR2)
- [x] Create `warlockRules.ts` with slot tables
- [x] Refactor `characterSlice.ts` for Pact Slots
- [x] Implement `PactSlotsWidget.tsx`
- [x] Integrate Arcanum tracker
- [x] Update `StatsView.tsx` with Warlock widgetssion
- [ ] Widget displays orb-based slots

## Phase 4: Short Rest Recharge (PR3)
- [ ] Add shortRestCompleted action to characterSlice
- [ ] Modify RestView to restore pact slots
- [ ] Write unit tests for short rest behavior

## Phase 5: Mystic Arcanum (PR4)
- [ ] Add arcanum state to characterSlice
- [ ] Create ArcanumWidget component
- [ ] Integrate into PactMagicView
- [ ] Tests for level 11+ availability

## Phase 6: Invocations (PR5)
- [ ] Create `invocations.ts` data file
- [ ] Add invocations state to characterSlice
- [ ] Create InvocationCard component
- [ ] Create InvocationsView
- [ ] Tests for toggle and limited use

## Phase 7: Spells Known (PR6)
- [ ] Create `warlockSpells.ts`
- [ ] Add spellsKnown/cantripsKnown state
- [ ] Create PactMagicView
- [ ] Tests for spell count limits

## Phase 8: UI Polish (PR7)
- [ ] Apply Kyoto palette consistently
- [ ] Update all views with consistent styling
- [ ] Visual inspection pass

## Phase 9: Cleanup (PR8)
- [ ] Remove WildShapeWidget
- [ ] Remove MinionDrawer
- [ ] Remove wizard-only spell data
- [ ] Remove mage armor toggle from AC
- [ ] Build passes with no dead imports

## Phase 10: Verification & Deploy
- [ ] Run preflight.sh
- [ ] Manual testing of core flows
- [ ] Deploy to Firebase Hosting

---

## MSP Cutoff Line
If behind schedule, ship with:
- ✓ Pact slots + short rest recharge
- ✓ Spells known display
- ✓ HP/AC/Concentration
- ✓ Basic Kyoto theme
- ✓ Persistence
