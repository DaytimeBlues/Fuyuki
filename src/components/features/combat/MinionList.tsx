import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { minionAdded, allMinionsCleared, minionSelectors, Minion } from '../../../store/slices/combatSlice';
import { MinionCard } from './MinionCard';
import { Plus, Trash2, Skull } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Preset minion templates based on SRD stat blocks
const MINION_TEMPLATES: Record<string, Omit<Minion, 'id'>> = {
    skeleton: {
        name: 'Skeleton',
        type: 'skeleton',
        hp: 13,
        maxHp: 13,
        ac: 13,
        speed: 30,
        attacks: [
            { name: 'Shortsword', toHit: 4, damage: '1d6+2', damageType: 'piercing' },
            { name: 'Shortbow', toHit: 4, damage: '1d6+2', damageType: 'piercing' },
        ],
        conditions: [],
    },
    zombie: {
        name: 'Zombie',
        type: 'zombie',
        hp: 22,
        maxHp: 22,
        ac: 8,
        speed: 20,
        attacks: [
            { name: 'Slam', toHit: 3, damage: '1d6+1', damageType: 'bludgeoning' },
        ],
        conditions: [],
    },
    undead_spirit_ghostly: {
        name: 'Undead Spirit',
        type: 'undead_spirit',
        form: 'ghostly',
        hp: 30,
        maxHp: 30,
        ac: 11,
        speed: 40,
        attacks: [
            { name: 'Deathly Touch', toHit: 5, damage: '1d8+3', damageType: 'necrotic' },
        ],
        conditions: [],
    },
    undead_spirit_putrid: {
        name: 'Undead Spirit',
        type: 'undead_spirit',
        form: 'putrid',
        hp: 30,
        maxHp: 30,
        ac: 11,
        speed: 30,
        attacks: [
            { name: 'Rotting Claw', toHit: 5, damage: '1d6+3', damageType: 'slashing' },
        ],
        conditions: [],
    },
    undead_spirit_skeletal: {
        name: 'Undead Spirit',
        type: 'undead_spirit',
        form: 'skeletal',
        hp: 30,
        maxHp: 30,
        ac: 13,
        speed: 30,
        attacks: [
            { name: 'Grave Bolt', toHit: 5, damage: '2d4+3', damageType: 'necrotic' },
        ],
        conditions: [],
    },
};

/**
 * Container for all active minions with:
 * - Add Minion button (triggers Animate Dead / Summon Undead flow)
 * - Per-minion cards
 * - "Clear All" bulk action
 */
export const MinionList: React.FC = () => {
    const dispatch = useAppDispatch();
    const minions = useAppSelector(state => minionSelectors.selectAll(state.combat.minions));
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [expandedMinionId, setExpandedMinionId] = useState<string | null>(null);

    const handleAddMinion = (templateKey: string) => {
        const template = MINION_TEMPLATES[templateKey];
        if (template) {
            const newMinion: Minion = {
                ...template,
                id: uuidv4(),
            };
            dispatch(minionAdded(newMinion));
        }
        setShowAddMenu(false);
    };

    const handleClearAll = () => {
        if (confirm('Remove all minions?')) {
            dispatch(allMinionsCleared());
        }
    };

    const toggleExpand = (minionId: string) => {
        setExpandedMinionId(prev => prev === minionId ? null : minionId);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Skull className="w-5 h-5 text-green-500" />
                    <h3 className="font-cinzel text-lg text-stone-100">Undead Thralls</h3>
                    <span className="px-2 py-0.5 text-xs bg-stone-800 text-stone-400 rounded">
                        {minions.length}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {minions.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-stone-500 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-3 h-3" />
                            Clear All
                        </button>
                    )}

                    <div className="relative">
                        <button
                            onClick={() => setShowAddMenu(!showAddMenu)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-900/30 hover:bg-green-900/50 border border-green-800 rounded text-green-400 text-sm font-bold transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </button>

                        {/* Add Menu Dropdown */}
                        {showAddMenu && (
                            <div className="absolute right-0 top-full mt-2 z-30 w-48 bg-stone-900 border border-stone-700 rounded-lg shadow-xl overflow-hidden">
                                <div className="p-2 border-b border-stone-800 text-xs text-stone-500 uppercase tracking-wider">
                                    Animate Dead
                                </div>
                                <button
                                    onClick={() => handleAddMinion('skeleton')}
                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-stone-800 text-left text-stone-300"
                                >
                                    <span>💀</span> Skeleton
                                </button>
                                <button
                                    onClick={() => handleAddMinion('zombie')}
                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-stone-800 text-left text-stone-300"
                                >
                                    <span>🧟</span> Zombie
                                </button>

                                <div className="p-2 border-t border-b border-stone-800 text-xs text-stone-500 uppercase tracking-wider">
                                    Summon Undead
                                </div>
                                <button
                                    onClick={() => handleAddMinion('undead_spirit_ghostly')}
                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-stone-800 text-left text-stone-300"
                                >
                                    <span>👻</span> Ghostly Form
                                </button>
                                <button
                                    onClick={() => handleAddMinion('undead_spirit_putrid')}
                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-stone-800 text-left text-stone-300"
                                >
                                    <span>🧟</span> Putrid Form
                                </button>
                                <button
                                    onClick={() => handleAddMinion('undead_spirit_skeletal')}
                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-stone-800 text-left text-stone-300"
                                >
                                    <span>💀</span> Skeletal Form
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Minion Cards */}
            {minions.length > 0 ? (
                <div className="space-y-2">
                    {minions.map(minion => (
                        <MinionCard
                            key={minion.id}
                            minion={minion}
                            isExpanded={expandedMinionId === minion.id}
                            onToggleExpand={() => toggleExpand(minion.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-stone-600 italic border border-dashed border-stone-800 rounded-lg">
                    No undead thralls summoned.
                    <br />
                    <span className="text-xs">Cast Animate Dead or Summon Undead to add minions.</span>
                </div>
            )}
        </div>
    );
};
