import { useState } from 'react';
import { MinionDrawer } from '../minions/MinionDrawer';
import type { Minion } from '../../types';
import { undeadStats } from '../../data/undeadStats';
import type { UndeadStatBlock } from '../../data/undeadStats';
import { Skull, Shield, Sword, Info, X, Users, Ghost, Biohazard, Bone } from 'lucide-react';

interface CombatViewProps {
    minions: Minion[];
    onAddMinion: (type: 'Skeleton' | 'Zombie') => void;
    onUpdateMinion: (id: string, hp: number) => void;
    onRemoveMinion: (id: string) => void;
    onClearMinions: () => void;
}

export function CombatView({
    minions,
    onAddMinion,
    onUpdateMinion,
    onRemoveMinion,
    onClearMinions
}: CombatViewProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStatBlock, setSelectedStatBlock] = useState<UndeadStatBlock | null>(null);

    const openStats = (name: string) => {
        const stats = undeadStats.find(s => s.name.includes(name));
        if (stats) setSelectedStatBlock(stats);
    };

    const skeletonCount = minions.filter(m => m.type === 'Skeleton').length;
    const zombieCount = minions.filter(m => m.type === 'Zombie').length;

    return (
        <div className="pb-20">
            {/* Undead Manager Card */}
            <div className="card-parchment p-4 mb-4">
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <Users size={18} className="text-accent" />
                        <h3 className="font-display text-sm text-parchment tracking-wider">Undead Horde</h3>
                    </div>
                    <span className="text-xs text-accent font-display">{minions.length} Active</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                    {/* Skeleton Counter */}
                    <div
                        className="bg-card-elevated/80 p-4 rounded-lg border border-parchment-dark/20 text-center relative group cursor-pointer hover:border-accent/40 transition-all"
                        onClick={() => openStats('Skeleton')}
                    >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Info size={12} className="text-accent" />
                        </div>
                        <Skull size={24} className="text-parchment mx-auto mb-2 group-hover:text-accent transition-colors" />
                        <div className="text-2xl font-display text-parchment-light mb-1">{skeletonCount}</div>
                        <div className="text-[10px] text-muted uppercase tracking-wider">Skeletons</div>
                    </div>

                    {/* Zombie Counter */}
                    <div
                        className="bg-card-elevated/80 p-4 rounded-lg border border-parchment-dark/20 text-center relative group cursor-pointer hover:border-accent/40 transition-all"
                        onClick={() => openStats('Zombie')}
                    >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Info size={12} className="text-accent" />
                        </div>
                        <Biohazard size={24} className="text-parchment mx-auto mb-2 group-hover:text-accent transition-colors" />
                        <div className="text-2xl font-display text-parchment-light mb-1">{zombieCount}</div>
                        <div className="text-[10px] text-muted uppercase tracking-wider">Zombies</div>
                    </div>
                </div>

                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="w-full btn-primary flex items-center justify-center gap-2 relative z-10"
                >
                    <Skull size={16} />
                    Manage Horde
                </button>
            </div>

            {/* Summon Undead Reference */}
            <div className="card-parchment p-4">
                <div className="flex items-center gap-2 mb-4 relative z-10">
                    <Bone size={18} className="text-accent" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Summon Undead</h3>
                    <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">Level 3</span>
                </div>

                <div className="space-y-2 relative z-10">
                    {/* Ghostly */}
                    <div
                        className="flex items-center gap-3 p-3 rounded-lg bg-card-elevated/60 border border-parchment-dark/20 cursor-pointer hover:border-accent/40 transition-all group"
                        onClick={() => openStats('Ghostly')}
                    >
                        <div className="p-2.5 bg-card rounded-lg border border-parchment-dark/30 group-hover:border-accent/40 transition-colors">
                            <Ghost size={18} className="text-parchment group-hover:text-accent transition-colors" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-display text-parchment-light group-hover:text-accent transition-colors">Ghostly</div>
                            <div className="text-xs text-muted">Fly 40ft • 1d8+7 Necrotic • Frighten</div>
                        </div>
                        <Info size={14} className="text-muted group-hover:text-accent transition-colors" />
                    </div>

                    {/* Putrid */}
                    <div
                        className="flex items-center gap-3 p-3 rounded-lg bg-card-elevated/60 border border-parchment-dark/20 cursor-pointer hover:border-accent/40 transition-all group"
                        onClick={() => openStats('Putrid')}
                    >
                        <div className="p-2.5 bg-card rounded-lg border border-parchment-dark/30 group-hover:border-accent/40 transition-colors">
                            <Shield size={18} className="text-parchment group-hover:text-accent transition-colors" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-display text-parchment-light group-hover:text-accent transition-colors">Putrid</div>
                            <div className="text-xs text-muted">Poison Aura • 1d6+7 Slash • Paralyze</div>
                        </div>
                        <Info size={14} className="text-muted group-hover:text-accent transition-colors" />
                    </div>

                    {/* Skeletal */}
                    <div
                        className="flex items-center gap-3 p-3 rounded-lg bg-card-elevated/60 border border-parchment-dark/20 cursor-pointer hover:border-accent/40 transition-all group"
                        onClick={() => openStats('Skeletal')}
                    >
                        <div className="p-2.5 bg-card rounded-lg border border-parchment-dark/30 group-hover:border-accent/40 transition-colors">
                            <Sword size={18} className="text-parchment group-hover:text-accent transition-colors" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-display text-parchment-light group-hover:text-accent transition-colors">Skeletal</div>
                            <div className="text-xs text-muted">Ranged 150ft • 2d4+7 Necrotic • Multiattack</div>
                        </div>
                        <Info size={14} className="text-muted group-hover:text-accent transition-colors" />
                    </div>
                </div>
            </div>

            <MinionDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                minions={minions}
                onAddMinion={onAddMinion}
                onUpdateMinion={onUpdateMinion}
                onRemoveMinion={onRemoveMinion}
                onClearMinions={onClearMinions}
            />

            {/* Stat Block Modal */}
            {selectedStatBlock && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    onClick={() => setSelectedStatBlock(null)}
                >
                    <div
                        className="card-parchment p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl shadow-accent/10"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h2 className="text-xl font-display text-parchment-light">{selectedStatBlock.name}</h2>
                                <p className="text-xs text-muted italic">{selectedStatBlock.type}</p>
                            </div>
                            <button onClick={() => setSelectedStatBlock(null)} className="flex items-center gap-1 text-muted hover:text-accent transition-colors">
                                <span className="text-xs font-display uppercase tracking-wider">Close</span>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4 text-sm relative z-10">
                            {/* AC / HP / Speed */}
                            <div className="grid grid-cols-3 gap-2 text-center bg-card-elevated/80 p-3 rounded-lg border border-parchment-dark/20">
                                <div>
                                    <div className="text-[10px] text-muted uppercase tracking-wider">AC</div>
                                    <div className="font-display text-lg text-accent">{selectedStatBlock.ac}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-muted uppercase tracking-wider">HP</div>
                                    <div className="font-display text-lg text-accent">{selectedStatBlock.hp}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-muted uppercase tracking-wider">Speed</div>
                                    <div className="font-display text-lg text-parchment-light">{selectedStatBlock.speed}</div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-6 gap-1 text-center text-xs">
                                {Object.entries(selectedStatBlock.stats).map(([stat, val]) => (
                                    <div key={stat} className="bg-card-elevated p-2 rounded border border-parchment-dark/20">
                                        <div className="text-[8px] text-muted uppercase">{stat}</div>
                                        <div className="font-display text-parchment-light">{val}</div>
                                        <div className="text-[8px] text-accent">{val >= 10 ? '+' : ''}{Math.floor((val - 10) / 2)}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Immunities */}
                            <div className="space-y-2 text-xs text-parchment border-t border-parchment-dark/20 pt-3">
                                {selectedStatBlock.damageImmunities && (
                                    <p><span className="text-accent font-display">Damage Immunities:</span> {selectedStatBlock.damageImmunities}</p>
                                )}
                                {selectedStatBlock.conditionImmunities && (
                                    <p><span className="text-accent font-display">Condition Immunities:</span> {selectedStatBlock.conditionImmunities}</p>
                                )}
                                <p><span className="text-accent font-display">Senses:</span> {selectedStatBlock.senses}</p>
                                <p><span className="text-accent font-display">Languages:</span> {selectedStatBlock.languages}</p>
                            </div>

                            {/* Traits */}
                            {selectedStatBlock.traits && (
                                <div className="border-t border-parchment-dark/20 pt-3">
                                    {selectedStatBlock.traits.map(trait => (
                                        <div key={trait.name} className="mb-2">
                                            <span className="text-parchment-light font-display italic">{trait.name}.</span>{' '}
                                            <span className="text-parchment">{trait.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="border-t border-parchment-dark/20 pt-3">
                                <h4 className="text-accent font-display border-b border-parchment-dark/20 pb-1 mb-2">Actions</h4>
                                {selectedStatBlock.actions.map(action => (
                                    <div key={action.name} className="mb-2">
                                        <span className="text-parchment-light font-display italic">{action.name}.</span>{' '}
                                        <span className="text-parchment">{action.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
