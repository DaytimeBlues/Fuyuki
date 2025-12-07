import { Shield } from 'lucide-react';

interface ArmorClassWidgetProps {
    baseAC: number;
    dexMod: number; // Added: DEX modifier for Mage Armor calculation
    mageArmour: boolean;
    hasShield: boolean;
    onToggle: (key: 'mageArmour' | 'shield') => void;
}

export function ArmorClassWidget({ baseAC, dexMod, mageArmour, hasShield, onToggle }: ArmorClassWidgetProps) {
    // RAW: Mage Armor sets base AC to 13 + DEX (replaces worn armor, mutually exclusive)
    // Shield (spell) adds +5 AC (stacks with base)
    const mageArmorAC = 13 + dexMod;
    const effectiveBaseAC = mageArmour ? mageArmorAC : baseAC;
    const currentAC = effectiveBaseAC + (hasShield ? 5 : 0);

    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-accent" />
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
                            <span className="text-sm text-parchment group-hover:text-accent transition-colors">
                                Mage Armour
                            </span>
                            <span className="text-xs text-muted">(+2)</span>
                        </div>
                        <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${mageArmour
                                ? 'bg-accent border-accent'
                                : 'border-parchment-dark/50 hover:border-accent/50'
                                }`}
                        >
                            {mageArmour && <div className="w-2 h-2 rounded-sm bg-bg-dark" />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={mageArmour}
                            onChange={() => onToggle('mageArmour')}
                        />
                    </label>

                    {/* Shield Toggle */}
                    <label className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-parchment group-hover:text-accent transition-colors">
                                Shield
                            </span>
                            <span className="text-xs text-muted">(+5)</span>
                        </div>
                        <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${hasShield
                                ? 'bg-accent border-accent'
                                : 'border-parchment-dark/50 hover:border-accent/50'
                                }`}
                        >
                            {hasShield && <div className="w-2 h-2 rounded-sm bg-bg-dark" />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={hasShield}
                            onChange={() => onToggle('shield')}
                        />
                    </label>

                    {/* Base AC Note */}
                    <div className="text-xs text-muted pt-1 border-t border-parchment-dark/20">
                        Base AC: {baseAC}
                    </div>
                </div>
            </div>
        </div>
    );
}

