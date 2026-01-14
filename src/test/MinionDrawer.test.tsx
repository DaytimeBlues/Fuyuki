import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MinionDrawer } from '../components/minions/MinionDrawer';
import type { Minion } from '../store/slices/combatSlice';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import combatReducer, { allMinionsCleared, minionAdded } from '../store/slices/combatSlice';
import characterReducer from '../store/slices/characterSlice';
import spellbookReducer from '../store/slices/spellbookSlice';

describe('MinionDrawer', () => {
  const mockMinions: Minion[] = [
    {
      id: '1',
      type: 'skeleton',
      name: 'Skeleton 1',
      hp: 10,
      ac: 13,
      maxHp: 13,
      speed: 30,
      attacks: [],
      conditions: [],
      notes: 'Test notes',
    },
    {
      id: '2',
      type: 'zombie',
      name: 'Zombie 1',
      hp: 22,
      ac: 8,
      maxHp: 22,
      speed: 20,
      attacks: [],
      conditions: [],
      notes: 'Test notes',
    },
  ];

  const createStore = () =>
    configureStore({
      reducer: {
        combat: combatReducer,
        character: characterReducer,
        spellbook: spellbookReducer,
      },
    });

  beforeEach(() => {
    vi.stubGlobal('crypto', {
      randomUUID: () => 'test-uuid',
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders minion list when open', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
          onClose={() => {}}
          minions={mockMinions}
        />
      </Provider>
    );

    expect(screen.getByText('Skeleton 1')).toBeInTheDocument();
    expect(screen.getByText('Zombie 1')).toBeInTheDocument();
  });

  it('calls onAddMinion when add button clicked', async () => {
    const user = userEvent.setup();
    const store = createStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
          onClose={() => {}}
          minions={[]}
        />
      </Provider>
    );

    const skeletonButton = screen.getByText('Raise Skeleton');
    await user.click(skeletonButton);

    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: minionAdded.type }));
  });

  it('calls onClearMinions when release all clicked', async () => {
    const user = userEvent.setup();
    const store = createStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
          onClose={() => {}}
          minions={mockMinions}
        />
      </Provider>
    );

    const clearButton = screen.getByText('Release All');
    await user.click(clearButton);

    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: allMinionsCleared.type }));
  });

  it('displays minion count', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
          onClose={() => {}}
          minions={mockMinions}
        />
      </Provider>
    );

    expect(screen.getByText(/2 Active/i)).toBeInTheDocument();
  });
});
