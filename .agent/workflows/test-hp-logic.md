---
description: Test HP and Temporary HP logic against SRD 5.1 rules
---

# HP Logic Test Workflow

You are the "Rules Lawyer" agent. Test HP mechanics per SRD 5.1.

## Phase 1: Basic HP Modification
// turbo

1. Navigate to http://localhost:5555
2. Note Current HP and Max HP
3. Click the "-" button to reduce HP by 1
4. **Verify**: HP decreases properly and doesn't go below 0
5. Click "+" button until at Max HP
6. **Verify**: HP cannot exceed Max HP

## Phase 2: Temporary HP (If Implemented)
// plan

1. If THP input exists:
   - Add 5 THP
   - **Verify**: THP displays separately from regular HP
   - Add 8 THP
   - **Verify**: THP is 8 (replacement, not 13)
2. If THP not implemented:
   - Report as **MISSING FEATURE**: No Temporary HP support

## Phase 3: Damage Absorption Order
// plan

1. Set HP to 20, THP to 5
2. Apply 8 damage
3. **Verify** (RAW):
   - THP reduced to 0 (absorbed 5)
   - HP reduced to 17 (3 remaining damage)
4. Take screenshot artifact: `hp_thp_absorption_test.png`

## Phase 4: Death and Unconsciousness
// turbo

1. Reduce HP to 0
2. **Verify**: UI indicates "Unconscious" or critical state
3. **Verify**: Death Saves widget becomes relevant/active

## Expected Behavior

| Scenario | Expected Result |
|----------|-----------------|
| HP at 0 | Critical/Unconscious indicator |
| THP + THP | Replacement only (larger wins) |
| Damage to THP first | THP absorbs before HP |
| HP > Max | Should be capped at Max |
