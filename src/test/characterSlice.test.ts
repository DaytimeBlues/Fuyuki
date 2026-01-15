import { describe, it, expect } from 'vitest';
import characterReducer, {
    shortRestCompleted,
    longRestCompleted,
    pactSlotUsed,
    selectCurrentAC
} from '../store/slices/characterSlice';

describe('characterSlice Warlock Logic', () => {
    it('refills pact slots on short rest', () => {
        // Start with used slot
        let state = characterReducer(undefined, { type: '@@INIT' });
        state = characterReducer(state, pactSlotUsed());
        expect(state.pactSlots.current).toBe(state.pactSlots.max - 1);

        // Perform short rest
        state = characterReducer(state, shortRestCompleted());
        expect(state.pactSlots.current).toBe(state.pactSlots.max);
    });

    it('refills pact slots and arcanum on long rest', () => {
        let state = characterReducer(undefined, { type: '@@INIT' });

        // Use a pact slot
        state = characterReducer(state, pactSlotUsed());

        state = characterReducer(state, longRestCompleted());
        expect(state.pactSlots.current).toBe(state.pactSlots.max);
    });

    it('calculates AC correctly with Armor of Shadows', () => {
        const initialState = characterReducer(undefined, { type: '@@INIT' });
        const state = {
            ...initialState,
            baseAC: 10,
            abilityMods: { ...initialState.abilityMods, dex: 2 },
            invocations: [
                { id: 'armor-of-shadows', name: 'Armor of Shadows', active: false, description: '' }
            ]
        };

        // Inactive: 10 + 2 = 12
        expect(selectCurrentAC({ character: state })).toBe(12);

        // Active: 13 + 2 = 15
        const activeState = characterReducer(state, { type: 'character/invocationToggled', payload: 'armor-of-shadows' });
        expect(selectCurrentAC({ character: activeState })).toBe(15);
    });
});
