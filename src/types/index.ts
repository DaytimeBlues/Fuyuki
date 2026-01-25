export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export type AbilityScores = Record<AbilityKey, number>;
export type AbilityMods = Record<AbilityKey, number>;

// === EQUIPMENT & ARMOR TYPES ===

export type ArmorSlot = 'head' | 'cloak' | 'chest' | 'hands' | 'feet' | 'ring1' | 'ring2' | 'amulet' | 'mainHand' | 'offHand';

export interface EquipmentSlots {
    head?: EquippedItem | null;
    cloak?: EquippedItem | null;
    chest?: EquippedItem | null;
    hands?: EquippedItem | null;
    feet?: EquippedItem | null;
    ring1?: EquippedItem | null;
    ring2?: EquippedItem | null;
    amulet?: EquippedItem | null;
    mainHand?: EquippedItem | null;
    offHand?: EquippedItem | null;
}

export interface EquippedItem {
    itemId: string;
    name: string;
    description?: string;
    cosmeticOnly: boolean;
    modifiers: StatModifier[];
}

export interface StatModifier {
    stat: 'ac' | 'attackBonus' | 'damageBonus' | 'saveDC' | 'speed' | 'initiative' | AbilityKey;
    value: number;
    type: 'bonus' | 'set';
}

// === WEAPON TYPES (SRD-Compliant) ===

export type WeaponProperty =
    | 'finesse'      // Use STR or DEX
    | 'versatile'    // One or two-handed
    | 'two-handed'   // Requires two hands
    | 'light'        // Dual-wield eligible
    | 'heavy'        // Disadvantage for Small creatures
    | 'reach'        // +5 ft reach
    | 'thrown'       // Can be thrown
    | 'loading'      // One attack per action
    | 'ammunition'   // Requires ammo
    | 'special';     // See weapon description

export interface WeaponStats {
    damage: string;             // e.g., "1d8"
    versatileDamage?: string;   // e.g., "1d10" (two-handed)
    damageType: string;         // e.g., "slashing"
    bonus: number;              // Magical bonus (+1, +2, etc.)
    properties: WeaponProperty[];
    range?: { normal: number; long: number }; // For ranged/thrown
    isPactWeapon?: boolean;
}

// === FAMILAR TYPES ===

export interface Familiar {
    id: string;
    name: string;
    type: 'imp' | 'pseudodragon' | 'quasit' | 'sprite' | 'custom';
    hp: number;
    maxHp: number;
    ac: number;
    speed: number;
    flySpeed?: number;
    isInvisible: boolean;
    traits: string[];         // e.g., ["Devil's Sight", "Magic Resistance"]
    attacks: MinionAttack[];
}

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

// === MINION TYPES (from codex) ===
export interface MinionStats {
    hp: number;
    ac: number;
    notes: string;
}

export interface MinionAttack {
    name: string;
    toHit: number;
    damage: string;
    damageType: string;
}

export interface Minion {
    id: string;
    name: string;
    type: string; // 'skeleton' | 'zombie' | 'undead_spirit' etc
    form?: 'ghostly' | 'putrid' | 'skeletal';
    hp: number;
    maxHp: number;
    ac: number;
    speed?: number; // Optional in some contexts?
    attacks?: MinionAttack[]; // Optional to support simple minions?
    conditions?: string[];
    controlExpiresRound?: number;
    notes?: string;
}

// === COMBAT LOG TYPES (from codex) ===
export type CombatLogType =
    | 'roll'
    | 'damageTaken'
    | 'heal'
    | 'resourceUse'
    | 'conditionAdd'
    | 'conditionRemove'
    | 'concentrationStart'
    | 'concentrationEnd'
    | 'note';

export interface CombatLogEntry {
    id: string;
    timestamp: string;
    type: CombatLogType;
    title: string;
    detail?: string;
}

// === INVENTORY TYPES ===
export interface InventoryItem {
    id: string; // Unique ID for equipment slot mapping (migration: auto-generated if missing)
    name: string;
    spells?: string[];
    charges?: {
        current: number;
        max: number;
    };
    description?: string;
    type?: 'weapon' | 'armor' | 'item' | 'consumable';
    preferredSlot?: ArmorSlot;
    equipped?: boolean;
    modifiers?: StatModifier[];
    weaponStats?: WeaponStats;
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
    current: number;
    max: number;
    size: number;
}

// ===== WARLOCK-SPECIFIC TYPES (from HEAD) =====

export interface PactSlots {
    current: number;
    max: number;
    level: number;
}

export interface ArcanumSlot {
    spellName: string;
    used: boolean;
}

export interface Invocation {
    id: string;
    name: string;
    description: string;
    grantsSpell?: string;
    atWill?: boolean;
    usesPerLongRest?: number;
    currentUses?: number;
    prerequisites?: string;
    active: boolean;
}

export interface PactBoon {
    type: 'chain' | 'blade' | 'tome' | null;
    familiar?: {
        name: string;
        type: string;
        hp: number;
        maxHp: number;
    };
    pactWeapon?: {
        name: string;
        type: string;
    };
    tomeCantrips?: string[];
}

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

    // Spell slots (standard/multiclass)
    slots: Record<number, { used: number; max: number }>;

    // Temporary buffs/states
    mageArmour: boolean;
    shield: boolean;

    // Wild Shape (from codex)
    transformed: {
        active: boolean;
        creatureName: string;
        hp: { current: number; max: number };
        ac: number;
    } | null;

    // === WARLOCK-SPECIFIC ===
    pactSlots: PactSlots;
    spellsKnown: string[];
    cantripsKnown: string[];
    arcanum: {
        6?: ArcanumSlot;
        7?: ArcanumSlot;
        8?: ArcanumSlot;
        9?: ArcanumSlot;
    };
    invocations: Invocation[];
    pactBoon: PactBoon;
    patron: Patron;

    // === EQUIPMENT & FAMILIAR ===
    equipmentSlots?: EquipmentSlots;
    familiar?: Familiar;

    // === CONDITIONS ===
    conditions?: string[];

    // Legacy or Config
    defaultMinion?: { [key: string]: MinionStats };
}

export interface Session {
    id: string;
    sessionNumber: number;
    date: string;
    label?: string;
    characterData: CharacterData;
    minions?: Minion[]; // Minions persisted with session
    lastModified: string;
    version: number;
    migrationVersion?: number; // Track which migrations ran
}
