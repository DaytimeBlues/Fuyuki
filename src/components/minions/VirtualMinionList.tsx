import { Minus, Plus, Trash2, Skull, Biohazard } from 'lucide-react';
import type { Minion } from '../../types';

interface VirtualMinionListProps {
    minions: Minion[];
    onUpdateMinion: (id: string, hp: number) => void;
    onRemoveMinion: (id: string) => void;
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
                    <div
                        key={minion.id}
                        className="bg-card-elevated/60 border border-white/10 rounded-xl p-3 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2"
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
                                >
                                    <Minus size={14} />
                                </button>
                                <span className={`font-display text-sm w-8 text-center ${minion.hp < minion.maxHp / 2 ? 'text-red-400' : 'text-parchment-light'}`}>
                                    {minion.hp}
                                </span>
                                <button
                                    onClick={() => onUpdateMinion(minion.id, Math.min(minion.maxHp, minion.hp + 1))}
                                    className="w-7 h-7 flex items-center justify-center hover:bg-white/20 text-muted hover:text-white rounded transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            <button
                                onClick={() => onRemoveMinion(minion.id)}
                                className="p-2 hover:bg-red-500/10 text-muted hover:text-red-400 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
