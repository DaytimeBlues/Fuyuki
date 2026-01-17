import React, { useState } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { minionRemoved, minionDamaged } from '../../../store/slices/combatSlice';
import type { Minion, MinionAttack } from '../../../types';
import { Heart, Shield, Zap, Trash2, ChevronDown, ChevronUp, Minus } from 'lucide-react';

interface MinionCardProps {
    minion: Minion;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
    /** Callback to roll a formula - displays "Roll 1d20+4" in parent UI */
    onRollFormula?: (label: string, formula: string) => void;
}

/**
 * Turn card for each controlled creature (Skeleton, Zombie, Undead Spirit).
 * 
 * Implements the Minion Decision Loop:
 * 1. Choose action (Attack, Dash, Dodge, Ready)
 * 2. If Attack: Choose target → Show formula → Roll → Apply damage
 * 3. Cancel/Skip always visible
 * 
 * FIXED: Uses onRollFormula to include the +X modifier in attack rolls,
 * keeping mental math out of the user experience.
 * 
 * SRD Reference:
 * - Skeleton/Zombie stat blocks (D&D Beyond Basic Rules 2014)
 * - Animate Dead (SRD 5.1, p. 115)
 */
export const MinionCard: React.FC<MinionCardProps> = ({
    minion,
    isExpanded = false,
    onToggleExpand,
    onRollFormula
}) => {
    const dispatch = useAppDispatch();
    const [selectedAction, setSelectedAction] = useState<'attack' | 'dash' | 'dodge' | 'ready' | null>(null);
    const [damageInput, setDamageInput] = useState('');

    const hpPercentage = (minion.hp / minion.maxHp) * 100;

    const getHpColor = () => {
        if (hpPercentage > 50) return 'bg-green-600';
        if (hpPercentage > 25) return 'bg-yellow-600';
        return 'bg-red-600';
    };

    const getTypeIcon = () => {
        switch (minion.type) {
            case 'skeleton': return '💀';
            case 'zombie': return '🧟';
            case 'undead_spirit': return '👻';
            default: return '💀';
        }
    };

    // FIXED: Use onRollFormula to include the full attack formula
    const handleAttackRoll = (attack: MinionAttack) => {
        if (onRollFormula) {
            onRollFormula(`${minion.name}: Attack Roll`, `1d20+${attack.toHit}`);
        }
    };

    const handleDamageRoll = (attack: MinionAttack) => {
        if (onRollFormula) {
            onRollFormula(`${minion.name}: ${attack.name} damage`, attack.damage);
        }
    };

    const handleApplyDamage = () => {
        const damage = parseInt(damageInput, 10);
        if (!isNaN(damage) && damage > 0) {
            dispatch(minionDamaged({ id: minion.id, damage }));
            setDamageInput('');
        }
    };

    const handleRemove = () => {
        dispatch(minionRemoved(minion.id));
    };

    const handleCancel = () => {
        setSelectedAction(null);
    };

    return (
        <div className={`
            bg-stone-900 border border-stone-700 rounded-lg overflow-hidden
            transition-all duration-200
            ${minion.hp <= 0 ? 'opacity-50' : ''}
        `}>
            {/* Header */}
            <div
                className="flex items-center justify-between p-3 bg-stone-800 cursor-pointer hover:bg-stone-750 transition-colors"
                onClick={onToggleExpand}
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTypeIcon()}</span>
                    <div>
                        <h4 className="font-cinzel text-stone-100">{minion.name}</h4>
                        {minion.form && (
                            <span className="text-xs text-stone-500 capitalize">{minion.form} Form</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Quick Stats */}
                    <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-blue-400" />
                            <span className="text-stone-300">{minion.ac}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-400" />
                            <span className="text-stone-300">{minion.hp}/{minion.maxHp}</span>
                        </div>
                    </div>

                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-stone-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-stone-500" />
                    )}
                </div>
            </div>

            {/* HP Bar */}
            <div className="h-1 bg-stone-950">
                <div
                    className={`h-full transition-all ${getHpColor()}`}
                    style={{ width: `${Math.max(0, hpPercentage)}%` }}
                />
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-3 space-y-3">

                    {/* Attack Options */}
                    {selectedAction === 'attack' ? (
                        <div className="space-y-2">
                            <div className="text-xs text-stone-500 uppercase tracking-wider">Select Attack</div>
                            {minion.attacks.map((attack, idx) => (
                                <div key={idx} className="p-3 bg-stone-950 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h5 className="font-semibold text-stone-200">{attack.name}</h5>
                                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                                            +{attack.toHit} to hit
                                        </span>
                                    </div>

                                    {/* FIXED: Roll buttons use onRollFormula with complete formulas */}
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleAttackRoll(attack)}
                                            className="flex-1 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800 rounded text-red-400 text-sm font-bold transition-colors"
                                        >
                                            🎲 Attack d20+{attack.toHit}
                                        </button>
                                        <button
                                            onClick={() => handleDamageRoll(attack)}
                                            className="flex-1 px-3 py-2 bg-orange-900/30 hover:bg-orange-900/50 border border-orange-800 rounded text-orange-400 text-sm font-bold transition-colors"
                                        >
                                            💥 Damage {attack.damage}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={handleCancel}
                                className="w-full text-center text-stone-500 hover:text-stone-300 text-sm py-2 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Action Buttons */}
                            <div className="grid grid-cols-4 gap-2">
                                <button
                                    onClick={() => setSelectedAction('attack')}
                                    className="flex flex-col items-center p-2 bg-red-900/20 hover:bg-red-900/30 border border-red-900/30 rounded text-red-400 text-xs transition-colors"
                                >
                                    <Zap className="w-4 h-4 mb-1" />
                                    Attack
                                </button>
                                <button
                                    onClick={() => {/* Dash: double movement */ }}
                                    className="flex flex-col items-center p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded text-stone-400 text-xs transition-colors"
                                >
                                    <span className="text-base mb-1">🏃</span>
                                    Dash
                                </button>
                                <button
                                    onClick={() => {/* Dodge: disadvantage on attacks */ }}
                                    className="flex flex-col items-center p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded text-stone-400 text-xs transition-colors"
                                >
                                    <Shield className="w-4 h-4 mb-1" />
                                    Dodge
                                </button>
                                <button
                                    onClick={handleRemove}
                                    className="flex flex-col items-center p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded text-stone-400 text-xs transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 mb-1" />
                                    Remove
                                </button>
                            </div>

                            {/* Quick HP Adjustment */}
                            <div className="flex items-center gap-2 p-2 bg-stone-950 rounded-lg">
                                <span className="text-xs text-stone-500 uppercase tracking-wider">HP:</span>
                                <input
                                    type="number"
                                    value={damageInput}
                                    onChange={(e) => setDamageInput(e.target.value)}
                                    placeholder="Damage"
                                    className="flex-1 px-2 py-1 bg-stone-900 border border-stone-700 rounded text-white text-sm placeholder:text-stone-600"
                                />
                                <button
                                    onClick={handleApplyDamage}
                                    className="p-1 bg-red-900/30 hover:bg-red-900/50 border border-red-800 rounded text-red-400"
                                    title="Apply Damage"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    )}

                    {/* Conditions */}
                    {minion.conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2 border-t border-stone-800">
                            {minion.conditions.map((condition, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-purple-900/30 text-purple-400 border border-purple-900/30 rounded"
                                >
                                    {condition}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
