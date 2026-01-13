import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import combatReducer, { minionAdded, type Minion } from '../store/slices/combatSlice';
import characterReducer from '../store/slices/characterSlice';
import spellbookReducer from '../store/slices/spellbookSlice';
import { MinionList } from './features/combat/MinionList';

const createBaseMinion = (index: number): Minion => ({
    id: `minion-${index}`,
    name: `Skeleton ${index}`,
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

describe('MinionList virtualization', () => {
    const originalLocalStorage = window.localStorage;
    let clientHeightSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage(),
            configurable: true,
        });
        clientHeightSpy = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(800);
    });

    afterEach(() => {
        clientHeightSpy.mockRestore();
        Object.defineProperty(window, 'localStorage', {
            value: originalLocalStorage,
            configurable: true,
        });
    });

    it('recycles DOM nodes for large lists', () => {
        const store = configureStore({
            reducer: {
                combat: combatReducer,
                character: characterReducer,
                spellbook: spellbookReducer,
            },
        });

        for (let i = 0; i < 1000; i += 1) {
            store.dispatch(minionAdded(createBaseMinion(i)));
        }

        render(
            <Provider store={store}>
                <MinionList />
            </Provider>
        );

        const list = screen.getByRole('list');
        expect(list.childElementCount).toBeLessThan(50);
    });
});
