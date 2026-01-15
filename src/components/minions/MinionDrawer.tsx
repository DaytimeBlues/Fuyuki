import { X, Skull, Biohazard } from 'lucide-react';
import type { Minion } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { minionAdded, minionRemoved, minionUpdated, allMinionsCleared } from '../../store/slices/combatSlice';
import { undeadStats } from '../../data/undeadStats';
import { VirtualMinionList } from './VirtualMinionList';

interface MinionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    minions: Minion[];
}

export function MinionDrawer({
    isOpen,
    onClose,
    minions,
}: MinionDrawerProps) {
    const dispatch = useAppDispatch();

    const handleAddMinion = (type: 'Skeleton' | 'Zombie') => {
        const stats = undeadStats.find(s => s.name === type);
        if (!stats) return;

        const count = minions.filter(m => m.type === type.toLowerCase()).length + 1;

        // Ensure type compatibility with minion slice
        // Slice expects 'skeleton' | 'zombie' | 'undead_spirit'
        const minionType = type.toLowerCase() as 'skeleton' | 'zombie';

        // Helper to parse dice string like "1d6+2" or "1d6 + 2"
        const parseDamage = (desc: string): string => {
            return desc.match(/\d+d\d+(?:\s*[+-]\s*\d+)?/)?.[0] || "1d4";
        };

        const newMinion: Minion = {
            id: crypto.randomUUID(),
            name: `${type} ${count}`,
            type: minionType,
            hp: parseInt(stats.hp.split(' ')[0]) || 1, // Extract "13" from "13 (2d8+4)"
            maxHp: parseInt(stats.hp.split(' ')[0]) || 1,
            ac: parseInt(stats.ac.split(' ')[0]) || 10,
            speed: parseInt(stats.speed.split(' ')[0]) || 30,
            attacks: stats.actions.filter(a =>
                ['Shortbow', 'Shortsword', 'Slam'].includes(a.name)
            ).map(a => ({
                name: a.name,
                toHit: parseInt(a.desc.match(/\+(\d+)/)?.[1] || "0"),
                damage: parseDamage(a.desc),
                damageType: a.desc.includes('piercing') ? 'piercing' : 'bludgeoning'
            })),
            conditions: [],
            controlExpiresRound: undefined,
            // Store traits in notes if available, or just action summaries
            notes: stats.traits ? stats.traits.map(t => t.name).join(', ') : ''
        };

        dispatch(minionAdded(newMinion));
    };

    const handleUpdateMinion = (id: string, hp: number) => {
        dispatch(minionUpdated({ id, changes: { hp } }));
    };

    const handleRemoveMinion = (id: string) => {
        dispatch(minionRemoved(id));
    };

    const handleClearMinions = () => {
        dispatch(allMinionsCleared());
    };

    return (
        <div
            onClick={onClose}
            className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
            <div
                className={`fixed bottom-0 left-0 right-0 bg-card border-t border-white/20 rounded-t-3xl z-50 transition-transform duration-300 ease-out transform ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    } h-[70vh] flex flex-col shadow-2xl shadow-white/5`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Handle / Header */}
                <div className="p-4 border-b border-white/10 shrink-0">
                    {/* Drawer Handle */}
                    <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4" />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skull size={20} className="text-white" />
                            <h2 className="font-display text-lg text-parchment-light tracking-wider">Minion Manager</h2>
                            <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full border border-white/20 font-display">
                                {minions.length} Active
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {minions.length > 0 && (
                                <button
                                    onClick={handleClearMinions}
                                    className="text-xs text-red-400 hover:text-red-300 uppercase font-display tracking-wider px-3 py-1.5 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-all"
                                >
                                    Release All
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/20 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all"
                                aria-label="Close drawer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto flex-1 p-4 space-y-4">
                    {/* Quick Add Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            onClick={() => handleAddMinion('Skeleton')}
                            className="flex items-center justify-center gap-2 bg-card-elevated/80 hover:bg-card-elevated border border-white/10 hover:border-white/30 p-3 rounded-xl transition-all group"
                        >
                            <Skull size={18} className="text-muted group-hover:text-white transition-colors" />
                            <span className="font-display text-sm text-parchment group-hover:text-parchment-light transition-colors">Raise Skeleton</span>
                        </button>
                        <button
                            onClick={() => handleAddMinion('Zombie')}
                            className="flex items-center justify-center gap-2 bg-card-elevated/80 hover:bg-card-elevated border border-white/10 hover:border-white/30 p-3 rounded-xl transition-all group"
                        >
                            <Biohazard size={18} className="text-muted group-hover:text-white transition-colors" />
                            <span className="font-display text-sm text-parchment group-hover:text-parchment-light transition-colors">Raise Zombie</span>
                        </button>
                    </div>

                    {/* Minion List */}
                    <VirtualMinionList minions={minions} onUpdateMinion={handleUpdateMinion} onRemoveMinion={handleRemoveMinion} />
                </div>

                {/* Safe area padding for bottom */}
                <div className="h-4 shrink-0" />
            </div>
        </div>
    );
}
