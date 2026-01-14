/**
 * warlockRules.ts
 * Implements D&D 5e SRD 5.1 rules for Warlocks.
 */
import type { PactSlots } from '../types';

/**
 * Warlock Pact Magic Slot table (SRD 5.1)
 * index matches warlock level
 */
export const PACT_SLOT_TABLE: Record<number, { count: number; level: number }> = {
    1: { count: 1, level: 1 },
    2: { count: 2, level: 1 },
    3: { count: 2, level: 2 },
    4: { count: 2, level: 2 },
    5: { count: 2, level: 3 },
    6: { count: 2, level: 3 },
    7: { count: 2, level: 4 },
    8: { count: 2, level: 4 },
    9: { count: 2, level: 5 },
    10: { count: 2, level: 5 },
    11: { count: 3, level: 5 },
    12: { count: 3, level: 5 },
    13: { count: 3, level: 5 },
    14: { count: 3, level: 5 },
    15: { count: 3, level: 5 },
    16: { count: 3, level: 5 },
    17: { count: 4, level: 5 },
    18: { count: 4, level: 5 },
    19: { count: 4, level: 5 },
    20: { count: 4, level: 5 },
};

/**
 * Gets the pact slot count and level for a given warlock level.
 */
export function getPactSlotInfo(level: number): { count: number; level: number } {
    return PACT_SLOT_TABLE[Math.max(1, Math.min(20, level))];
}

/**
 * Calculates the spell save DC for a warlock.
 * DC = 8 + proficiency + Charisma modifier
 */
export function calculateWarlockDC(profBonus: number, chaMod: number): number {
    return 8 + profBonus + chaMod;
}
