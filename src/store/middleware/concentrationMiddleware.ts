/**
 * concentrationMiddleware.ts
 *
 * WHY: Auto-displays CON save DC toast when damage is taken while concentrating.
 * This reduces cognitive load by not forcing players to remember DC = max(10, damage/2).
 */
import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { HapticPresets } from '../../utils/haptics';

const concentrationMiddleware: Middleware<object, RootState> = (store) => (next) => (action) => {
    const prevState = store.getState();
    const result = next(action);
    const nextState = store.getState();

    // Check if HP changed (damage taken)
    const prevHP = prevState.health.hp.current;
    const nextHP = nextState.health.hp.current;
    const hpDecreased = nextHP < prevHP;

    // Check if concentrating
    const hasConcentration = nextState.health.concentration !== null;

    // Trigger concentration check if damage taken while concentrating
    // Note: The characterSlice already handles concentration checks in hpChanged action
    // This middleware adds haptic feedback when haptics plugin is available
    if (hpDecreased && hasConcentration && prevHP > 0 && nextHP > 0) {
        // Character is alive and took damage while concentrating
        // Trigger haptic feedback for concentration check
        HapticPresets.concentrationBreak();
        console.debug('Concentration check triggered with haptic feedback');
    }

    return result;
};

export default concentrationMiddleware;
