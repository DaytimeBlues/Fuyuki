import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
    inventoryItemAdded,
    inventoryItemRemoved,
    itemChargeConsumed,
    itemEquipped
} from '../../store/slices/inventorySlice';
import { showToast as toastShown } from '../../store/slices/uiSlice';
import { castingStarted, slotConfirmed } from '../../store/slices/combatSlice';
import { InventoryItem } from '../../types';
import { Backpack, Trash2, Plus, Zap, Wand2, Swords as SwordsIcon, Shield, Search } from 'lucide-react';
import { spells } from '../../data/spells';
import { SRDBrowserModal } from '../modals/SRDBrowserModal';

export const InventoryView: React.FC = () => {
    const dispatch = useAppDispatch();
    const inventory = useAppSelector(state => state.inventory.inventory);
    const [isAdding, setIsAdding] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');
    const [newItemMaxCharges, setNewItemMaxCharges] = useState<number | ''>('');
    const [newItemSpells, setNewItemSpells] = useState('');

    const handleAddItem = () => {
        if (!newItemName.trim()) return;

        // Parse spells from comma-separated string
        const parsedSpells = newItemSpells
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

        const item: InventoryItem = {
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Auto-generate ID
            name: newItemName,
            description: newItemDesc,
            spells: parsedSpells.length > 0 ? parsedSpells : undefined,
        };

        if (newItemMaxCharges && typeof newItemMaxCharges === 'number') {
            item.charges = { current: newItemMaxCharges, max: newItemMaxCharges };
        }

        dispatch(inventoryItemAdded(item));
        setIsAdding(false);
        setNewItemName('');
        setNewItemDesc('');
        setNewItemMaxCharges('');
        setNewItemSpells('');
    };

    const handleUseCharge = (index: number) => {
        dispatch(itemChargeConsumed(index));
    };

    const handleCastFromItem = (index: number, spellName: string) => {
        // 1. Consume charge
        dispatch(itemChargeConsumed(index));

        // 2. Find spell
        const spell = spells.find(s => s.name === spellName) ||
            spells.find(s => s.name.toLowerCase() === spellName.toLowerCase());

        if (!spell) {
            dispatch(toastShown(`Unknown spell: ${spellName}`));
            return;
        }

        // 3. Initiate Casting (Combat Flow)
        const rollsLower = (spell.rolls ?? '').toLowerCase();
        const resolutionMode: 'attack' | 'save' | 'automatic' =
            rollsLower.includes('attack') ? 'attack' : rollsLower.includes('save') ? 'save' : 'automatic';

        dispatch(castingStarted({ spellId: spell.name }));
        dispatch(slotConfirmed({ slotLevel: spell.lvl, resolutionMode }));

        // Note: AppShell should handle navigation to 'combat' if activeTab is 'inventory' but that might need global nav state or simple toast
        dispatch(toastShown(`Casting ${spellName} from ${inventory[index].name}...`));
    };

    const handleDelete = (index: number) => {
        if (window.confirm('Delete this item?')) {
            dispatch(inventoryItemRemoved(index));
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-20">
            <header className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                    <Backpack className="w-6 h-6 text-stone-400" />
                    <h2 className="font-cinzel text-xl text-stone-200">Inventory</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded text-accent transition-colors"
                        data-testid="search-srd-btn"
                    >
                        <Search className="w-4 h-4" />
                        <span className="text-sm font-bold">Search DB</span>
                    </button>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300 transition-colors"
                        data-testid="add-item-btn"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-bold">Add Custom</span>
                    </button>
                </div>
            </header>

            {isAdding && (
                <div className="bg-stone-900 border border-stone-700 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Item Name</label>
                            <input
                                value={newItemName}
                                onChange={e => setNewItemName(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-yellow-900 focus:outline-none"
                                placeholder="Wand of Fireballs"
                                autoFocus
                                data-testid="item-name-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Description</label>
                            <input
                                value={newItemDesc}
                                onChange={e => setNewItemDesc(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-yellow-900 focus:outline-none"
                                placeholder="A gnarled wooden wand..."
                                data-testid="item-desc-input"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Max Charges</label>
                                <input
                                    type="number"
                                    value={newItemMaxCharges}
                                    onChange={e => setNewItemMaxCharges(parseInt(e.target.value) || '')}
                                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-yellow-900 focus:outline-none"
                                    placeholder="7"
                                    data-testid="item-charges-input"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Linked Spells</label>
                                <input
                                    value={newItemSpells}
                                    onChange={e => setNewItemSpells(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-yellow-900 focus:outline-none"
                                    placeholder="Fireball, Burning Hands"
                                    data-testid="item-spells-input"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-3 py-1 text-stone-500 hover:text-stone-300"
                                data-testid="item-cancel-btn"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddItem}
                                disabled={!newItemName.trim()}
                                className="px-4 py-1 btn-primary-action text-sm font-bold rounded disabled:opacity-50"
                                data-testid="item-create-btn"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-3">
                {inventory.length === 0 && !isAdding && (
                    <div className="text-center py-12 text-stone-600 italic">
                        Your backpack is empty.
                    </div>
                )}

                {inventory.map((item, idx) => (
                    <div
                        key={idx}
                        className={`bg-stone-900/40 border rounded-lg p-4 flex flex-col gap-3 group transition-all duration-300 ${item.equipped ? 'border-accent shadow-accent-subtle' : 'border-stone-800 hover:border-stone-700'
                            }`}
                        data-testid={`inventory-item-${idx}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                    {item.type === 'weapon' && <SwordsIcon size={14} className="text-accent" />}
                                    {item.type === 'armor' && <Shield size={14} className="text-blue-400" />}
                                    <h3 className={`font-display tracking-tight ${item.equipped ? 'text-white' : 'text-stone-300'}`}>
                                        {item.name}
                                    </h3>
                                    {item.charges && (
                                        <span className="text-[10px] font-mono bg-stone-950 px-2 py-0.5 rounded text-cyan-500 border border-cyan-900/30">
                                            {item.charges.current} / {item.charges.max}
                                        </span>
                                    )}
                                </div>
                                {item.description && (
                                    <p className="text-xs text-stone-500 font-sans">{item.description}</p>
                                )}

                                {/* Item Stats Display */}
                                <div className="flex gap-3 pt-1">
                                    {item.weaponStats && (
                                        <div className="flex items-center gap-1.5 bg-stone-950/50 px-2 py-0.5 rounded border border-white/5">
                                            <span className="text-[10px] text-muted uppercase tracking-tighter">DMG:</span>
                                            <span className="text-[11px] text-accent font-display">{item.weaponStats.damage}</span>
                                            <span className="text-[9px] text-muted italic">{item.weaponStats.damageType}</span>
                                        </div>
                                    )}
                                    {item.armorStats && (
                                        <div className="flex items-center gap-1.5 bg-stone-950/50 px-2 py-0.5 rounded border border-white/5">
                                            <span className="text-[10px] text-muted uppercase tracking-tighter">BASE AC:</span>
                                            <span className="text-[11px] text-blue-400 font-display">{item.armorStats.baseAC}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-1">
                                    {(item.type === 'weapon' || item.type === 'armor') && (
                                        <button
                                            onClick={() => dispatch(itemEquipped(idx))}
                                            className={`text-[10px] px-2 py-1 rounded border transition-all uppercase tracking-widest font-bold ${item.equipped
                                                ? 'bg-accent text-bg-dark border-accent ring-2 ring-accent/20'
                                                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white hover:border-white/20'
                                                }`}
                                        >
                                            {item.equipped ? 'Equipped' : 'Equip'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(idx)}
                                        className="p-1.5 hover:bg-red-900/20 rounded text-stone-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        data-testid={`item-delete-btn-${idx}`}
                                        title="Delete Item"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {item.charges && item.charges.current > 0 && !item.spells?.length && (
                                    <button
                                        onClick={() => handleUseCharge(idx)}
                                        title="Use Charge"
                                        className="p-2 bg-cyan-900/10 hover:bg-cyan-900/20 rounded text-cyan-500 transition-colors border border-cyan-500/20"
                                        data-testid={`item-use-charge-btn-${idx}`}
                                    >
                                        <Zap className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Linked Spells */}
                        {item.spells && item.spells.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-800/50">
                                {item.spells.filter(Boolean).map(spellName => (
                                    <button
                                        key={spellName}
                                        onClick={() => handleCastFromItem(idx, spellName)}
                                        disabled={item.charges && item.charges.current <= 0}
                                        className={`
                                            text-[10px] px-2 py-1 rounded border transition-colors flex items-center gap-1
                                            ${(item.charges && item.charges.current <= 0)
                                                ? 'bg-stone-950 text-stone-600 border-stone-900 cursor-not-allowed'
                                                : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white hover:border-stone-500 hover:bg-stone-700'
                                            }
                                        `}
                                        title={item.charges ? `Cast ${spellName} (1 charge)` : `Cast ${spellName}`}
                                        data-testid={`cast-spell-${spellName.replace(/\s+/g, '-')}`}
                                    >
                                        <Wand2 size={12} />
                                        {spellName}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <SRDBrowserModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </div>
    );
};
