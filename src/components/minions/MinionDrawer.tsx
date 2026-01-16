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

    const handleAddMinion = (type: 'Skeleton' | 'Zombie' | 'Ghostly' | 'Putrid' | 'Skeletal') => {
        // Map short names to full stat block names
        const statBlockName = {
            'Skeleton': 'Skeleton',
            'Zombie': 'Zombie',
            'Ghostly': 'Ghostly Spirit (Summon Undead)',
            'Putrid': 'Putrid Spirit (Summon Undead)',
            'Skeletal': 'Skeletal Spirit (Summon Undead)'
        }[type];

        const stats = undeadStats.find(s => s.name === statBlockName);
        if (!stats) return;

        const isSpirit = ['Ghostly', 'Putrid', 'Skeletal'].includes(type);
        const count = minions.filter(m => m.name.includes(type)).length + 1;

        // Ensure type compatibility with minion slice
        // Slice expects 'skeleton' | 'zombie' | 'undead_spirit'
        const minionType = isSpirit ? 'undead_spirit' : type.toLowerCase() as 'skeleton' | 'zombie';

        // Helper to parse dice string like "1d6+2" or "1d6 + 2"
        const parseDamage = (desc: string): string => {
            return desc.match(/\d+d\d+(?:\s*[+-]\s*\d+)?/)?.[0] || "1d4";
        };

        // Parse HP/AC. For spirits "30 + 10/Level (40)", we take the value in parens as default (Level 3)
        const parseValue = (val: string) => {
            if (val.includes('(')) {
                return parseInt(val.split('(')[1]) || 10;
            }
            return parseInt(val.split(' ')[0]) || 10;
        };

        const newMinion: Minion = {
            id: crypto.randomUUID(),
            name: `${type} Spirit ${count}`,
            type: minionType,
            form: isSpirit ? type.toLowerCase() as any : undefined,
            hp: parseValue(stats.hp),
            maxHp: parseValue(stats.hp),
            ac: parseValue(stats.ac),
            speed: parseValue(stats.speed),
            attacks: stats.actions.map(a => ({
                name: a.name,
                toHit: 0, // Spell Attack Modifier needs to be calculated elsewhere or input. Default to 0 for now.
                damage: parseDamage(a.desc),
                damageType: a.desc.includes('necrotic') ? 'necrotic' : a.desc.includes('slashing') ? 'slashing' : 'piercing'
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
                                    data-testid="all-minions-clear-btn"
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
                    {/* Standard Minions */}
                    <h3 className="text-xs text-muted uppercase tracking-widest font-bold mb-2">Animate Dead</h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            onClick={() => handleAddMinion('Skeleton')}
                            className="flex items-center justify-center gap-2 bg-card-elevated/80 hover:bg-card-elevated border border-white/10 hover:border-white/30 p-3 rounded-xl transition-all group"
                            data-testid="add-minion-skeleton-btn"
                        >
                            <Skull size={18} className="text-muted group-hover:text-white transition-colors" />
                            <span className="font-display text-sm text-parchment group-hover:text-parchment-light transition-colors">Skeleton</span>
                        </button>
                        <button
                            onClick={() => handleAddMinion('Zombie')}
                            className="flex items-center justify-center gap-2 bg-card-elevated/80 hover:bg-card-elevated border border-white/10 hover:border-white/30 p-3 rounded-xl transition-all group"
                            data-testid="add-minion-zombie-btn"
                        >
                            <Biohazard size={18} className="text-muted group-hover:text-white transition-colors" />
                            <span className="font-display text-sm text-parchment group-hover:text-parchment-light transition-colors">Zombie</span>
                        </button>
                    </div>

                    {/* Summon Undead (Tasha's) */}
                    <h3 className="text-xs text-muted uppercase tracking-widest font-bold mb-2">Summon Undead (Tasha's)</h3>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <button
                            onClick={() => handleAddMinion('Ghostly')}
                            className="flex flex-col items-center justify-center gap-2 bg-blue-950/30 hover:bg-blue-900/40 border border-blue-500/20 hover:border-blue-400/40 p-3 rounded-xl transition-all group"
                            data-testid="add-minion-ghostly-btn"
                        >
                            <Skull size={16} className="text-blue-400/80 group-hover:text-blue-300 transition-colors" />
                            <span className="font-display text-xs text-blue-200/80 group-hover:text-blue-100 transition-colors">Ghostly</span>
                        </button>
                        <button
                            onClick={() => handleAddMinion('Putrid')}
                            className="flex flex-col items-center justify-center gap-2 bg-green-950/30 hover:bg-green-900/40 border border-green-500/20 hover:border-green-400/40 p-3 rounded-xl transition-all group"
                            data-testid="add-minion-putrid-btn"
                        >
                            <Biohazard size={16} className="text-green-400/80 group-hover:text-green-300 transition-colors" />
                            <span className="font-display text-xs text-green-200/80 group-hover:text-green-100 transition-colors">Putrid</span>
                        </button>
                        <button
                            onClick={() => handleAddMinion('Skeletal')}
                            className="flex flex-col items-center justify-center gap-2 bg-stone-800/50 hover:bg-stone-800 border border-stone-600/30 hover:border-stone-500/50 p-3 rounded-xl transition-all group"
                            data-testid="add-minion-skeletal-btn"
                        >
                            <Skull size={16} className="text-stone-400 group-hover:text-stone-300 transition-colors" />
                            <span className="font-display text-xs text-stone-300 group-hover:text-stone-200 transition-colors">Skeletal</span>
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
