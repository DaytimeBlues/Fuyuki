import { Shield } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';

interface ArmorClassWidgetProps {
    baseAC: number;
    dexMod: number; // Added: DEX modifier for Mage Armor calculation
    mageArmour: boolean;
    hasShield: boolean;
    onToggle: (key: 'mageArmour' | 'shield') => void;
}

export const ArmorClassWidget = memo(function ArmorClassWidget({ baseAC, dexMod, mageArmour, hasShield, onToggle }: ArmorClassWidgetProps) {
    // RAW: Mage Armor sets base AC to 13 + DEX (replaces worn armor, mutually exclusive)
    // Shield (spell) adds +5 AC (stacks with base)
    const mageArmorAC = useMemo(() => 13 + dexMod, [dexMod]);
    const effectiveBaseAC = useMemo(() => mageArmour ? mageArmorAC : baseAC, [mageArmour, mageArmorAC, baseAC]);
    const currentAC = useMemo(() => effectiveBaseAC + (hasShield ? 5 : 0), [effectiveBaseAC, hasShield]);

    const handleToggleMageArmour = useCallback(() => onToggle('mageArmour'), [onToggle]);
    const handleToggleShield = useCallback(() => onToggle('shield'), [onToggle]);

    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-white" />
                <h3 className="font-display text-sm text-parchment tracking-wider">Armor Class</h3>
            </div>

            <div className="flex items-center gap-6">
                {/* Circular AC Display */}
                <div className="stat-circle">
                    <div className="text-center">
                        <span className="font-display text-3xl text-parchment-light">{currentAC}</span>
                    </div>
                </div>

                {/* AC Modifiers */}
                <div className="flex-1 space-y-3">
                    {/* Mage Armour Toggle */}
                    <label className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-parchment group-hover:text-white transition-colors">
                                Mage Armour
                            </span>
                            <span className="text-xs text-muted">(+2)</span>
                        </div>
                        <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${mageArmour
                                ? 'bg-white border-white'
                                : 'border-white/30 hover:border-white/50'
                                }`}
                        >
                            {mageArmour && <div className="w-2 h-2 rounded-sm bg-bg-dark" />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={mageArmour}
                            onChange={handleToggleMageArmour}
                        />
                    </label>

                    {/* Shield Toggle */}
                    <label className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-parchment group-hover:text-white transition-colors">
                                Shield
                            </span>
                            <span className="text-xs text-muted">(+5)</span>
                        </div>
                        <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${hasShield
                                ? 'bg-white border-white'
                                : 'border-white/30 hover:border-white/50'
                                }`}
                        >
                            {hasShield && <div className="w-2 h-2 rounded-sm bg-bg-dark" />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={hasShield}
                            onChange={handleToggleShield}
                        />
                    </label>

                    {/* Base AC Note */}
                    <div className="text-xs text-muted pt-1 border-t border-white/10">
                        Base AC: {baseAC}
                    </div>
                </div>
            </div>
        </div>
    );
});
