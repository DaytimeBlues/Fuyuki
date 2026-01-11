import type { CharacterData } from '../types';

export const initialCharacterData: CharacterData = {
    hp: { current: 35, max: 35, temp: 0 },
    hitDice: { current: 5, max: 5, size: 6 }, // Level 5 wizard, d6 hit die
    baseAC: 13,
    mageArmour: false,
    shield: false,
    dc: 14,
    profBonus: 3,
    level: 5,
    savingThrowProficiencies: ['int', 'wis'],
    deathSaves: { successes: 0, failures: 0 },
    abilities: {
        str: 8,
        dex: 14,
        con: 14,
        int: 17,  // INT 17 for Arcana +7 (3 mod + 3 prof + 1 expertise)
        wis: 15,
        cha: 10
    },
    abilityMods: {
        str: -1,
        dex: 2,
        con: 2,
        int: 3,
        wis: 2,
        cha: 0
    },
    skills: {
        acrobatics: { name: 'Acrobatics', attr: 'dex', prof: false },
        animalHandling: { name: 'Animal Handling', attr: 'wis', prof: false },
        arcana: { name: 'Arcana', attr: 'int', prof: true },
        athletics: { name: 'Athletics', attr: 'str', prof: false },
        deception: { name: 'Deception', attr: 'cha', prof: false },
        history: { name: 'History', attr: 'int', prof: true },
        insight: { name: 'Insight', attr: 'wis', prof: true },
        intimidation: { name: 'Intimidation', attr: 'cha', prof: false },
        investigation: { name: 'Investigation', attr: 'int', prof: true },
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
    slots: {
        1: { used: 0, max: 4 },
        2: { used: 0, max: 3 },
        3: { used: 0, max: 2 }
    },
    defaultMinion: {
        Skeleton: { hp: 13, ac: 13, notes: "Shortbow (1d6+2), Shortsword (1d6+2)" },
        Zombie: { hp: 22, ac: 8, notes: "Undead Fortitude, Slam (1d6+1)" }
    },
    concentration: null,
    attunement: [],
    inventory: ["Component Pouch", "Arcane Focus", "Scholar's Pack"],
    transformed: null
};
