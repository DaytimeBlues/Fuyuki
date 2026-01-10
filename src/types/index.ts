export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export type AbilityScores = Record<AbilityKey, number>;
export type AbilityMods = Record<AbilityKey, number>;

export interface Skill {
    name: string;
    attr: AbilityKey;
    prof: boolean;
}

export interface Spell {
    name: string;
    lvl: number;
    school: string;
    castTime: string;
    range: string;
    duration: string;
    components: string;
    attack: string;
    damage: string;
    desc: string;
    incantation?: string;
    pronunciation?: string;
}

export interface MinionStats {
    hp: number;
    ac: number;
    notes: string;
}

export interface Minion {
    id: string;
    type: 'Skeleton' | 'Zombie';
    name: string;
    hp: { current: number; max: number };
    ac: number;
    notes: string;
}

export interface HitDice {
    current: number;  // Available to spend
    max: number;      // Equal to character level
    size: number;     // Die size (6 for d6, 8 for d8, etc.)
}

export interface CharacterData {
    hp: { current: number; max: number; temp: number };
    hitDice: HitDice;
    baseAC: number;
    mageArmour: boolean;
    shield: boolean;
    dc: number;
    profBonus: number;
    level: number;
    savingThrowProficiencies: AbilityKey[];
    deathSaves: { successes: number; failures: number };
    /**
     * Base (editable) ability scores.
     * Derived (calculated) modifiers are stored separately in `abilityMods`.
     */
    abilities: AbilityScores;
    /** Derived (calculated) ability modifiers */
    abilityMods: AbilityMods;
    skills: {
        [key: string]: Skill;
    };
    slots: {
        [level: number]: { used: number; max: number };
    };
    defaultMinion: {
        [key: string]: MinionStats;
    };
    concentration: string | null; // Currently concentrating on this spell
    attunement: string[]; // Max 3 attuned magic items
    inventory: string[]; // General inventory items
    transformed: { // Wild Shape / Polymorph state
        active: boolean;
        creatureName: string;
        hp: { current: number; max: number };
        ac: number;
    } | null;
}

export interface Session {
    id: string;
    sessionNumber: number;
    date: string;
    label?: string;
    characterData: CharacterData;
    minions: Minion[];
    lastModified: string;
}
