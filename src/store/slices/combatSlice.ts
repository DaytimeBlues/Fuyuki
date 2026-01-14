import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../index';
import { slotExpended } from './spellbookSlice';

// Minion type for Animate Dead / Summon Undead creatures
export interface Minion {
    id: string;
    name: string;
    type: 'skeleton' | 'zombie' | 'undead_spirit';
    form?: 'ghostly' | 'putrid' | 'skeletal'; // For Summon Undead
    hp: number;
    maxHp: number;
    ac: number;
    speed: number;
    attacks: MinionAttack[];
    conditions: string[];
    controlExpiresRound?: number;
    notes?: string;
}

export interface MinionAttack {
    name: string;
    toHit: number;
    damage: string; // e.g., "1d6+2"
    damageType: string;
}

// Concentration state
export interface ConcentrationState {
    spellId: string;
    spellName: string;
    startRound: number;
    maxDurationRounds?: number;
}

// Combat phase for state machine
export type CombatPhase = 'idle' | 'casting' | 'resolving' | 'minion_turn';

// Casting state machine
export type CastingStep =
    | 'idle'
    | 'select_spell'
    | 'confirm_slot'
    | 'choose_targets'
    | 'resolve'
    | 'apply_effects'
    | 'complete';

export interface CastingState {
    step: CastingStep;
    spellId: string | null;
    slotLevel: number | null;
    resolutionMode: 'attack' | 'save' | 'automatic' | null;
}

const minionAdapter = createEntityAdapter<Minion>();

export interface CombatState {
    phase: CombatPhase;
    currentRound: number;

    // Concentration tracking
    activeConcentration: ConcentrationState | null;
    concentrationCheckDC: number | null; // Set when damage taken

    // Initiative (simple list for single player + minions)
    initiativeOrder: string[]; // actor IDs
    currentTurnIndex: number;

    // Minions (using EntityAdapter)
    minions: ReturnType<typeof minionAdapter.getInitialState>;

    // Casting state machine
    casting: CastingState;
}

const initialState: CombatState = {
    phase: 'idle',
    currentRound: 1,

    activeConcentration: null,
    concentrationCheckDC: null,

    initiativeOrder: [],
    currentTurnIndex: 0,

    minions: minionAdapter.getInitialState(),

    casting: {
        step: 'idle',
        spellId: null,
        slotLevel: null,
        resolutionMode: null,
    },
};

