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
 * Get pact slots for a given level
 * @param level Character level (1-20)
 * @returns Pact slots info
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
 * Warlock casting ability is CHA.
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
