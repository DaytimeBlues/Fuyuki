import { useState, lazy, Suspense } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { inventoryItemAdded, inventoryItemRemoved } from '../../store/slices/inventorySlice';
import { equipItem, unequipItem } from '../../store/slices/equipmentSlice';
import { InventoryItem, ArmorSlot } from '../../types';
import { Swords, Shield, Trash2, Plus, X, Target, Move } from 'lucide-react';

type InventoryTab = 'items' | 'armor' | 'weapons';

const ArmorView = lazy(() => import('./ArmorView').then(m => ({ default: m.ArmorView })));

export function WeaponsView() {
    const dispatch = useAppDispatch();
    const inventory = useAppSelector(state => state.inventory.inventory);
    const equipment = useAppSelector(state => state.equipment.equipped);
    const [activeTab, setActiveTab] = useState<InventoryTab>('weapons');

    const weaponItems = inventory.filter(item => item.type === 'weapon');
    const mainHandWeapon = equipment.mainHand;
    const offHandWeapon = equipment.offHand;

    // Get full weapon data from inventory for equipped items
    const getWeaponById = (itemId: string | undefined) => {
        if (!itemId) return null;
        return inventory.find(item => item.id === itemId);
    };

    const mainHandWeaponData = getWeaponById(mainHandWeapon?.itemId);
    const offHandWeaponData = getWeaponById(offHandWeapon?.itemId);

    const handleAddWeapon = () => {
        const newWeapon: InventoryItem = {
            id: `weapon_${Date.now()}`,
            name: 'New Weapon',
            type: 'weapon',
            weaponStats: {
                damage: '1d8',
                damageType: 'slashing',
                bonus: 0,
                properties: [],
            },
        };
        dispatch(inventoryItemAdded(newWeapon));
    };

    const handleEquipToMainHand = (weapon: InventoryItem) => {
        if (!weapon.id) return;
        dispatch(equipItem({ slot: 'mainHand', item: {
            itemId: weapon.id,
            name: weapon.name,
            cosmeticOnly: false,
            modifiers: [],
        }}));
    };

    const handleEquipToOffHand = (weapon: InventoryItem) => {
        if (!weapon.id) return;
        dispatch(equipItem({ slot: 'offHand', item: {
            itemId: weapon.id,
            name: weapon.name,
            cosmeticOnly: false,
            modifiers: [],
        }}));
    };

    const handleUnequipSlot = (slot: ArmorSlot) => {
        dispatch(unequipItem(slot));
    };

    const handleDeleteWeapon = (index: number) => {
        if (window.confirm('Delete this weapon?')) {
            dispatch(inventoryItemRemoved(index));
        }
    };

    const renderWeaponCard = (weapon: InventoryItem, index: number) => {
        const stats = weapon.weaponStats;
        if (!stats) return null;

        const isInMainHand = mainHandWeapon?.itemId === weapon.id;
        const isInOffHand = offHandWeapon?.itemId === weapon.id;

        return (
            <div
                key={index}
                className={`bg-card border rounded-xl p-4 transition-all ${isInMainHand || isInOffHand ? 'border-gold-dim/40 ring-1 ring-gold-dim/20' : 'border-white/10 hover:border-white/20'}`}
            >
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Swords size={16} className="text-gold-mid" />
                            <h3 className="font-display text-parchment">{weapon.name}</h3>
                            {stats.bonus && stats.bonus !== 0 && (
                                <span className="text-[10px] px-2 py-0.5 bg-accent text-bg-dark font-bold rounded">
                                    +{stats.bonus}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-3 text-sm text-muted">
                            <span>DMG: <span className="text-accent">{stats.damage}</span></span>
                            {stats.versatileDamage && (
                                <span title="Two-handed damage">
                                    2H: <span className="text-accent">{stats.versatileDamage}</span>
                                </span>
                            )}
                            <span>{stats.damageType}</span>
                            {stats.range && (
                                <span>Range: {stats.range.normal} ft</span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => handleEquipToMainHand(weapon)}
                            className={`p-2 rounded-lg border transition-all ${isInMainHand
                                ? 'bg-accent text-bg-dark border-accent'
                                : 'bg-bg-dark/40 border-white/10 hover:border-gold-dim/40 hover:text-gold-bright'
                            }`}
                            title="Equip to Main Hand"
                            aria-label="Equip to main hand"
                        >
                            <Move size={16} />
                        </button>
                        {!isInMainHand && (
                            <button
                                onClick={() => handleEquipToOffHand(weapon)}
                                className={`p-2 rounded-lg border transition-all ${isInOffHand
                                    ? 'bg-accent text-bg-dark border-accent'
                                    : 'bg-bg-dark/40 border-white/10 hover:border-gold-dim/40 hover:text-gold-bright'
                                }`}
                                title="Equip to Off Hand"
                                aria-label="Equip to off hand"
                            >
                                <Shield size={16} />
                            </button>
                        )}
                        {(isInMainHand || isInOffHand) && (
                            <button
                                onClick={() => handleUnequipSlot(isInMainHand ? 'mainHand' : 'offHand')}
                                className="p-2 hover:bg-red-900/20 rounded text-muted hover:text-red-500 transition-colors"
                                title="Unequip"
                                aria-label="Unequip"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Weapon Properties */}
                {stats.properties && stats.properties.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                        {stats.properties.map(prop => (
                            <span
                                key={prop}
                                className="text-[9px] px-2 py-0.5 bg-bg-dark/30 text-muted rounded border border-white/5 capitalize"
                            >
                                {prop.replace('-', ' ')}
                            </span>
                        ))}
                    </div>
                )}

                {/* Quick Stats */}
                <div className="flex gap-4 mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm">
                        <Target size={14} className="text-muted" />
                        <span className="text-muted">ATK:</span>
                        <span className="text-parchment">+{(stats.bonus || 0)}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <Swords className="w-6 h-6 text-gold-mid" />
                    <div>
                        <h2 className="font-display text-xl text-parchment tracking-widest uppercase">Weapons</h2>
                        <p className="text-[10px] text-muted font-japanese">武器</p>
                    </div>
                </div>

                {/* Tab Toggle */}
                <div className="flex gap-1 bg-bg-dark/40 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('items')}
                        className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'items' ? 'bg-accent text-bg-dark' : 'text-parchment hover:bg-white/5'}`}
                    >
                        Items
                    </button>
                    <button
                        onClick={() => setActiveTab('armor')}
                        className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'armor' ? 'bg-accent text-bg-dark' : 'text-parchment hover:bg-white/5'}`}
                    >
                        Armor
                    </button>
                    <button
                        onClick={() => setActiveTab('weapons')}
                        className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'weapons' ? 'bg-accent text-bg-dark' : 'text-parchment hover:bg-white/5'}`}
                    >
                        Weapons
                    </button>
                </div>
            </header>

            {activeTab === 'weapons' ? (
                /* Weapons List */
                <div className="space-y-4">
                    {/* Currently Equipped Section */}
                    {(mainHandWeaponData || offHandWeaponData) && (
                        <div className="bg-card-elevated/30 border border-gold-dim/20 rounded-xl p-4">
                            <h3 className="font-display text-sm text-gold-mid uppercase tracking-widest mb-3">Equipped</h3>
                            <p className="text-[10px] text-muted font-japanese mb-4">装備中</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mainHandWeaponData && (
                                    <div className="bg-card border border-gold-dim/30 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Swords size={14} className="text-gold-bright" />
                                            <span className="text-parchment font-medium">Main Hand</span>
                                        </div>
                                        <p className="text-sm text-parchment">{mainHandWeaponData.name}</p>
                                        {mainHandWeaponData.weaponStats && (
                                            <div className="text-xs text-muted mt-1">
                                                {mainHandWeaponData.weaponStats.damage} {mainHandWeaponData.weaponStats.damageType}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {offHandWeaponData && (
                                    <div className="bg-card border border-gold-dim/30 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Shield size={14} className="text-gold-bright" />
                                            <span className="text-parchment font-medium">Off Hand</span>
                                        </div>
                                        <p className="text-sm text-parchment">{offHandWeaponData.name}</p>
                                        {offHandWeaponData.weaponStats && (
                                            <div className="text-xs text-muted mt-1">
                                                {offHandWeaponData.weaponStats.damage} {offHandWeaponData.weaponStats.damageType}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Weapons Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {weaponItems.map((weapon, idx) => renderWeaponCard(weapon, idx))}
                    </div>

                    {/* Add Weapon Button */}
                    <button
                        onClick={handleAddWeapon}
                        className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-muted hover:text-parchment hover:border-white/40 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={18} />
                        <span className="font-display">Add Weapon</span>
                    </button>
                </div>
            ) : activeTab === 'armor' ? (
                /* Armor View - delegated to ArmorView component */
                <Suspense fallback={<div className="text-center py-12 text-muted">Loading...</div>}>
                    <ArmorView />
                </Suspense>
            ) : (
                /* Original Items View */
                <div className="space-y-3">
                    {inventory.filter(item => item.type !== 'weapon').map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-card border rounded-lg p-4 flex flex-col gap-3 group transition-all duration-300 border-white/10 hover:border-white/20"
                            data-testid={`inventory-item-${idx}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1">
                                    <h3 className="font-display text-parchment">{item.name}</h3>
                                    {item.description && (
                                        <p className="text-xs text-muted">{item.description}</p>
                                    )}
                                    {item.charges && (
                                        <span className="text-[10px] px-2 py-0.5 bg-cyan-900/20 text-cyan-400 rounded">
                                            {item.charges.current} / {item.charges.max} charges
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDeleteWeapon(idx)}
                                    className="p-1.5 hover:bg-red-900/20 rounded text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    data-testid={`item-delete-btn-${idx}`}
                                    title="Delete Item"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            {item.spells && item.spells.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                                    {item.spells.filter(Boolean).map(spellName => (
                                        <span
                                            key={spellName}
                                            className="text-[10px] px-2 py-1 bg-bg-dark/40 border border-white/10 rounded text-muted"
                                        >
                                            {spellName}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {inventory.filter(item => item.type !== 'weapon').length === 0 && (
                        <div className="text-center py-12 text-muted italic">
                            No items yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
