# Combat Stress Test - Manual Testing Guide

## Overview
This guide provides a complete checklist for stress-testing all combat mechanics in Fuyuki Warlock Tracker.

## Phase 1: Minion Management

### 1.1 Raise Skeleton
1. Navigate to **Combat** view
2. Click **Minion Manager** (bottom right)
3. Click **"Raise Skeleton"**
4. **Verify:**
   - [ ] Skeleton appears in minion list
   - [ ] HP shows 13
   - [ ] AC shows 13
   - [ ] Name: "Skeleton 1"

### 1.2 Raise Zombie
1. Click **"Raise Zombie"**
2. **Verify:**
   - [ ] Zombie appears in minion list
   - [ ] HP shows 22
   - [ ] AC shows 8
   - [ ] Name: "Zombie 1"

### 1.3 Raise Multiple Skeletons
1. Click **"Raise Skeleton"** 2 more times
2. **Verify:**
   - [ ] 3 total skeletons
   - [ ] Names increment: Skeleton 1, 2, 3
   - [ ] All have correct HP/AC

### 1.4 Modify Minion HP
1. Click **+** on Skeleton 1
2. **Verify:**
   - [ ] HP increases to 14
   - [ ] Color stays green (HP > max/2)

### 1.5 Damage Minion to 0 HP
1. Click **-** repeatedly until HP reaches 0
2. **Verify:**
   - [ ] HP shows 0
   - [ ] Color changes to red
   - [ ] Option to remove minion or status indicator appears

### 1.6 Minion Performance Test
1. Raise 10+ minions
2. **Verify:**
   - [ ] List scrolls smoothly
   - [ ] No lag when adding/removing minions
   - [ ] All minions remain accessible
   - [ ] Memory usage stable (check DevTools if available)

**Screenshot Artifact:** Save screenshot as `combat_minion_stress.png`

---

## Phase 2: HP Edge Cases

### 2.1 HP to 0
1. Set current HP to 0
2. **Verify:**
   - [ ] HP shows 0
   - [ ] Death save section appears
   - [ ] HP bar empty

### 2.2 Negative HP
1. Try to set HP below 0 (if manual input allows)
2. **Verify:**
   - [ ] HP clamped at 0 or allows negative
   - [ ] Character marked as "Dead" if below negative max

### 2.3 HP Above Max
1. Set HP to 5 above max
2. **Verify:**
   - [ ] HP capped at max value
   - [ ] No overflow

### 2.4 Temp HP Interaction
1. Add 5 temp HP
2. Take 3 damage
3. **Verify:**
   - [ ] Temp HP depletes first (5→2)
   - [ ] Current HP starts decreasing after temp HP hits 0 (HP → HP-1)
   - [ ] Temp HP shows correctly after damage

---

## Phase 3: Mass Destruction

### 3.1 Clear All Minions
1. Have 5+ minions
2. Click **"Release All"** button
3. **Verify:**
   - [ ] All minions removed immediately
   - [ ] List shows "No undead servants raised..."
   - [ ] Toast notification appears
   - [ ] Undo/history preserved (optional)

### 3.2 Single Minion Removal
1. Raise 2 minions
2. Click trash icon on one minion
3. **Verify:**
   - [ ] Only that minion removed
   - [ ] Other minion still present
   - [ ] Toast notification appears

---

## Phase 4: Spell Slot Exhaustion

### 4.1 Exhaust Level 1 Slots
1. Navigate to **Home** view
2. Cast all 2 Level 1 slots
3. **Verify:**
   - [ ] Both orbs show "empty" state
   - [ ] Cannot cast more Level 1 spells
   - [ ] Visual indicator shows 0/2 slots used

### 4.2 Toggle Empty Slot
1. Click on an "empty" Level 1 orb
2. **Verify:**
   - [ ] Slot toggles to "used" state (maybe for tracking)
   - [ ] Or slot remains disabled/unavailable

### 4.3 Multiple Level Exhaustion
1. Exhaust Level 2 (2 slots)
2. Exhaust Level 3 (2 slots)
3. **Verify:**
   - [ ] All slot orbs show empty
   - [ ] App handles no available spells gracefully
   - [ ] No crashes or errors

