import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import healthReducer from './slices/healthSlice';
import warlockReducer from './slices/warlockSlice';
import statReducer from './slices/statSlice';
import inventoryReducer from './slices/inventorySlice';
import spellbookReducer from './slices/spellbookSlice';
import combatReducer from './slices/combatSlice';
import uiReducer from './slices/uiSlice';
import { persistenceMiddleware } from './slices/persistenceMiddleware';
import { open5eApi } from './api/open5eApi';

const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        health: healthReducer,
        warlock: warlockReducer,
        stats: statReducer,
        inventory: inventoryReducer,
        spellbook: spellbookReducer,
        combat: combatReducer,
        [open5eApi.reducerPath]: open5eApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .prepend(listenerMiddleware.middleware)
            .concat(persistenceMiddleware)
            .concat(open5eApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