export const combatSlice = createSlice({
    name: 'combat',
    initialState,
    reducers: {
        // === Concentration Management ===
        concentrationStarted: (state, action: PayloadAction<{ spellId: string; spellName: string; maxDurationRounds?: number }>) => {
            // Starting a new concentration spell ends any existing one
            state.activeConcentration = {
                spellId: action.payload.spellId,
                spellName: action.payload.spellName,
                startRound: state.currentRound,
                maxDurationRounds: action.payload.maxDurationRounds,
            };
            state.concentrationCheckDC = null;
        },

        concentrationBroken: (state) => {
            state.activeConcentration = null;
            state.concentrationCheckDC = null;
        },

        concentrationCheckRequired: (state, action: PayloadAction<{ damage: number }>) => {
            // DC = max(10, damage / 2)
            const dc = Math.max(10, Math.floor(action.payload.damage / 2));
            state.concentrationCheckDC = dc;
        },

        concentrationCheckResolved: (state, action: PayloadAction<{ passed: boolean }>) => {
            if (!action.payload.passed) {
                state.activeConcentration = null;
            }
            state.concentrationCheckDC = null;
        },

        // === Minion Management ===
        minionAdded: (state, action: PayloadAction<Minion>) => {
            minionAdapter.addOne(state.minions, action.payload);
            // Add to initiative order
            if (!state.initiativeOrder.includes(action.payload.id)) {
                state.initiativeOrder.push(action.payload.id);
            }
        },

        minionRemoved: (state, action: PayloadAction<string>) => {
            minionAdapter.removeOne(state.minions, action.payload);
            state.initiativeOrder = state.initiativeOrder.filter(id => id !== action.payload);
        },

        minionUpdated: (state, action: PayloadAction<{ id: string; changes: Partial<Minion> }>) => {
            const minion = state.minions.entities[action.payload.id];
            if (!minion) return;

            const sanitizeNumber = (value: unknown, fallback: number, min: number) => {
                if (typeof value !== 'number' || !Number.isFinite(value)) {
                    return fallback;
                }
                return Math.max(min, Math.trunc(value));
            };

            const nextMaxHp = 'maxHp' in action.payload.changes
                ? sanitizeNumber(action.payload.changes.maxHp, minion.maxHp, 1)
                : minion.maxHp;
            const nextHp = 'hp' in action.payload.changes
                ? Math.min(
                    sanitizeNumber(action.payload.changes.hp, minion.hp, 0),
                    nextMaxHp
                )
                : minion.hp;

            const nextName = 'name' in action.payload.changes
                ? (typeof action.payload.changes.name === 'string' && action.payload.changes.name.trim().length > 0
                    ? action.payload.changes.name
                    : minion.name)
                : minion.name;

            const sanitizedChanges: Partial<Minion> = {
                ...action.payload.changes,
                hp: nextHp,
                maxHp: nextMaxHp,
                ac: 'ac' in action.payload.changes
                    ? sanitizeNumber(action.payload.changes.ac, minion.ac, 0)
                    : minion.ac,
                speed: 'speed' in action.payload.changes
                    ? sanitizeNumber(action.payload.changes.speed, minion.speed, 0)
                    : minion.speed,
                name: nextName,
            };

            minionAdapter.updateOne(state.minions, {
                id: action.payload.id,
                changes: sanitizedChanges,
            });
        },

        minionDamaged: (state, action: PayloadAction<{ id: string; damage: number }>) => {
            const minion = state.minions.entities[action.payload.id];
            if (minion) {
                const newHp = Math.max(0, minion.hp - action.payload.damage);
                minionAdapter.updateOne(state.minions, {
                    id: action.payload.id,
                    changes: { hp: newHp },
                });
            }
        },

        minionHealed: (state, action: PayloadAction<{ id: string; healing: number }>) => {
            const minion = state.minions.entities[action.payload.id];
            if (minion) {
                const newHp = Math.min(minion.maxHp, minion.hp + action.payload.healing);
                minionAdapter.updateOne(state.minions, {
                    id: action.payload.id,
                    changes: { hp: newHp },
                });
            }
        },

        allMinionsCleared: (state) => {
            minionAdapter.removeAll(state.minions);
            state.initiativeOrder = state.initiativeOrder.filter(id => id === 'player');
        },

        // === Turn Management ===
        combatStarted: (state) => {
            state.phase = 'idle';
            state.currentRound = 1;
            state.currentTurnIndex = 0;
        },

        turnAdvanced: (state) => {
            if (state.initiativeOrder.length > 0) {
                state.currentTurnIndex = (state.currentTurnIndex + 1) % state.initiativeOrder.length;

                // New round if we've cycled back to the start
                if (state.currentTurnIndex === 0) {
                    state.currentRound += 1;
                }
            }
        },

        combatEnded: (state) => {
            state.phase = 'idle';
            state.currentRound = 1;
            state.currentTurnIndex = 0;
            state.activeConcentration = null;
            state.concentrationCheckDC = null;
        },

        // === Casting State Machine ===
        castingStarted: (state, action: PayloadAction<{ spellId: string }>) => {
            state.phase = 'casting';
            state.casting = {
                step: 'select_spell',
                spellId: action.payload.spellId,
                slotLevel: null,
                resolutionMode: null,
            };
        },

        slotConfirmed: (state, action: PayloadAction<{ slotLevel: number; resolutionMode: 'attack' | 'save' | 'automatic' }>) => {
            state.casting.step = 'resolve';
            state.casting.slotLevel = action.payload.slotLevel;
            state.casting.resolutionMode = action.payload.resolutionMode;
            state.phase = 'resolving';
        },

        castingResolved: (state) => {
            state.casting.step = 'apply_effects';
        },

        castingCompleted: (state) => {
            state.casting = {
                step: 'idle',
                spellId: null,
                slotLevel: null,
                resolutionMode: null,
            };
            state.phase = 'idle';
        },

        castingCancelled: (state) => {
            state.casting = {
                step: 'idle',
                spellId: null,
                slotLevel: null,
                resolutionMode: null,
            };
            state.phase = 'idle';
        },
    },
});

// Export actions
export const {
    concentrationStarted,
    concentrationBroken,
    concentrationCheckRequired,
    concentrationCheckResolved,
    minionAdded,
    minionRemoved,
    minionUpdated,
    minionDamaged,
    minionHealed,
    allMinionsCleared,
    combatStarted,
    turnAdvanced,
    combatEnded,
    castingStarted,
    slotConfirmed,
    castingResolved,
    castingCompleted,
    castingCancelled,
} = combatSlice.actions;

/**
 * Complete the cast and spend a slot if needed.
 *
 * Notes:
 * - `castingCompleted` is a pure reducer; this thunk performs the cross-slice side effect.
 * - This is intentionally conservative: it only spends when `slotLevel > 0`.
 */
export const castingCompletedWithSlot = () => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const slotLevel = state.combat.casting.slotLevel ?? 0;

    // Cantrips (0) and unknown values do not expend slots.
    if (slotLevel > 0) {
        dispatch(slotExpended({ level: slotLevel }));
    }

    dispatch(castingCompleted());
};

// Selectors
export const minionSelectors = minionAdapter.getSelectors();

export default combatSlice.reducer;
