export interface UndeadStatBlock {
    name: string;
    type: string;
    ac: string;
    hp: string;
    speed: string;
    stats: { str: number; dex: number; con: number; int: number; wis: number; cha: number };
    damageImmunities?: string;
    conditionImmunities?: string;
    senses: string;
    languages: string;
    traits?: { name: string; desc: string }[];
    actions: { name: string; desc: string }[];
}

export const undeadStats: UndeadStatBlock[] = [
    {
        name: "Skeleton",
        type: "Medium Undead, Lawful Evil",
        ac: "13 (Armor Scraps)",
        hp: "13 (2d8 + 4)",
        speed: "30 ft.",
        stats: { str: 10, dex: 14, con: 15, int: 6, wis: 8, cha: 5 },
        damageImmunities: "Poison",
        conditionImmunities: "Exhaustion, Poisoned",
        senses: "Darkvision 60 ft., Passive Perception 9",
        languages: "Understands languages it knew in life but can't speak",
        actions: [
            { name: "Shortsword", desc: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage." },
            { name: "Shortbow", desc: "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage." }
        ]
    },
    {
        name: "Zombie",
        type: "Medium Undead, Neutral Evil",
        ac: "8",
        hp: "22 (3d8 + 9)",
        speed: "20 ft.",
        stats: { str: 13, dex: 6, con: 16, int: 3, wis: 6, cha: 5 },
        damageImmunities: "Poison",
        conditionImmunities: "Poisoned",
        senses: "Darkvision 60 ft., Passive Perception 8",
        languages: "Understands languages it knew in life but can't speak",
        traits: [
            { name: "Undead Fortitude", desc: "If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead." }
        ],
        actions: [
            { name: "Slam", desc: "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) bludgeoning damage." }
        ]
    },
    {
        name: "Ghostly Spirit (Summon Undead)",
        type: "Medium Undead",
        ac: "11 + Level (14)",
        hp: "30 + 10/Level (40)",
        speed: "0 ft., fly 40 ft. (hover)",
        stats: { str: 4, dex: 16, con: 16, int: 10, wis: 10, cha: 16 },
        damageImmunities: "Necrotic, Poison",
        conditionImmunities: "Frightened, Grappled, Paralyzed, Petrified, Poisoned, Prone, Restrained",
        senses: "Darkvision 60 ft., Passive Perception 10",
        languages: "Understands languages you speak",
        traits: [
            { name: "Incorporeal Passage", desc: "The spirit can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object." }
        ],
        actions: [
            { name: "Multiattack", desc: "The spirit makes a number of attacks equal to half this spell's level (rounded down)." },
            { name: "Deathly Touch", desc: "Melee Weapon Attack: +Your Spell Attack Modifier to hit, reach 5 ft., one creature. Hit: 1d8 + 3 + Level Necrotic damage, and the creature must succeed on a Wisdom saving throw against your Spell Save DC or be frightened of the undead until the end of the target's next turn." }
        ]
    },
    {
        name: "Putrid Spirit (Summon Undead)",
        type: "Medium Undead",
        ac: "11 + Level (14)",
        hp: "30 + 10/Level (40)",
        speed: "30 ft.",
        stats: { str: 16, dex: 10, con: 16, int: 10, wis: 10, cha: 4 },
        damageImmunities: "Necrotic, Poison",
        conditionImmunities: "Frightened, Poisoned",
        senses: "Darkvision 60 ft., Passive Perception 10",
        languages: "Understands languages you speak",
        traits: [
            { name: "Festering Aura", desc: "Any creature, other than you, that starts its turn within 5 feet of the spirit must succeed on a Constitution saving throw against your Spell Save DC or be poisoned until the start of its next turn." }
        ],
        actions: [
            { name: "Multiattack", desc: "The spirit makes a number of attacks equal to half this spell's level (rounded down)." },
            { name: "Rotting Claw", desc: "Melee Weapon Attack: +Your Spell Attack Modifier to hit, reach 5 ft., one target. Hit: 1d6 + 3 + Level Slashing damage. If the target is poisoned, it must succeed on a Constitution saving throw against your Spell Save DC or be paralyzed until the end of its next turn." }
        ]
    },
    {
        name: "Skeletal Spirit (Summon Undead)",
        type: "Medium Undead",
        ac: "11 + Level (14)",
        hp: "20 + 10/Level (30)",
        speed: "30 ft.",
        stats: { str: 10, dex: 16, con: 15, int: 6, wis: 8, cha: 5 },
        damageImmunities: "Necrotic, Poison",
        conditionImmunities: "Exhaustion, Frightened, Poisoned",
        senses: "Darkvision 60 ft., Passive Perception 9",
        languages: "Understands languages you speak",
        actions: [
            { name: "Multiattack", desc: "The spirit makes a number of attacks equal to half this spell's level (rounded down)." },
            { name: "Grave Bolt", desc: "Ranged Spell Attack: +Your Spell Attack Modifier to hit, range 150 ft., one target. Hit: 2d4 + 3 + Level Necrotic damage." }
        ]
    }
];
