import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectFamiliar } from '../../store/selectors';
import {
    familiarHpChanged,
    toggleInvisibility,
    setInvisibility,
    clearFamiliar
} from '../../store/slices/familiarSlice';
import { GRINDLETTE } from '../../data/familiarsData';
import { Skull, Heart, Eye, X, Plus } from 'lucide-react';
import { useDraggableWidget } from '../../hooks/useDraggableWidget';

export function FamiliarBubble() {
    const dispatch = useAppDispatch();
    const familiar = useAppSelector(selectFamiliar);
    const [isExpanded, setIsExpanded] = useState(false);
    const { isDragging, bind } = useDraggableWidget({ id: 'familiar' });

    // Auto-add Grindlette if no familiar is set
    const handleAddFamiliar = () => {
        if (!familiar) {
            dispatch({ type: 'familiar/setFamiliar', payload: GRINDLETTE } as any);
        }
    };

    const handleHpChange = (delta: number) => {
        if (familiar) {
            const newHp = Math.max(0, Math.min(familiar.maxHp, familiar.hp + delta));
            dispatch(familiarHpChanged(newHp));
        }
    };

    return (
        <div
            {...bind}
            className="flex flex-col items-end gap-3 pointer-events-auto"
        >
            {/* Expanded Stat Block */}
            <div className={`flex flex-col gap-2 transition-all duration-500 origin-bottom ${isExpanded ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10 pointer-events-none'}`}>
                {/* Familiar Header */}
                <div className="flex items-center justify-between bg-card-elevated border border-gold-dim/30 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                        <Skull size={20} className="text-purple-400" />
                        <div>
                            <h3 className="font-display text-parchment text-sm">{familiar?.name || 'No Familiar'}</h3>
                            <p className="text-[10px] text-muted font-japanese">使い魔</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="p-2 hover:bg-white/10 rounded text-muted hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Familiar Stats */}
                {familiar && (
                    <div className="bg-card border border-white/10 rounded-xl p-3 space-y-3">
                        {/* HP Bar */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Heart size={14} className="text-red-400" />
                                    <span className="text-xs text-muted">HP</span>
                                </div>
                                <span className="font-display text-parchment">
                                    {familiar.hp} / {familiar.maxHp}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleHpChange(-1)}
                                    className="px-2 py-1 bg-bg-dark/40 border border-white/10 rounded hover:border-white/20 text-muted hover:text-white"
                                >
                                    -
                                </button>
                                <div className="flex-1 h-2 bg-bg-dark/40 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all"
                                        style={{ width: `${(familiar.hp / familiar.maxHp) * 100}%` }}
                                    />
                                </div>
                                <button
                                    onClick={() => handleHpChange(1)}
                                    className="px-2 py-1 bg-bg-dark/40 border border-white/10 rounded hover:border-white/20 text-muted hover:text-white"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* AC & Speed */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-bg-dark/30 rounded-lg p-2 text-center">
                                <div className="text-[9px] text-muted">AC</div>
                                <div className="font-display text-parchment">{familiar.ac}</div>
                            </div>
                            <div className="bg-bg-dark/30 rounded-lg p-2 text-center">
                                <div className="text-[9px] text-muted">SPEED</div>
                                <div className="font-display text-parchment">{familiar.speed} ft</div>
                            </div>
                        </div>

                        {/* Traits */}
                        {familiar.traits && familiar.traits.length > 0 && (
                            <div className="space-y-1">
                                <div className="text-[9px] text-muted mb-1">TRAITS</div>
                                <div className="flex flex-wrap gap-1">
                                    {familiar.traits.map((trait, idx) => (
                                        <span
                                            key={idx}
                                            className="text-[9px] px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded border border-purple-500/20"
                                        >
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Invisibility Toggle */}
                        <button
                            onClick={() => dispatch(toggleInvisibility())}
                            className={`flex items-center justify-between p-2 rounded-lg border transition-all ${familiar.isInvisible
                                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                                : 'bg-bg-dark/30 border-white/10 hover:border-white/20 text-muted'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Eye size={14} />
                                <span className="text-sm font-display">
                                    {familiar.isInvisible ? 'Visible' : 'Invisible'}
                                </span>
                            </div>
                            {familiar.isInvisible && (
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                            )}
                        </button>

                        {/* Clear Familiar Button */}
                        <button
                            onClick={() => {
                                if (window.confirm('Clear familiar? This cannot be undone.')) {
                                    dispatch(clearFamiliar());
                                    setIsExpanded(false);
                                }
                            }}
                            className="w-full py-2 border border-red-900/20 text-red-400 rounded hover:bg-red-900/20 transition-all text-sm"
                        >
                            Clear Familiar
                        </button>
                    </div>
                )}
            </div>

            {/* Core Bubble */}
            <div className="relative">
                <button
                    onClick={() => {
                        if (!isDragging) {
                            if (familiar) {
                                setIsExpanded(!isExpanded);
                            } else {
                                handleAddFamiliar();
                                setIsExpanded(true);
                            }
                        }
                    }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative
                        bg-black/40 backdrop-blur-md border border-white/10 shadow-xl
                        ${isExpanded
                            ? 'bg-purple-500 text-bg-dark scale-90 rotate-45 shadow-purple-500/30'
                            : 'text-white hover:border-white/40 hover:scale-105 active:scale-95'
                        }
                        ${isDragging ? 'scale-110 shadow-2xl shadow-purple-500/30 ring-2 ring-purple-500/50' : ''}
                    `}
                >
                    {familiar ? <Skull size={24} /> : <Plus size={24} />}
                </button>

                {/* HP Ring Indicator */}
                {familiar && familiar.hp < familiar.maxHp && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse ring-2 ring-white/20" />
                )}
            </div>
        </div>
    );
}
