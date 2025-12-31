import { useState } from 'react';
import { X, Trash2, Skull, Biohazard } from 'lucide-react';
import type { Minion } from '../../types';

interface MinionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    minions: Minion[];
    onAddMinion: (type: 'Skeleton' | 'Zombie') => void;
    onUpdateMinion: (id: string, hp: number) => void;
    onRemoveMinion: (id: string) => void;
    onClearMinions: () => void;
}

export function MinionDrawer({
    isOpen,
    onClose,
    minions,
    onAddMinion,
    onUpdateMinion,
    onRemoveMinion,
    onClearMinions
}: MinionDrawerProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-card border-t-2 border-accent/30 rounded-t-3xl z-50 transition-transform duration-300 ease-out transform ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    } h-[60vh] flex flex-col shadow-2xl shadow-accent/10`}
            >
                {/* Handle / Header */}
                <div className="p-4 border-b border-parchment-dark/20 flex items-center justify-between shrink-0" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1 bg-parchment-dark/40 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
                        <Skull size={20} className="text-accent mt-2" />
                        <h2 className="font-display text-lg text-parchment-light tracking-wider mt-2">Minion Manager</h2>
                        <span className="bg-accent/10 text-accent text-xs px-2 py-0.5 rounded-full mt-2 border border-accent/20 font-display">
                            {minions.length} Active
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {minions.length > 0 && (
                            <button
                                onClick={onClearMinions}
                                className="text-xs text-red-400 hover:text-red-300 uppercase font-display tracking-wider px-2 py-1 mt-2"
                            >
                                Release All
                            </button>
                        )}
                        <button 
                            onClick={onClose} 
                            className="flex items-center gap-1 p-2 hover:bg-parchment-dark/20 rounded-full mt-2 transition-colors group"
                        >
                            <span className="text-xs text-muted group-hover:text-parchment-light font-display uppercase tracking-wider hidden sm:inline">Close</span>
                            <X size={20} className="text-muted group-hover:text-parchment-light" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-4 space-y-4 pb-8">
                    {/* Quick Add Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            onClick={() => onAddMinion('Skeleton')}
                            className="flex items-center justify-center gap-2 bg-card-elevated/80 hover:bg-card-elevated border border-parchment-dark/20 hover:border-accent/50 p-3 rounded-xl transition-all group"
                        >
                            <Skull size={18} className="text-muted group-hover:text-accent transition-colors" />
                            <span className="font-display text-sm text-parchment group-hover:text-parchment-light transition-colors">Raise Skeleton</span>
                        </button>
                        <button
                            onClick={() => onAddMinion('Zombie')}
                            className="flex items-center justify-center gap-2 bg-card-elevated/80 hover:bg-card-elevated border border-parchment-dark/20 hover:border-accent/50 p-3 rounded-xl transition-all group"
                        >
                            <Biohazard size={18} className="text-muted group-hover:text-accent transition-colors" />
                            <span className="font-display text-sm text-parchment group-hover:text-parchment-light transition-colors">Raise Zombie</span>
                        </button>
                    </div>

                    {/* Minion List */}
                    <div className="space-y-3">
                        {minions.map((minion) => (
                            <div
                                key={minion.id}
                                className="bg-card-elevated/60 border border-parchment-dark/20 rounded-xl p-3 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        {minion.type === 'Skeleton' ? (
                                            <Skull size={14} className="text-accent" />
                                        ) : (
                                            <Biohazard size={14} className="text-accent" />
                                        )}
                                        <span className="font-display text-parchment-light">{minion.name}</span>
                                        <span className="text-xs text-muted">AC {minion.ac}</span>
                                    </div>
                                    <p className="text-xs text-muted/70 truncate max-w-[150px] ml-6">{minion.notes}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 bg-card/60 rounded-lg p-1 border border-parchment-dark/20">
                                        <button
                                            onClick={() => onUpdateMinion(minion.id, minion.hp.current - 1)}
                                            className="w-7 h-7 flex items-center justify-center hover:bg-red-500/20 text-muted hover:text-red-400 rounded transition-colors"
                                        >
                                            <MinusIcon size={14} />
                                        </button>
                                        <span className={`font-display text-sm w-8 text-center ${minion.hp.current < minion.hp.max / 2 ? 'text-red-400' : 'text-parchment-light'}`}>
                                            {minion.hp.current}
                                        </span>
                                        <button
                                            onClick={() => onUpdateMinion(minion.id, minion.hp.current + 1)}
                                            className="w-7 h-7 flex items-center justify-center hover:bg-accent/20 text-muted hover:text-accent rounded transition-colors"
                                        >
                                            <PlusIcon size={14} />
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
                        ))}

                        {minions.length === 0 && (
                            <div className="text-center py-12 text-muted italic font-display">
                                No undead servants raised...
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </>
    );
}

// Helper icons
function MinusIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
}

function PlusIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
}
