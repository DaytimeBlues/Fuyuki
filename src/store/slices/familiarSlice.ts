import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Familiar, MinionAttack } from '../../types';

export interface FamiliarState {
    active: Familiar | null;
}

const initialState: FamiliarState = {
    active: null,
};

export const familiarSlice = createSlice({
    name: 'familiar',
    initialState,
    reducers: {
        hydrateFamiliar: (state, action: PayloadAction<Familiar | null>) => {
            state.active = action.payload;
            return state;
        },
        setFamiliar: (state, action: PayloadAction<Familiar>) => {
            state.active = action.payload;
            return state;
        },
        clearFamiliar: (state) => {
            state.active = null;
            return state;
        },
        familiarHpChanged: (state, action: PayloadAction<number>) => {
            if (state.active) {
                state.active.hp = action.payload;
            }
            return state;
        },
        familiarMaxHpChanged: (state, action: PayloadAction<number>) => {
            if (state.active) {
                state.active.maxHp = action.payload;
            }
            return state;
        },
        toggleInvisibility: (state) => {
            if (state.active) {
                state.active.isInvisible = !state.active.isInvisible;
            }
            return state;
        },
        setInvisibility: (state, action: PayloadAction<boolean>) => {
            if (state.active) {
                state.active.isInvisible = action.payload;
            }
            return state;
        },
        familiarAttackAdded: (state, action: PayloadAction<MinionAttack>) => {
            if (state.active) {
                state.active.attacks = state.active.attacks || [];
                state.active.attacks.push(action.payload);
            }
            return state;
        },
        familiarAttackRemoved: (state, action: PayloadAction<number>) => {
            if (state.active && state.active.attacks) {
                state.active.attacks.splice(action.payload, 1);
            }
            return state;
        },
        familiarTraitAdded: (state, action: PayloadAction<string>) => {
            if (state.active) {
                state.active.traits = state.active.traits || [];
                state.active.traits.push(action.payload);
            }
            return state;
        },
        familiarTraitRemoved: (state, action: PayloadAction<number>) => {
            if (state.active && state.active.traits) {
                state.active.traits.splice(action.payload, 1);
            }
            return state;
        },
    },
});

export const {
    hydrateFamiliar,
    setFamiliar,
    clearFamiliar,
    familiarHpChanged,
    familiarMaxHpChanged,
    toggleInvisibility,
    setInvisibility,
    familiarAttackAdded,
    familiarAttackRemoved,
    familiarTraitAdded,
    familiarTraitRemoved,
} = familiarSlice.actions;

export default familiarSlice.reducer;
