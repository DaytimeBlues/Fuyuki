import { CharacterData } from '../types';

/**
 * Flattens CharacterData into a numerical feature vector.
 * Used for future ML analysis, build comparison, and clustering.
 */
export interface CharacterEmbedding {
    // Core stats (6 dimensions) - normalized absolute values
    abilities: [str: number, dex: number, con: number, int: number, wis: number, cha: number];

    // Derived stats
    level: number;
    profBonus: number;
    baseAC: number;
    dc: number;

    // Warlock-specific categorical encodings
    // 0=Fiend, 1=GOO, 2=Archfey, etc. (Mapped from ID)
    patronIndex: number;

    // 0=None, 1=Chain, 2=Blade, 3=Tome
    pactBoonIndex: number;

    // Metadata for categorical mapping (optional, for debugging)
    _meta?: {
        patronId?: string;
        pactBoonType?: string | null;
    };

    // Multi-hot encoded vectors will be represented as sparse arrays or simple counts for now
    // to avoid massive vectors in the initial definition, but structured for expansion.

    // Count of known spells/cantrips as a proxy for breadth vs depth
    spellsKnownCount: number;
    cantripsKnownCount: number;

    // Binary vector of active invocations
    // We Map invocation IDs to a consistent index for comparison
    // For this prototype, we'll store the raw count and a hash for quick equality checks
    invocationsCount: number;
    invocationsHash: string; // sorted joined IDs
}

/**
 * Maps patron IDs to a numerical index.
 */
function getPatronIndex(patronId?: string): number {
    const map: Record<string, number> = {
        'fiend': 0,
        'archfey': 1,
        'great-old-one': 2,
        'hexblade': 3,
        'celestial': 4,
        'genie': 5,
        'fathomless': 6,
        'undead': 7,
        'undying': 8
    };
    return patronId ? (map[patronId] ?? -1) : -1;
}

/**
 * Maps pact boons to a numerical index.
 */
function getPactBoonIndex(pactType: string | null): number {
    const map: Record<string, number> = {
        'chain': 1,
        'blade': 2,
        'tome': 3,
        'talisman': 4
    };
    return pactType ? (map[pactType] ?? 0) : 0;
}

/**
 * Generates a simplistic hash of invocation IDs for consistent comparison
 */
function hashInvocations(invocations: { id: string, active: boolean }[]): string {
    return invocations
        .filter(i => i.active)
        .map(i => i.id)
        .sort()
        .join('|');
}

export function generateEmbedding(character: CharacterData): CharacterEmbedding {
    return {
        abilities: [
            character.abilities.str,
            character.abilities.dex,
            character.abilities.con,
            character.abilities.int,
            character.abilities.wis,
            character.abilities.cha
        ],
        level: character.level,
        profBonus: character.profBonus,
        baseAC: character.baseAC,
        dc: character.dc,
        patronIndex: getPatronIndex(character.patron?.name?.toLowerCase().replace('the ', '')), // Approximation based on name if ID missing, or assume we refactor to IDs later
        pactBoonIndex: getPactBoonIndex(character.pactBoon.type),
        spellsKnownCount: character.spellsKnown.length,
        cantripsKnownCount: character.cantripsKnown.length,
        invocationsCount: character.invocations.filter(i => i.active).length,
        invocationsHash: hashInvocations(character.invocations),
        _meta: {
            // We use character.patron.name here as existing type doesn't guarantee ID
            // Ideally we'd map this from a known source
            patronId: character.patron?.name,
            pactBoonType: character.pactBoon.type
        }
    };
}

/**
 * Calculates Cosine Similarity between two embeddings.
 * Focuses on the core stats and structural choices.
 * Returns -1.0 to 1.0
 */
export function compareEmbeddings(a: CharacterEmbedding, b: CharacterEmbedding): number {
    // Flatten significant numerical features into a vector
    const vectorA = [
        ...a.abilities,
        a.level,
        a.baseAC,
        a.spellsKnownCount,
        a.invocationsCount
        // We exclude categorical indices from cosine sim as they aren't ordinal
    ];

    const vectorB = [
        ...b.abilities,
        b.level,
        b.baseAC,
        b.spellsKnownCount,
        b.invocationsCount
    ];

    const dotProduct = vectorA.reduce((sum, val, i) => sum + (val * vectorB[i]), 0);
    const magA = Math.sqrt(vectorA.reduce((sum, val) => sum + (val * val), 0));
    const magB = Math.sqrt(vectorB.reduce((sum, val) => sum + (val * val), 0));

    if (magA === 0 || magB === 0) return 0;

    const numericalSimilarity = dotProduct / (magA * magB);

    // Apply categorical penalties
    let penalty = 0;
    if (a.patronIndex !== b.patronIndex) penalty += 0.2;
    if (a.pactBoonIndex !== b.pactBoonIndex) penalty += 0.15;

    return Math.max(-1, Math.min(1, numericalSimilarity - penalty));
}
