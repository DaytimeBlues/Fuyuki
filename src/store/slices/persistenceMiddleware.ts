/**
 * persistenceMiddleware.ts
 * 
 * WHY: Automatically persists character state to sessionStorage on every action.
 * This eliminates the manual useEffect + debounce pattern in App.tsx.
 * 
 * The middleware intercepts actions dispatched to the 'character' slice
 * and saves the updated state to the active session in sessionStorage.
 */
import { Middleware } from '@reduxjs/toolkit';
import { updateActiveSession } from '../../utils/sessionStorage';
import { CharacterState } from './characterSlice';

// Actions that should NOT trigger persistence (ephemeral)
const EPHEMERAL_ACTIONS = ['character/toastCleared', 'character/toastShown'];

export const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);

    // Only persist on character actions, and skip ephemeral ones
    if (
        typeof action === 'object' &&
        action !== null &&
        'type' in action &&
        typeof action.type === 'string' &&
        action.type.startsWith('character/') &&
        !EPHEMERAL_ACTIONS.includes(action.type)
    ) {
        const state = store.getState();
        const character: CharacterState = state.character;

        // Extract CharacterData (without minions and toast) for session storage
        const { minions, ...characterData } = character;

        // Save to sessionStorage (debounced internally if needed, but let's keep it simple)
        // Using requestIdleCallback for better performance on rapid updates
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(() => {
                updateActiveSession(characterData, minions);
            });
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => {
                updateActiveSession(characterData, minions);
            }, 0);
        }
    }

    return result;
};
