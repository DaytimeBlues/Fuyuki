import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    castingStarted,
    slotConfirmed,
    castingResolved,
    castingCompleted,
    castingCancelled,
    concentrationStarted,
    concentrationBroken,
} from '../store/slices/combatSlice';
import { slotExpended } from '../store/slices/spellbookSlice';
import { SpellV3 } from '../schemas/spellSchema';

/**
 * Hook implementing the spell casting state machine.
 * 
 * Flow: idle → selectSpell → confirmSlot → resolve → applyEffects → complete
 *       ↑_______________|_______________|______________|____________↓
 *                         (cancel returns to idle)
 * 
 * Physical Dice Mode: This hook calculates formulas but does NOT roll dice digitally.
 */
export const useSpellCast = () => {
    const dispatch = useAppDispatch();

    // State from Redux
    const castingState = useAppSelector(state => state.combat.casting);
    const activeConcentration = useAppSelector(state => state.combat.activeConcentration);
    const availableSlots = useAppSelector(state => state.spellbook.availableSlots);

    /**
     * Begin casting a spell. Moves to 'select_spell' state.
     */
    const selectSpell = useCallback((spell: SpellV3) => {
        dispatch(castingStarted({ spellId: spell.id }));
    }, [dispatch]);

    /**
     * Confirm slot level and resolution mode. Moves to 'resolve' state.
     * Also expends the spell slot.
     */
    const confirmSlot = useCallback((
        spell: SpellV3,
        slotLevel: number
    ) => {
        // Determine resolution mode from spell properties
        let resolutionMode: 'attack' | 'save' | 'automatic' = 'automatic';
        if (spell.requiresAttackRoll) {
            resolutionMode = 'attack';
        } else if (spell.requiresSavingThrow) {
            resolutionMode = 'save';
        }

        // Expend the slot (cantrips don't use slots)
        if (slotLevel > 0) {
            dispatch(slotExpended({ level: slotLevel }));
        }

        // Handle concentration
        if (spell.duration.type === 'concentration') {
            // End existing concentration if any
            if (activeConcentration) {
                dispatch(concentrationBroken());
            }
            // Start new concentration
            dispatch(concentrationStarted({
                spellId: spell.id,
                spellName: spell.name,
                // Convert duration string to rounds if possible (simplified)
                maxDurationRounds: parseDurationToRounds(spell.duration.value),
            }));
        }

        dispatch(slotConfirmed({ slotLevel, resolutionMode }));
    }, [dispatch, activeConcentration]);

    /**
     * Mark the resolution as complete (after user confirms Hit/Miss or Pass/Fail).
     * Moves to 'apply_effects' state.
     */
    const resolveSpell = useCallback((_outcome: { hit?: boolean; saved?: boolean }) => {
        dispatch(castingResolved());
    }, [dispatch]);

    /**
     * Complete the casting. Resets state to idle.
     */
    const completeCast = useCallback(() => {
        dispatch(castingCompleted());
    }, [dispatch]);

    /**
     * Cancel casting at any point. Returns to idle without side effects.
     * Note: If slots were already expended, they remain expended (as per SRD).
     */
    const cancel = useCallback(() => {
        dispatch(castingCancelled());
    }, [dispatch]);

    /**
     * Check if a spell can be cast at a given level.
     */
    const canCastAtLevel = useCallback((spell: SpellV3, slotLevel: number): boolean => {
        if (spell.level === 0) return true; // Cantrips always castable
        if (slotLevel < spell.level) return false; // Can't downcast
        return (availableSlots[slotLevel] ?? 0) > 0;
    }, [availableSlots]);

    /**
     * Get available slot levels for a spell.
     */
    const getAvailableSlotLevels = useCallback((spell: SpellV3): number[] => {
        if (spell.level === 0) return [0]; // Cantrip

        return Object.entries(availableSlots)
            .filter(([lvl, count]) => Number(lvl) >= spell.level && count > 0)
            .map(([lvl]) => Number(lvl))
            .sort((a, b) => a - b);
    }, [availableSlots]);

    return {
        // State
        castingState,
        isConcentrating: activeConcentration !== null,
        activeConcentration,

        // Actions
        selectSpell,
        confirmSlot,
        resolveSpell,
        completeCast,
        cancel,

        // Helpers
        canCastAtLevel,
        getAvailableSlotLevels,
    };
};

/**
 * Parse duration string to rounds (1 round = 6 seconds).
 * Simplified parser for common durations.
 */
function parseDurationToRounds(duration?: string): number | undefined {
    if (!duration) return undefined;

    const lower = duration.toLowerCase();

    if (lower.includes('1 minute')) return 10;
    if (lower.includes('10 minutes')) return 100;
    if (lower.includes('1 hour')) return 600;
    if (lower.includes('8 hours')) return 4800;
    if (lower.includes('24 hours')) return 14400;
    if (lower.includes('1 round')) return 1;

    // Extract number of minutes if present
    const minuteMatch = lower.match(/(\d+)\s*minutes?/);
    if (minuteMatch) {
        return parseInt(minuteMatch[1], 10) * 10;
    }

    return undefined;
}
