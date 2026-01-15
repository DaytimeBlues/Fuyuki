/**
 * Redux Store Configuration
 *
 * WHY: Central state store with persistence middleware for automatic sessionStorage sync.
 * The character slice is single source of truth for all character data.
 */
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';
import spellbookReducer from './slices/spellbookSlice';
import combatReducer from './slices/combatSlice';
import { persistenceMiddleware } from './slices/persistenceMiddleware';
// import concentrationMiddleware from './middleware/concentrationMiddleware';

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
            .concat(persistenceMiddleware)
            // .concat(concentrationMiddleware), // TODO: Enable after fixing circular type reference
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

