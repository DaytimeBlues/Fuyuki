import { Backpack, Plus, X, Wand2 } from 'lucide-react';
import { useState } from 'react';
import type { InventoryItem } from '../../types';

interface InventoryWidgetProps {
    items: InventoryItem[];
    onAdd: (item: InventoryItem) => void;
    onRemove: (index: number) => void;
    onCastSpell?: (spellName: string) => void;
}

function parseInventoryInput(input: string): InventoryItem {
    const trimmed = input.trim();

    // Simple wand syntax helpers:
    // - "Wand of Magic Missile" => spells: ["Magic Missile"]
    // - "Wand: Magic Missile, Shield" => spells: ["Magic Missile", "Shield"]
    const wandPrefixMatch = trimmed.match(/^wand\s*:\s*(.+)$/i);
    if (wandPrefixMatch) {
        const spells = wandPrefixMatch[1]
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        return { name: `Wand (${spells.join(', ')})`, spells: spells.length > 0 ? spells : undefined };
    }

    const wandOfMatch = trimmed.match(/^wand of\s+(.+)$/i);
    if (wandOfMatch) {
        const spellName = wandOfMatch[1].trim();
        return { name: trimmed, spells: spellName ? [spellName] : undefined };
    }

    return { name: trimmed };
}

export function InventoryWidget({ items, onAdd, onRemove, onCastSpell }: InventoryWidgetProps) {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = (raw: string) => {
        if (raw.trim()) {
            onAdd(parseInventoryInput(raw));
            setInputValue('');
        }
    };

    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Backpack size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Inventory</h3>
                </div>
                <span className="text-xs text-muted">
                    {items.length} Items
                </span>
            </div>

            {/* Inventory Items - Scrollable */}
            <div className="space-y-2 mb-3 max-h-60 overflow-y-auto pr-1">
                {items.length === 0 ? (
                    <p className="text-xs text-muted italic">Empty backpack...</p>
                ) : (
                    items.map((item, index) => (
                        <div
                            key={index}
                            className="bg-card-elevated border border-white/10 rounded px-3 py-2 group hover:border-white/30 transition-colors"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-parchment-light">{item.name}</span>
                                <button
                                    onClick={() => onRemove(index)}
                                    className="text-muted hover:text-red-400 opacity-60 group-hover:opacity-100 transition-all"
                                    aria-label="Remove item"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {item.spells && item.spells.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {item.spells.map(spellName => (
                                        <button
                                            key={spellName}
                                            onClick={() => onCastSpell?.(spellName)}
                                            className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 rounded text-parchment-light hover:text-white hover:border-white/30 transition-colors flex items-center gap-1"
                                            title={`Cast ${spellName}`}
                                        >
                                            <Wand2 size={12} />
                                            Cast {spellName}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add New Item */}
            <div className="border-t border-white/10 pt-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAdd(inputValue);
                        }}
                        placeholder="Add item..."
                        className="flex-1 bg-card-elevated border border-white/10 rounded px-3 py-2 text-sm text-parchment placeholder-muted focus:outline-none focus:border-white/30"
                    />
                    <button
                        onClick={() => handleAdd(inputValue)}
                        disabled={!inputValue.trim()}
                        className="btn-fantasy px-3 py-2 disabled:opacity-50"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
