import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { castingCompleted, castingCancelled } from '../../store/slices/combatSlice';
import { ResolutionPanel } from '../features/combat/ResolutionPanel';
import { spells } from '../../data/spells';

export const CombatOverlay: React.FC = () => {
    const dispatch = useAppDispatch();
    const combatState = useAppSelector(state => state.combat);
    const { phase, casting } = combatState;

    if (phase !== 'resolving') return null;

    const spell = spells.find(s => s.name === casting.spellId) ||
        spells.find(s => s.name.toLowerCase() === casting.spellId?.toLowerCase());

    if (!spell) return null;

    // Convert legacy Spell to SpellV3 shape if needed (for safety)
    // The ResolutionPanel expects SpellV3. Our data/spells.ts is close but might need adapter.
    // For now assuming direct compatibility or close enough.
    // We add dummy V3 fields if missing.
    const spellV3: any = {
        ...spell,
        id: spell.name,
        requiresAttackRoll: spell.rolls.includes('Attack'),
        requiresSavingThrow: spell.rolls.includes('save'),
        damage: [{
            count: parseInt(spell.damage.split('d')[0]) || 0,
            sides: parseInt(spell.damage.split('d')[1]?.split(' ')[0]) || 0,
            type: spell.damageType,
            scaling: { type: 'per_slot_level', diceIncreasePerLevel: 1 } // Basic inference
        }],
        savingThrowDetails: {
            ability: spell.rolls.includes('DEX') ? 'dex' : spell.rolls.includes('WIS') ? 'wis' : 'con',
            onSuccess: 'none'
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
            <div className="w-full max-w-lg">
                <ResolutionPanel
                    spell={spellV3}
                    slotLevel={casting.slotLevel || spell.lvl}
                    onHit={() => {
                        // Logic to apply damage to target minion would go here
                        dispatch(castingCompleted());
                    }}
                    onMiss={() => {
                        dispatch(castingCompleted());
                    }}
                    onPass={() => {
                        dispatch(castingCompleted());
                    }}
                    onFail={() => {
                        dispatch(castingCompleted());
                    }}
                    onApply={() => {
                        dispatch(castingCompleted());
                    }}
                    onCancel={() => {
                        dispatch(castingCancelled());
                    }}
                />
            </div>
        </div>
    );
};
