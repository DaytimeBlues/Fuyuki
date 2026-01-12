import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

// import { RootState } from '../index'; // Circular dependency removal

export type AbilityName = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export interface Skill {
    ability: AbilityName;
    proficient: boolean;
    expert: boolean;
}

export interface CharacterState {
    name: string;
    level: number;
    class: string;
    proficiencyBonus: number;
    abilities: Record<AbilityName, number>;
    skills: Record<string, Skill>;
    armorClass: number;
    hitPoints: number;
    maxHitPoints: number;
    speed: number;
    features: string[];
    feats: string[];
    attunedItems: string[];
}

const initialState: CharacterState = {
    name: "Aramancia",
    level: 10,
    class: "Wizard (Necromancer)",
    proficiencyBonus: 4,
    abilities: {
        strength: 8,
        dexterity: 14,
        constitution: 12,
        intelligence: 20,
        wisdom: 16,
        charisma: 10,
    },
    skills: {
        arcana: { ability: 'intelligence', proficient: true, expert: true },
        history: { ability: 'intelligence', proficient: true, expert: false },
        investigation: { ability: 'intelligence', proficient: true, expert: false },
        religion: { ability: 'intelligence', proficient: true, expert: false },
        // Add defaults for others as needed
    },
    armorClass: 12,
    hitPoints: 85,
    maxHitPoints: 85,
    speed: 30,
    features: ["Empowered Evocation", "Undead Thralls"],
    feats: ["War Caster"],
    attunedItems: [],
};

export const characterSlice = createSlice({
    name: 'character',
    initialState,
    reducers: {
        abilityScoreChanged: (state, action: PayloadAction<{ ability: AbilityName, newScore: number }>) => {
            state.abilities[action.payload.ability] = action.payload.newScore;
        },
        levelUp: (state, action: PayloadAction<{ newLevel: number }>) => {
            state.level = action.payload.newLevel;
            state.proficiencyBonus = Math.floor((action.payload.newLevel / 4) + 2);
        },
        hpChanged: (state, action: PayloadAction<number>) => {
            state.hitPoints = Math.min(Math.max(0, action.payload), state.maxHitPoints);
        }
    },
});

// --- Selectors ---

// Local type to avoid circular dependency
interface StateWithCharacter {
    character: CharacterState;
}

export const selectCharacter = (state: StateWithCharacter) => state.character;

export const selectAbilityModifier = createSelector(
    [selectCharacter, (_: StateWithCharacter, abilityName: AbilityName) => abilityName],
    (character, abilityName) => Math.floor((character.abilities[abilityName] - 10) / 2)
);

export const selectSkillModifier = createSelector(
    [
        selectCharacter,
        (_: StateWithCharacter, skillName: string) => skillName,
        (state: StateWithCharacter, skillName: string) => {
            const skill = state.character.skills[skillName];
            return selectAbilityModifier(state, skill ? skill.ability : 'intelligence'); // Fallback
        }
    ],
    (character, skillName, baseAbilityModifier) => {
        const skill = character.skills[skillName];
        if (!skill) return 0;

        let modifier = baseAbilityModifier;
        if (skill.proficient) modifier += character.proficiencyBonus;
        if (skill.expert) modifier += character.proficiencyBonus;
        return modifier;
    }
);

export const selectSpellSaveDC = createSelector(
    [selectCharacter, (state: StateWithCharacter) => selectAbilityModifier(state, 'intelligence')],
    (character, intModifier) => 8 + intModifier + character.proficiencyBonus
);

export const selectSpellAttackBonus = createSelector(
    [selectCharacter, (state: StateWithCharacter) => selectAbilityModifier(state, 'intelligence')],
    (character, intModifier) => intModifier + character.proficiencyBonus
);

export const { abilityScoreChanged, levelUp, hpChanged } = characterSlice.actions;
export default characterSlice.reducer;
