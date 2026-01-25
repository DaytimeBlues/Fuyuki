import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { slotExpended } from '../slices/spellbookSlice';
import { spellCast } from '../slices/tacticalSlice';

export const tacticalListener = createListenerMiddleware();

tacticalListener.startListening({
    matcher: isAnyOf(slotExpended),
    effect: async (action, listenerApi) => {
        // Track spell cast when slot is expended
        if (slotExpended.match(action)) {
            const { level } = action.payload;

            // Find spell being cast from current context
            // This is a simplified approach - in production, you'd track which specific spell was cast
            // For now, we'll use level as a proxy
            listenerApi.dispatch(spellCast({
                spellName: `Level ${level} Spell`,
                level,
                school: 'Unknown' // Would be populated from spell selection UI
            }));
        }
    }
});
