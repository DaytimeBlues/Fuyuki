import { configureStore, createAction, createListenerMiddleware, createReducer } from '@reduxjs/toolkit';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import combatReducer, {
    concentrationCheckRequired,
    concentrationStarted,
    type CombatState,
} from '../slices/combatSlice';

const takeDamage = createAction<{ damage: number }>('combat/takeDamage');
const castSpell = createAction<{ spellId: string; spellName: string; concentration: boolean }>('combat/castSpell');
const openConcentrationModal = createAction<{ dc: number; spellName: string }>('ui/openConcentrationModal');

interface UiState {
    concentrationModal: { dc: number; spellName: string } | null;
}

const uiReducer = createReducer<UiState>({ concentrationModal: null }, (builder) => {
    builder.addCase(openConcentrationModal, (state, action) => {
        state.concentrationModal = action.payload;
    });
});

interface TestState {
    combat: CombatState;
    ui: UiState;
}

const createTestStore = () => {
    const listenerMiddleware = createListenerMiddleware<TestState>();

    listenerMiddleware.startListening({
        actionCreator: castSpell,
        effect: (action, listenerApi) => {
            if (action.payload.concentration) {
                listenerApi.dispatch(
                    concentrationStarted({
                        spellId: action.payload.spellId,
                        spellName: action.payload.spellName,
                    })
                );
            }
        },
    });

    listenerMiddleware.startListening({
        actionCreator: takeDamage,
        effect: (action, listenerApi) => {
            const state = listenerApi.getState();
            const activeConcentration = state.combat.activeConcentration;
            if (!activeConcentration) return;

            const dc = Math.max(10, Math.floor(action.payload.damage / 2));
            listenerApi.dispatch(concentrationCheckRequired({ damage: action.payload.damage }));
            listenerApi.dispatch(openConcentrationModal({ dc, spellName: activeConcentration.spellName }));
        },
    });

    return configureStore({
        reducer: {
            combat: combatReducer,
            ui: uiReducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
    });
};

const mockLocalStorage = () => {
    const store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            Object.keys(store).forEach((key) => delete store[key]);
        },
    };
};

describe('concentration listener middleware', () => {
    const originalLocalStorage = window.localStorage;

    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage(),
            configurable: true,
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: originalLocalStorage,
            configurable: true,
        });
    });

    it('dispatches openConcentrationModal when damage is taken while concentrating', () => {
        const store = createTestStore();

        store.dispatch(castSpell({ spellId: 'spell-1', spellName: 'Witch Bolt', concentration: true }));
        store.dispatch(takeDamage({ damage: 12 }));

        const state = store.getState();
        expect(state.ui.concentrationModal).toEqual({ dc: 10, spellName: 'Witch Bolt' });
        expect(state.combat.concentrationCheckDC).toBe(10);
    });

    it('avoids duplicate active concentration during rapid damage + cast', () => {
        const store = createTestStore();

        store.dispatch(castSpell({ spellId: 'spell-1', spellName: 'Hold Person', concentration: true }));
        store.dispatch(takeDamage({ damage: 18 }));
        store.dispatch(castSpell({ spellId: 'spell-2', spellName: 'Fly', concentration: true }));

        const state = store.getState();
        expect(state.combat.activeConcentration?.spellId).toBe('spell-2');
    });

    it('calculates DC as max(10, damage/2)', () => {
        const store = createTestStore();

        store.dispatch(castSpell({ spellId: 'spell-1', spellName: 'Hex', concentration: true }));
        store.dispatch(takeDamage({ damage: 22 }));

        let state = store.getState();
        expect(state.ui.concentrationModal?.dc).toBe(11);

        store.dispatch(takeDamage({ damage: 4 }));
        state = store.getState();
        expect(state.ui.concentrationModal?.dc).toBe(10);
    });
});
