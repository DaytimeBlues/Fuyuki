/**
 * Multiclass Spell Slot Calculator
 * Per SRD 5.1 rules for determining spell slots when multiclassing
 */

// Class caster types
export type CasterType = 'full' | 'half' | 'third' | 'none';

export interface ClassLevel {
    className: string;
    level: number;
    casterType: CasterType;
}

// Map of classes to their caster types
export const CLASS_CASTER_TYPE: Record<string, CasterType> = {
    // Full casters (1:1)
    'Bard': 'full',
    'Cleric': 'full',
    'Druid': 'full',
    'Sorcerer': 'full',
    'Wizard': 'full',

    // Half casters (1:2, round down)
    'Paladin': 'half',
    'Ranger': 'half',

    // Third casters (1:3, round down)
    'Fighter (Eldritch Knight)': 'third',
    'Rogue (Arcane Trickster)': 'third',

    // Non-casters
    'Barbarian': 'none',
    'Fighter': 'none',
    'Monk': 'none',
    'Rogue': 'none',
};

// SRD 5.1 Multiclass Spellcaster Spell Slots table
// Index = caster level (0 = no slots, 1-20 = caster levels)
export const MULTICLASS_SPELL_SLOTS: Record<number, Record<number, number>> = {
    0: {},
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
 * Calculate total caster level from class levels
 * Per SRD 5.1: Full = 1x, Half = 0.5x (round down), Third = 0.33x (round down)
 */
export function calculateCasterLevel(classLevels: ClassLevel[]): number {
    let totalCasterLevel = 0;

    for (const { level, casterType } of classLevels) {
        switch (casterType) {
            case 'full':
                totalCasterLevel += level;
                break;
            case 'half':
                // Round down: Paladin 5 / Ranger 5 = 2 + 2 = 4
                totalCasterLevel += Math.floor(level / 2);
                break;
            case 'third':
                // Round down: EK Fighter 9 = 3
                totalCasterLevel += Math.floor(level / 3);
                break;
            case 'none':
                // No contribution
                break;
        }
    }

    return Math.min(20, totalCasterLevel);
}

/**
 * Get spell slots for a given caster level
 */
export function getSpellSlots(casterLevel: number): Record<number, number> {
    return MULTICLASS_SPELL_SLOTS[Math.min(20, Math.max(0, casterLevel))] || {};
}

/**
 * Format class levels for display
 */
export function formatClassLevels(classLevels: ClassLevel[]): string {
    return classLevels
        .filter(c => c.level > 0)
        .map(c => `${c.className} ${c.level}`)
        .join(' / ');
}
