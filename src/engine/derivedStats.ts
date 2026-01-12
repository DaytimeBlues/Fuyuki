/**
 * Derived Stats Calculator
 * 
 * Helper functions for calculating derived statistics from base values.
 * All calculations follow SRD 5.1 rules.
 */

/**
 * Calculate ability modifier from ability score.
 * Formula: floor((score - 10) / 2)
 * 
 * SRD Reference: Ability Scores (SRD 5.1, p. 76)
 */
export function calculateAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

/**
 * Calculate proficiency bonus from character level.
 * Formula: floor(level / 4) + 2
 * 
 * SRD Reference: Proficiency Bonus (SRD 5.1, p. 77)
 */
export function calculateProficiencyBonus(level: number): number {
    return Math.floor((level - 1) / 4) + 2;
}

/**
 * Calculate initiative bonus.
 * For most characters: DEX modifier
 * 
 * SRD Reference: Initiative (SRD 5.1, p. 91)
 */
export function calculateInitiativeBonus(dexModifier: number): number {
    return dexModifier;
}

/**
 * Calculate spell attack bonus.
 * Formula: proficiency bonus + spellcasting ability modifier
 * 
 * SRD Reference: Wizard Spellcasting (SRD 5.1, p. 53)
 * 
 * @param proficiencyBonus - Character's proficiency bonus
 * @param spellcastingAbilityModifier - Modifier for spellcasting ability (INT for Wizard)
 */
export function calculateSpellAttackBonus(
    proficiencyBonus: number,
    spellcastingAbilityModifier: number
): number {
    return proficiencyBonus + spellcastingAbilityModifier;
}

/**
 * Calculate spell save DC.
 * Formula: 8 + proficiency bonus + spellcasting ability modifier
 * 
 * SRD Reference: Wizard Spellcasting (SRD 5.1, p. 53)
 * 
 * @param proficiencyBonus - Character's proficiency bonus
 * @param spellcastingAbilityModifier - Modifier for spellcasting ability (INT for Wizard)
 */
export function calculateSpellSaveDC(
    proficiencyBonus: number,
    spellcastingAbilityModifier: number
): number {
    return 8 + proficiencyBonus + spellcastingAbilityModifier;
}

/**
 * Calculate skill modifier.
 * Formula: ability modifier + (proficient ? proficiency : 0) + (expert ? proficiency : 0)
 * 
 * @param abilityModifier - The ability modifier for this skill
 * @param proficiencyBonus - Character's proficiency bonus
 * @param isProficient - Whether the character is proficient in this skill
 * @param hasExpertise - Whether the character has expertise in this skill
 */
export function calculateSkillModifier(
    abilityModifier: number,
    proficiencyBonus: number,
    isProficient: boolean,
    hasExpertise: boolean
): number {
    let modifier = abilityModifier;
    if (isProficient) modifier += proficiencyBonus;
    if (hasExpertise) modifier += proficiencyBonus;
    return modifier;
}

/**
 * Calculate saving throw modifier.
 * Formula: ability modifier + (proficient ? proficiency : 0)
 * 
 * @param abilityModifier - The ability modifier for this save
 * @param proficiencyBonus - Character's proficiency bonus
 * @param isProficient - Whether the character is proficient in this save
 */
export function calculateSavingThrowModifier(
    abilityModifier: number,
    proficiencyBonus: number,
    isProficient: boolean
): number {
    return abilityModifier + (isProficient ? proficiencyBonus : 0);
}

/**
 * Calculate Armor Class.
 * 
 * SRD Reference: Armor Class (SRD 5.1, pp. 80-81)
 * 
 * @param baseAC - Base AC from armor or Unarmored Defense
 * @param dexModifier - DEX modifier
 * @param maxDexBonus - Maximum DEX bonus allowed (undefined for no limit)
 * @param shieldBonus - Bonus from shield (typically +2)
 * @param otherBonuses - Any other AC bonuses
 */
export function calculateArmorClass(
    baseAC: number,
    dexModifier: number,
    maxDexBonus?: number,
    shieldBonus: number = 0,
    otherBonuses: number = 0
): number {
    const effectiveDex = maxDexBonus !== undefined
        ? Math.min(dexModifier, maxDexBonus)
        : dexModifier;

    return baseAC + effectiveDex + shieldBonus + otherBonuses;
}

/**
 * Format a modifier as a signed string (e.g., +5 or -2).
 */
export function formatModifier(modifier: number): string {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

/**
 * Parse a dice formula and extract components.
 * Example: "2d6+3" -> { count: 2, sides: 6, modifier: 3 }
 */
export function parseDiceFormula(formula: string): {
    count: number;
    sides: number;
    modifier: number
} | null {
    const match = formula.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
    if (!match) return null;

    return {
        count: parseInt(match[1], 10),
        sides: parseInt(match[2], 10),
        modifier: match[3] ? parseInt(match[3], 10) : 0,
    };
}
