import srdSpellsRaw from './srd-5.2-spells.json';
import type { Spell } from '../types';

// SRD 5.2 spell format
interface SRDSpell {
    name: string;
    level: number;
    school: string;
    classes: string[];
    actionType: string;
    concentration: boolean;
    ritual: boolean;
    range: string;
    components: string[];
    material?: string;
    duration: string;
    description: string;
    cantripUpgrade?: string;
    higherLevelSlot?: string;
    castingTime?: string;
}

// School abbreviation mapping
const schoolAbbrev: Record<string, string> = {
    'abjuration': 'ABJ',
    'conjuration': 'CONJ',
    'divination': 'DIV',
    'enchantment': 'ENCH',
    'evocation': 'EVO',
    'illusion': 'ILLUS',
    'necromancy': 'NECRO',
    'transmutation': 'TRANS',
};

// Parse damage from description (best effort)
function parseDamage(desc: string): { damage: string; damageType: string; rolls: string } {
    // Common damage patterns
    const damageMatch = desc.match(/(\d+d\d+(?:\s*\+\s*\d+)?)\s+(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)/i);
    const saveMatch = desc.match(/(strength|dexterity|constitution|intelligence|wisdom|charisma)\s+saving\s+throw/i);
    const attackMatch = desc.match(/spell\s+attack/i);

    let rolls = 'None';
    if (attackMatch) rolls = 'Spell Attack';
    else if (saveMatch) rolls = `${saveMatch[1].substring(0, 3).toUpperCase()} save`;

    return {
        damage: damageMatch ? damageMatch[1] : '—',
        damageType: damageMatch ? damageMatch[2].charAt(0).toUpperCase() + damageMatch[2].slice(1) : 'Utility',
        rolls,
    };
}

// Transform SRD spell to app format
function transformSpell(srd: SRDSpell): Spell {
    const { damage, damageType, rolls } = parseDamage(srd.description);

    return {
        name: srd.name,
        lvl: srd.level,
        school: schoolAbbrev[srd.school.toLowerCase()] || srd.school.toUpperCase().substring(0, 4),
        castTime: srd.castingTime || (srd.actionType === 'action' ? '1 Action' :
            srd.actionType === 'bonusAction' ? '1 Bonus Action' :
                srd.actionType === 'reaction' ? '1 Reaction' : '1 Action'),
        range: srd.range,
        duration: srd.duration,
        components: srd.components.map(c => c.toUpperCase()).join(', ') +
            (srd.material ? ` (${srd.material})` : ''),
        effect: srd.description.split('.')[0] + '.',
        rolls,
        damage,
        damageType,
        concentration: srd.concentration,
        decisionTree: srd.cantripUpgrade ? [{ level: 5, summary: srd.cantripUpgrade }] :
            srd.higherLevelSlot ? [{ level: srd.level + 1, summary: srd.higherLevelSlot }] : [],
        desc: srd.description,
    };
}

// Get all SRD spells for a specific class
export function getSpellsForClass(className: string): Spell[] {
    return (srdSpellsRaw as SRDSpell[])
        .filter(s => s.classes.includes(className.toLowerCase()))
        .map(transformSpell);
}

// Get all Wizard spells (default for this app)
export const wizardSpells: Spell[] = getSpellsForClass('wizard');

// Get all SRD spells
export const allSRDSpells: Spell[] = (srdSpellsRaw as SRDSpell[]).map(transformSpell);

// Legacy export: combine with wizard spells
export const spells = wizardSpells;
