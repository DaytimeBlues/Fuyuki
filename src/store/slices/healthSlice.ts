import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CharacterData } from '../../types';
import { getActiveSession } from '../../utils/sessionStorage';
import { initialCharacterData } from '../../data/initialState';

export interface HealthState {
    hp: { current: number; max: number; temp: number };
    deathSaves: { successes: number; failures: number };
    hitDice: { current: number; max: number; size: number };
    concentration: string | null;
    transformed: {
        active: boolean;
        creatureName: string;
        hp: { current: number; max: number };
        ac: number;
    } | null;
    conditions: string[];
}

const getInitialState = (): HealthState => {
    const session = getActiveSession();
    const data = session ? session.characterData : initialCharacterData;
    return {
        hp: data.hp,
        deathSaves: data.deathSaves,
        hitDice: data.hitDice,
        concentration: data.concentration,
        transformed: data.transformed,
        conditions: data.conditions || [],
    };
};

const initialState: HealthState = getInitialState();

export const healthSlice = createSlice({
    name: 'health',
    initialState,
    reducers: {
        hydrateHealth: (state, action: PayloadAction<Pick<CharacterData, 'hp' | 'deathSaves' | 'hitDice' | 'concentration' | 'transformed' | 'conditions'>>) => {
            console.log('Hydrating Health:', action.payload.hp);
            state.hp = action.payload.hp;
            state.deathSaves = action.payload.deathSaves;
            state.hitDice = action.payload.hitDice;
            state.concentration = action.payload.concentration;
            state.transformed = action.payload.transformed;
            state.conditions = action.payload.conditions || [];
        },
        hpChanged: (state, action: PayloadAction<number>) => {
            const delta = action.payload - state.hp.current;
            if (delta < 0) {
                const damageAmt = Math.abs(delta);
                const tempAbsorbed = Math.min(state.hp.temp, damageAmt);
                const remainingDamage = damageAmt - tempAbsorbed;
                const newHP = Math.max(0, state.hp.current - remainingDamage);

                state.hp.temp -= tempAbsorbed;
                state.hp.current = newHP;

                if (newHP === 0) {
                    state.concentration = null;
                }
            } else {
                const wasAtZero = state.hp.current === 0;
                state.hp.current = Math.min(state.hp.max, Math.max(0, action.payload));
                if (wasAtZero && state.hp.current > 0) {
                    state.deathSaves = { successes: 0, failures: 0 };
                }
            }
        },
        tempHpSet: (state, action: PayloadAction<number>) => {
            state.hp.temp = Math.max(0, action.payload);
        },
        concentrationSet: (state, action: PayloadAction<string | null>) => {
            state.concentration = action.payload;
        },
        deathSaveChanged: (state, action: PayloadAction<{ type: 'successes' | 'failures'; value: number }>) => {
            state.deathSaves[action.payload.type] = action.payload.value;
        },
        hitDiceSpent: (state, action: PayloadAction<{ count: number; healed: number }>) => {
            state.hitDice.current = Math.max(0, state.hitDice.current - action.payload.count);
            state.hp.current = Math.min(state.hp.max, state.hp.current + action.payload.healed);
        },
        wildShapeStarted: (state, action: PayloadAction<{ name: string; hp: number; ac: number }>) => {
            state.transformed = {
                active: true,
                creatureName: action.payload.name,
                hp: { current: action.payload.hp, max: action.payload.hp },
                ac: action.payload.ac
            };
        },
        wildShapeEnded: (state) => {
            state.transformed = null;
        },
        wildShapeHpChanged: (state, action: PayloadAction<number>) => {
            if (state.transformed) {
                state.transformed.hp.current = Math.max(0, Math.min(state.transformed.hp.max, action.payload));
            }
        },
        wildShapeDamageTaken: (state, action: PayloadAction<number>) => {
            if (state.transformed) {
                const damage = action.payload;
                const shapeHp = state.transformed.hp.current;

                if (damage >= shapeHp) {
                    const carryover = damage - shapeHp;
                    state.transformed = null;
                    if (carryover > 0) {
                        const tempAbsorbed = Math.min(state.hp.temp, carryover);
                        const remaining = carryover - tempAbsorbed;
                        state.hp.temp -= tempAbsorbed;
                        state.hp.current = Math.max(0, state.hp.current - remaining);
                    }
                } else {
                    state.transformed.hp.current -= damage;
                }
            }
        },
        longRestHealth: (state) => {
            state.hp.current = state.hp.max;
            state.hp.temp = 0;
            const recovered = Math.max(1, Math.ceil(state.hitDice.max / 2));
            state.hitDice.current = Math.min(state.hitDice.max, state.hitDice.current + recovered);
            state.concentration = null;
            state.deathSaves = { successes: 0, failures: 0 };
        },
        conditionAdded: (state, action: PayloadAction<string>) => {
            if (!state.conditions.includes(action.payload)) {
                state.conditions.push(action.payload);
            }
        },
        conditionRemoved: (state, action: PayloadAction<string>) => {
            state.conditions = state.conditions.filter(c => c !== action.payload);
        },
        conditionsCleared: (state) => {
            state.conditions = [];
        }
    },
});

export const {
    hydrateHealth,
    hpChanged,
    tempHpSet,
    concentrationSet,
    deathSaveChanged,
    hitDiceSpent,
    wildShapeStarted,
    wildShapeEnded,
    wildShapeHpChanged,
    wildShapeDamageTaken,
    longRestHealth,
    conditionAdded,
    conditionRemoved,
    conditionsCleared
} = healthSlice.actions;

export default healthSlice.reducer;
