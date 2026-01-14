import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';
import characterReducer, { hpChanged } from '../slices/characterSlice';
import combatReducer, { concentrationStarted } from '../slices/combatSlice';
import { createConcentrationMiddleware } from './concentrationMiddleware';

const setupStore = () => {
    const concentrationMiddleware = createConcentrationMiddleware();

    return configureStore({
        reducer: {
            character: characterReducer,
            combat: combatReducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(concentrationMiddleware.middleware),
    });
};

describe('concentration middleware', () => {
    it('opens the concentration check modal when damage is taken while concentrating', () => {
        const store = setupStore();

        store.dispatch(concentrationStarted({ spellId: 'spell-1', spellName: 'Shield of Faith' }));
        store.dispatch(hpChanged(13)); // 35 -> 13 damage = 22

        const state = store.getState();
        expect(state.combat.concentrationCheckDC).toBe(11);
    });

    it('keeps only the latest concentration spell when actions are dispatched rapidly', () => {
        const store = setupStore();

        store.dispatch(concentrationStarted({ spellId: 'spell-1', spellName: 'Invisibility' }));
        store.dispatch(concentrationStarted({ spellId: 'spell-2', spellName: 'Fly' }));

        const state = store.getState();
        expect(state.combat.activeConcentration?.spellId).toBe('spell-2');
        expect(state.combat.activeConcentration?.spellName).toBe('Fly');
    });

    it('calculates DC values correctly for damage thresholds', () => {
        const storeHigh = setupStore();
        storeHigh.dispatch(concentrationStarted({ spellId: 'spell-1', spellName: 'Haste' }));
        storeHigh.dispatch(hpChanged(13)); // 35 -> 13 damage = 22
        expect(storeHigh.getState().combat.concentrationCheckDC).toBe(11);

        const storeLow = setupStore();
        storeLow.dispatch(concentrationStarted({ spellId: 'spell-1', spellName: 'Haste' }));
        storeLow.dispatch(hpChanged(31)); // 35 -> 31 damage = 4
        expect(storeLow.getState().combat.concentrationCheckDC).toBe(10);

        const storeNone = setupStore();
        storeNone.dispatch(concentrationStarted({ spellId: 'spell-1', spellName: 'Haste' }));
        storeNone.dispatch(hpChanged(35)); // 35 -> 35 damage = 0
        expect(storeNone.getState().combat.concentrationCheckDC).toBeNull();
    });
});
