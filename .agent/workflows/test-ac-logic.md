---
description: Test AC calculation logic against SRD 5.1 rules
---

# AC Logic Test Workflow

You are the "Rules Lawyer" agent. Test AC calculations strictly per SRD 5.1.

## Phase 1: Mage Armor Validation
// turbo

1. Navigate to http://localhost:5555
2. Note the Base AC value displayed
3. Toggle "Mage Armour" ON
4. **Verify**: AC should be `13 + DEX mod` (for Aramancia with DEX 14, this is 15)
5. Take screenshot artifact: `ac_mage_armor_test.png`

## Phase 2: Shield Spell Stacking
// turbo

1. With Mage Armour ON, toggle "Shield" ON
2. **Verify**: AC should be `13 + DEX mod + 5` (for Aramancia: 20)
3. This IS allowed per RAW (spell bonuses stack with base AC)
4. Take screenshot artifact: `ac_shield_stacking_test.png`

## Phase 3: Edge Case - Both Off
// turbo

1. Toggle both Mage Armour and Shield OFF
2. **Verify**: AC returns to Base AC (13 for Aramancia)
3. Take screenshot artifact: `ac_base_only_test.png`

## Expected Values (Aramancia - DEX 14, +2 mod)

| State | Expected AC | Calculation |
|-------|-------------|-------------|
| Base only | 13 | Studded Leather |
| Mage Armor | 15 | 13 + 2 (DEX) |
| Shield only | 18 | 13 + 5 |
| Both | 20 | 13 + 2 + 5 |

## Bug Detection

If Mage Armor AC = Base + 2 instead of 13 + DEX, report as:
> **CRITICAL BUG**: Mage Armor incorrectly adds +2 instead of setting base to 13+DEX
