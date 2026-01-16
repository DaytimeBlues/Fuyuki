export interface InvocationDefinition {
    id: string;
    name: string;
    description: string;
    prerequisites?: string;
    level?: number;
    pact?: 'blade' | 'chain' | 'tome' | 'talismans';
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
        id: 'thirsting-blade',
        name: 'Thirsting Blade',
        description: 'You can attack with your pact weapon twice, instead of once, whenever you take the Attack action on your turn.',
        level: 5,
        pact: 'blade'
    },
    {
        id: 'book-of-ancient-secrets',
        name: 'Book of Ancient Secrets',
        description: 'You can now inscribe magical rituals in your Book of Shadows. Choose two 1st-level spells that have the ritual tag from any class’s spell list.',
        pact: 'tome'
    },
    {
        id: 'voice-of-the-chain-master',
        name: 'Voice of the Chain Master',
        description: 'You can communicate telepathically with your familiar and perceive through your familiar’s senses as long as you are on the same plane of existence.',
        pact: 'chain'
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
