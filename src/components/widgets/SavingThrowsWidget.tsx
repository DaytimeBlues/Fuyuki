import { Shield } from 'lucide-react';
import type { CharacterData } from '../../types';

interface SavingThrowsWidgetProps {
    abilityMods: CharacterData['abilityMods'];
    profBonus: number;
    savingThrowProficiencies: ('str' | 'dex' | 'con' | 'int' | 'wis' | 'cha')[];
}

export function SavingThrowsWidget({ abilityMods, profBonus, savingThrowProficiencies }: SavingThrowsWidgetProps) {
    const saves: { key: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'; label: string }[] = [
        { key: 'str', label: 'STR' },
        { key: 'dex', label: 'DEX' },
        { key: 'con', label: 'CON' },
        { key: 'int', label: 'INT' },
        { key: 'wis', label: 'WIS' },
        { key: 'cha', label: 'CHA' },
    ];

    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-white" />
                <h3 className="font-display text-sm text-parchment tracking-wider">SAVING THROWS</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {saves.map(({ key, label }) => {
                    const isProficient = savingThrowProficiencies.includes(key);
                    const abilityMod = abilityMods[key] || 0;
                    const total = abilityMod + (isProficient ? profBonus : 0);

                    return (
                        <div
                            key={key}
                            className={`p-3 rounded-lg border transition-all ${isProficient
                                    ? 'bg-white/5 border-white/20'
                                    : 'bg-card-elevated/60 border-white/10'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${isProficient
                                                ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]'
                                                : 'bg-white/20'
                                            }`}
                                    />
                                    <span
                                        className={`text-xs uppercase tracking-wider ${isProficient ? 'text-parchment-light font-display' : 'text-muted'
                                            }`}
                                    >
                                        {label}
                                    </span>
                                </div>
                                <span
                                    className={`font-display text-sm ${isProficient ? 'text-white' : 'text-muted'
                                        }`}
                                    data-testid={`saving-throw-${key}`}
                                >
                                    {total >= 0 ? '+' : ''}{total}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-[10px] text-muted opacity-60">
                    Proficient saves shown with • indicator
                </p>
            </div>
        </div>
    );
}
