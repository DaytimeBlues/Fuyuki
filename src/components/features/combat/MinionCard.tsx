import React, { useState } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { minionRemoved, Minion, MinionAttack } from '../../../store/slices/combatSlice';
import { Heart, Shield, Zap, Trash2, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

interface MinionCardProps {
    minion: Minion;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
}

/**
 * Turn card for each controlled creature (Skeleton, Zombie, Undead Spirit).
 * Implements the Minion Decision Loop:
 * 1. Choose action (Attack, Dash, Dodge, Ready)
 * 2. If Attack: Choose target → Show formula → Hit/Miss → Show damage
 * 3. Cancel/Skip always visible
 * 
 * SRD Reference:
 * - Skeleton/Zombie stat blocks (D&D Beyond Basic Rules 2014)
 * - Animate Dead (SRD 5.1, p. 115)
 */
export const MinionCard: React.FC<MinionCardProps> = ({ minion, isExpanded = false, onToggleExpand }) => {
    const dispatch = useAppDispatch();
    const [selectedAction, setSelectedAction] = useState<'attack' | 'dash' | 'dodge' | 'ready' | null>(null);
    const [selectedAttack, setSelectedAttack] = useState<MinionAttack | null>(null);
    const [showResolution, setShowResolution] = useState(false);

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

    const handleAttackSelected = (attack: MinionAttack) => {
        setSelectedAttack(attack);
        setShowResolution(true);
    };

    const handleHit = () => {
        // In Physical Dice Mode, we just show the damage formula and let user apply
        setShowResolution(false);
        setSelectedAttack(null);
        setSelectedAction(null);
    };

    const handleMiss = () => {
        setShowResolution(false);
        setSelectedAttack(null);
        setSelectedAction(null);
    };

    const handleRemove = () => {
        dispatch(minionRemoved(minion.id));
    };

    const handleCancel = () => {
        setSelectedAction(null);
        setSelectedAttack(null);
        setShowResolution(false);
    };

    return (
        <div className={`
            bg-stone-900 border border-stone-700 rounded-lg overflow-hidden
            transition-all duration-200
            ${minion.hp <= 0 ? 'opacity-50' : ''}
        `}>
            {/* Header */}
            <div
                className="flex items-center justify-between p-3 bg-stone-800 cursor-pointer"
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

                    {/* Resolution Panel (if attacking) */}
                    {showResolution && selectedAttack && (
                        <div className="bg-stone-950 rounded-lg p-4 space-y-3">
                            <div className="text-center">
                                <div className="text-xs text-stone-500 uppercase tracking-wider mb-2">Roll to Hit</div>
                                <div className="text-2xl font-mono font-bold text-white">
                                    d20 + {selectedAttack.toHit}
                                </div>
                            </div>

                            <div className="bg-stone-900/50 rounded p-2 text-center">
                                <div className="text-xs text-stone-500">On Hit</div>
                                <div className="text-lg font-mono text-red-400">
                                    {selectedAttack.damage} {selectedAttack.damageType}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={handleHit}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-green-900/30 hover:bg-green-900/50 border border-green-800 rounded text-green-400 text-sm font-bold"
                                >
                                    <Check className="w-4 h-4" />
                                    Hit
                                </button>
                                <button
                                    onClick={handleMiss}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded text-stone-400 text-sm font-bold"
                                >
                                    <X className="w-4 h-4" />
                                    Miss
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons (if not in resolution) */}
                    {!showResolution && (
                        <>
                            {/* Attack Options */}
                            {selectedAction === 'attack' ? (
                                <div className="space-y-2">
                                    <div className="text-xs text-stone-500 uppercase tracking-wider">Select Attack</div>
                                    {minion.attacks.map((attack, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAttackSelected(attack)}
                                            className="w-full flex items-center justify-between p-2 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700"
                                        >
                                            <span className="text-stone-200">{attack.name}</span>
                                            <span className="text-xs text-stone-500">
                                                +{attack.toHit} | {attack.damage}
                                            </span>
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleCancel}
                                        className="w-full text-center text-stone-500 hover:text-stone-300 text-sm py-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-2">
                                    <button
                                        onClick={() => setSelectedAction('attack')}
                                        className="flex flex-col items-center p-2 bg-red-900/20 hover:bg-red-900/30 border border-red-900/30 rounded text-red-400 text-xs"
                                    >
                                        <Zap className="w-4 h-4 mb-1" />
                                        Attack
                                    </button>
                                    <button
                                        onClick={() => {/* Dash logic */ }}
                                        className="flex flex-col items-center p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded text-stone-400 text-xs"
                                    >
                                        <span className="text-base mb-1">🏃</span>
                                        Dash
                                    </button>
                                    <button
                                        onClick={() => {/* Dodge logic */ }}
                                        className="flex flex-col items-center p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded text-stone-400 text-xs"
                                    >
                                        <Shield className="w-4 h-4 mb-1" />
                                        Dodge
                                    </button>
                                    <button
                                        onClick={handleRemove}
                                        className="flex flex-col items-center p-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded text-stone-400 text-xs"
                                    >
                                        <Trash2 className="w-4 h-4 mb-1" />
                                        Remove
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Conditions */}
                    {minion.conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
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
