import { describe, it, expect } from 'vitest';
import { generateEmbedding, compareEmbeddings } from '../engine/characterEmbedding';
import { createWarlockRulesGraph } from '../engine/rulesGraph';
import { CharacterData } from '../types';

// Mock minimal character data
const mockCharacter: CharacterData = {
    hp: { current: 10, max: 10, temp: 0 },
    hitDice: { current: 1, max: 1, size: 8 },
    baseAC: 12,
    dc: 13,
    profBonus: 2,
    level: 1,
    savingThrowProficiencies: ['wis', 'cha'],
    deathSaves: { successes: 0, failures: 0 },
    abilities: { str: 8, dex: 14, con: 12, int: 10, wis: 13, cha: 16 },
    abilityMods: { str: -1, dex: 2, con: 1, int: 0, wis: 1, cha: 3 },
    skills: {},
    concentration: null,
    attunement: [],
    inventory: [],
    preparedSpells: [],
    slots: {},
    mageArmour: false,
    shield: false,
    transformed: null,
    pactSlots: { current: 1, max: 1, level: 1 },
    spellsKnown: ['hex', 'eldritch blast'],
    cantripsKnown: ['eldritch blast', 'mage hand'], // "eldritch blast" required for prereq test
    arcanum: {},
    invocations: [],
    pactBoon: { type: null },
    patron: { name: 'The Fiend', features: [] }
};

describe('CharacterEmbedding', () => {
    it('generateEmbedding should flatten character stats', () => {
        const embedding = generateEmbedding(mockCharacter);

        expect(embedding.abilities).toEqual([8, 14, 12, 10, 13, 16]);
        expect(embedding.level).toBe(1);
        expect(embedding.patronIndex).toBe(0); // Fiend
        expect(embedding.pactBoonIndex).toBe(0); // None
        expect(embedding.cantripsKnownCount).toBe(2);
    });

    it('compareEmbeddings should return high similarity for identical characters', () => {
        const emb1 = generateEmbedding(mockCharacter);
        const emb2 = generateEmbedding(mockCharacter);

        const sim = compareEmbeddings(emb1, emb2);
        expect(sim).toBeCloseTo(1.0);
    });

    it('compareEmbeddings should return lower similarity for different builds', () => {
        const char2 = { ...mockCharacter, level: 5, abilities: { ...mockCharacter.abilities, cha: 20 } };
        const emb1 = generateEmbedding(mockCharacter);
        const emb2 = generateEmbedding(char2);

        const sim = compareEmbeddings(emb1, emb2);
        expect(sim).toBeLessThan(1.0);
        expect(sim).toBeGreaterThan(0); // Should still have some similarity
    });
});

describe('RulesGraph', () => {
    const graph = createWarlockRulesGraph();

    it('should validate Thirsting Blade prerequisites correctly', () => {
        // Case 1: Level 1, No Pact -> Invalid (Level & Pact Check)
        const res1 = graph.isChoiceValid('invocation:thirsting-blade', mockCharacter);
        expect(res1).toBe(false);

        // Case 2: Level 5, Blade Pact -> Valid
        const level5Blade: CharacterData = {
            ...mockCharacter,
            level: 5,
            pactBoon: { type: 'blade' }
        };
        const res2 = graph.isChoiceValid('invocation:thirsting-blade', level5Blade);
        expect(res2).toBe(true);

        // Case 3: Level 5, Tome Pact -> Invalid (Pact Check)
        const level5Tome: CharacterData = {
            ...mockCharacter,
            level: 5,
            pactBoon: { type: 'tome' }
        };
        const res3 = graph.isChoiceValid('invocation:thirsting-blade', level5Tome);
        expect(res3).toBe(false);
    });

    it('should validate Agonizing Blast prerequisites correctly', () => {
        // Case 1: Has Eldritch Blast -> Valid
        const res1 = graph.isChoiceValid('invocation:agonizing-blast', mockCharacter);
        expect(res1).toBe(true); // mockCharacter has 'eldritch blast' cantrip

        // Case 2: No Eldritch Blast -> Invalid
        const noBlast: CharacterData = {
            ...mockCharacter,
            cantripsKnown: ['mage hand', 'minor illusion']
        };
        const res2 = graph.isChoiceValid('invocation:agonizing-blast', noBlast);
        expect(res2).toBe(false);
    });

    it('should list available choices for a type', () => {
        // At level 1, should see some invocations (e.g. Eldritch Sight) but not level 5 ones
        const choices = graph.getAvailableChoices('invocation', mockCharacter);

        expect(choices).toContain('invocation:eldritch-sight');
        expect(choices).not.toContain('invocation:thirsting-blade');
    });
});
