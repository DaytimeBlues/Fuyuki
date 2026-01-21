import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { castingCancelled, castingCompletedWithSlot } from '../../store/slices/combatSlice';
import { ResolutionPanel } from '../features/combat/ResolutionPanel';
import { spells } from '../../data/spells';
import { SpellV3 } from '../../schemas/spellSchema';

// Define the shape expected by ResolutionPanel
// Using Partial since we're adapting from legacy spell format and don't have all V3 fields
type SpellAdapter = Partial<SpellV3> & {
    id: string;
    name: string;
    level: number;
    requiresAttackRoll?: boolean;
    requiresSavingThrow?: boolean;
    desc?: string;
    decisionTree?: { level: number; summary: string }[];
    higherLevelDescription?: string;
};

export const CombatOverlay: React.FC = () => {
    const dispatch = useAppDispatch();
    const combatState = useAppSelector(state => state.combat);
    const { phase, casting } = combatState;

    if (phase !== 'resolving') return null;

    const spell = spells.find(s => s.name === casting.spellId) ||
        spells.find(s => s.name.toLowerCase() === casting.spellId?.toLowerCase());

    if (!spell) return null;

    // Adapter: legacy Spell -> enough of SpellV3 for ResolutionPanel.
    const rollsLower = (spell.rolls ?? '').toLowerCase();
    const requiresAttackRoll = rollsLower.includes('attack');
    const requiresSavingThrow = rollsLower.includes('save');

    const saveAbility = (() => {
        const r = spell.rolls ?? '';
        if (r.includes('STR')) return 'Strength';
        if (r.includes('DEX')) return 'Dexterity';
        if (r.includes('CON')) return 'Constitution';
        if (r.includes('INT')) return 'Intelligence';
        if (r.includes('WIS')) return 'Wisdom';
        if (r.includes('CHA')) return 'Charisma';
        return 'Dexterity';
    })();

    const firstDiceMatch = (spell.damage ?? '').match(/(\d+)\s*d\s*(\d+)/i);
    const damage =
        firstDiceMatch && Number(firstDiceMatch[1]) > 0 && Number(firstDiceMatch[2]) > 0
            ? [{
                count: Number(firstDiceMatch[1]),
                sides: Number(firstDiceMatch[2]),
                type: (spell.damageType || 'force').toLowerCase(),
                // Many wizard damage spells scale by +1 die per slot level.
                scaling: { type: 'per_slot_level' as const, diceIncreasePerLevel: 1 }
            }]
            : undefined;

    const spellV3: SpellAdapter = {
        id: spell.name,
        name: spell.name,
        level: spell.lvl,
        requiresAttackRoll,
        requiresSavingThrow,
        damage,
        savingThrowDetails: requiresSavingThrow ? {
            ability: saveAbility,
            onSuccess: damage ? 'half' : 'special',
            onFail: damage ? 'full' : 'special',
        } : undefined,
        // Extra fields used by the legacy UI plan
        desc: spell.desc,
        decisionTree: spell.decisionTree,
        higherLevelDescription: undefined,
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-void/90 backdrop-blur-sm transition-all duration-300"
            data-testid="combat-overlay"
        >
            {/* Kyoto Decorative Elements */}
            <div className="absolute left-0 top-0 bottom-0 w-24 flex flex-col items-center justify-center opacity-10 pointer-events-none select-none">
                <div className="writing-vertical-rl text-[8rem] font-black font-japanese text-white leading-none">
                    戦闘
                </div>
            </div>

            {/* Background Grid Texture (Ma) */}
            <div className="absolute inset-0 bg-[url('/assets/grid-pattern.png')] opacity-5 pointer-events-none mix-blend-overlay" />

            <div className="w-full max-w-lg relative z-10 animate-scale-in">
                {/* Header Decoration */}
                <div className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-mid to-transparent" />
                </div>

                <ResolutionPanel
                    spell={spellV3}
                    slotLevel={casting.slotLevel || spell.lvl}
                    onHit={() => dispatch(castingCompletedWithSlot())}
                    onMiss={() => dispatch(castingCompletedWithSlot())}
                    onPass={() => dispatch(castingCompletedWithSlot())}
                    onFail={() => dispatch(castingCompletedWithSlot())}
                    onApply={() => dispatch(castingCompletedWithSlot())}
                    onCancel={() => dispatch(castingCancelled())}
                />
            </div>
        </div>
    );
};
