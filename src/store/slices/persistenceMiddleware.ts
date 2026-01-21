import { Middleware, UnknownAction } from '@reduxjs/toolkit';
import { updateActiveSession } from '../../utils/sessionStorage';
import { RootState } from '../index';
import { CharacterData, Minion } from '../../types';

// Actions that should NOT trigger persistence (ephemeral)
const EPHEMERAL_ACTIONS = ['ui/toastCleared', 'ui/toastShown'];

const CHARACTER_SLICE_PREFIXES = ['health/', 'warlock/', 'stats/', 'inventory/'];

export const persistenceMiddleware: Middleware = (store) => (next) => (action: UnknownAction) => {
    const result = next(action);

    // Check if the action belongs to one of our modular character slices
    const actionType = typeof action === 'object' && action !== null && 'type' in action ? action.type : null;

    const isCharacterAction = typeof actionType === 'string' &&
        CHARACTER_SLICE_PREFIXES.some(prefix => actionType.startsWith(prefix));

    if (isCharacterAction && actionType && !EPHEMERAL_ACTIONS.includes(actionType)) {
        const state = store.getState() as RootState;

        // Reconstruct CharacterData from modular slices
        const characterData: Partial<CharacterData> = {
            ...state.stats,
            ...state.health,
            ...state.warlock,
            ...state.inventory,
        };

        const minions = Object.values(state.combat.minions.entities).filter(
            (m): m is Minion => m !== undefined
        );

        // Save to sessionStorage using requestIdleCallback for performance
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(() => {
                updateActiveSession(characterData as CharacterData, minions);
            });
        } else {
            setTimeout(() => {
                updateActiveSession(characterData as CharacterData, minions);
            }, 0);
        }
    }

    return result;
};
