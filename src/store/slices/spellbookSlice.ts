import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';
import { SpellSchema } from '../../schemas/spellSchema';

type SpellV3 = z.infer<typeof SpellSchema>;

const spellbookAdapter = createEntityAdapter<SpellV3>();

export interface SpellbookState {
    // extended EntityState
    pids: string[]; // prepared spell IDs
    availableSlots: Record<number, number>; // level -> count
    maxSlots: Record<number, number>; // level -> max
}

const initialState = spellbookAdapter.getInitialState({
    preparedSpellIds: [] as string[],
    availableSlots: { 1: 4, 2: 3, 3: 2, 4: 1 } as Record<number, number>, // Added Type Assertion
    maxSlots: { 1: 4, 2: 3, 3: 2, 4: 1 } as Record<number, number>
});

export const spellbookSlice = createSlice({
    name: 'spellbook',
    initialState,
    reducers: {
        spellLearned: spellbookAdapter.addOne,
        spellsLearned: spellbookAdapter.addMany,
        spellPrepared: (state, action: PayloadAction<string>) => {
            if (!state.preparedSpellIds.includes(action.payload)) {
                state.preparedSpellIds.push(action.payload);
            }
        },
        spellUnprepared: (state, action: PayloadAction<string>) => {
            state.preparedSpellIds = state.preparedSpellIds.filter(id => id !== action.payload);
        },
        slotExpended: (state, action: PayloadAction<{ level: number }>) => {
            const { level } = action.payload;
            // Ensure availableSlots exists and has a numeric value before decrementing
            if (state.availableSlots && state.availableSlots[level] && state.availableSlots[level] > 0) {
                state.availableSlots[level] -= 1;
            }
        },
        slotsRestored: (state) => {
            state.availableSlots = { ...state.maxSlots };
        }
    }
});

export const { spellLearned, spellsLearned, spellPrepared, spellUnprepared, slotExpended, slotsRestored } = spellbookSlice.actions;
export default spellbookSlice.reducer;
