import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import healthReducer from './slices/healthSlice';
import warlockReducer from './slices/warlockSlice';
import statReducer from './slices/statSlice';
import inventoryReducer from './slices/inventorySlice';
import spellbookReducer from './slices/spellbookSlice';
import combatReducer from './slices/combatSlice';
import uiReducer from './slices/uiSlice';
import widgetReducer from './slices/widgetSlice';
import equipmentReducer from './slices/equipmentSlice';
import familiarReducer from './slices/familiarSlice';
import { persistenceMiddleware } from './slices/persistenceMiddleware';
import { open5eApi } from './api/open5eApi';

const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        widget: widgetReducer,
        health: healthReducer,
        warlock: warlockReducer,
        stats: statReducer,
        inventory: inventoryReducer,
        spellbook: spellbookReducer,
        combat: combatReducer,
        equipment: equipmentReducer,
        familiar: familiarReducer,
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
