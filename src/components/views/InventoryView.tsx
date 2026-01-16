import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { inventoryItemAdded, inventoryItemRemoved, itemChargeConsumed, toastShown } from '../../store/slices/characterSlice';
import { castingStarted, slotConfirmed } from '../../store/slices/combatSlice';
import { InventoryItem } from '../../types';
import { Backpack, Trash2, Plus, Zap, Wand2 } from 'lucide-react';
import { spells } from '../../data/spells';

export const InventoryView: React.FC = () => {
    const dispatch = useAppDispatch();
    const inventory = useAppSelector(state => state.character.inventory);
    const [isAdding, setIsAdding] = useState(false);
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
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300 transition-colors"
                    data-testid="add-item-btn"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-bold">Add Item</span>
                </button>
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
                        className="bg-stone-900/40 border border-stone-800 rounded-lg p-4 flex flex-col gap-3 group hover:border-stone-700 transition-colors"
                        data-testid={`inventory-item-${idx}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h3 className="font-bold text-stone-300 flex items-center gap-2">
                                    {item.name}
                                    {item.charges && (
                                        <span className="text-xs font-mono bg-stone-950 px-2 py-0.5 rounded text-cyan-500 border border-cyan-900/30">
                                            {item.charges.current} / {item.charges.max}
                                        </span>
                                    )}
                                </h3>
                                {item.description && (
                                    <p className="text-sm text-stone-500">{item.description}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {item.charges && item.charges.current > 0 && !item.spells?.length && (
                                    <button
                                        onClick={() => handleUseCharge(idx)}
                                        title="Use Charge"
                                        className="p-2 hover:bg-stone-800 rounded text-cyan-500 transition-colors"
                                        data-testid={`item-use-charge-btn-${idx}`}
                                    >
                                        <Zap className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(idx)}
                                    className="p-2 hover:bg-red-900/20 rounded text-red-900 hover:text-red-500 transition-colors"
                                    data-testid={`item-delete-btn-${idx}`}
                                    title="Delete Item"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
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
        </div>
    );
};
