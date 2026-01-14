import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { inventoryItemAdded, inventoryItemRemoved, itemChargeConsumed } from '../../store/slices/characterSlice';
import { InventoryItem } from '../../types';
import { Backpack, Trash2, Plus, Zap } from 'lucide-react';
// import { spells } from '../../data/spells';

export const InventoryView: React.FC = () => {
    const dispatch = useAppDispatch();
    const inventory = useAppSelector(state => state.character.inventory);
    const [isAdding, setIsAdding] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');
    const [newItemMaxCharges, setNewItemMaxCharges] = useState<number | ''>('');

    const handleAddItem = () => {
        if (!newItemName.trim()) return;

        const item: InventoryItem = {
            name: newItemName,
            description: newItemDesc,
            spells: [], // TODO: UI for selecting spells
        };

        if (newItemMaxCharges && typeof newItemMaxCharges === 'number') {
            item.charges = { current: newItemMaxCharges, max: newItemMaxCharges };
        }

        dispatch(inventoryItemAdded(item));
        setIsAdding(false);
        setNewItemName('');
        setNewItemDesc('');
        setNewItemMaxCharges('');
    };

    const handleUseCharge = (index: number) => {
        dispatch(itemChargeConsumed(index));
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
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Description</label>
                            <input
                                value={newItemDesc}
                                onChange={e => setNewItemDesc(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-yellow-900 focus:outline-none"
                                placeholder="A gnarled wooden wand..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Max Charges (Optional)</label>
                            <input
                                type="number"
                                value={newItemMaxCharges}
                                onChange={e => setNewItemMaxCharges(parseInt(e.target.value) || '')}
                                className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-yellow-900 focus:outline-none"
                                placeholder="7"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-3 py-1 text-stone-500 hover:text-stone-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddItem}
                                disabled={!newItemName.trim()}
                                className="px-4 py-1 bg-yellow-900/50 hover:bg-yellow-900 text-yellow-500 rounded font-bold disabled:opacity-50"
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
                    <div key={idx} className="bg-stone-900/40 border border-stone-800 rounded-lg p-4 flex items-start justify-between group hover:border-stone-700 transition-colors">
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

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.charges && item.charges.current > 0 && (
                                <button
                                    onClick={() => handleUseCharge(idx)}
                                    title="User Charge"
                                    className="p-2 hover:bg-stone-800 rounded text-cyan-500 transition-colors"
                                >
                                    <Zap className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(idx)}
                                className="p-2 hover:bg-red-900/20 rounded text-red-900 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
