import srdSpellsRaw from './srd-5.2-spells.json';
import { SpellV3 } from '../schemas/spellSchema';

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

// Transform SRD school to proper case
const schoolMap: Record<string, SpellV3['school']> = {
    'abjuration': 'Abjuration',
    'conjuration': 'Conjuration',
    'divination': 'Divination',
    'enchantment': 'Enchantment',
    'evocation': 'Evocation',
    'illusion': 'Illusion',
    'necromancy': 'Necromancy',
    'transmutation': 'Transmutation',
};

// Map action type to casting time
const castingTimeMap: Record<string, SpellV3['castingTime']> = {
    'action': '1 action',
    'bonusAction': '1 bonus action',
    'reaction': '1 reaction',
    '1 minute': '1 minute',
    '10 minutes': '10 minutes',
    '1 hour': '1 hour',
};

// Map range string to valid range enum
function mapRange(range: string): SpellV3['range'] {
    const cleanRange = range.toLowerCase();
    if (cleanRange === 'self') return 'Self';
    if (cleanRange === 'touch') return 'Touch';
    if (cleanRange.includes('5 feet')) return '5 feet';
    if (cleanRange.includes('10 feet')) return '10 feet';
    if (cleanRange.includes('30 feet')) return '30 feet';
    if (cleanRange.includes('60 feet')) return '60 feet';
    if (cleanRange.includes('90 feet')) return '90 feet';
    if (cleanRange.includes('100 feet')) return '100 feet';
    if (cleanRange.includes('120 feet')) return '120 feet';
    if (cleanRange.includes('150 feet')) return '150 feet';
    if (cleanRange.includes('300 feet')) return '300 feet';
    if (cleanRange.includes('1 mile') || cleanRange.includes('mile')) return '1 mile';
    if (cleanRange.includes('sight')) return 'Sight';
    if (cleanRange.includes('unlimited')) return 'Unlimited';
    return 'Special';
}

// Parse damage from description
function parseDamage(desc: string): SpellV3['damage'] {
    const damageMatch = desc.match(/(\d+)d(\d+)\s+(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)/i);
    if (!damageMatch) return undefined;

    return [{
        count: parseInt(damageMatch[1]),
        sides: parseInt(damageMatch[2]),
        type: damageMatch[3].toLowerCase(),
    }];
}

// Detect if spell requires attack roll
function requiresAttack(desc: string): boolean {
    return /spell\s+attack|ranged\s+attack|melee\s+attack/i.test(desc);
}

// Detect if spell requires saving throw
function requiresSave(desc: string): { required: boolean; ability?: string } {
    const saveMatch = desc.match(/(strength|dexterity|constitution|intelligence|wisdom|charisma)\s+saving\s+throw/i);
    if (saveMatch) {
        return { required: true, ability: saveMatch[1].charAt(0).toUpperCase() + saveMatch[1].slice(1).toLowerCase() };
    }
    return { required: false };
}

// Transform a single SRD spell to SpellV3 format
function transformToV3(srd: SRDSpell): SpellV3 {
    const saveInfo = requiresSave(srd.description);

    const durationType = srd.concentration ? 'concentration' :
        srd.duration.toLowerCase() === 'instantaneous' ? 'instantaneous' :
            srd.duration.toLowerCase().includes('until') ? 'special' : 'timed';

    return {
        id: srd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: srd.name,
        level: srd.level,
        school: schoolMap[srd.school.toLowerCase()] || 'Evocation',
        ritual: srd.ritual,
        castingTime: castingTimeMap[srd.actionType] || castingTimeMap[srd.castingTime || ''] || '1 action',
        range: mapRange(srd.range),
        components: {
            verbal: srd.components.includes('v'),
            somatic: srd.components.includes('s'),
            material: srd.material,
        },
        duration: {
            type: durationType,
            value: durationType !== 'instantaneous' ? srd.duration : undefined,
        },
        description: srd.description,
        higherLevelDescription: srd.higherLevelSlot || srd.cantripUpgrade,
        requiresAttackRoll: requiresAttack(srd.description),
        requiresSavingThrow: saveInfo.required,
        savingThrowDetails: saveInfo.required ? {
            ability: saveInfo.ability as 'Dexterity' | 'Strength' | 'Constitution' | 'Intelligence' | 'Wisdom' | 'Charisma',
            onSuccess: 'half',
            onFail: 'full',
        } : undefined,
        damage: parseDamage(srd.description),
        tags: [srd.school.toLowerCase()],
    };
}

// Get all Wizard spells from SRD in V3 format
export function getWizardSpellsV3(): SpellV3[] {
    return (srdSpellsRaw as SRDSpell[])
        .filter(s => s.classes.includes('wizard'))
        .map(transformToV3);
}

// Export all wizard spells
export const wizardSpellsV3 = getWizardSpellsV3();

// Export all SRD spells in V3 format
export const allSRDSpellsV3 = (srdSpellsRaw as SRDSpell[]).map(transformToV3);
