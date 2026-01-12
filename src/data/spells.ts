import type { Spell } from '../types';

export const spells: Spell[] = [
    {
        name: "Toll the Dead",
        lvl: 0,
        school: "NECRO",
        castTime: "1 Action",
        range: "60 ft",
        duration: "Instantaneous",
        components: "V, S",
        effect: "Ring a necrotic bell that punishes wounded targets.",
        rolls: "WIS save vs DC 15",
        damage: "2d8 (2d12 if damaged)",
        damageType: "Necrotic",
        decisionTree: [
            { level: 1, summary: "Base damage: 1d8 (1d12 if damaged)." },
            { level: 5, summary: "Damage scales to 2 dice (current tier)." },
            { level: 11, summary: "Damage scales to 3 dice." },
            { level: 17, summary: "Damage scales to 4 dice." }
        ],
        desc: "Point at one creature you can see within range. The target must succeed on a Wisdom saving throw or take 2d8 necrotic damage. If the target is missing any of its hit points, it instead takes 2d12 necrotic damage. At Level 5, this cantrip deals 2 dice of damage (upgraded from 1 die).",
        incantation: "Mortis Tactus",
        pronunciation: "MOR-tis TAK-toos"
    },
    {
        name: "Mage Hand",
        lvl: 0,
        school: "CONJ",
        castTime: "1 Action",
        range: "30 ft",
        duration: "1 minute",
        components: "V, S",
        effect: "Create a spectral hand to manipulate objects at range.",
        rolls: "None",
        damage: "—",
        damageType: "Utility",
        decisionTree: [
            { level: 1, summary: "Base hand functions for light object manipulation." },
            { level: 5, summary: "Use the hand in combat for quick object interactions." },
            { level: 11, summary: "Handle delicate tasks at range with steady control." },
            { level: 17, summary: "Keep the hand active while repositioning in combat." }
        ],
        desc: "A spectral floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand can manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial.",
        incantation: "Manus Invisibilis",
        pronunciation: "MAH-noos in-vih-SEE-bih-lis"
    },
    {
        name: "Message",
        lvl: 0,
        school: "TRANS",
        castTime: "1 Action",
        range: "120 ft",
        duration: "1 round",
        components: "V, S, M",
        effect: "Whisper a private message to a creature and receive a reply.",
        rolls: "None",
        damage: "—",
        damageType: "Utility",
        decisionTree: [
            { level: 1, summary: "Base effect for short tactical whispers." },
            { level: 5, summary: "Use every round to coordinate positioning." },
            { level: 11, summary: "Maintain silent command loops across the battlefield." },
            { level: 17, summary: "Keep whisper chains active during complex maneuvers." }
        ],
        desc: "You point your finger toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear.",
        incantation: "Nuntius Susurrus",
        pronunciation: "NOON-tee-oos soo-SOO-roos"
    },
    {
        name: "Prestidigitation",
        lvl: 0,
        school: "TRANS",
        castTime: "1 Action",
        range: "10 ft",
        duration: "Up to 1 hour",
        components: "V, S",
        effect: "Create minor magical effects for utility and flair.",
        rolls: "None",
        damage: "—",
        damageType: "Utility",
        decisionTree: [
            { level: 1, summary: "Base effects: sensory, clean/soil, light/snuff." },
            { level: 5, summary: "Layer multiple minor effects for distraction." },
            { level: 11, summary: "Sustain long-form utility effects in downtime." },
            { level: 17, summary: "Maintain multiple cantrip effects simultaneously." }
        ],
        desc: "You create one of the following magical effects within range: a harmless sensory effect, light/snuff a candle, clean/soil an object, chill/warm material, make a color/mark/symbol appear, or create a trinket/illusion.",
        incantation: "Praestigia Minima",
        pronunciation: "pray-STIH-jee-ah MIN-ih-mah"
    },

    {
        name: "Sleep (2024)",
        lvl: 1,
        school: "ENCH",
        castTime: "1 Action",
        range: "60 ft",
        duration: "1 min (Conc.)",
        components: "V, S, M",
        effect: "Force creatures into magical slumber.",
        rolls: "WIS save vs DC 14",
        damage: "Unconscious",
        damageType: "Condition",
        decisionTree: [
            { level: 1, summary: "Base effect: 5-foot-radius sphere of sleep." },
            { level: 3, summary: "Upcast to affect tougher targets or more creatures." },
            { level: 5, summary: "Upcast again for battlefield-wide control." }
        ],
        concentration: true,
        desc: "Creatures in a 5-foot-radius sphere must succeed on a Wisdom saving throw or be incapacitated and unconscious for the duration.",
        incantation: "Somnus",
        pronunciation: "SOM-noos"
    },
    {
        name: "Detect Magic",
        lvl: 1,
        school: "DIV",
        castTime: "1 Action",
        range: "Self",
        duration: "10 min (Conc.)",
        components: "V, S",
        effect: "Sense magical auras in a 30-foot radius.",
        rolls: "None",
        damage: "—",
        damageType: "Utility",
        decisionTree: [
            { level: 1, summary: "Base detection of magic within 30 feet." },
            { level: 5, summary: "Maintain concentration while moving between rooms." },
            { level: 9, summary: "Use while inspecting multiple targets quickly." }
        ],
        concentration: true,
        desc: "For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any.",
        incantation: "Revelio Magica",
        pronunciation: "reh-VEH-lee-oh MAH-jee-kah"
    },
    {
        name: "Faerie Fire",
        lvl: 1,
        school: "EVO",
        castTime: "1 Action",
        range: "60 ft",
        duration: "1 min (Conc.)",
        components: "V",
        effect: "Outline targets in light, granting advantage to hit them.",
        rolls: "DEX save vs DC 14",
        damage: "—",
        damageType: "Utility",
        decisionTree: [
            { level: 1, summary: "Base 20-foot cube for advantage marking." },
            { level: 5, summary: "Maintain the glow through key turns in combat." },
            { level: 9, summary: "Sustain focus on priority targets." }
        ],
        concentration: true,
        desc: "Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice). Any creature in the area when the spell is cast is also outlined if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius.",
        incantation: "Lumen Febris",
        pronunciation: "LOO-men FEH-bris"
    },
    {
        name: "Disguise Self",
        lvl: 1,
        school: "ILLU",
        castTime: "1 Action",
        range: "Self",
        duration: "1 hour",
        components: "V, S",
        effect: "Alter your appearance with a visual illusion.",
        rolls: "None",
        damage: "—",
        damageType: "Utility",
        decisionTree: [
            { level: 1, summary: "Base disguise for infiltration or escape." },
            { level: 5, summary: "Blend into larger crowds without disruption." },
            { level: 9, summary: "Maintain disguise through longer scenes." }
        ],
        desc: "You make yourself—including your clothing, armor, weapons, and other belongings on your person—look different until the spell ends or until you use your action to dismiss it. You can seem 1 foot shorter or taller and can appear thin, fat, or in between.",
        incantation: "Facies Mutatio",
        pronunciation: "FAH-see-ehs moo-TAH-tee-oh"
    },

    {
        name: "Absorb Elements",
        lvl: 1,
        school: "ABJ",
        castTime: "Reaction",
        range: "Self",
        duration: "1 round",
        components: "S",
        effect: "Gain resistance to elemental damage and empower a strike.",
        rolls: "Triggered reaction",
        damage: "+1d6",
        damageType: "Acid/Cold/Fire/Lightning/Thunder",
        decisionTree: [
            { level: 1, summary: "Base: resistance + 1d6 bonus damage." },
            { level: 5, summary: "Use to turn heavy hits into counterattacks." },
            { level: 9, summary: "Conserve reactions for big elemental bursts." }
        ],
        desc: "You have resistance to the triggering damage type (acid, cold, fire, lightning, or thunder) until the start of your next turn. Also, the first time you hit with a melee attack on your next turn, the target takes an extra 1d6 damage of the triggering type.",
        incantation: "Elementum Scutum",
        pronunciation: "eh-leh-MEN-toom SKOO-toom"
    },


    {
        name: "Phantasmal Force",
        lvl: 2,
        school: "ILLU",
        castTime: "1 Action",
        range: "60 ft",
        duration: "1 min (Conc.)",
        components: "V, S, M",
        effect: "Project an illusion that deals psychic damage each round.",
        rolls: "INT save vs DC 14",
        damage: "1d6 per round",
        damageType: "Psychic",
        decisionTree: [
            { level: 3, summary: "Base illusion and 1d6 psychic damage per round." },
            { level: 5, summary: "Sustain damage while repositioning or hiding." },
            { level: 9, summary: "Use to lock down priority threats longer." }
        ],
        concentration: true,
        desc: "You craft an illusion in a creature's mind. On a failed INT save, you create a phantasmal object (max 10-foot cube). The target takes 1d6 psychic damage each round while within 5 feet of the illusion.",
        incantation: "Mentis Imago",
        pronunciation: "MEN-tis ih-MAH-go"
    },
    {
        name: "Suggestion",
        lvl: 2,
        school: "ENCH",
        castTime: "1 Action",
        range: "30 ft",
        duration: "8 hours (Conc.)",
        components: "V, M",
        effect: "Magically compel a creature to follow a reasonable course of action.",
        rolls: "WIS save vs DC 14",
        damage: "—",
        damageType: "Charm",
        decisionTree: [
            { level: 3, summary: "Base: 8 hours of compelled action." },
            { level: 7, summary: "Use for extended tactical repositioning." },
            { level: 9, summary: "Pair with social scenes for long-term control." }
        ],
        concentration: true,
        desc: "You suggest a course of activity (limited to a sentence or two) and magically influence a creature you can see within range that can hear and understand you. Creatures that can't be charmed are immune. The suggestion must be worded in such a manner as to make the course of action sound reasonable.",
        incantation: "Vox Imperium",
        pronunciation: "voks im-PEH-ree-oom"
    },
    {
        name: "Mirror Image",
        lvl: 2,
        school: "ILLU",
        castTime: "1 Action",
        range: "Self",
        duration: "1 minute",
        components: "V, S",
        effect: "Create duplicates that force attackers to miss you.",
        rolls: "d20 to redirect attacks",
        damage: "—",
        damageType: "Defense",
        decisionTree: [
            { level: 3, summary: "Base: 3 duplicates." },
            { level: 5, summary: "Maintain defensive screen while repositioning." },
            { level: 9, summary: "Combine with cover for layered defense." }
        ],
        desc: "Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it's impossible to track which image is real. Each time a creature targets you with an attack, roll a d20 to determine whether it targets you or one of the duplicates.",
        incantation: "Speculum Triplex",
        pronunciation: "SPEH-kyoo-loom TREE-plex"
    },
    {
        name: "Animate Dead",
        lvl: 3,
        school: "NECRO",
        castTime: "1 Minute",
        range: "10 ft",
        duration: "Instantaneous",
        components: "V, S, M",
        effect: "Raise skeletal or zombie servants and control them.",
        rolls: "None",
        damage: "Varies",
        damageType: "Summon",
        decisionTree: [
            { level: 5, summary: "Base: animate/control up to 4 undead." },
            { level: 7, summary: "Upcast: control 2 additional undead." },
            { level: 9, summary: "Upcast: control 4 additional undead." }
        ],
        desc: "Create an undead servant (Skeleton from bones, Zombie from corpse). You can control up to 4 creatures at once. The creature remains under your control for 24 hours. Reassert control by casting this spell again.",
        incantation: "Surgite Mortui",
        pronunciation: "sur-GEE-teh MOR-too-ee"
    },
    {
        name: "Summon Undead",
        lvl: 3,
        school: "NECRO",
        castTime: "1 Action",
        range: "90 ft",
        duration: "1 hr (Conc.)",
        components: "V, S, M (300gp)",
        effect: "Call forth a ghostly, putrid, or skeletal spirit.",
        rolls: "Use summoned stat block",
        damage: "Varies",
        damageType: "Necrotic",
        decisionTree: [
            { level: 5, summary: "Choose Ghostly, Putrid, or Skeletal spirit." },
            { level: 7, summary: "Upcast: +1 AC, +10 HP, +1 damage per attack." },
            { level: 9, summary: "Upcast: +2 AC, +20 HP, +2 damage per attack." }
        ],
        concentration: true,
        desc: "Call forth an undead spirit (Ghostly, Putrid, or Skeletal). The spirit obeys your verbal commands. GHOSTLY: Fly 40ft, Frightening Presence. PUTRID: Poison Aura. SKELETAL: Ranged attacks 150ft.",
        incantation: "Spiritus Invoco",
        pronunciation: "SPEE-ree-toos in-VOH-koh"
    },
    {
        name: "Web",
        lvl: 2,
        school: "CONJ",
        castTime: "1 Action",
        range: "60 ft",
        duration: "1 hr (Conc.)",
        components: "V, S, M",
        effect: "Create a 20ft cube of sticky webbing.",
        rolls: "DEX save vs DC",
        damage: "Restrained",
        damageType: "Condition",
        decisionTree: [
            { level: 3, summary: "Control space and restrain enemies." },
            { level: 5, summary: "Create choke points in narrow hallways." }
        ],
        concentration: true,
        desc: "You conjure a mass of thick, sticky web. The webs fill a 20-foot cube. difficult terrain. Creatures starting their turn in the webs or entering them must make a Dexterity save or be restrained.",
        incantation: "Tela Aranea",
        pronunciation: "TEH-lah ah-RAH-neh-ah"
    },
    {
        name: "Misty Step",
        lvl: 2,
        school: "CONJ",
        castTime: "Bonus Action",
        range: "Self",
        duration: "Instantaneous",
        components: "V",
        effect: "Teleport 30ft to an unoccupied space you can see.",
        rolls: "None",
        damage: "—",
        damageType: "Utility",
        decisionTree: [
            { level: 3, summary: "Escape grapples or close distance." },
            { level: 5, summary: "Reposition for better spell angles." }
        ],
        desc: "Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.",
        incantation: "Vapor Transitus",
        pronunciation: "VAH-por tran-SEE-toos"
    },
    {
        name: "Invisibility",
        lvl: 2,
        school: "ILLU",
        castTime: "1 Action",
        range: "Touch",
        duration: "1 hr (Conc.)",
        components: "V, S, M",
        effect: "Creature touched becomes invisible.",
        rolls: "None",
        damage: "—",
        damageType: "Utility",
        decisionTree: [
            { level: 3, summary: "Scouting or defensive escape." },
            { level: 5, summary: "Upcast to target 2 creatures." }
        ],
        concentration: true,
        desc: "A creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person. The spell ends for a target that attacks or casts a spell.",
        incantation: "Evanesco",
        pronunciation: "eh-vah-NES-koh"
    },
    {
        name: "Fly",
        lvl: 3,
        school: "TRANS",
        castTime: "1 Action",
        range: "Touch",
        duration: "10 min (Conc.)",
        components: "V, S, M",
        effect: "Target gains a flying speed of 60 feet.",
        rolls: "None",
        damage: "—",
        damageType: "Utility",
        decisionTree: [
            { level: 5, summary: "Bypass terrain and melee enemies." },
            { level: 7, summary: "Upcast to target 2 creatures." }
        ],
        concentration: true,
        desc: "You touch a willing creature. The target gains a flying speed of 60 feet for the duration. When the spell ends, the target falls if it is still aloft, unless it can stop the fall.",
        incantation: "Volatus",
        pronunciation: "voh-LAH-toos"
    },
    {
        name: "Haste",
        lvl: 3,
        school: "TRANS",
        castTime: "1 Action",
        range: "30 ft",
        duration: "1 min (Conc.)",
        components: "V, S, M",
        effect: "Double speed, +2 AC, extra action.",
        rolls: "None",
        damage: "Buff",
        damageType: "Utility",
        decisionTree: [
            { level: 5, summary: "Supercharge a martial ally (Minion/Party)." },
            { level: 9, summary: "Vital for chasing down fleeting enemies." }
        ],
        concentration: true,
        desc: "Choose a willing creature within range. Speed is doubled, gains +2 bonus to AC, advantage on DEX saves, and an additional action on each of its turns (Attack, Dash, Disengage, Hide, or Use Object). When the spell ends, the target can't move or take actions until after its next turn.",
        incantation: "Celeritas",
        pronunciation: "seh-LEH-ree-tas"
    },
    {
        name: "Hypnotic Pattern",
        lvl: 3,
        school: "ILLU",
        castTime: "1 Action",
        range: "120 ft",
        duration: "1 min (Conc.)",
        components: "S, M",
        effect: "Charming lights incapacitate creatures in a 30ft cube.",
        rolls: "WIS save vs DC",
        damage: "Incapacitated",
        damageType: "Condition",
        decisionTree: [
            { level: 5, summary: "Mass crowd control for groups." },
            { level: 9, summary: "Shutdown entire enemy encounters." }
        ],
        concentration: true,
        desc: "You create a twisting pattern of colors that weaves through the air inside a 30-foot cube within range. Creatures in the area must make a Wisdom saving throw. On a failed save, the creature is charmed for the duration. While charmed, the creature is incapacitated and has a speed of 0.",
        incantation: "Hypnosis",
        pronunciation: "hip-NOH-sis"
    },
    {
        name: "Slow",
        lvl: 3,
        school: "TRANS",
        castTime: "1 Action",
        range: "120 ft",
        duration: "1 min (Conc.)",
        components: "V, S, M",
        effect: "Slows up to 6 creatures (half speed, -2 AC, no reactions).",
        rolls: "WIS save vs DC",
        damage: "Debuff",
        damageType: "Condition",
        decisionTree: [
            { level: 5, summary: "Debuff multiple enemies, ruin caster turns." },
            { level: 9, summary: "Selective targeting avoids friendly fire." }
        ],
        concentration: true,
        desc: "You alter time around up to six creatures of your choice in a 40-foot cube. Targets must make a Wisdom saving throw. On a failed save: Speed is halved, -2 to AC and DEX saves, and it can't use reactions. On its turn, it can use either an action or a bonus action, not both.",
        incantation: "Tardus Tempus",
        pronunciation: "TAR-doos TEM-poos"
    },
    {
        name: "Polymorph",
        lvl: 4,
        school: "TRANS",
        castTime: "1 Action",
        range: "60 ft",
        duration: "1 hr (Conc.)",
        components: "V, S, M",
        effect: "Transform a creature into a beast.",
        rolls: "WIS save vs DC",
        damage: "Transformation",
        damageType: "Utility",
        decisionTree: [
            { level: 7, summary: "Turn ally into distinct beast (Giant Ape/T-Rex)." },
            { level: 9, summary: "Remove enemy from fight by turning into snail." }
        ],
        concentration: true,
        desc: "You transform a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The new form can be any beast whose challenge rating is equal to or less than the target's.",
        incantation: "Mutatio Formae",
        pronunciation: "moo-TAH-tee-oh FOR-may"
    },
    {
        name: "Banishment",
        lvl: 4,
        school: "ABJ",
        castTime: "1 Action",
        range: "60 ft",
        duration: "1 min (Conc.)",
        components: "V, S, M",
        effect: "Banish a creature to another plane of existence.",
        rolls: "CHA save vs DC",
        damage: "Removal",
        damageType: "Utility",
        decisionTree: [
            { level: 7, summary: "Remove key threat from combat instantly." },
            { level: 9, summary: "Upcast to banish 2 creatures." }
        ],
        concentration: true,
        desc: "You attempt to send one creature that you can see within range to another plane of existence. The target must succeed on a Charisma saving throw or be banished. If the target is native to the plane of existence you're on, you banish the target to a harmless demiplane.",
        incantation: "Exsilium",
        pronunciation: "ex-SIL-ee-oom"
    }
];
