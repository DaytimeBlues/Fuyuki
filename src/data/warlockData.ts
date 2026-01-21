export interface InvocationDefinition {
    id: string;
    name: string;
    description: string;
    prerequisites?: string;
    level?: number;
    pact?: 'blade' | 'chain' | 'tome' | 'talisman';
}

export const INVOCATIONS: InvocationDefinition[] = [
    {
        id: 'agonizing-blast',
        name: 'Agonizing Blast',
        description: 'When you cast eldritch blast, add your Charisma modifier to the damage it deals on a hit.',
        prerequisites: 'Eldritch Blast cantrip'
    },
    {
        id: 'armor-of-shadows',
        name: 'Armor of Shadows',
        description: 'You can cast mage armor on yourself at will, without expending a spell slot or material components.'
    },
    {
        id: 'eldritch-sight',
        name: 'Eldritch Sight',
        description: 'You can cast detect magic at will, without expending a spell slot.'
    },
    {
        id: 'devils-sight',
        name: "Devil's Sight",
        description: 'You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.'
    },
    {
        id: 'fiendish-vigor',
        name: 'Fiendish Vigor',
        description: 'You can cast false life on yourself at will as a 1st-level spell, without expending a spell slot or material components.'
    },
    {
        id: 'mask-of-many-faces',
        name: 'Mask of Many Faces',
        description: 'You can cast disguise self at will, without expending a spell slot.'
    },
    {
        id: 'repelling-blast',
        name: 'Repelling Blast',
        description: 'When you hit a creature with eldritch blast, you can push the creature up to 10 feet away from you in a straight line.',
        prerequisites: 'Eldritch Blast cantrip'
    },
    {
        id: 'improved-pact-weapon',
        name: 'Improved Pact Weapon',
        description: 'You can use any weapon you summon with your Pact of the Blade feature as a casting focus for your warlock spells. In addition, the weapon gains a +1 bonus to its attack and damage rolls, unless it is a magic weapon that already has a bonus to those rolls. Finally, the weapon you conjure can be a shortbow, longbow, light crossbow, or heavy crossbow.',
        pact: 'blade'
    },
    {
        id: 'eldritch-smite',
        name: 'Eldritch Smite',
        description: 'Once per turn when you hit a creature with your pact weapon, you can expend a warlock spell slot to deal an extra 1d8 force damage to the target, plus another 1d8 per level of the spell slot, and you can knock the target prone if it is Huge or smaller.',
        level: 5,
        pact: 'blade'
    },
    {
        id: 'thirsting-blade',
        name: 'Thirsting Blade',
        description: 'You can attack with your pact weapon twice, instead of once, whenever you take the Attack action on your turn.',
        level: 5,
        pact: 'blade'
    },
    {
        id: 'lifedrinker',
        name: 'Lifedrinker',
        description: 'When you hit a creature with your pact weapon, the creature takes extra necrotic damage equal to your Charisma modifier (minimum 1).',
        level: 12,
        pact: 'blade'
    },
    {
        id: 'book-of-ancient-secrets',
        name: 'Book of Ancient Secrets',
        description: 'You can now inscribe magical rituals in your Book of Shadows. Choose two 1st-level spells that have the ritual tag from any class’s spell list.',
        pact: 'tome'
    },
    {
        id: 'aspect-of-the-moon',
        name: 'Aspect of the Moon',
        description: 'You no longer need to sleep and can’t be forced to sleep by any means. To gain the benefits of a long rest, you can spend all 8 hours doing light activity.',
        pact: 'tome'
    },
    {
        id: 'gift-of-the-protectors',
        name: 'Gift of the Protectors',
        description: 'A new page appears in your Book of Shadows. With your permission, a creature can use its action to write its name on that page, which can contain up to a number of names equal to your proficiency bonus. When a creature whose name is on the page is reduced to 0 hit points but not killed outright, the creature magically drops to 1 hit point instead.',
        level: 9,
        pact: 'tome'
    },
    {
        id: 'investment-of-the-chain-master',
        name: 'Investment of the Chain Master',
        description: 'When you cast find familiar, you infuse the summoned familiar with a measure of your eldritch power, granting it several benefits: flying/swimming speed, bonus action attack, magical attacks, and your spell save DC for its features.',
        pact: 'chain'
    },
    {
        id: 'voice-of-the-chain-master',
        name: 'Voice of the Chain Master',
        description: 'You can communicate telepathically with your familiar and perceive through your familiar’s senses as long as you are on the same plane of existence.',
        pact: 'chain'
    },
    {
        id: 'chains-of-carceri',
        name: 'Chains of Carceri',
        description: 'You can cast hold monster at will—targeting a celestial, fiend, or elemental—without expending a spell slot or material components. You must finish a long rest before you can use this invocation on the same creature again.',
        level: 15,
        pact: 'chain'
    },
    {
        id: 'rebuke-of-the-talisman',
        name: 'Rebuke of the Talisman',
        description: 'When the wearer of your talisman is hit by a creature within 30 feet of you, you can use your reaction to deal psychic damage to the attacker equal to your proficiency bonus and push it up to 10 feet away from the talisman’s wearer.',
        pact: 'talisman'
    },
    {
        id: 'protection-of-the-talisman',
        name: 'Protection of the Talisman',
        description: 'When the wearer of your talisman fails a saving throw, they can add a d4 to the roll, potentially turning the failure into a success. This benefit can be used a number of times equal to your proficiency bonus, and all expended uses are restored when you finish a long rest.',
        level: 7,
        pact: 'talisman'
    },
    {
        id: 'bond-of-the-talisman',
        name: 'Bond of the Talisman',
        description: 'While someone else is wearing your talisman, you can use your action to teleport to the unoccupied space nearest to them, provided the two of you are on the same plane of existence. The wearer of your talisman can do the same thing to teleport to you.',
        level: 12,
        pact: 'talisman'
    }
];

export const PACT_BOONS = [
    {
        id: 'blade',
        name: 'Pact of the Blade',
        description: 'You can use your action to create a pact weapon in your empty hand. You can choose the form that this melee weapon takes each time you create it.'
    },
    {
        id: 'chain',
        name: 'Pact of the Chain',
        description: 'You learn the find familiar spell and can cast it as a ritual. When you cast the spell, you can choose one of the normal forms for your familiar or one of the special forms: imp, pseudodragon, quasit, or sprite.'
    },
    {
        id: 'tome',
        name: 'Pact of the Tome',
        description: 'Your patron gives you a grimoire called a Book of Shadows. When you gain this feature, choose three cantrips from any class’s spell list.'
    },
    {
        id: 'talisman',
        name: 'Pact of the Talisman',
        description: 'Your patron gives you a special amulet, a talisman that can aid the wearer when they fail an ability check. When the wearer fails an ability check, they can add a d4 to the roll, potentially turning the failure into a success.'
    }
];

export const PATRONS = [
    {
        id: 'fiend',
        name: 'The Fiend',
        description: 'You have made a pact with a fiend from the lower planes of existence.',
        features: [
            { name: "Dark One's Blessing", desc: "Starting at 1st level, when you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level." },
            { name: "Dark One's Own Luck", desc: "Starting at 6th level, you can call on your patron to alter fate in your favor. When you make an ability check or a saving throw, you can add a d10 to the roll." }
        ]
    }
];
