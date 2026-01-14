import { configureStore } from '@reduxjs/toolkit';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import minionReducer, {
    minionAdded,
    minionRemoved,
    minionUpdated,
    minionUpserted,
    minionSelectors,
} from './minionSlice';
import { MINION_AC_MAX, MINION_NAME_MAX, minionSchema } from './minionSchema';

const buildStore = () =>
    configureStore({
        reducer: {
            minions: minionReducer,
        },
    });

describe('minionSlice fuzz', () => {
    it('clamps negative HP to 0', () => {
        const store = buildStore();
        store.dispatch(minionAdded({ id: 'a', name: 'Test', hp: -12, ac: 10 }));
        const minion = minionSelectors.selectById(store.getState(), 'a');
        expect(minion?.hp).toBe(0);
    });

    it(`clamps AC to max ${MINION_AC_MAX}`, () => {
        const store = buildStore();
        store.dispatch(minionAdded({ id: 'a', name: 'Test', hp: 5, ac: 99 }));
        const minion = minionSelectors.selectById(store.getState(), 'a');
        expect(minion?.ac).toBe(MINION_AC_MAX);
    });

    it(`truncates name to ${MINION_NAME_MAX} chars`, () => {
        const store = buildStore();
        const longName = 'x'.repeat(MINION_NAME_MAX + 10);
        store.dispatch(minionAdded({ id: 'a', name: longName, hp: 5, ac: 10 }));
        const minion = minionSelectors.selectById(store.getState(), 'a');
        expect(minion?.name.length).toBe(MINION_NAME_MAX);
    });

    it('normalizes NaN values to safe defaults', () => {
        const store = buildStore();
        store.dispatch(minionAdded({ id: 'a', name: 'Test', hp: Number.NaN, ac: Number.NaN }));
        const minion = minionSelectors.selectById(store.getState(), 'a');
        expect(minion?.hp).toBe(0);
        expect(minion?.ac).toBe(0);
    });

    it('keeps all random minion changes within schema constraints', () => {
        const actionArb = fc.oneof(
            fc.record({
                type: fc.constant('add'),
                id: fc.uuid(),
                name: fc.string(),
                hp: fc.oneof(fc.integer({ min: -500, max: 500 }), fc.float({ noNaN: false })),
                ac: fc.oneof(fc.integer({ min: -20, max: 100 }), fc.float({ noNaN: false })),
            }),
            fc.record({
                type: fc.constant('upsert'),
                id: fc.uuid(),
                name: fc.string(),
                hp: fc.oneof(fc.integer({ min: -500, max: 500 }), fc.float({ noNaN: false })),
                ac: fc.oneof(fc.integer({ min: -20, max: 100 }), fc.float({ noNaN: false })),
            }),
            fc.record({
                type: fc.constant('update'),
                id: fc.uuid(),
                name: fc.option(fc.string(), { nil: undefined }),
                hp: fc.option(fc.oneof(fc.integer({ min: -500, max: 500 }), fc.float({ noNaN: false })), { nil: undefined }),
                ac: fc.option(fc.oneof(fc.integer({ min: -20, max: 100 }), fc.float({ noNaN: false })), { nil: undefined }),
            }),
            fc.record({
                type: fc.constant('remove'),
                id: fc.uuid(),
            }),
        );

        fc.assert(
            fc.property(fc.array(actionArb, { minLength: 1, maxLength: 200 }), (actions) => {
                const store = buildStore();

                actions.forEach((action) => {
                    switch (action.type) {
                        case 'add':
                            store.dispatch(minionAdded(action));
                            break;
                        case 'upsert':
                            store.dispatch(minionUpserted(action));
                            break;
                        case 'update':
                            store.dispatch(
                                minionUpdated({
                                    id: action.id,
                                    changes: {
                                        name: action.name,
                                        hp: action.hp,
                                        ac: action.ac,
                                    },
                                }),
                            );
                            break;
                        case 'remove':
                            store.dispatch(minionRemoved(action.id));
                            break;
                        default:
                            break;
                    }
                });

                const all = minionSelectors.selectAll(store.getState());
                all.forEach((minion) => {
                    expect(minionSchema.safeParse(minion).success).toBe(true);
                });
            }),
            { numRuns: 2000 },
        );
    });
});
