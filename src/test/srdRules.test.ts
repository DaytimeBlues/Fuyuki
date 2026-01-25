import { describe, it, expect, vi } from 'vitest';
import {
    getProfBonus,
    getAbilityMod,
    calculateMaxHP,
    calculateSpellSaveDC,
    clamp,
} from '../utils/srdRules';
import { getPactSlotInfo } from '../utils/warlockRules';
import {
    validateAndClampSessionNumber,
    validateAndClampAbilityScore,
    validateAndClampLevel,
    validateHP,
    isValueValid,
    formatValidationResult,
} from '../utils/inputValidationEnhanced';

describe('SRD 5.1 Rules (Hardened)', () => {
    describe('getProfBonus', () => {
        it('returns correct bonus for all tiers', () => {
            expect(getProfBonus(1)).toBe(2);
            expect(getProfBonus(5)).toBe(3);
            expect(getProfBonus(9)).toBe(4);
            expect(getProfBonus(13)).toBe(5);
            expect(getProfBonus(17)).toBe(6);
        });

        it('clamps level range', () => {
            expect(getProfBonus(0)).toBe(2);
            expect(getProfBonus(21)).toBe(6);
        });
    });

    describe('getAbilityMod', () => {
        it('calculates correctly for standard and extreme scores', () => {
            expect(getAbilityMod(1)).toBe(-5);
            expect(getAbilityMod(10)).toBe(0);
            expect(getAbilityMod(20)).toBe(5);
            expect(getAbilityMod(30)).toBe(10);
        });
    });

    describe('calculateMaxHP (d8 Warlock)', () => {
        it('calculates level 1 warlock HP correctly', () => {
            // Level 1 Warlock, d8, CON +2: 8 + 2 = 10
            expect(calculateMaxHP(1, 14, 8)).toBe(10);
        });

        it('calculates level 5 warlock HP correctly', () => {
            // Level 5 Warlock, d8, CON +2:
            // Level 1: 8 + 2 = 10
            // Levels 2-5: 4 * (5 + 2) = 28
            // Total: 38
            expect(calculateMaxHP(5, 14, 8)).toBe(38);
        });

        it('handles negative CON modifier', () => {
            // Level 5 Warlock, d8, CON -2:
            // Level 1: 8 - 2 = 6
            // Levels 2-5: 4 * (5 - 2) = 12
            // Total: 18
            expect(calculateMaxHP(5, 6, 8)).toBe(18);
        });

        it('returns minimum 1 HP per level', () => {
            expect(calculateMaxHP(5, 1, 8)).toBe(5);
        });
    });

    describe('calculateSpellSaveDC (CHA-based)', () => {
        it('calculates DC correctly', () => {
            // 8 + prof(2) + cha(3) = 13
            expect(calculateSpellSaveDC(2, 3)).toBe(13);
            // 8 + prof(3) + cha(3) = 14
            expect(calculateSpellSaveDC(3, 3)).toBe(14);
        });
    });

    describe('Warlock Pact Slot Info', () => {
        it('matches SRD 5.1 table', () => {
            expect(getPactSlotInfo(1)).toEqual({ count: 1, level: 1 });
            expect(getPactSlotInfo(2)).toEqual({ count: 2, level: 1 });
            expect(getPactSlotInfo(3)).toEqual({ count: 2, level: 2 });
            expect(getPactSlotInfo(5)).toEqual({ count: 2, level: 3 });
            expect(getPactSlotInfo(7)).toEqual({ count: 2, level: 4 });
            expect(getPactSlotInfo(9)).toEqual({ count: 2, level: 5 });
            expect(getPactSlotInfo(11)).toEqual({ count: 3, level: 5 });
            expect(getPactSlotInfo(17)).toEqual({ count: 4, level: 5 });
        });
    });

    describe('clamp', () => {
        it('clamps values correctly', () => {
            expect(clamp(5, 1, 10)).toBe(5);
            expect(clamp(0, 1, 10)).toBe(1);
            expect(clamp(11, 1, 10)).toBe(10);
        });
    });

    describe('Input Validation (Enhanced)', () => {
        it('validates session numbers and returns fallback on invalid', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            expect(validateAndClampSessionNumber('5', false)).toBe(5);
            expect(validateAndClampSessionNumber('10000', false)).toBe(1);
            expect(validateAndClampSessionNumber('abc', false)).toBe(1);

            warnSpy.mockRestore();
        });

        it('validates ability scores and returns fallback on invalid', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            expect(validateAndClampAbilityScore('str', '16', false)).toBe(16);
            expect(validateAndClampAbilityScore('str', '40', false)).toBe(10);
            expect(validateAndClampAbilityScore('cha', 'abc', false)).toBe(10);

            warnSpy.mockRestore();
        });

        it('validates level and HP inputs with fallbacks', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            expect(validateAndClampLevel('5', false)).toBe(5);
            expect(validateAndClampLevel('25', false)).toBe(1);
            expect(validateHP('10', 'current')).toBe(10);
            expect(validateHP('-1', 'temp')).toBe(0);
            expect(validateHP('0', 'max')).toBe(0);

            warnSpy.mockRestore();
        });

        it('reports validity and formats validation results', () => {
            expect(isValueValid('5', 'session')).toBe(true);
            expect(isValueValid('10000', 'session')).toBe(false);
            expect(isValueValid('20', 'level')).toBe(true);
            expect(isValueValid('25', 'level')).toBe(false);
            expect(isValueValid('-1000', 'hp')).toBe(false);

            expect(formatValidationResult(true, null, 'Level')).toEqual({
                isValid: true,
                showWarning: false,
                message: 'Level is valid',
            });
            expect(formatValidationResult(false, 'Invalid input', 'Level')).toEqual({
                isValid: false,
                showWarning: true,
                message: 'Invalid input',
            });
        });
    });
});
