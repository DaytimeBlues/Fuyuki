import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CharacterData, PactSlots, ArcanumSlot, Invocation, PactBoon, Patron } from '../../types';
import { getActiveSession } from '../../utils/sessionStorage';
import { initialCharacterData } from '../../data/initialState';

export interface WarlockState {
    pactSlots: PactSlots;
    spellsKnown: string[];
    cantripsKnown: string[];
    arcanum: {
        6?: ArcanumSlot;
        7?: ArcanumSlot;
        8?: ArcanumSlot;
        9?: ArcanumSlot;
    };
    invocations: Invocation[];
    pactBoon: PactBoon;
    patron: Patron;
}

const getInitialState = (): WarlockState => {
    const session = getActiveSession();
    const data = session ? session.characterData : initialCharacterData;
    return {
        pactSlots: data.pactSlots,
        spellsKnown: data.spellsKnown,
        cantripsKnown: data.cantripsKnown,
        arcanum: data.arcanum,
        invocations: data.invocations,
        pactBoon: data.pactBoon,
        patron: data.patron,
    };
};

const initialState: WarlockState = getInitialState();

export const warlockSlice = createSlice({
    name: 'warlock',
    initialState,
    reducers: {
        hydrateWarlock: (state, action: PayloadAction<CharacterData>) => {
            state.pactSlots = action.payload.pactSlots;
            state.spellsKnown = action.payload.spellsKnown;
            state.cantripsKnown = action.payload.cantripsKnown;
            state.arcanum = action.payload.arcanum;
            state.invocations = action.payload.invocations;
            state.pactBoon = action.payload.pactBoon;
            state.patron = action.payload.patron;
        },
        pactSlotUsed: (state) => {
            if (state.pactSlots.current > 0) {
                state.pactSlots.current -= 1;
            }
        },
        pactSlotRestored: (state) => {
            if (state.pactSlots.current < state.pactSlots.max) {
                state.pactSlots.current += 1;
            }
        },
        pactSlotsRefilled: (state) => {
            state.pactSlots.current = state.pactSlots.max;
        },
        arcanumUsed: (state, action: PayloadAction<number>) => {
            const lvl = action.payload as 6 | 7 | 8 | 9;
            if (state.arcanum[lvl]) {
                state.arcanum[lvl]!.used = true;
            }
        },
        arcanumRestored: (state, action: PayloadAction<number>) => {
            const lvl = action.payload as 6 | 7 | 8 | 9;
            if (state.arcanum[lvl]) {
                state.arcanum[lvl]!.used = false;
            }
        },
        invocationToggled: (state, action: PayloadAction<string>) => {
            const invocation = state.invocations.find(i => i.id === action.payload);
            if (invocation) {
                invocation.active = !invocation.active;
            }
        },
        invocationUseConsumed: (state, action: PayloadAction<string>) => {
            const invocation = state.invocations.find(i => i.id === action.payload);
            if (invocation && invocation.currentUses !== undefined && invocation.currentUses > 0) {
                invocation.currentUses -= 1;
            }
        },
        longRestWarlock: (state) => {
            state.pactSlots.current = state.pactSlots.max;
            Object.values(state.arcanum).forEach(slot => {
                if (slot) slot.used = false;
            });
            state.invocations.forEach(inv => {
                if (inv.usesPerLongRest !== undefined) {
                    inv.currentUses = inv.usesPerLongRest;
                }
            });
        },
        shortRestWarlock: (state) => {
            state.pactSlots.current = state.pactSlots.max;
        }
    },
});

export const {
    hydrateWarlock,
    pactSlotUsed,
    pactSlotRestored,
    pactSlotsRefilled,
    arcanumUsed,
    arcanumRestored,
    invocationToggled,
    invocationUseConsumed,
    longRestWarlock,
    shortRestWarlock
} = warlockSlice.actions;

export default warlockSlice.reducer;
