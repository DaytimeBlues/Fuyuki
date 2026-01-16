export interface BioSection {
    title: string;
    content: string;
}

export interface Character {
    name: string;
    role: string;
    desc: string;
}

export const biographyData: BioSection[] = [
    {
        title: "Early Life & House Vaelithor",
        content: "Aramancia Titania Vaelithor was born into House Vaelithor, a distinguished Drow noble family in Menzoberranzan known for rationalism, philosophy, and arcane mastery rather than brutality. Her parents, Lady Veylith Vaelithor (a diviner of exceptional talent) and Lord Serath Vaelithor (an arcane strategist), raised her to view magic as an extension of thought and to question the theocracy of Lolth. They taught her that power is illusion and that all rulers distort truth to maintain control."
    },
    {
        title: "The Betrayal & Captivity",
        content: "When Aramancia was young, her parents uncovered forbidden knowledge—evidence of a systematic purge of magic, bloodlines, and philosophies that questioned Lolth's divine right. House Veltalith struck in response, burning House Vaelithor's libraries and slaughtering its scholars. Her parents cast a grand illusion upon Aramancia as they died, shielding her from the horror until it was too late to resist. She was taken by Matron Xyrris Veltalith and delivered to Menzoberranzan's military complex, where she was trained under war-mage Zathrel Dorn through sensory deprivation, controlled conditioning, and tactical magic."
    },
    {
        title: "The Trial of the Forsaken",
        content: "Aramancia was subjected to the Trial of the Forsaken—a death labyrinth designed to cull 1,000 captives down to 10 survivors across four deadly zones. She survived through calculation and manipulation, tracking temporal patterns others couldn't perceive. In the final moments, when 11 survived instead of 10, a companion sacrificed themselves for her with the cryptic words: \"...what of this, then?\". She later discovered the trial had actually lasted ten years, though others believed only one had passed."
    },
    {
        title: "Escape & Exile",
        content: "After the trial, Aramancia methodically planned her escape from Menzoberranzan, making herself forgettable while observing weaknesses in the city's security. She fled to the surface world carrying only a scorched fragment of her mother's spellbook. Now at 220 years old, she wanders as an exiled scholar seeking pre-Lolthian civilizations and forbidden knowledge that might reveal meaning beyond survival. She maintains a secret list of those who destroyed her family but remains uncertain whether vengeance would bring peace."
    }
];

export const allies: Character[] = [
    {
        name: "Oscar",
        role: "Dwarven Companion",
        desc: "A drunk dwarf whom Aramancia met at their lowest point. Despite his vices, he is a loyal friend."
    },
    {
        name: "Fuyuki",
        role: "Kitsune Warlock",
        desc: "An enigmatic Warlock for which I deduced may have unwittingly made a compact with the devil - a patron to fuel his darker arts - how excellent! He has ties to a cult and a curious mask. Despite a distant attitude at first, has let slip his deep fears and insecurities at being beholden to a patron who may order the death of friends or family at a whim. A curious case for me to pry, and I believe, to genuinely help."
    },
    {
        name: "Brandon",
        role: "Elven Scholar",
        desc: "A fellow elf, peculiar in his ways, but earnest and intelligent."
    },
    {
        name: "Zeke",
        role: "Pirate",
        desc: "Underneath it all, he is a cool dude and a pirate."
    },
    {
        name: "Thulian",
        role: "Kobold Dreamer",
        desc: "A true-hearted but aloof Kobold who aspires to be a dragon."
    },
    {
        name: "Lady Veylith Vaelithor",
        role: "Mother",
        desc: "Exceptional diviner and philosopher who taught Aramancia to see through deception; cast the final illusion to shield her daughter."
    },
    {
        name: "Lord Serath Vaelithor",
        role: "Father",
        desc: "Arcane strategist who trained Aramancia in analyzing motives and breaking down enemies into patterns of behavior."
    },
    {
        name: "The Unknown Sacrifice",
        role: "Lost Companion",
        desc: "A companion from the Trial of the Forsaken who willingly gave up their place so Aramancia could survive."
    }
];

export const enemies: Character[] = [
    {
        name: "Matron Xyrris Veltalith",
        role: "Matron Mother",
        desc: "Matron of House Veltalith who orchestrated the destruction of House Vaelithor and ordered Aramancia's capture."
    },
    {
        name: "Zathrel Dorn",
        role: "War-Mage",
        desc: "High-ranking war-mage who conditioned Aramancia through clinical arcane torture, viewing her as nothing more than an asset."
    },
    {
        name: "House Veltalith",
        role: "Rival House",
        desc: "The rival house that murdered her family, absorbed their wealth, and erased their legacy."
    }
];
