import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    concentrationCheckRequired,
    concentrationCheckResolved,
    concentrationBroken
} from '../../../store/slices/combatSlice';
import { slotsRestored } from '../../../store/slices/spellbookSlice';
import { Brain, Moon, Sun, AlertTriangle, Check, X } from 'lucide-react';

/**
 * Global quick actions widget providing:
 * - Concentration Check (when damage is taken)
 * - Death Save tracking
 * - Short Rest / Long Rest triggers
 * 
 * SRD Reference:
 * - Concentration check DC = max(10, damage/2) (SRD 5.1, Concentration, pp. 101-102)
 */
export const QuickActionsWidget: React.FC = () => {
    const dispatch = useAppDispatch();
    const activeConcentration = useAppSelector(state => state.combat.activeConcentration);
    const concentrationCheckDC = useAppSelector(state => state.combat.concentrationCheckDC);

    const [showDamageInput, setShowDamageInput] = useState(false);
    const [damageInput, setDamageInput] = useState('');

    // CON modifier for concentration check (from character)
    const conMod = useAppSelector(state => {
        const conScore = state.character.abilities.constitution;
        return Math.floor((conScore - 10) / 2);
    });
    const profBonus = useAppSelector(state => state.character.proficiencyBonus);

    // War Caster feat gives advantage on concentration checks
    const hasWarCaster = useAppSelector(state => state.character.feats.includes('War Caster'));

    const handleTriggerConcentrationCheck = () => {
        const damage = parseInt(damageInput, 10);
        if (!isNaN(damage) && damage > 0) {
            dispatch(concentrationCheckRequired({ damage }));
            setDamageInput('');
            setShowDamageInput(false);
        }
    };

    const handleConcentrationPassed = () => {
        dispatch(concentrationCheckResolved({ passed: true }));
    };

    const handleConcentrationFailed = () => {
        dispatch(concentrationCheckResolved({ passed: false }));
    };

    const handleDropConcentration = () => {
        if (confirm(`Drop concentration on ${activeConcentration?.spellName}?`)) {
            dispatch(concentrationBroken());
        }
    };

    const handleShortRest = () => {
        // Short rest doesn't restore spell slots for Wizard (only hit dice, etc.)
        alert('Short Rest: Recover HP with Hit Dice. Spell slots are NOT restored until Long Rest.');
    };

    const handleLongRest = () => {
        if (confirm('Take a Long Rest? This will restore all spell slots.')) {
            dispatch(slotsRestored());
            alert('Long Rest complete. All spell slots restored!');
        }
    };

    return (
        <div className="space-y-4">
            {/* Active Concentration Display */}
            {activeConcentration && (
                <div className="bg-purple-950/30 border border-purple-900/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                            <span className="text-sm text-purple-300">
                                Concentrating on <strong>{activeConcentration.spellName}</strong>
                            </span>
                        </div>
                        <button
                            onClick={handleDropConcentration}
                            className="text-xs text-stone-500 hover:text-red-400 transition-colors"
                        >
                            Drop
                        </button>
                    </div>
                </div>
            )}

            {/* Concentration Check Modal */}
            {concentrationCheckDC !== null && (
                <div className="bg-orange-950/30 border border-orange-800 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-orange-300">
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                        <span className="font-bold">Concentration Check Required!</span>
                    </div>

                    <div className="bg-stone-950 rounded-lg p-4 text-center">
                        <div className="text-xs text-stone-500 uppercase tracking-wider mb-2">Roll Constitution Save</div>
                        <div className="text-3xl font-mono font-bold text-white mb-2">
                            DC {concentrationCheckDC}
                        </div>
                        <div className="text-sm text-stone-400">
                            Your modifier: d20 + {conMod + profBonus} (CON {conMod >= 0 ? `+${conMod}` : conMod} + Prof +{profBonus})
                        </div>
                        {hasWarCaster && (
                            <div className="mt-2 text-xs text-green-400">
                                ✓ War Caster: Roll with Advantage
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleConcentrationPassed}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-900/30 hover:bg-green-900/50 border border-green-800 rounded text-green-400 font-bold"
                        >
                            <Check className="w-4 h-4" />
                            Passed
                        </button>
                        <button
                            onClick={handleConcentrationFailed}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800 rounded text-red-400 font-bold"
                        >
                            <X className="w-4 h-4" />
                            Failed
                        </button>
                    </div>
                </div>
            )}

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
                {/* Concentration Check Trigger */}
                {activeConcentration && !concentrationCheckDC && (
                    <div className="col-span-2">
                        {showDamageInput ? (
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={damageInput}
                                    onChange={(e) => setDamageInput(e.target.value)}
                                    placeholder="Damage taken"
                                    className="flex-1 px-3 py-2 bg-stone-900 border border-stone-700 rounded text-white placeholder:text-stone-600"
                                    autoFocus
                                />
                                <button
                                    onClick={handleTriggerConcentrationCheck}
                                    className="px-4 py-2 bg-orange-900/30 hover:bg-orange-900/50 border border-orange-800 rounded text-orange-400 font-bold"
                                >
                                    Check
                                </button>
                                <button
                                    onClick={() => setShowDamageInput(false)}
                                    className="px-3 py-2 text-stone-500 hover:text-stone-300"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowDamageInput(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded text-stone-300"
                            >
                                <AlertTriangle className="w-4 h-4 text-orange-400" />
                                Took Damage (Concentration Check)
                            </button>
                        )}
                    </div>
                )}

                {/* Rest Buttons */}
                <button
                    onClick={handleShortRest}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded text-stone-400 text-sm"
                >
                    <Moon className="w-4 h-4" />
                    Short Rest
                </button>
                <button
                    onClick={handleLongRest}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-yellow-900/20 hover:bg-yellow-900/30 border border-yellow-900/30 rounded text-yellow-500 text-sm"
                >
                    <Sun className="w-4 h-4" />
                    Long Rest
                </button>
            </div>
        </div>
    );
};
