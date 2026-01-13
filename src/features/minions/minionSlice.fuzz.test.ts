import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import combatReducer, { minionAdded, minionUpdated, type Minion } from '../../store/slices/combatSlice';
import { MinionSchema } from '../../schemas/minionSchema';

const createBaseMinion = (): Minion => ({
    id: 'minion-1',
    name: 'Skeleton',
    type: 'skeleton',
    hp: 13,
    maxHp: 13,
    ac: 13,
    speed: 30,
    attacks: [],
    conditions: [],
});

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

describe('minionSlice fuzz', () => {
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

    it('never produces invalid minion state under random updates', () => {
        const updateArb = fc.record(
            {
                hp: fc.oneof(
                    fc.integer({ min: -1000, max: 1000 }),
                    fc.integer({ min: Number.MAX_SAFE_INTEGER - 1000, max: Number.MAX_SAFE_INTEGER })
                ),
                ac: fc.oneof(
                    fc.integer({ min: -1000, max: 1000 }),
                    fc.integer({ min: Number.MAX_SAFE_INTEGER - 1000, max: Number.MAX_SAFE_INTEGER })
                ),
                name: fc.string({ maxLength: 200 }),
            },
            { withDeletedKeys: true }
        );

        fc.assert(
            fc.property(updateArb, (changes) => {
                let state = combatReducer(undefined, { type: 'combat/init' });
                const baseMinion = createBaseMinion();
                state = combatReducer(state, minionAdded(baseMinion));
                state = combatReducer(state, minionUpdated({ id: baseMinion.id, changes }));

                const updated = state.minions.entities[baseMinion.id];
                expect(updated).toBeDefined();
                const result = MinionSchema.safeParse(updated);
                expect(result.success).toBe(true);
            }),
            { numRuns: 2000 }
        );
    });
});
