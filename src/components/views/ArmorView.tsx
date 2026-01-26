import { useRef, useState, memo } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectEquipment } from '../../store/selectors';
import { equipItem, unequipItem, toggleCosmeticOnly } from '../../store/slices/equipmentSlice';
import { ArmorSlot, EquippedItem, StatModifier } from '../../types';
import { Shield, Sword, Crown, Gem, X, Check, Eye, Lock, HelpCircle, type LucideIcon } from 'lucide-react';

type ArmorTab = 'doll' | 'list';

const SLOT_LABELS: Record<ArmorSlot, { label: string; icon: LucideIcon; ja: string }> = {
    head: { label: 'Head', icon: Crown, ja: '頭' },
    cloak: { label: 'Cloak', icon: Shield, ja: 'マント' },
    chest: { label: 'Chest', icon: Shield, ja: '胸部' },
    hands: { label: 'Hands', icon: Lock, ja: '手' },
    feet: { label: 'Feet', icon: Shield, ja: '足' },
    ring1: { label: 'Ring 1', icon: HelpCircle, ja: '指輪 1' },
    ring2: { label: 'Ring 2', icon: HelpCircle, ja: '指輪 2' },
    amulet: { label: 'Amulet', icon: Gem, ja: '護身符' },
    mainHand: { label: 'Main Hand', icon: Sword, ja: 'メイン' },
    offHand: { label: 'Off Hand', icon: Shield, ja: 'オフハンド' },
};