**Screenshot Artifact:** Save screenshot as `spellslots_exhausted.png`

---

## Phase 5: Death Saves

### 5.1 Enter Death State
1. Set HP to 0
2. **Verify:**
   - [ ] Death save section appears
   - [ ] 0/3 successes, 0/3 failures
   - [ ] "Stable" or "Dead" indicator visible

### 5.2 Add Death Save Failure
1. Click failure button (red) 3 times
2. **Verify:**
   - [ ] Failures count: 3/3
   - [ ] Character marked as "Dead"
   - [ ] Cannot take actions
   - [ ] Visual indicator shows skull/dead state

### 5.3 Stabilize Character
1. From death state, add HP (heal to >0)
2. **Verify:**
   - [ ] Death saves reset to 0/0
   - [ ] Character marked as "Stable"
   - [ ] Actions enabled again

### 5.4 Test Instant Death Rule
1. Set HP to max (e.g., 50)
2. Take 51+ damage at once
3. **Verify:**
   - [ ] HP goes below -max (-50 or lower)
   - [ ] Character immediately marked as "Dead"
   - [ ] 3 death save failures counted
   - [ ] Bypasses death save roll opportunity

---

## Phase 6: Rest Reset

### 6.1 Short Rest
1. Use all spell slots
2. Damage HP to 5 below max
3. Click **"Short Rest"**
4. **Verify:**
   - [ ] Pact slots (if available) are restored
   - [ ] HP NOT restored (short rest doesn't heal)
   - [ ] Hit dice available to use

### 6.2 Long Rest
1. Use all spell slots
2. Set HP to 0
3. Click **"Long Rest"**
4. **Verify:**
   - [ ] All spell slots restored to full
   - [ ] HP restored to max
   - [ ] Death saves reset to 0/0
   - [ ] Mystic Arcanum restored

### 6.3 Level Up Rest
1. Set HP to 0
2. Click **"LEVEL UP"** in QuickActions
3. **Verify:**
   - [ ] Level increases (e.g., 1→2)
   - [ ] HP max recalculated based on new level
   - [ ] HP set to new max
   - [ ] Spell slots updated for new level
   - [ ] Haptic feedback triggers

---

## Additional Stress Tests

### Concentration Mechanics
1. Cast concentration spell
2. Take damage
3. **Verify:**
   - [ ] Toast appears with DC calculation
   - [ ] DC = max(10, damage/2)
   - [ ] Haptic feedback triggers
   - [ ] Can continue concentrating on successful save

### Inventory System
1. Add items with attunement
2. Remove attuned items
3. **Verify:**
   - [ ] Items tracked correctly
   - [ ] Attunement limit respected (3 items)
   - [ ] AC updates correctly when adding/removing magic items

### Character Editor Validation
1. Try setting level to 25
2. Try setting ability scores to 35
3. **Verify:**
   - [ ] Level clamped to 20
   - [ ] Ability scores clamped to 30
   - [ ] No crashes on invalid inputs

---

## Automated Testing Commands

If you want to automate some tests:

```bash
# Run all tests
npm run test

# Run with coverage
npm run test -- --coverage

# Build for production
npm run build

# Lint check
npm run lint
```

---

## Bug Report Template

If you find any issues during testing:

```
Issue Title: [Brief description]
Phase: [Phase number]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Behavior:
- [What should happen]

Actual Behavior:
- [What actually happened]

Screenshots/Logs:
- [Attach or paste]
```

---

## Testing Status Tracker

- [ ] Phase 1: Minion Management
- [ ] Phase 2: HP Edge Cases
- [ ] Phase 3: Mass Destruction
- [ ] Phase 4: Spell Slot Exhaustion
- [ ] Phase 5: Death Saves
- [ ] Phase 6: Rest Reset

---

## Notes for Devs

Current known limitations:
- E2E Playwright tests not configured in this project
- Manual testing required for UI interactions
- Device-specific haptics need physical Android device

Recommended improvements:
1. Add E2E tests with Playwright for critical flows
2. Add visual regression tests for UI states
3. Add performance benchmarking for minion rendering
4. Add accessibility testing (a11y)
