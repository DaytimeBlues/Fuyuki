import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';
import spellbookReducer from './slices/spellbookSlice';

const listenerMiddleware = createListenerMiddleware();

// TODO: Add listeners for concentration, etc.

export const store = configureStore({
    reducer: {
        character: characterReducer,
        spellbook: spellbookReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
