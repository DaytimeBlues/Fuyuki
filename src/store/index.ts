/**
 * Redux Store Configuration
 * 
 * WHY: Central state store with persistence middleware for automatic sessionStorage sync.
 * The character slice is the single source of truth for all character data.
 */
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';
import spellbookReducer from './slices/spellbookSlice';
import combatReducer from './slices/combatSlice';
import { persistenceMiddleware } from './slices/persistenceMiddleware';

const listenerMiddleware = createListenerMiddleware();

// TODO: Add listeners for concentration checks on damage, etc.

export const store = configureStore({
    reducer: {
        character: characterReducer,
        spellbook: spellbookReducer,
        combat: combatReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .prepend(listenerMiddleware.middleware)
            .concat(persistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