export const ArmorView = memo(function ArmorView() {
    const dispatch = useAppDispatch();
    const equipment = useAppSelector(selectEquipment);
    const [activeTab, setActiveTab] = useState<ArmorTab>('doll');
    const [editingSlot, setEditingSlot] = useState<ArmorSlot | null>(null);
    const [editorItem, setEditorItem] = useState<Partial<EquippedItem> | null>(null);
    const customItemCounter = useRef(0);

    const handleSlotClick = (slot: ArmorSlot) => {
        const equipped = equipment[slot];
        if (equipped) {
            setEditorItem(equipped);
            setEditingSlot(slot);
            return;
        }

        customItemCounter.current += 1;
        const newItem: EquippedItem = {
            itemId: `custom_${customItemCounter.current}`,
            name: '',
            cosmeticOnly: false,
            modifiers: [],
        };
        setEditorItem(newItem);
        setEditingSlot(slot);
    };

    // Helper to safely get editor item value
    const getEditorValue = <K extends keyof EquippedItem>(key: K, defaultValue: EquippedItem[K]): EquippedItem[K] => {
        return editorItem?.[key] ?? defaultValue;
    };

    // Helper to add a new modifier with proper typing
    const addNewModifier = () => {
        if (!editorItem) return;
        const currentModifiers: StatModifier[] = getEditorValue('modifiers', []);
        const newModifier: StatModifier = { stat: 'ac', value: 0, type: 'bonus' };
        setEditorItem({ ...editorItem, modifiers: [...currentModifiers, newModifier] });
    };

    const handleSaveSlot = () => {
        if (editingSlot && editorItem) {
            if (!editorItem.name) {
                // Remove from slot if name is empty
                dispatch(unequipItem(editingSlot));
            } else {
                dispatch(equipItem({ slot: editingSlot, item: editorItem as EquippedItem }));
            }
        }
        setEditingSlot(null);
        setEditorItem(null);
    };

    const handleUnequip = (slot: ArmorSlot) => {
        dispatch(unequipItem(slot));
    };

    const handleToggleCosmetic = (slot: ArmorSlot) => {
        dispatch(toggleCosmeticOnly(slot));
    };

    // Helper to update modifiers
    const handleModifierChange = (index: number, field: 'stat' | 'value' | 'type', value: StatModifier['stat'] | number | 'bonus' | 'set') => {
        if (!editorItem?.modifiers) return;
        const newModifiers = [...editorItem.modifiers];
        newModifiers[index] = { ...newModifiers[index], [field]: value };
        setEditorItem({ ...editorItem, modifiers: newModifiers });
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-gold-mid" />
                    <div>
                        <h2 className="font-display text-xl text-parchment tracking-widest uppercase">Armor</h2>
                        <p className="text-[10px] text-muted font-japanese">防具</p>
                    </div>
                </div>
                {/* Tab Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('doll')}
                        className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'doll' ? 'bg-accent text-bg-dark font-bold' : 'bg-card hover:bg-card-elevated text-parchment'}`}
                    >
                        Paper Doll
                    </button>
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'list' ? 'bg-accent text-bg-dark font-bold' : 'bg-card hover:bg-card-elevated text-parchment'}`}
                    >
                        List View
                    </button>
                </div>
            </header>

            {activeTab === 'doll' ? (
                /* Paper Doll View */
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left: Kitsune Silhouette */}
                    <div className="relative min-h-[400px] flex items-center justify-center">
                        {/* Simplified Kitsune Silhouette - SVG */}
                        <svg
                            viewBox="0 0 200 300"
                            className="w-full h-auto max-w-sm text-parchment/10"
                            fill="currentColor"
                        >
                            {/* Head */}
                            <ellipse cx="100" cy="45" rx="35" ry="40" />
                            {/* Ears */}
                            <polygon points="70,15 55,45 75,50" />
                            <polygon points="130,15 145,45 125,50" />
                            {/* Torso */}
                            <path d="M65 85 Q100 80 135 85 L140 160 Q100 170 60 160 Z" />
                            {/* Arms */}
                            <path d="M65 90 Q45 120 40 160" fill="none" strokeWidth="8" />
                            <path d="M135 90 Q155 120 160 160" fill="none" strokeWidth="8" />
                            {/* Legs */}
                            <path d="M80 165 L75 280" fill="none" strokeWidth="10" />
                            <path d="M120 165 L125 280" fill="none" strokeWidth="10" />
                            {/* Tail */}
                            <path d="M100 170 Q150 200 180 250 Q190 260 170 270" fill="none" strokeWidth="6" className="text-parchment/5" />
                        </svg>

                        {/* Slot Hotspots - Clickable areas on the silhouette */}
                        <button
                            onClick={() => handleSlotClick('head')}
                            className={`absolute top-[5%] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 transition-all hover:scale-110 ${equipment.head ? 'border-gold-bright bg-gold-bright/20' : 'border-white/20 bg-bg-dark/40 hover:border-white/40'}`}
                            aria-label="Head slot"
                        >
                            {equipment.head && <Crown size={20} className="text-gold-bright" />}
                        </button>

                        <button
                            onClick={() => handleSlotClick('chest')}
                            className={`absolute top-[30%] left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 transition-all hover:scale-110 ${equipment.chest ? 'border-gold-bright bg-gold-bright/20' : 'border-white/20 bg-bg-dark/40 hover:border-white/40'}`}
                            aria-label="Chest slot"
                        >
                            {equipment.chest && <Shield size={20} className="text-gold-bright" />}
                        </button>

                        <button
                            onClick={() => handleSlotClick('hands')}
                            className={`absolute top-[40%] left-[25%] w-12 h-12 rounded-full border-2 transition-all hover:scale-110 ${equipment.hands ? 'border-gold-bright bg-gold-bright/20' : 'border-white/20 bg-bg-dark/40 hover:border-white/40'}`}
                            aria-label="Hands slot"
                        >
                            {equipment.hands && <Lock size={20} className="text-gold-bright" />}
                        </button>

                        <button
                            onClick={() => handleSlotClick('feet')}
                            className={`absolute bottom-[5%] left-[35%] w-12 h-12 rounded-full border-2 transition-all hover:scale-110 ${equipment.feet ? 'border-gold-bright bg-gold-bright/20' : 'border-white/20 bg-bg-dark/40 hover:border-white/40'}`}
                            aria-label="Feet slot"
                        >
                            {equipment.feet && <Shield size={20} className="text-gold-bright" />}
                        </button>

                        {/* Accessory Slots - Bottom Right */}
                        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                            {(['ring1', 'ring2', 'amulet', 'cloak'] as ArmorSlot[]).map(slot => (
                                <button
                                    key={slot}
                                    onClick={() => handleSlotClick(slot)}
                                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 flex items-center justify-center ${equipment[slot] ? 'border-gold-bright bg-gold-bright/20' : 'border-white/20 bg-bg-dark/40 hover:border-white/40'}`}
                                    aria-label={`${SLOT_LABELS[slot].label} slot`}
                                >
                                    {equipment[slot] && <Eye size={14} className="text-gold-bright" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Equipped Items List */}
                    <div className="space-y-3">
                        <h3 className="font-display text-sm text-parchment uppercase tracking-widest mb-4">Equipped Items</h3>
                        <p className="text-[10px] text-muted font-japanese mb-4">装備品</p>

                        {(Object.entries(equipment) as [ArmorSlot, EquippedItem | null][]).map(([slot, item]) => {
                            if (!item) return null;
                            const slotInfo = SLOT_LABELS[slot];
                            return (
                                <div
                                    key={slot}
                                    className={`bg-card border rounded-lg p-4 transition-all ${item.cosmeticOnly ? 'border-white/10' : 'border-gold-dim/30 ring-1 ring-gold-dim/20'}`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <slotInfo.icon size={16} className="text-gold-mid" />
                                                <h4 className="font-display text-parchment">{item.name}</h4>
                                                {item.cosmeticOnly && (
                                                    <span className="text-[9px] px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                                                        Cosmetic
                                                    </span>
                                                )}
                                            </div>
                                            {item.description && (
                                                <p className="text-xs text-muted mb-2">{item.description}</p>
                                            )}
                                            {item.modifiers.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {item.modifiers.map((mod, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-[9px] px-2 py-0.5 bg-gold-mid/10 text-gold-bright rounded border border-gold-dim/30"
                                                        >
                                                            {mod.stat === 'ac' && `AC ${mod.value > 0 ? '+' : ''}${mod.value}`}
                                                            {mod.stat === 'attackBonus' && `ATK ${mod.value > 0 ? '+' : ''}${mod.value}`}
                                                            {mod.stat === 'damageBonus' && `DMG ${mod.value > 0 ? '+' : ''}${mod.value}`}
                                                            {['str', 'dex', 'con', 'int', 'wis', 'cha'].includes(mod.stat) && `${mod.stat.toUpperCase()} ${mod.value > 0 ? '+' : ''}${mod.value}`}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleCosmetic(slot)}
                                                className={`text-[9px] px-2 py-1 rounded border transition-all ${item.cosmeticOnly ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 'bg-bg-dark/40 border-white/10 text-muted hover:text-white'}`}
                                                title="Toggle cosmetic only"
                                            >
                                                <Eye size={12} />
                                            </button>
                                            <button
                                                onClick={() => handleUnequip(slot)}
                                                className="p-2 hover:bg-red-900/20 rounded text-muted hover:text-red-500 transition-colors"
                                                title="Unequip"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* List View - All Slots */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(Object.keys(SLOT_LABELS) as ArmorSlot[]).map(slot => {
                        const slotInfo = SLOT_LABELS[slot];
                        const item = equipment[slot];
                        return (
                            <button
                                key={slot}
                                onClick={() => handleSlotClick(slot)}
                                className={`relative bg-card border rounded-xl p-6 transition-all hover:scale-105 group ${item ? 'border-gold-dim/40 ring-1 ring-gold-dim/20' : 'border-white/10 hover:border-white/20'}`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg transition-all ${item ? 'bg-gold-mid/20 text-gold-bright' : 'bg-bg-dark/40 text-muted group-hover:text-parchment'}`}>
                                        <slotInfo.icon size={24} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="font-display text-parchment text-sm">{slotInfo.label}</h3>
                                        <p className="text-[10px] text-muted font-japanese">{slotInfo.ja}</p>
                                    </div>
                                    {item && <Check size={16} className="text-gold-bright" />}
                                </div>
                                {item && (
                                    <div className="text-left">
                                        <p className="text-xs text-parchment font-medium">{item.name}</p>
                                        {item.cosmeticOnly && (
                                            <span className="text-[9px] text-purple-400">Cosmetic Only</span>
                                        )}
                                        {item.modifiers.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {item.modifiers.slice(0, 3).map((mod, idx) => (
                                                    <span key={idx} className="text-[9px] px-2 py-0.5 bg-gold-mid/10 text-gold-bright rounded">
                                                        {mod.stat === 'ac' && `+${mod.value} AC`}
                                                        {mod.stat !== 'ac' && `${mod.stat.toUpperCase()} ${mod.value > 0 ? '+' : ''}${mod.value}`}
                                                    </span>
                                                ))}
                                                {item.modifiers.length > 3 && (
                                                    <span className="text-[9px] px-2 py-0.5 bg-bg-dark/40 text-muted rounded">
                                                        +{item.modifiers.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {!item && (
                                    <p className="text-xs text-muted italic">Empty slot</p>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Slot Editor Modal */}
            {editingSlot && editorItem !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-void/95 backdrop-blur-md">
                    <div className="bg-card-elevated border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-display text-lg text-parchment">Edit {SLOT_LABELS[editingSlot].label}</h3>
                                <p className="text-[10px] text-muted font-japanese">{SLOT_LABELS[editingSlot].ja}</p>
                            </div>
                            <button
                                onClick={() => setEditingSlot(null)}
                                className="p-2 hover:bg-white/10 rounded text-muted hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Item Name */}
                            <div>
                                <label className="block text-xs font-bold text-muted uppercase mb-2">Item Name</label>
                                <input
                                    type="text"
                                    value={getEditorValue('name', '')}
                                    onChange={e => setEditorItem({ ...editorItem, name: e.target.value })}
                                    className="w-full bg-bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-parchment focus:border-gold-dim/40 focus:outline-none"
                                    placeholder="e.g., Cloak of Protection +1"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-muted uppercase mb-2">Description</label>
                                <textarea
                                    value={getEditorValue('description', '')}
                                    onChange={e => setEditorItem({ ...editorItem, description: e.target.value })}
                                    className="w-full bg-bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-parchment focus:border-gold-dim/40 focus:outline-none resize-none"
                                    rows={2}
                                    placeholder="Optional description..."
                                />
                            </div>

                            {/* Cosmetic Only Toggle */}
                            <div className="flex items-center justify-between p-3 bg-bg-dark/30 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2">
                                    <Eye size={16} className="text-muted" />
                                    <span className="text-sm text-parchment">Cosmetic Only</span>
                                </div>
                                    <button
                                        onClick={addNewModifier}
                                        className="w-full py-2 border-2 border-dashed border-white/20 rounded-lg text-muted hover:text-parchment hover:border-white/40 transition-all text-sm"
                                    >
                                        + Add Modifier
                                    </button>
                            </div>

                            {/* Modifiers */}
                            <div>
                                <label className="block text-xs font-bold text-muted uppercase mb-2">Stat Modifiers</label>
                                <div className="space-y-2">
                                    {(getEditorValue('modifiers', [])).map((mod, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <select
                                                value={mod.stat}
                                                onChange={e => handleModifierChange(idx, 'stat', e.target.value as StatModifier['stat'])}
                                                className="flex-1 bg-bg-dark/50 border border-white/10 rounded-lg px-3 py-2 text-parchment text-sm focus:border-gold-dim/40 focus:outline-none"
                                            >
                                                <option value="ac">Armor Class (AC)</option>
                                                <option value="attackBonus">Attack Bonus</option>
                                                <option value="damageBonus">Damage Bonus</option>
                                                <option value="saveDC">Save DC</option>
                                                <option value="str">Strength (STR)</option>
                                                <option value="dex">Dexterity (DEX)</option>
                                                <option value="con">Constitution (CON)</option>
                                                <option value="int">Intelligence (INT)</option>
                                                <option value="wis">Wisdom (WIS)</option>
                                                <option value="cha">Charisma (CHA)</option>
                                                <option value="speed">Speed</option>
                                                <option value="initiative">Initiative</option>
                                            </select>
                                            <select
                                                value={mod.type}
                                                onChange={e => handleModifierChange(idx, 'type', e.target.value as 'bonus' | 'set')}
                                                className="w-24 bg-bg-dark/50 border border-white/10 rounded-lg px-3 py-2 text-parchment text-sm focus:border-gold-dim/40 focus:outline-none"
                                            >
                                                <option value="bonus">Bonus (+/-)</option>
                                                <option value="set">Set to value</option>
                                            </select>
                                            <input
                                                type="number"
                                                value={mod.value}
                                                onChange={e => handleModifierChange(idx, 'value', parseInt(e.target.value) || 0)}
                                                className="w-20 bg-bg-dark/50 border border-white/10 rounded-lg px-3 py-2 text-parchment text-sm focus:border-gold-dim/40 focus:outline-none"
                                                placeholder="0"
                                            />
                                    <button
                                        onClick={() => {
                                            const newMods = [...(getEditorValue('modifiers', []))];
                                            newMods.splice(idx, 1);
                                            setEditorItem({ ...editorItem, modifiers: newMods });
                                        }}
                                        className="p-2 hover:bg-red-900/20 rounded text-muted hover:text-red-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => {
                                            if (editorItem) {
                                                const newMods: StatModifier[] = [...(editorItem.modifiers || []), { stat: 'ac', value: 0, type: 'bonus' }];
                                                setEditorItem({ ...editorItem, modifiers: newMods });
                                            }
                                        }}
                                        className="w-full py-2 border-2 border-dashed border-white/20 rounded-lg text-muted hover:text-parchment hover:border-white/40 transition-all text-sm"
                                    >
                                        + Add Modifier
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-white/10">
                                <button
                                    onClick={handleSaveSlot}
                                    className="flex-1 py-3 bg-accent text-bg-dark font-bold rounded-lg hover:opacity-90 transition-all"
                                >
                                    <Check size={18} className="inline mr-2" />
                                    Save
                                </button>
                                <button
                                    onClick={() => handleUnequip(editingSlot)}
                                    className="px-4 py-3 bg-bg-dark/40 border border-white/10 text-red-400 rounded-lg hover:bg-red-900/20 transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});
