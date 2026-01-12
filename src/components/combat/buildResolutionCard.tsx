import type { Spell } from '../../types';

export interface ResolutionData {
    roll?: {
        label: string;
        formula: string;
    };
    save?: {
        label: string;
        dc: number;
        type: string;
    };
    damage?: {
        formula: string;
        label: string;
    };
    auto?: {
        label: string;
    };
}

/**
 * Heuristic parser to convert a Spell object into actionable resolution data.
 * This bridges the "Rules" (spells.ts) and the "View" (ResolutionCard).
 */
export function buildResolutionCard(spell: Spell): ResolutionData {
    const res: ResolutionData = {};

    // 1. Parse Attack / Save
    // Typical string: "Save: WIS DC 14" or "Melee: +5 to hit" (minion)
    // For spells in spells.ts, it's usually "Save: TYPE DC XX" or "Utility"
    
    // Check for Save
    const saveMatch = spell.attack.match(/Save: (\w+) DC (\d+)/);
    if (saveMatch) {
        res.save = {
            label: `${spell.name} Save`,
            type: saveMatch[1],
            dc: parseInt(saveMatch[2])
        };
    } 
    // Check for Attack Roll (Less common for spells in this list, but possible for Ray of Sickness etc)
    else if (spell.attack.includes("Attack")) {
        // Assume spell attack modifier (typically +7 for this character)
        // Hardcoded for now based on character stats (INT 18 => +4, Prof +3 => +7)
        res.roll = {
            label: "Spell Attack",
            formula: "1d20+7" 
        };
    }
    // Check for Auto (Magic Missile, etc.)
    else if (spell.name === "Magic Missile") {
         res.auto = { label: "Auto-hit (No roll)" };
    }

    // 2. Parse Damage
    // Typical string: "2d8 (2d12 if damaged) Necrotic" or "8d6 Fire"
    // Heuristic: Grab the first "XdY" or "XdY+Z" pattern
    const damageMatch = spell.damage.match(/(\d+d\d+(?:\s*\+\s*\d+)?)/);
    if (damageMatch) {
        res.damage = {
            label: "Damage",
            formula: damageMatch[1]
        };
    } else if (spell.damage.includes("Healing")) {
        // Cure Wounds, etc.
        const healMatch = spell.damage.match(/(\d+d\d+\s*\+\s*\d+)/);
        if (healMatch) {
             res.damage = {
                label: "Healing",
                formula: healMatch[1]
            };
        }
    }

    // 3. Special Case: Toll the Dead (Conditional)
    if (spell.name === "Toll the Dead") {
        // It has two damage modes. We'll default to the "Healthy" one (2d8)
        // but arguably the UI could offer both. For now, 2d8 is safe.
        // The regex above catches "2d8", so we are good.
    }

    return res;
}
