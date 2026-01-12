import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';
import spellbookReducer from './slices/spellbookSlice';
import combatReducer from './slices/combatSlice';

const listenerMiddleware = createListenerMiddleware();

// TODO: Add listeners for concentration checks on damage, etc.

export const store = configureStore({
    reducer: {
        character: characterReducer,
        spellbook: spellbookReducer,
        combat: combatReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
