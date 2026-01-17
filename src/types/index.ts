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
    effect: string;
    rolls: string;
    damage: string;
    damageType: string;
    classes?: string[];
    source?: string;
    decisionTree: SpellDecision[];
    concentration?: boolean;
    desc: string;
    scenario?: string;
    incantation?: string;
    pronunciation?: string;
}

export interface SpellDecision {
    level: number;
    summary: string;
}

export interface MinionStats {
    hp: number;
    ac: number;
    notes: string;
}

export interface Minion {
    id: string;
    name: string;
    type: 'skeleton' | 'zombie' | 'undead_spirit';
    form?: 'ghostly' | 'putrid' | 'skeletal';
    hp: number;
    maxHp: number;
    ac: number;
    speed: number;
    attacks: MinionAttack[];
    conditions: string[];
    controlExpiresRound?: number;
    notes?: string;
}

export interface MinionAttack {
    name: string;
    toHit: number;
    damage: string;
    damageType: string;
}

export interface InventoryItem {
    name: string;
    /**
     * Optional list of spells that can be cast via this item (e.g., wand/staff).
     * These are spell *names* that should match entries in `src/data/spells.ts`.
     */
    spells?: string[];
    /**
     * Optional charges for items like wands.
     */
    charges?: {
        current: number;
        max: number;
    };
    description?: string;
    type?: 'weapon' | 'armor' | 'item';
    equipped?: boolean;
    weaponStats?: {
        damage: string;
        damageType: string;
        bonus?: number;
        properties?: string[];
        isPactWeapon?: boolean;
    };
    armorStats?: {
        baseAC: number;
        dexCap?: number;
        stealthDisadvantage?: boolean;
    };
}

// Re-export Schema types
export { SpellSchema } from '../schemas/spellSchema';
export type { SpellV3 } from '../schemas/spellSchema';

export interface HitDice {
    current: number;  // Available to spend
    max: number;      // Equal to character level
    size: number;     // Die size (8 for warlock d8)
}

// ===== WARLOCK-SPECIFIC TYPES =====

/** Pact Magic slots - shared pool of 1-3 slots at a single level */
export interface PactSlots {
    current: number;  // Available slots
    max: number;      // Total slots (1-3 based on level)
    level: number;    // Current slot level (1-5)
}

/** Mystic Arcanum - one high-level spell per long rest */
export interface ArcanumSlot {
    spellName: string;
    used: boolean;
}

/** Eldritch Invocation with toggle and limited use tracking */
export interface Invocation {
    id: string;
    name: string;
    description: string;
    /** For at-will spells granted by invocation */
    grantsSpell?: string;
    atWill?: boolean;
    /** For limited-use invocations */
    usesPerLongRest?: number;
    currentUses?: number;
    /** Prerequisites display (not enforced) */
    prerequisites?: string;
    /** Toggle state for passive invocations */
    active: boolean;
}

/** Pact Boon choice and associated tracking */
export interface PactBoon {
    type: 'chain' | 'blade' | 'tome' | null;
    /** Chain pact familiar */
    familiar?: {
        name: string;
        type: string;
        hp: number;
        maxHp: number;
    };
    /** Blade pact weapon */
    pactWeapon?: {
        name: string;
        type: string;
    };
    /** Tome pact extra cantrips */
    tomeCantrips?: string[];
}

/** Patron (subclass) info */
export interface Patron {
    name: string;
    features: string[];
}

// ===== MAIN CHARACTER DATA =====

export interface CharacterData {
    // Core stats
    hp: { current: number; max: number; temp: number };
    hitDice: HitDice;
    baseAC: number;
    dc: number;
    profBonus: number;
    level: number;
    savingThrowProficiencies: AbilityKey[];
    deathSaves: { successes: number; failures: number };
    abilities: AbilityScores;
    abilityMods: AbilityMods;
    skills: { [key: string]: Skill };
    concentration: string | null;
    attunement: string[];
    inventory: InventoryItem[];
    preparedSpells: string[];

    // Spell slots (standard)
    slots: Record<number, { used: number; max: number }>;

    // Temporary buffs/states
    mageArmour: boolean;
    shield: boolean;

    // === WARLOCK-SPECIFIC ===
    /** Pact Magic slots (1-3 at levels 1-5, short rest recharge) */
    pactSlots: PactSlots;
    /** Spells known (not prepared) */
    spellsKnown: string[];
    cantripsKnown: string[];
    /** Mystic Arcanum (6th-9th level, 1/long rest each) */
    arcanum: {
        6?: ArcanumSlot;
        7?: ArcanumSlot;
        8?: ArcanumSlot;
        9?: ArcanumSlot;
    };
    /** Eldritch Invocations */
    invocations: Invocation[];
    /** Pact Boon (level 3+) */
    pactBoon: PactBoon;
    /** Patron subclass */
    patron: Patron;
}

export interface Session {
    id: string;
    sessionNumber: number;
    date: string;
    label?: string;
    characterData: CharacterData;
    minions?: Minion[];
    lastModified: string;
}
