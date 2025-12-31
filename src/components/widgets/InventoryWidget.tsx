import { Backpack, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface InventoryWidgetProps {
    items: string[];
    onAdd: (item: string) => void;
    onRemove: (index: number) => void;
}

export function InventoryWidget({ items, onAdd, onRemove }: InventoryWidgetProps) {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = (item: string) => {
        if (item.trim()) {
            onAdd(item.trim());
            setInputValue('');
        }
    };

    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Backpack size={18} className="text-amber-600" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Inventory</h3>
                </div>
                <span className="text-xs text-muted">
                    {items.length} Items
                </span>
            </div>

            {/* Inventory Items */}
            <div className="space-y-2 mb-3 max-h-60 overflow-y-auto pr-1">
                {items.length === 0 ? (
                    <p className="text-xs text-muted italic">Empty backpack...</p>
                ) : (
                    items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-card-elevated border border-parchment-dark/30 rounded px-3 py-2 group hover:border-accent/30 transition-colors"
                        >
                            <span className="text-sm text-parchment-light">{item}</span>
                            <button
                                onClick={() => onRemove(index)}
                                className="text-muted hover:text-red-400 opacity-60 group-hover:opacity-100 transition-all"
                                aria-label="Remove item"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add New Item */}
            <div className="border-t border-parchment-dark/20 pt-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAdd(inputValue);
                        }}
                        placeholder="Add item..."
                        className="flex-1 bg-card-elevated border border-parchment-dark/30 rounded px-3 py-2 text-sm text-parchment placeholder-muted focus:outline-none focus:border-accent/50"
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
