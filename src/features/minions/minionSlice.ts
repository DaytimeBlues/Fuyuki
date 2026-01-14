import { createEntityAdapter, createSlice, type EntityState, type PayloadAction } from '@reduxjs/toolkit';
import { MINION_AC_MAX, MINION_NAME_MAX, type Minion } from './minionSchema';

export interface MinionState extends EntityState<Minion> {}

const minionAdapter = createEntityAdapter<Minion>();

const sanitizeNumber = (value: unknown, fallback = 0) => {
    const numeric = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
};

const sanitizeName = (name: unknown) => {
    const raw = typeof name === 'string' ? name : String(name ?? '');
    const trimmed = raw.trim();
    const safe = trimmed.length > 0 ? trimmed : 'Minion';
    return safe.slice(0, MINION_NAME_MAX);
};

const sanitizeMinion = (input: Partial<Minion> & { id: string }): Minion => {
    const hp = Math.max(0, sanitizeNumber(input.hp, 0));
    const ac = Math.min(MINION_AC_MAX, Math.max(0, sanitizeNumber(input.ac, 0)));

    return {
        id: input.id,
        name: sanitizeName(input.name ?? 'Minion'),
        hp,
        ac,
    };
};

export const minionSlice = createSlice({
    name: 'minions',
    initialState: minionAdapter.getInitialState(),
    reducers: {
        minionAdded: (state, action: PayloadAction<Partial<Minion> & { id: string }>) => {
            minionAdapter.addOne(state, sanitizeMinion(action.payload));
        },
        minionUpserted: (state, action: PayloadAction<Partial<Minion> & { id: string }>) => {
            minionAdapter.upsertOne(state, sanitizeMinion(action.payload));
        },
        minionUpdated: (state, action: PayloadAction<{ id: string; changes: Partial<Minion> }>) => {
            const existing = state.entities[action.payload.id];
            if (!existing) return;

            const next = sanitizeMinion({ ...existing, ...action.payload.changes, id: action.payload.id });
            minionAdapter.upsertOne(state, next);
        },
        minionRemoved: minionAdapter.removeOne,
        minionsCleared: minionAdapter.removeAll,
    },
});

export const {
    minionAdded,
    minionUpserted,
    minionUpdated,
    minionRemoved,
    minionsCleared,
} = minionSlice.actions;

export const minionSelectors = minionAdapter.getSelectors<{ minions: MinionState }>(
    (state) => state.minions,
);

export default minionSlice.reducer;
