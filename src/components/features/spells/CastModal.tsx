import React, { useState } from 'react';
import { SpellV3 } from '../../../schemas/spellSchema';
import { X, Zap, AlertTriangle } from 'lucide-react';

interface CastModalProps {
    spell: SpellV3;
    availableSlots: Record<number, number>;
    onConfirm: (level: number) => void;
    onCancel: () => void;
    isConcentrating?: boolean;
}

export const CastModal: React.FC<CastModalProps> = ({ spell, availableSlots, onConfirm, onCancel, isConcentrating }) => {
    const [selectedLevel, setSelectedLevel] = useState<number>(Math.max(1, spell.level)); // Default to base level

    // Determine valid slot levels (must be >= spell level and have slots > 0)
    const validLevels = Object.entries(availableSlots)
        .filter(([lvl, count]) => Number(lvl) >= spell.level && count > 0)
        .map(([lvl]) => Number(lvl))
        .sort((a, b) => a - b);

    const handleCast = () => {
        onConfirm(selectedLevel);
    };

    // Calculate scaled damage/healing preview (basic logic for now)
    const getScaledDescription = (level: number) => {
        let desc = "";
        if (spell.damage && spell.damage[0]?.scaling?.type === 'per_slot_level') {
            const baseCount = spell.damage[0].count;
            const extra = (level - spell.level) * (spell.damage[0].scaling.diceIncreasePerLevel || 0);
            const totalDice = baseCount + extra;
            desc = `Deals ${totalDice}${spell.damage[0].sides > 0 ? 'd' + spell.damage[0].sides : ''} ${spell.damage[0].type} damage.`;
        }
        return desc;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-stone-900 border border-stone-700 rounded-lg shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-stone-800">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <h2 className="text-xl font-cinzel text-stone-100">Cast {spell.name}</h2>
                    </div>
                    <button onClick={onCancel} className="text-stone-500 hover:text-stone-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">

                    {/* Concentration Warning */}
                    {spell.duration.type === 'concentration' && isConcentrating && (
                        <div className="flex items-start gap-3 p-3 text-sm bg-orange-950/30 border border-orange-900/50 rounded text-orange-200">
                            <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
                            <div>
                                <p className="font-bold">Breaking Concentration</p>
                                <p className="opacity-90">Casting this spell will end your current concentration.</p>
                            </div>
                        </div>
                    )}

                    {/* Slot Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-400 uppercase tracking-wider">Select Spell Slot</label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.keys(availableSlots).map(lvl => Number(lvl)).filter(l => l <= 9 && l >= 1).map(level => {
                                const count = availableSlots[level] || 0;
                                const isValid = level >= spell.level;
                                const isAffordable = count > 0;

                                return (
                                    <button
                                        key={level}
                                        disabled={!isValid || !isAffordable}
                                        onClick={() => setSelectedLevel(level)}
                                        className={`
                      p-2 border rounded text-center transition-all
                      ${selectedLevel === level && isValid && isAffordable
                                                ? 'bg-yellow-900/20 border-yellow-600 text-yellow-500 ring-1 ring-yellow-600'
                                                : (!isValid || !isAffordable)
                                                    ? 'bg-stone-950 border-stone-900 text-stone-700 cursor-not-allowed opacity-50'
                                                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-600'
                                            }
                    `}
                                    >
                                        <div className="text-xs font-bold mb-1">Level {level}</div>
                                        <div className="text-[10px]">{count} Slots</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="p-3 bg-stone-950 rounded border border-stone-900">
                        <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Effect Preview</div>
                        <p className="text-stone-300 text-sm">
                            {getScaledDescription(selectedLevel) || spell.description.slice(0, 100) + "..."}
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-stone-800 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-stone-400 hover:text-stone-200 text-sm font-bold uppercase tracking-wider"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCast}
                        disabled={validLevels.length === 0}
                        className="px-6 py-2 bg-red-900 hover:bg-red-800 text-white rounded text-sm font-bold uppercase tracking-wider shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cast Spell
                    </button>
                </div>

            </div>
        </div>
    );
};
