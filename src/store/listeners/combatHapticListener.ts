import { createListenerMiddleware } from '@reduxjs/toolkit';
import { minionDamaged, castingCompleted } from '../slices/combatSlice';
import { HapticPresets } from '../../utils/haptics';

export const combatHapticListener = createListenerMiddleware();

combatHapticListener.startListening({
    actionCreator: minionDamaged,
    effect: async (_action) => {
        // Critical hit if damage > 10
        if (_action.payload.damage >= 10) {
            await HapticPresets.criticalHit();
        } else {
            await HapticPresets.damageTaken();
        }
    }
});

combatHapticListener.startListening({
    actionCreator: castingCompleted,
    effect: async () => {
        await HapticPresets.spellCast();
    }
});
