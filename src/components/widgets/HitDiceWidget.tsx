import { Dices, Heart } from 'lucide-react';
import { useState } from 'react';
import type { HitDice } from '../../types';

interface HitDiceWidgetProps {
    hitDice: HitDice;
    conMod: number;
    currentHP: number;
    maxHP: number;
    onSpend: (healed: number, diceSpent: number) => void;
}

export function HitDiceWidget({ hitDice, conMod, currentHP, maxHP, onSpend }: HitDiceWidgetProps) {
    const [lastRoll, setLastRoll] = useState<{ roll: number; total: number } | null>(null);
    const canSpend = hitDice.current > 0 && currentHP < maxHP;

    const rollHitDie = () => {
        if (!canSpend) return;

        // Roll the hit die
        const roll = Math.floor(Math.random() * hitDice.size) + 1;
        // RAW: Healing = roll + CON mod (minimum 0 per die, but total can't go below 0)
        const healing = Math.max(0, roll + conMod);
        // Cap healing at missing HP
        const actualHealing = Math.min(healing, maxHP - currentHP);

        setLastRoll({ roll, total: healing });
        onSpend(actualHealing, 1);

        // Clear the roll display after 3 seconds
        setTimeout(() => setLastRoll(null), 3000);
    };

    return (
        <div className="card-parchment p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Dices size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Hit Dice</h3>
                </div>
                <span className={`text-xs ${hitDice.current === 0 ? 'text-red-400' : 'text-muted'}`}>
                    {hitDice.current}/{hitDice.max} d{hitDice.size}
                </span>
            </div>

            {/* Visual Hit Dice */}
            <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: hitDice.max }).map((_, i) => {
                    const isAvailable = i < hitDice.current;
                    return (
                        <div
                            key={i}
                            className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-display transition-all ${
                                isAvailable
                                    ? 'bg-white/10 border-white/30 text-white'
                                    : 'bg-transparent border-white/10 text-muted'
                            }`}
                        >
                            d{hitDice.size}
                        </div>
                    );
                })}
            </div>

            {/* Roll Result */}
            {lastRoll && (
                <div className="bg-white/10 border border-white/20 rounded-lg p-3 mb-3 animate-scale-in">
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-muted text-sm">Rolled</span>
                        <span className="font-display text-2xl text-white">{lastRoll.roll}</span>
                        <span className="text-muted text-sm">+ {conMod} CON =</span>
                        <div className="flex items-center gap-1">
                            <Heart size={16} className="text-white" />
                            <span className="font-display text-2xl text-white">{lastRoll.total}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Spend Button */}
            <button
                onClick={rollHitDie}
                disabled={!canSpend}
                className={`w-full btn-fantasy py-3 flex items-center justify-center gap-2 ${
                    !canSpend ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                <Dices size={16} />
                {currentHP >= maxHP ? 'HP Full' : hitDice.current === 0 ? 'No Hit Dice' : 'Spend Hit Die'}
            </button>

            <p className="text-[10px] text-muted mt-2 text-center opacity-60">
                Roll d{hitDice.size} + {conMod} CON mod to heal
            </p>
        </div>
    );
}
