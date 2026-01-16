/**
 * SRD 5.1 Rules Utility Functions
 * Pure functions for D&D 5e character stat calculations
 */

import type { AbilityMods, AbilityScores, CharacterData } from '../types';

/**
 * Calculate proficiency bonus by character level
 * SRD 5.1: +2 (L1-4), +3 (L5-8), +4 (L9-12), +5 (L13-16), +6 (L17-20)
 * @param level Character level (1-20)
 * @returns Proficiency bonus
 */
export function getProficiencyBonus(level: number): number {
    const clampedLevel = Math.max(1, Math.min(20, level));
    return Math.floor((clampedLevel - 1) / 4) + 2;
}

/**
 * Calculate ability modifier from ability score
 * SRD 5.1: floor((score - 10) / 2)
 * @param score Ability score (1-30, typical 3-20)
 * @returns Ability modifier
 */
export function getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

/**
 * Full caster spell slots by level (Wizard, Cleric, Druid, Bard, Sorcerer)
 * SRD 5.1 Spellcasting Table
 */
export const FULL_CASTER_SLOTS: Record<number, Record<number, number>> = {
    1: { 1: 2 },
    2: { 1: 3 },
    3: { 1: 4, 2: 2 },
    4: { 1: 4, 2: 3 },
    5: { 1: 4, 2: 3, 3: 2 },
    6: { 1: 4, 2: 3, 3: 3 },
    7: { 1: 4, 2: 3, 3: 3, 4: 1 },
    8: { 1: 4, 2: 3, 3: 3, 4: 2 },
    9: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
    11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
    18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
    19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
    20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
};

/**
 * Get pact slots for a given level
 */
import { getPactSlotInfo } from './warlockRules';

/**
 * Calculate maximum HP
 * SRD 5.1: First level = max hit die + CON mod, subsequent = avg (fixed) + CON mod
 * @param level Character level
 * @param conScore Constitution score
 * @param hitDieSize Hit die size (8 for warlock)
 * @returns Maximum HP
 */
export function calculateMaxHP(level: number, conScore: number, hitDieSize: number): number {
    const clampedLevel = Math.max(1, Math.min(20, level));
    const conMod = getAbilityModifier(conScore);

    const firstLevelHP = hitDieSize + conMod;

    if (clampedLevel === 1) {
        return Math.max(1, firstLevelHP);
    }

    const avgHitDie = Math.floor(hitDieSize / 2) + 1;
    const subsequentLevels = clampedLevel - 1;

    const totalHP = firstLevelHP + subsequentLevels * (avgHitDie + conMod);

    return Math.max(clampedLevel, totalHP);
}

/**
 * Calculate Spell Save DC
 * SRD 5.1: 8 + proficiency bonus + spellcasting ability modifier
 */
export function getSpellSaveDC(profBonus: number, spellcastingMod: number): number {
    return 8 + profBonus + spellcastingMod;
}

export function getAbilityMods(scores: AbilityScores): AbilityMods {
    return {
        str: getAbilityModifier(scores.str),
        dex: getAbilityModifier(scores.dex),
        con: getAbilityModifier(scores.con),
        int: getAbilityModifier(scores.int),
        wis: getAbilityModifier(scores.wis),
        cha: getAbilityModifier(scores.cha),
    };
}

/**
 * Recalculate common derived character fields from base values.
 */
export function recalculateDerivedCharacterData(prev: CharacterData): CharacterData {
    const level = clamp(prev.level, LEVEL_MIN, LEVEL_MAX);
    const abilityScores = prev.abilities;
    const abilityMods = getAbilityMods(abilityScores);
    const profBonus = getProficiencyBonus(level);

    // Pact slot recalculation
    const pactSlotInfo = getPactSlotInfo(level);
    const pactSlots = {
        ...prev.pactSlots,
        max: pactSlotInfo.count,
        level: pactSlotInfo.level,
        current: Math.min(prev.pactSlots.current, pactSlotInfo.count)
    };

    const maxHP = calculateMaxHP(level, abilityScores.con, prev.hitDice.size);
    const currentHP = Math.min(prev.hp.current, maxHP);

    const hitDiceMax = level;
    const hitDiceCurrent = Math.min(prev.hitDice.current, hitDiceMax);

    // Warlock uses CHA for DC
    const dc = getSpellSaveDC(profBonus, abilityMods.cha);

    // Filter standard slots to match level if multiclassing or generic
    const slots = { ...prev.slots };
    const standardMaxSlots = FULL_CASTER_SLOTS[level] || {};
    Object.keys(slots).forEach(lvlKey => {
        const lvl = parseInt(lvlKey);
        const max = standardMaxSlots[lvl] || 0;
        slots[lvl] = { ...slots[lvl], max };
    });

    // Mystic Arcanum initialization
    const arcanum = { ...prev.arcanum };
    if (level >= 11 && !arcanum[6]) arcanum[6] = { used: false, spellName: '' };
    if (level >= 13 && !arcanum[7]) arcanum[7] = { used: false, spellName: '' };
    if (level >= 15 && !arcanum[8]) arcanum[8] = { used: false, spellName: '' };
    if (level >= 17 && !arcanum[9]) arcanum[9] = { used: false, spellName: '' };

    return {
        ...prev,
        level,
        abilities: abilityScores,
        abilityMods,
        profBonus,
        dc,
        hp: { ...prev.hp, current: currentHP, max: maxHP },
        hitDice: { ...prev.hitDice, current: hitDiceCurrent, max: hitDiceMax },
        pactSlots,
        arcanum,
        slots,
    };
}

/**
 * Ability score constraints
 */
export const ABILITY_SCORE_MIN = 1;
export const ABILITY_SCORE_MAX = 30; // RAW max is 30 (only achievable through magic)
export const ABILITY_SCORE_STANDARD_MAX = 20; // Standard cap without magical enhancement

/**
 * Level constraints
 */
export const LEVEL_MIN = 1;
export const LEVEL_MAX = 20;

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Compatibility exports (older naming used across the app/tests).
 * Prefer the new names above.
 */
export const getProfBonus = getProficiencyBonus;
export const getAbilityMod = getAbilityModifier;
export const calculateSpellSaveDC = getSpellSaveDC;
