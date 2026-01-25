import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpellCastEvent } from '../../services/TacticalAdvisor';

export interface TacticalState {
    spellHistory: SpellCastEvent[];
    recommendationsShown: number;
}

const initialState: TacticalState = {
    spellHistory: [],
    recommendationsShown: 0
};

export const tacticalSlice = createSlice({
    name: 'tactical',
    initialState: initialState,
    reducers: {
        spellCast: (state, action: PayloadAction<Omit<SpellCastEvent, 'timestamp'>>) => {
            const event: SpellCastEvent = {
                ...action.payload,
                timestamp: Date.now()
            };

            state.spellHistory.unshift(event);

            // Keep only last 10 casts
            if (state.spellHistory.length > 10) {
                state.spellHistory = state.spellHistory.slice(0, 10);
            }
        },
        spellHistoryCleared: (state) => {
            state.spellHistory = [];
        },
        recommendationViewed: (state) => {
            state.recommendationsShown += 1;
        },
        resetRecommendations: (state) => {
            state.recommendationsShown = 0;
        }
    }
});

export const { spellCast, spellHistoryCleared, recommendationViewed, resetRecommendations } = tacticalSlice.actions;
export default tacticalSlice.reducer;
