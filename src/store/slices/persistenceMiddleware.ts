import { Middleware } from '@reduxjs/toolkit';
import { updateActiveSession } from '../../utils/sessionStorage';
import { RootState } from '../index';

// Actions that should NOT trigger persistence (ephemeral)
const EPHEMERAL_ACTIONS = ['ui/toastCleared', 'ui/toastShown'];

const CHARACTER_SLICE_PREFIXES = ['health/', 'warlock/', 'stats/', 'inventory/'];

export const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);

    // Check if the action belongs to one of our modular character slices
    const isCharacterAction = typeof action === 'object' &&
        action !== null &&
        'type' in action &&
        typeof (action as any).type === 'string' &&
        CHARACTER_SLICE_PREFIXES.some(prefix => (action as any).type.startsWith(prefix));

    if (isCharacterAction && !EPHEMERAL_ACTIONS.includes((action as any).type)) {
        const state = store.getState() as RootState;

        // Reconstruct CharacterData from modular slices
        const characterData = {
            ...state.stats,
            ...state.health,
            ...state.warlock,
            ...state.inventory,
        };

        const minions = Object.values(state.combat.minions.entities) as any[];

        // Save to sessionStorage using requestIdleCallback for performance
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(() => {
                updateActiveSession(characterData as any, minions);
            });
        } else {
            setTimeout(() => {
                updateActiveSession(characterData as any, minions);
            }, 0);
        }
    }

    return result;
};
