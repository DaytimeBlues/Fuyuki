export interface SchoolLore {
    name: string;
    description: string;
    famousWizards: {
        name: string;
        title: string;
        desc: string;
    }[];
}

export const magicSchools: SchoolLore[] = [
    {
        name: "Abjuration",
        description: "Focuses on protective spells that create magical barriers, negate harmful effects, or banish creatures to other planes.",
        famousWizards: [
            {
                name: "Khelben 'Blackstaff' Arunsun",
                title: "Lord Mage of Waterdeep",
                desc: "A Chosen of Mystra and wielder of the Blackstaff, known for his mastery of protective wards and dispelling magic."
            }
        ]
    },
    {
        name: "Conjuration",
        description: "Involves transporting objects and creatures from one location to another, or creating them from nothing.",
        famousWizards: [
            {
                name: "Tasha (Iggwilv)",
                title: "The Witch Queen",
                desc: "Famed for her mastery of demonology and summoning, creator of Tasha's Hideous Laughter."
            },
            {
                name: "Mordenkainen",
                title: "Archmage of Oerth",
                desc: "Leader of the Circle of Eight, known for his Faithful Hound and Magnificent Mansion."
            }
        ]
    },
    {
        name: "Divination",
        description: "Reveals information, whether in the form of secrets long forgotten, glimpses of the future, or the locations of hidden things.",
        famousWizards: [
            {
                name: "Elminster Aumar",
                title: "The Sage of Shadowdale",
                desc: "Perhaps the most famous wizard in Faerûn, a Chosen of Mystra with unparalleled insight and knowledge."
            }
        ]
    },
    {
        name: "Enchantment",
        description: "Affects the minds of others, influencing or controlling their behavior. Such spells can make enemies see the caster as a friend, or force creatures to take a course of action.",
        famousWizards: [
            {
                name: "Tasha",
                title: "The Witch Queen",
                desc: "Also a master of enchantment, manipulating minds with spells like Hideous Laughter."
            }
        ]
    },
    {
        name: "Evocation",
        description: "Manipulates magical energy to produce a desired effect, usually destructive. Some evocations create blasts of fire or lightning.",
        famousWizards: [
            {
                name: "Bigby",
                title: "Great Wizard of Greyhawk",
                desc: "Known for his various 'Hand' spells, manipulating force to crush or grasp foes."
            },
            {
                name: "Melf",
                title: "Prince Brightflame",
                desc: "Creator of the Acid Arrow, blending martial prowess with destructive magic."
            }
        ]
    },
    {
        name: "Illusion",
        description: "Deceives the senses or minds of others. They cause people to see things that are not there, miss things that are there, or hear phantom noises.",
        famousWizards: [
            {
                name: "Phandalin's Illusionist",
                title: "Unknown",
                desc: "Local legends speak of a wizard who hid an entire tower in plain sight."
            }
        ]
    },
    {
        name: "Necromancy",
        description: "Manipulates the energies of life and death. Such spells can grant an extra reserve of life force, drain the life energy from another creature, create the undead, or even bring the dead back to life.",
        famousWizards: [
            {
                name: "Szass Tam",
                title: "Zulkir of Necromancy",
                desc: "The lich ruler of Thay, commanding vast legions of undead and seeking ultimate power."
            },
            {
                name: "Acererak",
                title: "The Devourer",
                desc: "An eternal lich who travels the planes, building deadly dungeons to trap souls."
            },
            {
                name: "Vecna",
                title: "The Whispered One",
                desc: "Once a mortal king, now a god of secrets and undeath. His Hand and Eye are artifacts of immense evil."
            },
            {
                name: "Larloch",
                title: "The Shadow King",
                desc: "An ancient Netherese lich who rules the Warlock's Crypt, hoarding magical artifacts."
            }
        ]
    },
    {
        name: "Transmutation",
        description: "Changes the properties of a creature, object, or environment. They might turn an enemy into a harmless creature, bolster the strength of an ally, or make an object move at the caster's command.",
        famousWizards: [
            {
                name: "Malchor Harpell",
                title: "The Eccentric",
                desc: "A member of the chaotic Harpell family, known for bizarre and experimental transmutations."
            }
        ]
    }
];
