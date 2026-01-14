import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { MinionList } from './features/combat/MinionList';
import combatReducer, { minionAdded } from '../store/slices/combatSlice';

const buildStore = () =>
    configureStore({
        reducer: {
            combat: combatReducer,
        },
    });

const createMinion = (index: number) => ({
    id: `minion-${index}`,
    name: `Minion ${index}`,
    type: 'skeleton' as const,
    hp: 10,
    maxHp: 10,
    ac: 12,
    speed: 30,
    attacks: [
        { name: 'Shortsword', toHit: 4, damage: '1d6+2', damageType: 'piercing' },
    ],
    conditions: [],
});

describe('MinionList virtualization', () => {
    it('virtualizes large lists to keep DOM light', () => {
        Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
            configurable: true,
            value: 400,
        });

        const store = buildStore();
        for (let i = 0; i < 1000; i += 1) {
            store.dispatch(minionAdded(createMinion(i)));
        }

        render(
            <Provider store={store}>
                <MinionList />
            </Provider>,
        );

        const scrollContainer = screen.getByTestId('minion-virtual-scroll');
        const content = screen.getByTestId('minion-virtual-content');
        const rows = screen.getAllByTestId('minion-virtual-row');

        expect(scrollContainer.dataset.refReady).toBe('true');
        expect(content.childElementCount).toBeLessThan(50);
        expect(rows.length).toBeLessThan(50);
        expect(rows[0].style.transform).toMatch(/translateY\(/);
    });
});
