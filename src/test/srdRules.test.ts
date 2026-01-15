import { describe, it, expect } from 'vitest';
import {
    calculateMaxHP,
    calculateSpellSaveDC,
    recalculateDerivedCharacterData,
} from '../utils/srdRules';
import { getPactSlotInfo } from '../utils/warlockRules';
import type { CharacterData } from '../types';

describe('SRD 5.1 Warlock Rules', () => {
    describe('getPactSlotInfo', () => {
        it('returns correct counts and levels (SRD 5.1)', () => {
            expect(getPactSlotInfo(1)).toEqual({ count: 1, level: 1 });
            expect(getPactSlotInfo(2)).toEqual({ count: 2, level: 1 });
            expect(getPactSlotInfo(3)).toEqual({ count: 2, level: 2 });
            expect(getPactSlotInfo(5)).toEqual({ count: 2, level: 3 });
            expect(getPactSlotInfo(11)).toEqual({ count: 3, level: 5 });
            expect(getPactSlotInfo(17)).toEqual({ count: 4, level: 5 });
        });
    });

    describe('calculateMaxHP', () => {
        it('calculates level 1 warlock HP correctly (d8)', () => {
            // Level 1 Warlock, d8, CON +2: 8 + 2 = 10
            expect(calculateMaxHP(1, 14, 8)).toBe(10);
        });

        it('calculates level 5 warlock HP correctly', () => {
            // Level 5 Warlock, d8, CON +2:
            // Level 1: 8 + 2 = 10
            // Levels 2-5: 4 * (5 + 2) = 28 (avg for d8 is 5)
            // Total: 38
            expect(calculateMaxHP(5, 14, 8)).toBe(38);
        });

        it('handles negative CON modifier', () => {
            // Level 1 Wizard, d6, CON -2: 6 + (-2) = 4
            expect(calculateMaxHP(1, 6, 6)).toBe(4);

            // Level 5 Wizard, d6, CON -2:
            // Level 1: 6 - 2 = 4
            // Levels 2-5: 4 * (4 - 2) = 8
            // Total: 4 + 8 = 12
            expect(calculateMaxHP(5, 6, 6)).toBe(12);
        });

        it('returns minimum 1 HP per level for extreme negative CON', () => {
            // Level 5 Wizard, d6, CON -5:
            // Level 1: 6 - 5 = 1
            // Levels 2-5: 4 * (4 - 5) = -4
            // Raw Total: 1 - 4 = -3
            // But minimum is 1 HP per level, so minimum 5 HP
            expect(calculateMaxHP(5, 1, 6)).toBe(5);
        });

        it('calculates other hit die sizes correctly', () => {
            // Level 5 Fighter, d10, CON +2:
            // Level 1: 10 + 2 = 12
            // Levels 2-5: 4 * (6 + 2) = 32 (avg for d10 is 6)
            // Total: 12 + 32 = 44
            expect(calculateMaxHP(5, 14, 10)).toBe(44);
        });
    });

    describe('calculateSpellSaveDC', () => {
        it('calculates warlock spell DC correctly (uses CHA)', () => {
            // 8 + prof + CHA mod
            expect(calculateSpellSaveDC(2, 3)).toBe(13); // Level 1-4, CHA 16
            expect(calculateSpellSaveDC(3, 4)).toBe(15); // Level 5-8, CHA 18
        });
    });

    describe('recalculateDerivedCharacterData', () => {
        it('updates pact slots and DC when level changes', () => {
            const initial: CharacterData = {
                level: 1,
                abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 16 },
                abilityMods: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 3 },
                profBonus: 2,
                dc: 13,
                hp: { current: 8, max: 8, temp: 0 },
                hitDice: { current: 1, max: 1, size: 8 },
                pactSlots: { current: 1, max: 1, level: 1 },
                arcanum: {},
                invocations: [],
                skills: {},
                savingThrowProficiencies: [],
                baseAC: 10,
                spellsKnown: [],
                cantripsKnown: [],
                inventory: [],
                attunement: [],
                concentration: null,
                deathSaves: { successes: 0, failures: 0 },
                pactBoon: { type: 'blade' },
                patron: { name: 'Fiend', features: [] },
                preparedSpells: [],
                slots: {
                    1: { used: 0, max: 0 },
                    2: { used: 0, max: 0 },
                    3: { used: 0, max: 0 },
                    4: { used: 0, max: 0 },
                    5: { used: 0, max: 0 },
                    6: { used: 0, max: 0 },
                    7: { used: 0, max: 0 },
                    8: { used: 0, max: 0 },
                    9: { used: 0, max: 0 }
                },
                mageArmour: false,
                shield: false
            };

            const updated = recalculateDerivedCharacterData({ ...initial, level: 5 });

            expect(updated.profBonus).toBe(3);
            expect(updated.pactSlots.max).toBe(2);
            expect(updated.pactSlots.level).toBe(3);
            expect(updated.dc).toBe(14); // 8 + 3 (prof) + 3 (cha)
        });
    });
});
