import { Wand2 } from 'lucide-react';

interface SpellSlotsWidgetProps {
    slots: { [level: number]: { used: number; max: number } };
    onChange: (level: number, used: number) => void;
}

export function SpellSlotsWidget({ slots, onChange }: SpellSlotsWidgetProps) {
    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Wand2 size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Spell Slots</h3>
                </div>
                <div className="text-xs text-muted">
                    Save DC <span className="text-white font-semibold">14</span>
                </div>
            </div>

            <div className="space-y-4">
                {Object.entries(slots).map(([level, { used, max }]) => (
                    <div key={level} className="flex items-center gap-4">
                        {/* Level Label */}
                        <div className="w-16">
                            <span className="text-xs text-muted">Level</span>
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
                                    />
                                );
                            })}
                        </div>

                        {/* Count Display */}
                        <div className="text-xs text-muted min-w-[40px] text-right">
                            <span className="text-white">{max - used}</span>/{max}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
