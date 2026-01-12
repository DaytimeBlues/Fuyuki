import type { SpellV3 } from '../../../schemas/spellSchema';

/**
 * Data structure for rendering a spell resolution card.
 */
export interface ResolutionCardData {
    title: string;
    level: number;
    school: string;
    description?: string;

    /** Attack mode: "make a spell attack" */
    attack?: {
        label: string;
        formula: string; // e.g., "1d20+9"
    };

    /** Save mode: "target makes a saving throw" */
    save?: {
        label: string;
        dc: number;
        ability: string;
        halfOnSave: boolean;
    };

    /** Automatic mode: no attack or save required */
    auto?: {
        label: string;
    };

    /** Damage roll */
    damage?: {
        label: string;
        formula: string;
        type: string;
    };

    /** Healing roll */
    healing?: {
        label: string;
        formula: string;
    };

    /** Duration */
    duration?: {
        value: string;
        concentration: boolean;
    };

    /** Additional effects */
    effects?: string[];
}

/**
 * Build a ResolutionCardData object from a SpellV3 and character stats.
 * 
 * This function transforms spell data into a UI-ready format that shows
 * exactly what the user needs to roll and what the results mean.
 * 
 * @param spell - The spell being cast
 * @param spellAttackBonus - Character's spell attack bonus
 * @param spellSaveDC - Character's spell save DC
 * @param slotLevel - The level of spell slot being used (for upcasting)
 */
export function buildResolutionCard(
    spell: SpellV3,
    spellAttackBonus: number,
    spellSaveDC: number,
    slotLevel?: number
): ResolutionCardData {
    const effectiveLevel = slotLevel ?? spell.level;

    const card: ResolutionCardData = {
        title: spell.name,
        level: spell.level,
        school: spell.school,
        description: spell.description.slice(0, 200) + (spell.description.length > 200 ? '...' : ''),
    };

    // Determine resolution mode
    if (spell.requiresAttackRoll) {
        card.attack = {
            label: 'Spell Attack',
            formula: `1d20+${spellAttackBonus}`,
        };
    } else if (spell.requiresSavingThrow && spell.savingThrowDetails) {
        card.save = {
            label: `${spell.savingThrowDetails.ability.toUpperCase()} Save`,
            dc: spellSaveDC,
            ability: spell.savingThrowDetails.ability,
            halfOnSave: spell.savingThrowDetails.onSuccess === 'half',
        };
    } else {
        card.auto = {
            label: 'Automatic Effect (no attack or save)',
        };
    }

    // Calculate damage with upcasting
    if (spell.damage && spell.damage.length > 0) {
        const dmg = spell.damage[0];
        let diceCount = dmg.count;

        // Apply upcasting scaling
        if (dmg.scaling?.type === 'per_slot_level' && dmg.scaling.diceIncreasePerLevel) {
            const levelsAboveBase = effectiveLevel - spell.level;
            diceCount += levelsAboveBase * dmg.scaling.diceIncreasePerLevel;
        }

        const formula = `${diceCount}d${dmg.sides}`;

        card.damage = {
            label: effectiveLevel > spell.level
                ? `Damage (Upcast to Lvl ${effectiveLevel})`
                : 'Damage',
            formula,
            type: dmg.type,
        };
    }

    // Calculate healing with upcasting
    if (spell.healing && spell.healing.length > 0) {
        const heal = spell.healing[0];
        let diceCount = heal.count;

        if (heal.scaling?.type === 'per_slot_level' && heal.scaling.diceIncreasePerLevel) {
            const levelsAboveBase = effectiveLevel - spell.level;
            diceCount += levelsAboveBase * heal.scaling.diceIncreasePerLevel;
        }

        const formula = `${diceCount}d${heal.sides}`;

        card.healing = {
            label: effectiveLevel > spell.level
                ? `Healing (Upcast to Lvl ${effectiveLevel})`
                : 'Healing',
            formula,
        };
    }

    // Duration
    card.duration = {
        value: spell.duration.value || 'Instantaneous',
        concentration: spell.duration.type === 'concentration',
    };

    return card;
}

/**
 * Format a resolution card for display as a summary string.
 */
export function summarizeResolution(card: ResolutionCardData): string {
    const parts: string[] = [];

    if (card.attack) {
        parts.push(`Attack: ${card.attack.formula} vs AC`);
    } else if (card.save) {
        parts.push(`${card.save.ability.toUpperCase()} Save DC ${card.save.dc}`);
    } else if (card.auto) {
        parts.push('Auto-hit');
    }

    if (card.damage) {
        parts.push(`${card.damage.formula} ${card.damage.type}`);
    }

    if (card.healing) {
        parts.push(`Heal ${card.healing.formula}`);
    }

    return parts.join(' • ');
}
