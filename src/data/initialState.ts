/**
 * initialState.ts - Warlock Default Character
 * Level 5 Fiend Warlock for testing
 */
import type { CharacterData } from '../types';

export const initialCharacterData: CharacterData = {
    // Core stats
    hp: { current: 38, max: 38, temp: 0 },  // d8 + CON 14 at level 5
    hitDice: { current: 5, max: 5, size: 8 }, // d8 for Warlock
    baseAC: 13, // Leather armor (11) + DEX 2
    dc: 14, // 8 + 3 (Prof) + 3 (CHA 16)
    profBonus: 3,
    level: 5,
    savingThrowProficiencies: ['wis', 'cha'], // Warlock saves
    deathSaves: { successes: 0, failures: 0 },
    abilities: {
        str: 8,
        dex: 14,
        con: 14,
        int: 10,
        wis: 12,
        cha: 16  // Primary stat for Warlock
    },
    abilityMods: {
        str: -1,
        dex: 2,
        con: 2,
        int: 0,
        wis: 1,
        cha: 3
    },
    skills: {
        acrobatics: { name: 'Acrobatics', attr: 'dex', prof: false },
        animalHandling: { name: 'Animal Handling', attr: 'wis', prof: false },
        arcana: { name: 'Arcana', attr: 'int', prof: true },
        athletics: { name: 'Athletics', attr: 'str', prof: false },
        deception: { name: 'Deception', attr: 'cha', prof: true },
        history: { name: 'History', attr: 'int', prof: false },
        insight: { name: 'Insight', attr: 'wis', prof: false },
        intimidation: { name: 'Intimidation', attr: 'cha', prof: true },
        investigation: { name: 'Investigation', attr: 'int', prof: false },
        medicine: { name: 'Medicine', attr: 'wis', prof: false },
        nature: { name: 'Nature', attr: 'int', prof: false },
        perception: { name: 'Perception', attr: 'wis', prof: false },
        performance: { name: 'Performance', attr: 'cha', prof: false },
        persuasion: { name: 'Persuasion', attr: 'cha', prof: false },
        religion: { name: 'Religion', attr: 'int', prof: false },
        sleightOfHand: { name: 'Sleight of Hand', attr: 'dex', prof: false },
        stealth: { name: 'Stealth', attr: 'dex', prof: false },
        survival: { name: 'Survival', attr: 'wis', prof: false }
    },
    concentration: null,
    attunement: [],
    inventory: [
        { name: 'Arcane Focus (Rod)' },
        { name: 'Leather Armor' },
        { name: "Dungeoneer's Pack" }
    ],
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
    shield: false,
    pactSlots: {
        current: 2,  // Level 5 has 2 slots
        max: 2,
        level: 3     // 3rd-level slots at level 5
    },
    cantripsKnown: [
        'Eldritch Blast',
        'Minor Illusion',
        'Prestidigitation'
    ],
    spellsKnown: [
        'Hex',
        'Armor of Agathys',
        'Hellish Rebuke',
        'Misty Step',
        'Hold Person',
        'Darkness'
    ],
    arcanum: {},  // Empty until level 11
    invocations: [
        {
            id: 'agonizing-blast',
            name: 'Agonizing Blast',
            description: 'Add CHA modifier to Eldritch Blast damage.',
            active: true
        },
        {
            id: 'devils-sight',
            name: "Devil's Sight",
            description: 'See normally in darkness (magical and nonmagical) to 120 ft.',
            active: true
        },
        {
            id: 'repelling-blast',
            name: 'Repelling Blast',
            description: 'Push creature 10 ft when hit by Eldritch Blast.',
            active: true
        }
    ],
    pactBoon: {
        type: 'blade',
        pactWeapon: {
            name: 'Pact Blade',
            type: 'longsword'
        }
    },
    patron: {
        name: 'The Fiend',
        features: [
            "Dark One's Blessing",
            "Dark One's Own Luck"
        ]
    }
};
