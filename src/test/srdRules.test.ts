import { describe, it, expect } from 'vitest';
import {
    getProfBonus,
    getAbilityMod,
    getFullCasterSlots,
    getSpellSlotsWithUsed,
    calculateMaxHP,
    calculateSpellSaveDC,
    clamp,
    ABILITY_SCORE_MIN,
    ABILITY_SCORE_MAX,
    LEVEL_MIN,
    LEVEL_MAX,
} from '../utils/srdRules';

describe('SRD 5.1 Rules', () => {
    describe('getProfBonus', () => {
        it('returns +2 for levels 1-4', () => {
            expect(getProfBonus(1)).toBe(2);
            expect(getProfBonus(2)).toBe(2);
            expect(getProfBonus(3)).toBe(2);
            expect(getProfBonus(4)).toBe(2);
        });

        it('returns +3 for levels 5-8', () => {
            expect(getProfBonus(5)).toBe(3);
            expect(getProfBonus(6)).toBe(3);
            expect(getProfBonus(7)).toBe(3);
            expect(getProfBonus(8)).toBe(3);
        });

        it('returns +4 for levels 9-12', () => {
            expect(getProfBonus(9)).toBe(4);
            expect(getProfBonus(10)).toBe(4);
            expect(getProfBonus(11)).toBe(4);
            expect(getProfBonus(12)).toBe(4);
        });

        it('returns +5 for levels 13-16', () => {
            expect(getProfBonus(13)).toBe(5);
            expect(getProfBonus(14)).toBe(5);
            expect(getProfBonus(15)).toBe(5);
            expect(getProfBonus(16)).toBe(5);
        });

        it('returns +6 for levels 17-20', () => {
            expect(getProfBonus(17)).toBe(6);
            expect(getProfBonus(18)).toBe(6);
            expect(getProfBonus(19)).toBe(6);
            expect(getProfBonus(20)).toBe(6);
        });

        it('clamps levels below 1 to 1', () => {
            expect(getProfBonus(0)).toBe(2);
            expect(getProfBonus(-5)).toBe(2);
        });

        it('clamps levels above 20 to 20', () => {
            expect(getProfBonus(21)).toBe(6);
            expect(getProfBonus(100)).toBe(6);
        });
    });

    describe('getAbilityMod', () => {
        it('calculates modifier correctly for standard scores', () => {
            expect(getAbilityMod(1)).toBe(-5);
            expect(getAbilityMod(8)).toBe(-1);
            expect(getAbilityMod(10)).toBe(0);
            expect(getAbilityMod(11)).toBe(0);
            expect(getAbilityMod(12)).toBe(1);
            expect(getAbilityMod(14)).toBe(2);
            expect(getAbilityMod(15)).toBe(2);
            expect(getAbilityMod(17)).toBe(3);
            expect(getAbilityMod(18)).toBe(4);
            expect(getAbilityMod(20)).toBe(5);
        });

        it('handles extreme scores', () => {
            expect(getAbilityMod(30)).toBe(10); // Max RAW
            expect(getAbilityMod(3)).toBe(-4);  // Min point buy
        });
    });

    describe('getFullCasterSlots', () => {
        it('returns correct slots for level 1', () => {
            const slots = getFullCasterSlots(1);
            expect(slots[1]).toBe(2);
            expect(slots[2]).toBeUndefined();
        });

        it('returns correct slots for level 5', () => {
            const slots = getFullCasterSlots(5);
            expect(slots[1]).toBe(4);
            expect(slots[2]).toBe(3);
            expect(slots[3]).toBe(2);
            expect(slots[4]).toBeUndefined();
        });

        it('returns correct slots for level 9', () => {
            const slots = getFullCasterSlots(9);
            expect(slots[1]).toBe(4);
            expect(slots[2]).toBe(3);
            expect(slots[3]).toBe(3);
            expect(slots[4]).toBe(3);
            expect(slots[5]).toBe(1);
            expect(slots[6]).toBeUndefined();
        });

        it('returns correct slots for level 20', () => {
            const slots = getFullCasterSlots(20);
            expect(slots[1]).toBe(4);
            expect(slots[2]).toBe(3);
            expect(slots[3]).toBe(3);
            expect(slots[4]).toBe(3);
            expect(slots[5]).toBe(3);
            expect(slots[6]).toBe(2);
            expect(slots[7]).toBe(2);
            expect(slots[8]).toBe(1);
            expect(slots[9]).toBe(1);
        });
    });

    describe('getSpellSlotsWithUsed', () => {
        it('initializes all slots with 0 used', () => {
            const slots = getSpellSlotsWithUsed(5);
            expect(slots[1]).toEqual({ used: 0, max: 4 });
            expect(slots[2]).toEqual({ used: 0, max: 3 });
            expect(slots[3]).toEqual({ used: 0, max: 2 });
        });

        it('preserves used counts from existing slots', () => {
            const existingSlots = {
                1: { used: 2, max: 4 },
                2: { used: 1, max: 3 },
                3: { used: 0, max: 2 },
            };
            const slots = getSpellSlotsWithUsed(5, existingSlots);
            expect(slots[1]).toEqual({ used: 2, max: 4 });
            expect(slots[2]).toEqual({ used: 1, max: 3 });
            expect(slots[3]).toEqual({ used: 0, max: 2 });
        });

        it('caps used at new max when level decreases', () => {
            const existingSlots = {
                1: { used: 4, max: 4 },
                2: { used: 3, max: 3 },
                3: { used: 2, max: 2 },
            };
            const slots = getSpellSlotsWithUsed(3, existingSlots);
            expect(slots[1]).toEqual({ used: 4, max: 4 });
            expect(slots[2]).toEqual({ used: 2, max: 2 }); // Capped from 3 to 2
            expect(slots[3]).toBeUndefined();
        });

        it('adds new slot levels when level increases', () => {
            const existingSlots = {
                1: { used: 2, max: 4 },
                2: { used: 1, max: 2 },
            };
            const slots = getSpellSlotsWithUsed(5, existingSlots);
            expect(slots[3]).toEqual({ used: 0, max: 2 }); // New level 3 slots
        });
    });

    describe('calculateMaxHP', () => {
        it('calculates level 1 wizard HP correctly', () => {
            // Level 1 Wizard, d6, CON +2: 6 + 2 = 8
            expect(calculateMaxHP(1, 6, 2)).toBe(8);
        });

        it('calculates level 5 wizard HP correctly', () => {
            // Level 5 Wizard, d6, CON +2:
            // Level 1: 6 + 2 = 8
            // Levels 2-5: 4 * (4 + 2) = 24
            // Total: 8 + 24 = 32
            // Note: avg for d6 is floor(6/2)+1 = 4
            expect(calculateMaxHP(5, 6, 2)).toBe(32);
        });

        it('handles negative CON modifier', () => {
            // Level 1 Wizard, d6, CON -2: 6 + (-2) = 4
            expect(calculateMaxHP(1, 6, -2)).toBe(4);
            
            // Level 5 Wizard, d6, CON -2:
            // Level 1: 6 - 2 = 4
            // Levels 2-5: 4 * (4 - 2) = 8
            // Total: 4 + 8 = 12
            expect(calculateMaxHP(5, 6, -2)).toBe(12);
        });

        it('returns minimum 1 HP per level for extreme negative CON', () => {
            // Level 5 Wizard, d6, CON -5:
            // Level 1: 6 - 5 = 1
            // Levels 2-5: 4 * (4 - 5) = -4
            // Raw Total: 1 - 4 = -3
            // But minimum is 1 HP per level, so minimum 5 HP
            expect(calculateMaxHP(5, 6, -5)).toBe(5);
        });

        it('calculates other hit die sizes correctly', () => {
            // Level 5 Fighter, d10, CON +2:
            // Level 1: 10 + 2 = 12
            // Levels 2-5: 4 * (6 + 2) = 32 (avg for d10 is 6)
            // Total: 12 + 32 = 44
            expect(calculateMaxHP(5, 10, 2)).toBe(44);
        });
    });

    describe('calculateSpellSaveDC', () => {
        it('calculates spell DC correctly', () => {
            // 8 + prof + spellcasting mod
            expect(calculateSpellSaveDC(2, 3)).toBe(13); // Level 1-4 wizard, INT 16
            expect(calculateSpellSaveDC(3, 3)).toBe(14); // Level 5-8 wizard, INT 16
            expect(calculateSpellSaveDC(3, 4)).toBe(15); // Level 5-8 wizard, INT 18
            expect(calculateSpellSaveDC(6, 5)).toBe(19); // Level 17-20 wizard, INT 20
        });
    });

    describe('clamp', () => {
        it('clamps values below min', () => {
            expect(clamp(-5, 0, 10)).toBe(0);
            expect(clamp(0, 1, 20)).toBe(1);
        });

        it('clamps values above max', () => {
            expect(clamp(15, 0, 10)).toBe(10);
            expect(clamp(25, 1, 20)).toBe(20);
        });

        it('returns value when within range', () => {
            expect(clamp(5, 0, 10)).toBe(5);
            expect(clamp(10, 1, 20)).toBe(10);
        });
    });

    describe('Constants', () => {
        it('has correct ability score bounds', () => {
            expect(ABILITY_SCORE_MIN).toBe(1);
            expect(ABILITY_SCORE_MAX).toBe(30);
        });

        it('has correct level bounds', () => {
            expect(LEVEL_MIN).toBe(1);
            expect(LEVEL_MAX).toBe(20);
        });
    });
});
