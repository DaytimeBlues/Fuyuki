import { SpellV3 } from '../schemas/spellSchema';

export const initialSpellsV3: SpellV3[] = [
    {
        id: "magic-missile",
        name: "Magic Missile",
        level: 1,
        school: "Evocation",
        castingTime: "1 action",
        range: "120 feet",
        components: { verbal: true, somatic: true },
        duration: { type: "instantaneous" },
        description: "You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.",
        ritual: false,
        requiresAttackRoll: false,
        requiresSavingThrow: false,
        damage: [
            {
                count: 1,
                sides: 4,
                type: "force",
                scaling: {
                    type: "per_slot_level",
                    additionalEntriesPerLevel: 1
                }
            }
        ],
        tags: ["damage", "force"]
    },
    {
        id: "shield",
        name: "Shield",
        level: 1,
        school: "Abjuration",
        castingTime: "1 reaction",
        reactionTrigger: "which you take when you are hit by an attack or targeted by the magic missile spell",
        range: "Self",
        components: { verbal: true, somatic: true },
        duration: { type: "timed", value: "1 round" },
        description: "An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.",
        ritual: false,
        requiresAttackRoll: false,
        requiresSavingThrow: false,
        tags: ["defense", "reaction"]
    },
    {
        id: "fireball",
        name: "Fireball",
        level: 3,
        school: "Evocation",
        castingTime: "1 action",
        range: "150 feet",
        components: { verbal: true, somatic: true, material: "a tiny ball of bat guano and sulfur" },
        duration: { type: "instantaneous" },
        description: "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.",
        ritual: false,
        requiresAttackRoll: false,
        requiresSavingThrow: true,
        savingThrowDetails: {
            ability: "Dexterity",
            onSuccess: "half",
            onFail: "full"
        },
        damage: [
            {
                count: 8,
                sides: 6,
                type: "fire",
                scaling: {
                    type: "per_slot_level",
                    diceIncreasePerLevel: 1
                }
            }
        ],
        tags: ["damage", "aoe", "fire"]
    },
    {
        id: "mage-armor",
        name: "Mage Armor",
        level: 1,
        school: "Abjuration",
        castingTime: "1 action",
        range: "Touch",
        components: { verbal: true, somatic: true, material: "a piece of cured leather" },
        duration: { type: "timed", value: "8 hours" },
        description: "You touch a willing creature who isn't wearing armor, and a protective magical force surrounds it until the spell ends. The target's base AC becomes 13 + its Dexterity modifier. The spell ends if the target dons armor or if you dismiss the spell as an action.",
        ritual: false,
        requiresAttackRoll: false,
        requiresSavingThrow: false,
        tags: ["buff", "defense"]
    },
    {
        id: "detect-magic",
        name: "Detect Magic",
        level: 1,
        school: "Divination",
        ritual: true,
        castingTime: "1 action",
        range: "Self",
        components: { verbal: true, somatic: true },
        duration: { type: "concentration", value: "up to 10 minutes" },
        description: "For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any.",
        requiresAttackRoll: false,
        requiresSavingThrow: false,
        tags: ["utility", "detection"]
    },
    {
        id: "summon-undead",
        name: "Summon Undead",
        level: 3,
        school: "Necromancy",
        castingTime: "1 action",
        range: "90 feet",
        components: { verbal: true, somatic: true, material: "a gilded skull worth at least 300 gp" },
        duration: { type: "concentration", value: "up to 1 hour" },
        description: "You call forth an undead spirit. It manifests in an unoccupied space that you can see within range. This corporeal form uses the Undead Spirit stat block. When you cast the spell, choose the creature's form: Ghostly, Putrid, or Skeletal.",
        ritual: false,
        requiresAttackRoll: false,
        requiresSavingThrow: false,
        tags: ["summoning", "necromancy"],
        variants: [
            { name: "Ghostly", description: "Incorporeal and can move through objects." },
            { name: "Putrid", description: "Emits a stench that can poison creatures." },
            { name: "Skeletal", description: "Ranged attacker." }
        ]
    }
];
