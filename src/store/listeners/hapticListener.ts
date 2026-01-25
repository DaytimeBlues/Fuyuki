import { createListenerMiddleware } from '@reduxjs/toolkit';
import { deathSaveChanged, concentrationSet } from '../slices/healthSlice';
import { HapticPresets } from '../../utils/haptics';

export const hapticListener = createListenerMiddleware();

hapticListener.startListening({
    actionCreator: deathSaveChanged,
    effect: async (action) => {
        const { type, value } = action.payload;

        // Haptic feedback for death saves
        if (type === 'successes' || type === 'failures') {
            if (value === 1) {
                // First success or failure - medium notification
                await HapticPresets.buttonPress();
            }

            if (value === 3) {
                // Third save of either type - critical outcome
                if (type === 'failures') {
                    // Character death - heavy warning
                    await HapticPresets.criticalHit();
                    await new Promise(resolve => setTimeout(resolve, 300));
                    await HapticPresets.criticalHit();
                } else {
                    // Stabilized - success pattern
                    await HapticPresets.healing();
                }
            }
        }
    }
});

hapticListener.startListening({
    actionCreator: concentrationSet,
    effect: async (action) => {
        const newSpell = action.payload;

        // Concentration broken - warning
        if (newSpell === null) {
            await HapticPresets.concentrationBreak();
        }
    }
});

hapticListener.startListening({
    actionCreator: concentrationSet,
    effect: async (action) => {
        const newSpell = action.payload;

        // Concentration broken - warning
        if (newSpell === null) {
            await HapticPresets.concentrationBreak();
        }
    }
});
