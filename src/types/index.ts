export interface Ability {
    score: number;
    mod: number;
}

export interface Skill {
    name: string;
    attr: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
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

export interface CharacterData {
    hp: { current: number; max: number; temp: number };
    baseAC: number;
    mageArmour: boolean;
    shield: boolean;
    dc: number;
    profBonus: number;
    level: number;
    hitDice: { total: number; used: number; dieType: number };
    savingThrowProficiencies: ('str' | 'dex' | 'con' | 'int' | 'wis' | 'cha')[];
    deathSaves: { successes: number; failures: number };
    abilities: {
        str: Ability;
        dex: Ability;
        con: Ability;
        int: Ability;
        wis: Ability;
        cha: Ability;
    };
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
