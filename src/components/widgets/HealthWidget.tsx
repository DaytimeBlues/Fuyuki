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
    const [isDamaged, setIsDamaged] = useState(false);
    const [isHealing, setIsHealing] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);

    // Memoize calculated percentage for responsiveness
    const percentage = useMemo(() => Math.min(100, Math.max(0, (current / max) * 100)), [current, max]);
    const isCritical = current === 0;
    const isLow = current <= 10 && current > 0; // Red at 10 HP or below

    // Handle HP Change with Animation
    const handleHpChange = (newHp: number) => {
        setAnimationKey(prev => prev + 1);
        if (newHp < current) {
            setIsDamaged(true);
            setIsHealing(false);
            setTimeout(() => setIsDamaged(false), 400); // Match animation duration
        } else if (newHp > current) {
            setIsHealing(true);
            setIsDamaged(false);
            setTimeout(() => setIsHealing(false), 400);
        }
        onChange(newHp);
    };

    // RAW: THP doesn't stack - new THP replaces old (player chooses larger)
    const handleAddTemp = useCallback(() => {
        const newTemp = parseInt(tempInput) || 0;
        if (newTemp > temp) {
            onTempChange(newTemp);
        }
        setTempInput('');
    }, [tempInput, temp, onTempChange]);

    const handleClearTemp = useCallback(() => onTempChange(0), [onTempChange]);

    return (
        <div className={`card-parchment p-4 mb-4 transition-colors duration-200 ${isDamaged ? 'damage-taken' : ''}`}>
            <div className="flex items-center gap-2 mb-4">
                <Skull size={18} className="text-white" />
                <h3 className="font-display text-sm text-parchment tracking-wider">Hit Points</h3>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-white/40 font-display tracking-tighter border border-white/10" data-testid="app-ready">
                    ヒットポイント
                </span>
                {temp > 0 && (
                    <span className="ml-auto text-xs bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/20" data-testid="hp-temp-display">
                        +{temp} THP
                    </span>
                )}
            </div>

            <div className="flex items-center gap-6">
                {/* Circular HP Display */}
                <div className={`stat-circle ${isCritical ? 'border-red-500' : ''} ${isLow ? 'border-orange-500' : ''}`}>
                    <div className="text-center">
                        <span
                            key={animationKey}
                            className={`font-display text-2xl ${isCritical ? 'text-red-400' : isLow ? 'text-orange-400' : 'text-parchment-light'
                                } ${isDamaged ? 'animate-number-pop-damage' : isHealing ? 'animate-number-pop-heal' : ''}`}
                            data-testid="hp-current"
                        >
                            {current}
                        </span>
                        <span className="text-muted text-sm" data-testid="hp-max">/{max}</span>
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

                    {/* +/- Buttons with Signifiers */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleHpChange(current - 1)}
                            className="btn-fantasy flex-1 flex flex-col items-center justify-center py-2 h-14 active:bg-red-900/30 active:border-red-500/50 transition-colors"
                            data-testid="hp-decrease-btn"
                        >
                            <Minus size={20} className="mb-0.5" />
                            <span className="text-[8px] font-display text-muted uppercase tracking-widest leading-none">Damage</span>
                        </button>
                        <button
                            onClick={() => handleHpChange(current + 1)}
                            className="btn-fantasy flex-1 flex flex-col items-center justify-center py-2 h-14 active:bg-green-900/30 active:border-green-500/50 transition-colors"
                            data-testid="hp-increase-btn"
                        >
                            <Plus size={20} className="mb-0.5" />
                            <span className="text-[8px] font-display text-muted uppercase tracking-widest leading-none">Heal</span>
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
                        data-testid="hp-temp-input"
                    />
                    <button
                        onClick={handleAddTemp}
                        className="btn-fantasy text-xs px-2 py-1"
                        data-testid="hp-temp-set-btn"
                    >
                        Set
                    </button>
                    {temp > 0 && (
                        <button
                            onClick={handleClearTemp}
                            className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-2 py-1 rounded bg-red-900/20"
                            data-testid="hp-temp-clear-btn"
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
