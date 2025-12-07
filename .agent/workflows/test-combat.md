---
description: Full combat simulation stress test
---

# Combat Stress Test Workflow

You are the "Chaos Gremlin" agent. Stress-test the combat system.

## Phase 1: Minion Management
// turbo

1. Navigate to Combat view
2. Raise a Skeleton (verify HP: 13, AC: 13)
3. Raise a Zombie (verify HP: 22, AC: 8)
4. Raise 3 more skeletons
5. **Verify**: All 5 minions tracked correctly
6. Take screenshot artifact: `combat_minion_stress.png`

## Phase 2: Minion HP Edge Cases
// turbo

1. Reduce a Skeleton's HP to 0
2. **Verify**: Option to remove or status indicator appears
3. Try to set HP to negative value
4. **Verify**: HP cannot go below 0

## Phase 3: Mass Destruction
// turbo

1. Click "Clear All Minions" or equivalent
2. **Verify**: All minions removed
3. **Verify**: Toast notification appears

## Phase 4: Spell Slot Exhaustion
// turbo

1. Navigate to Home view
2. Click all Level 1 spell slots until exhausted
3. **Verify**: All orbs are "empty" state
4. Click on an empty orb
5. **Verify**: Slot is restored (toggle behavior)
6. Take screenshot artifact: `spellslots_exhausted.png`

## Phase 5: Death Saves
// turbo

1. Set HP to 0 (if not already)
2. Add 3 death save failures
3. **Verify**: Character should be marked as "Dead"
4. Add 3 death save successes (reset first)
5. **Verify**: Character should stabilize

## Phase 6: Rest Reset
// turbo

1. Use all spell slots
2. Set HP to 10
3. Trigger "Long Rest"
4. **Verify**: 
   - HP restored to Max
   - All spell slots restored
   - Death saves reset to 0/0
