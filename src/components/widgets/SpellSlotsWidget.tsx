import { Wand2 } from 'lucide-react';
import { memo } from 'react';

interface SpellSlotsWidgetProps {
    slots: { [level: number]: { used: number; max: number } };
    onChange: (level: number, used: number) => void;
    spellSaveDC?: number;
}

export const SpellSlotsWidget = memo(function SpellSlotsWidget({ slots, onChange, spellSaveDC = 14 }: SpellSlotsWidgetProps) {
    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Wand2 size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Spell Slots</h3>
                </div>
                <div className="text-xs text-muted">
                    Save DC <span className="text-white font-semibold">{spellSaveDC}</span>
                </div>
            </div>

            <div className="space-y-4">
                {Object.entries(slots).map(([level, { used, max }]) => (
                    <div key={level} className="flex items-center gap-4">
                        {/* Level Label */}
                        <div className="w-16">
                            <span className="text-xs text-parchment/70">Level</span>
                            <span className="font-display text-lg text-parchment-light ml-1">{level}</span>
                        </div>

                        {/* Orb Slots */}
                        <div className="flex-1 flex items-center gap-2">
                            {Array.from({ length: max }).map((_, i) => {
                                const isAvailable = i >= used;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            const newUsed = i < used ? i : i + 1;
                                            onChange(Number(level), newUsed);
                                        }}
                                        className={`transition-all duration-200 ${isAvailable ? 'orb' : 'orb-empty'}`}
                                        title={isAvailable ? 'Click to use' : 'Click to restore'}
                                        aria-label={`Level ${level} slot ${i + 1}, ${isAvailable ? 'available' : 'used'}`}
                                    />
                                );
                            })}
                        </div>

                        {/* Count Display */}
                        <div className="text-xs text-parchment/70 min-w-[40px] text-right">
                            <span className="text-parchment-light">{max - used}</span>/{max}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
