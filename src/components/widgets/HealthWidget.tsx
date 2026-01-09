import { Skull, Minus, Plus, Shield } from 'lucide-react';
import { useState, memo, useCallback, useMemo } from 'react';

interface HealthWidgetProps {
    current: number;
    max: number;
    temp: number;
    onChange: (newCurrent: number) => void;
    onTempChange: (newTemp: number) => void;
}

export const HealthWidget = memo(function HealthWidget({ current, max, temp, onChange, onTempChange }: HealthWidgetProps) {
    const [tempInput, setTempInput] = useState('');
    
    // Memoize calculated values
    const percentage = useMemo(() => Math.min(100, Math.max(0, (current / max) * 100)), [current, max]);
    const isLow = useMemo(() => percentage <= 25, [percentage]);
    const isCritical = useMemo(() => current === 0, [current]);

    // RAW: THP doesn't stack - new THP replaces old (player chooses larger)
    const handleAddTemp = useCallback(() => {
        const newTemp = parseInt(tempInput) || 0;
        if (newTemp > temp) {
            onTempChange(newTemp);
        }
        setTempInput('');
    }, [tempInput, temp, onTempChange]);

    const handleIncrement = useCallback(() => onChange(current + 1), [onChange, current]);
    const handleDecrement = useCallback(() => onChange(current - 1), [onChange, current]);
    const handleClearTemp = useCallback(() => onTempChange(0), [onTempChange]);

    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
                <Skull size={18} className="text-white" />
                <h3 className="font-display text-sm text-parchment tracking-wider">Hit Points</h3>
                {temp > 0 && (
                    <span className="ml-auto text-xs bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/20">
                        +{temp} THP
                    </span>
                )}
            </div>

            <div className="flex items-center gap-6">
                {/* Circular HP Display */}
                <div className={`stat-circle ${isCritical ? 'border-red-500' : ''} ${isLow ? 'border-orange-500' : ''}`}>
                    <div className="text-center">
                        <span className={`font-display text-2xl ${isCritical ? 'text-red-400' : isLow ? 'text-orange-400' : 'text-parchment-light'}`}>
                            {current}
                        </span>
                        <span className="text-muted text-sm">/{max}</span>
                    </div>
                </div>

                {/* HP Bar and Controls */}
                <div className="flex-1">
                    {/* Progress Bar */}
                    <div className="h-2 bg-card-elevated rounded-full overflow-hidden mb-3 border border-white/10">
                        <div
                            className={`h-full transition-all duration-300 ease-out rounded-full ${isCritical ? 'bg-red-500' : isLow ? 'bg-orange-500' : 'bg-white'
                                }`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {/* +/- Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleDecrement}
                            className="btn-fantasy flex-1 flex items-center justify-center py-2"
                        >
                            <Minus size={16} />
                        </button>
                        <button
                            onClick={handleIncrement}
                            className="btn-fantasy flex-1 flex items-center justify-center py-2"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Temporary HP Section */}
            <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Shield size={14} className="text-white/70" />
                    <span className="text-xs text-muted">Temp HP</span>
                    <input
                        type="number"
                        min="0"
                        value={tempInput}
                        onChange={(e) => setTempInput(e.target.value)}
                        placeholder={temp.toString()}
                        className="flex-1 bg-card-elevated border border-white/10 rounded px-2 py-1 text-sm text-parchment w-16 text-center focus:outline-none focus:border-white/30"
                    />
                    <button
                        onClick={handleAddTemp}
                        className="btn-fantasy text-xs px-2 py-1"
                    >
                        Set
                    </button>
                    {temp > 0 && (
                        <button
                            onClick={handleClearTemp}
                            className="text-xs text-red-400 hover:text-red-300"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <p className="text-[10px] text-muted mt-1 opacity-60">
                    THP replaces (doesn't stack) • Absorbed before HP
                </p>
            </div>
        </div>
    );
});
