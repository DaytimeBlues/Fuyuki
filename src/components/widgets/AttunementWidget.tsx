import { Gem, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface AttunementWidgetProps {
    items: string[];
    onAdd: (item: string) => void;
    onRemove: (index: number) => void;
}

const MAX_ATTUNEMENT = 3;

// Common magic items for quick selection
const COMMON_ITEMS = [
    'Cloak of Protection',
    'Ring of Protection',
    'Amulet of Health',
    'Gauntlets of Ogre Power',
    'Headband of Intellect',
    'Belt of Giant Strength'
];

export function AttunementWidget({ items, onAdd, onRemove }: AttunementWidgetProps) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const slotsUsed = items.length;
    const canAdd = slotsUsed < MAX_ATTUNEMENT;

    const handleAdd = (item: string) => {
        if (canAdd && item.trim()) {
            onAdd(item.trim());
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Gem size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Attunement</h3>
                </div>
                <span className={`text-xs ${slotsUsed >= MAX_ATTUNEMENT ? 'text-red-400' : 'text-muted'}`}>
                    {slotsUsed}/{MAX_ATTUNEMENT}
                </span>
            </div>

            {/* Attuned Items */}
            <div className="space-y-2 mb-3">
                {items.length === 0 ? (
                    <p className="text-xs text-muted italic">No attuned items</p>
                ) : (
                    items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-white/10 border border-white/20 rounded px-3 py-2"
                        >
                            <span className="text-sm text-white">{item}</span>
                            <button
                                onClick={() => onRemove(index)}
                                className="text-red-400 hover:text-red-300"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add New Item */}
            {canAdd && (
                <div className="border-t border-white/10 pt-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Add magic item..."
                            className="flex-1 bg-card-elevated border border-white/10 rounded px-3 py-2 text-sm text-parchment focus:outline-none focus:border-white/30"
                        />
                        <button
                            onClick={() => handleAdd(inputValue)}
                            disabled={!inputValue.trim()}
                            className="btn-fantasy px-3 py-2 disabled:opacity-50"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {/* Quick Suggestions */}
                    {showSuggestions && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {COMMON_ITEMS.filter(i => !items.includes(i)).slice(0, 3).map(item => (
                                <button
                                    key={item}
                                    onClick={() => handleAdd(item)}
                                    className="text-[10px] px-2 py-1 bg-card-elevated border border-white/10 rounded text-muted hover:text-white hover:border-white/30 transition-colors"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {!canAdd && (
                <p className="text-[10px] text-red-400 mt-2">
                    Maximum attunement reached (3 items)
                </p>
            )}
        </div>
    );
}
