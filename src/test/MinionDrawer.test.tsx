import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MinionDrawer } from '../components/minions/MinionDrawer';
import combatReducer from '../store/slices/combatSlice';
import characterReducer from '../store/slices/characterSlice';
import spellbookReducer from '../store/slices/spellbookSlice';
import type { Minion } from '../types';

// Helper to render with Redux Provider
function renderWithStore(
  ui: React.ReactElement,
  minions: Minion[] = []
) {
  // Build proper entity adapter state
  const minionState = {
    ids: minions.map(m => m.id),
    entities: Object.fromEntries(minions.map(m => [m.id, m])),
  };

  const store = configureStore({
    reducer: {
      character: characterReducer,
      spellbook: spellbookReducer,
      combat: combatReducer,
    },
    preloadedState: {
      combat: {
        phase: 'idle' as const,
        currentRound: 1,
        activeConcentration: null,
        concentrationCheckDC: null,
        initiativeOrder: [],
        currentTurnIndex: 0,
        minions: minionState,
        // New fields
        log: [],
        conditions: [],
        undeadCommand: null,
        reactionAvailable: true,
        bonusActionAvailable: true,
        inCombat: false,
        stable: false,
        casting: {
          step: 'idle' as const,
          spellId: null,
          slotLevel: null,
          resolutionMode: null,
        },
      },
    },
  });
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}

const mockMinions: Minion[] = [
  {
    id: '1',
    type: 'skeleton',
    name: 'Skeleton 1',
    hp: 10,
    maxHp: 13,
    ac: 13,
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
    maxHp: 22,
    ac: 8,
    speed: 20,
    attacks: [],
    conditions: [],
    notes: 'Test notes',
  },
];

describe('MinionDrawer', () => {
  it('renders minion list when open', () => {
    renderWithStore(
      <MinionDrawer
        isOpen={true}
        onClose={() => { }}
        minions={mockMinions}
      />,
      mockMinions
    );

    expect(screen.getByText('Skeleton 1')).toBeInTheDocument();
    expect(screen.getByText('Zombie 1')).toBeInTheDocument();
  });

  it('dispatches minionAdded when add button clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <MinionDrawer
        isOpen={true}
        onClose={() => { }}
        minions={[]}
      />
    );

    const skeletonButton = screen.getByText('Raise Skeleton');
    await user.click(skeletonButton);

    const state = store.getState();
    expect(state.combat.minions.ids.length).toBe(1);
    const minionId = state.combat.minions.ids[0];
    expect(state.combat.minions.entities[minionId].type).toBe('skeleton');
  });

  it('dispatches allMinionsCleared when release all clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <MinionDrawer
        isOpen={true}
        onClose={() => { }}
        minions={mockMinions}
      />,
      mockMinions
    );

    const clearButton = screen.getByText('Release All');
    await user.click(clearButton);

    const state = store.getState();
    expect(state.combat.minions.ids.length).toBe(0);
  });

  it('displays minion count', () => {
    renderWithStore(
      <MinionDrawer
        isOpen={true}
        onClose={() => { }}
        minions={mockMinions}
      />,
      mockMinions
    );

    expect(screen.getByText(/2 Active/i)).toBeInTheDocument();
  });
});

