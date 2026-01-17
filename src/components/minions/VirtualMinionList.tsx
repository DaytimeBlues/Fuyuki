import { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, Skull, Biohazard } from 'lucide-react';
import type { Minion } from '../../types';

interface VirtualMinionListProps {
    minions: Minion[];
    onUpdateMinion: (id: string, hp: number) => void;
    onRemoveMinion: (id: string) => void;
}

function MinionItem({ minion, onUpdateMinion, onRemoveMinion }: {
    minion: Minion;
    onUpdateMinion: (id: string, hp: number) => void;
    onRemoveMinion: (id: string) => void;
}) {
    const [isDamaged, setIsDamaged] = useState(false);
    const [isHealing, setIsHealing] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const [prevHp, setPrevHp] = useState(minion.hp);

    useEffect(() => {
        if (minion.hp < prevHp) {
            setIsDamaged(true);
            setIsHealing(false);
            setAnimationKey(prev => prev + 1);
            setTimeout(() => setIsDamaged(false), 400);
        } else if (minion.hp > prevHp) {
            setIsHealing(true);
            setIsDamaged(false);
            setAnimationKey(prev => prev + 1);
            setTimeout(() => setIsHealing(false), 400);
        }
        setPrevHp(minion.hp);
    }, [minion.hp, prevHp]);

    return (
        <div
            className={`bg-card-elevated/60 border border-white/10 rounded-xl p-3 flex items-center justify-between transition-colors duration-200 ${isDamaged ? 'damage-taken' : ''}`}
            data-testid="minion-card"
        >
            <div>
                <div className="flex items-center gap-2">
                    {minion.type.toLowerCase() === 'skeleton' ? (
                        <Skull size={14} className="text-white" />
                    ) : (
                        <Biohazard size={14} className="text-white" />
                    )}
                    <span className="font-display text-parchment-light">{minion.name}</span>
                    <span className="text-xs text-muted">AC {minion.ac}</span>
                </div>
                <p className="text-xs text-muted/70 truncate max-w-[150px] ml-6">{minion.notes}</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-card/60 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => onUpdateMinion(minion.id, Math.max(0, minion.hp - 1))}
                        className="w-7 h-7 flex items-center justify-center hover:bg-red-500/20 text-muted hover:text-red-400 rounded transition-colors"
                        data-testid="minion-damage-btn"
                    >
                        <Minus size={14} />
                    </button>
                    <input
                        key={animationKey}
                        type="number"
                        value={minion.hp}
                        onChange={(e) => onUpdateMinion(minion.id, parseInt(e.target.value) || 0)}
                        className={`w-10 bg-transparent text-center font-display text-sm focus:outline-none border-b border-transparent focus:border-white/30 ${isDamaged ? 'animate-number-pop-damage' : isHealing ? 'animate-number-pop-heal' : ''
                            }`}
                        data-testid="minion-hp-input"
                    />
                    <button
                        onClick={() => onUpdateMinion(minion.id, Math.min(minion.maxHp, minion.hp + 1))}
                        className="w-7 h-7 flex items-center justify-center hover:bg-white/20 text-muted hover:text-white rounded transition-colors"
                        data-testid="minion-heal-btn"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                <button
                    onClick={() => onRemoveMinion(minion.id)}
                    className="p-2 hover:bg-red-500/10 text-muted hover:text-red-400 rounded-lg transition-colors"
                    data-testid="remove-minion-btn"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}

export function VirtualMinionList({ minions, onUpdateMinion, onRemoveMinion }: VirtualMinionListProps) {
    return (
        <div className="space-y-3">
            {minions.length === 0 ? (
                <div className="text-center py-12 text-muted italic font-display">
                    No undead servants raised...
                </div>
            ) : (
                minions.map((minion) => (
                    <MinionItem
                        key={minion.id}
                        minion={minion}
                        onUpdateMinion={onUpdateMinion}
                        onRemoveMinion={onRemoveMinion}
                    />
                ))
            )}
        </div>
    );
}
