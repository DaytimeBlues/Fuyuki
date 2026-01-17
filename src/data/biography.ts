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
        title: "Chronicle",
        content: "write bio here"
    }
];

export const allies: Character[] = [];

export const enemies: Character[] = [];
