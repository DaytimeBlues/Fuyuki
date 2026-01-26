import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConcentrationWidget } from '../components/widgets/ConcentrationWidget';
import healthReducer, { hpChanged, concentrationSet } from '../store/slices/healthSlice';
import warlockReducer from '../store/slices/warlockSlice';
import statReducer from '../store/slices/statSlice';
import inventoryReducer from '../store/slices/inventorySlice';
import spellbookReducer from '../store/slices/spellbookSlice';
import combatReducer from '../store/slices/combatSlice';
import uiReducer from '../store/slices/uiSlice';
import widgetReducer from '../store/slices/widgetSlice';
import equipmentReducer from '../store/slices/equipmentSlice';
import familiarReducer from '../store/slices/familiarSlice';
import tacticalReducer from '../store/slices/tacticalSlice';
import concentrationMiddleware from '../store/middleware/concentrationMiddleware';
import { open5eApi } from '../store/api/open5eApi';

const mockConcentrationBreak = vi.hoisted(() => vi.fn());

vi.mock('../utils/haptics', () => ({
  HapticPresets: {
    concentrationBreak: mockConcentrationBreak,
  },
}));

const createStore = () =>
  configureStore({
    reducer: {
      ui: uiReducer,
      widget: widgetReducer,
      health: healthReducer,
      warlock: warlockReducer,
      stats: statReducer,
      inventory: inventoryReducer,
      spellbook: spellbookReducer,
      combat: combatReducer,
      equipment: equipmentReducer,
      familiar: familiarReducer,
      tactical: tacticalReducer,
      [open5eApi.reducerPath]: open5eApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(concentrationMiddleware, open5eApi.middleware),
  });

describe('ConcentrationWidget', () => {
  it('renders without active concentration', () => {
    render(
      <ConcentrationWidget
        spell={null}
        onClear={() => {}}
        onSet={() => {}}
      />
    );

    expect(screen.getByText('Concentration')).toBeInTheDocument();
    expect(screen.getByText('Not concentrating on any spell')).toBeInTheDocument();
  });

  it('displays active concentration spell', () => {
    render(
      <ConcentrationWidget
        spell="Mage Armor"
        onClear={() => {}}
        onSet={() => {}}
      />
    );

    expect(screen.getByText('Mage Armor')).toBeInTheDocument();
  });

  it('calls onClear when end button is clicked', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();

    render(
      <ConcentrationWidget
        spell="Shield"
        onClear={handleClear}
        onSet={() => {}}
      />
    );

    const endButton = screen.getByText('End');
    await user.click(endButton);

    expect(handleClear).toHaveBeenCalled();
  });

  it('allows setting concentration via quick buttons', async () => {
    const user = userEvent.setup();
    const handleSet = vi.fn();

    render(
      <ConcentrationWidget
        spell={null}
        onClear={() => {}}
        onSet={handleSet}
      />
    );

    const blessButton = screen.getByText('Bless');
    await user.click(blessButton);

    expect(handleSet).toHaveBeenCalledWith('Bless');
  });
});

describe('concentrationMiddleware', () => {
  beforeEach(() => {
    mockConcentrationBreak.mockClear();
  });

  it('triggers haptic feedback when taking damage while concentrating and alive', () => {
    const store = createStore();

    store.dispatch(concentrationSet('Hex'));
    store.dispatch(hpChanged(30));

    expect(mockConcentrationBreak).toHaveBeenCalledTimes(1);
  });

  it('does not trigger when not concentrating', () => {
    const store = createStore();

    store.dispatch(concentrationSet(null));
    store.dispatch(hpChanged(30));

    expect(mockConcentrationBreak).not.toHaveBeenCalled();
  });

  it('does not trigger when damage drops HP to 0', () => {
    const store = createStore();

    store.dispatch(concentrationSet('Hex'));
    store.dispatch(hpChanged(0));

    expect(mockConcentrationBreak).not.toHaveBeenCalled();
  });
});
