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
        },
        setFamiliar: (state, action: PayloadAction<Familiar>) => {
            state.active = action.payload;
        },
        clearFamiliar: (state) => {
            state.active = null;
        },
        familiarHpChanged: (state, action: PayloadAction<number>) => {
            if (state.active) {
                state.active.hp = action.payload;
            }
        },
        familiarMaxHpChanged: (state, action: PayloadAction<number>) => {
            if (state.active) {
                state.active.maxHp = action.payload;
            }
        },
        toggleInvisibility: (state) => {
            if (state.active) {
                state.active.isInvisible = !state.active.isInvisible;
            }
        },
        setInvisibility: (state, action: PayloadAction<boolean>) => {
            if (state.active) {
                state.active.isInvisible = action.payload;
            }
        },
        familiarAttackAdded: (state, action: PayloadAction<MinionAttack>) => {
            if (state.active) {
                state.active.attacks = state.active.attacks || [];
                state.active.attacks.push(action.payload);
            }
        },
        familiarAttackRemoved: (state, action: PayloadAction<number>) => {
            if (state.active && state.active.attacks) {
                state.active.attacks.splice(action.payload, 1);
            }
        },
        familiarTraitAdded: (state, action: PayloadAction<string>) => {
            if (state.active) {
                state.active.traits = state.active.traits || [];
                state.active.traits.push(action.payload);
            }
        },
        familiarTraitRemoved: (state, action: PayloadAction<number>) => {
            if (state.active && state.active.traits) {
                state.active.traits.splice(action.payload, 1);
            }
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
