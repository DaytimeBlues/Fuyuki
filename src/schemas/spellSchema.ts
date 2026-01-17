import { z } from "zod";

// Enum for common schools of magic
const SchoolOfMagicSchema = z.enum([
    "Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation",
    "Illusion", "Necromancy", "Transmutation"
]);

// Enum for casting times
const CastingTimeSchema = z.enum([
    "1 action", "1 bonus action", "1 reaction", "1 minute", "10 minutes", "1 hour", "24 hours", "special"
]);

// Enum for ranges
const RangeSchema = z.enum([
    "Self", "Touch", "5 feet", "10 feet", "30 feet", "60 feet", "90 feet", "100 feet", "120 feet", "150 feet", "300 feet", "1 mile", "Sight", "Unlimited", "Special"
]);

// Schema for components
const ComponentsSchema = z.object({
    verbal: z.boolean(),
    somatic: z.boolean(),
    material: z.string().optional(), // e.g., "a tiny ball of bat guano and sulfur"
    materialCostInGold: z.number().optional(), // For specific expensive components
    materialIsConsumed: z.boolean().optional(),
});

// Schema for duration, including concentration
const DurationSchema = z.object({
    type: z.enum(["instantaneous", "timed", "concentration", "special"]),
    value: z.string().optional(), // e.g., "1 minute", "up to 1 hour", "until dispelled"
});

// Schema for damage or healing entries
const DiceEntrySchema = z.object({
    count: z.number(),
    sides: z.number(), // d4, d6, d8, d10, d12, d20
    type: z.string(), // "acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "psychic", "radiant", "slashing", "thunder", "healing"
    scaling: z.object({
        type: z.enum(["per_slot_level", "per_character_level"]),
        diceIncreasePerLevel: z.number().optional(),
        sidesIncreasePerLevel: z.number().optional(),
        flatIncreasePerLevel: z.number().optional(),
        // For complex scaling like Magic Missile's additional darts
        additionalEntriesPerLevel: z.number().optional(),
    }).optional(),
});

// Schema for saving throw information
const SavingThrowSchema = z.object({
    ability: z.enum(["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"]),
    onSuccess: z.enum(["half", "negates", "special"]),
    onFail: z.enum(["full", "extra", "special"]),
});

// Schema for an attack roll
const AttackRollSchema = z.object({
    type: z.enum(["melee", "ranged", "spell"]),
    ability: z.enum(["Strength", "Dexterity", "Intelligence", "Wisdom", "Charisma"]).optional(), // Spell attacks use spellcasting ability
});

// The main Spell schema
export const SpellSchema = z.object({
    id: z.string(),
    name: z.string(),
    level: z.number().min(0).max(9),
    school: SchoolOfMagicSchema,
    ritual: z.boolean().default(false),
    castingTime: CastingTimeSchema,
    range: RangeSchema,
    components: ComponentsSchema,
    duration: DurationSchema,
    description: z.string(),
    scenario: z.string().optional(), // Descriptive usage example for new players
    higherLevelDescription: z.string().optional(), // Text for "When you cast this spell using a spell slot of X level or higher..."

    // --- Dynamic/Executable Logic Fields ---
    requiresAttackRoll: z.boolean().default(false),
    attackRollDetails: AttackRollSchema.optional(),
    requiresSavingThrow: z.boolean().default(false),
    savingThrowDetails: SavingThrowSchema.optional(),
    damage: z.array(DiceEntrySchema).optional(),
    healing: z.array(DiceEntrySchema).optional(),

    // For spells like Polymorph, Summon Undead, etc.
    variants: z.array(z.object({
        name: z.string(),
        description: z.string(),
        // Can link to a monster ID from a compendium or have custom stats here
        monsterId: z.string().optional(),
        customStats: z.record(z.string(), z.unknown()).optional(),
    })).optional(),

    // For spells that can be cast as a reaction with specific triggers
    reactionTrigger: z.string().optional(), // e.g., "Which you take when you see a creature within 60 feet of you casting a spell"

    // List of classes that have access to this spell
    classes: z.array(z.string()).optional(),

    // Tags for filtering and searching
    tags: z.array(z.string()).optional(), // e.g., ["control", "damage", "summoning", "utility"]
});

// Export the inferred TypeScript type
export type SpellV3 = z.infer<typeof SpellSchema>;
