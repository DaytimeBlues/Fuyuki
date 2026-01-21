import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CharacterData, AbilityKey, AbilityScores, AbilityMods, Skill } from '../../types';
import { getActiveSession } from '../../utils/sessionStorage';
import { initialCharacterData } from '../../data/initialState';

export interface StatState {
    abilities: AbilityScores;
    abilityMods: AbilityMods;
    skills: { [key: string]: Skill };
    level: number;
    profBonus: number;
    baseAC: number;
    dc: number;
    savingThrowProficiencies: AbilityKey[];
    slots: Record<number, { used: number; max: number }>;
}

const getInitialState = (): StatState => {
    const session = getActiveSession();
    const data = session ? session.characterData : initialCharacterData;
    return {
        abilities: data.abilities,
        abilityMods: data.abilityMods,
        skills: data.skills,
        level: data.level,
        profBonus: data.profBonus,
        baseAC: data.baseAC,
        dc: data.dc,
        savingThrowProficiencies: data.savingThrowProficiencies,
        slots: data.slots,
    };
};

const initialState: StatState = getInitialState();

export const statSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        hydrateStats: (state, action: PayloadAction<CharacterData>) => {
            state.abilities = action.payload.abilities;
            state.abilityMods = action.payload.abilityMods;
            state.skills = action.payload.skills;
            state.level = action.payload.level;
            state.profBonus = action.payload.profBonus;
            state.baseAC = action.payload.baseAC;
            state.dc = action.payload.dc;
            state.savingThrowProficiencies = action.payload.savingThrowProficiencies;
            state.slots = action.payload.slots;
        },
        levelChanged: (state, action: PayloadAction<number>) => {
            state.level = action.payload;
            // Note: Recalculation depends on full state, usually handled by a wrapper or thunk
        },
        abilityScoreChanged: (state, action: PayloadAction<{ ability: AbilityKey; newScore: number }>) => {
            state.abilities[action.payload.ability] = action.payload.newScore;
        },
        slotsUpdated: (state, action: PayloadAction<Record<number, { used: number; max: number }>>) => {
            state.slots = action.payload;
        },
        slotExpended: (state, action: PayloadAction<{ level: number }>) => {
            const slot = state.slots[action.payload.level];
            if (slot && slot.used < slot.max) {
                slot.used += 1;
            }
        },
        slotRestored: (state, action: PayloadAction<{ level: number }>) => {
            const slot = state.slots[action.payload.level];
            if (slot && slot.used > 0) {
                slot.used -= 1;
            }
        },
        updateDerivedStats: (state, action: PayloadAction<Partial<StatState>>) => {
            Object.assign(state, action.payload);
        }
    },
});

export const {
    hydrateStats,
    levelChanged,
    abilityScoreChanged,
    slotsUpdated,
    slotExpended,
    slotRestored,
    updateDerivedStats
} = statSlice.actions;

export default statSlice.reducer;
