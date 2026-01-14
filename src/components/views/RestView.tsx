import { useState } from 'react';
import { Tent, Moon, Sun, Sparkles, ChevronRight, X } from 'lucide-react';
import { HitDiceWidget } from '../widgets/HitDiceWidget';
import type { HitDice } from '../../types';

interface RestViewProps {
    hitDice: HitDice;
    conMod: number;
    currentHP: number;
    maxHP: number;
    onSpendHitDie: (healed: number, diceSpent: number) => void;
    onShortRest: () => void;
    onLongRest: () => void;
}

export function RestView({ hitDice, conMod, currentHP, maxHP, onSpendHitDie, onShortRest, onLongRest }: RestViewProps) {
    const [showShortRest, setShowShortRest] = useState(false);

    if (showShortRest) {
        return (
            <div className="pb-20">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Sun size={24} className="text-white" />
                        <h2 className="font-display text-xl text-parchment-light tracking-wider">Short Rest</h2>
                    </div>
                    <button
                        onClick={() => setShowShortRest(false)}
                        className="p-2 text-muted hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* HP Status */}
                <div className="card-parchment p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">Current HP</span>
                        <span className="font-display text-xl text-white">
                            {currentHP} <span className="text-muted">/ {maxHP}</span>
                        </span>
                    </div>
                    <div className="h-2 bg-card-elevated rounded-full overflow-hidden mt-2 border border-white/10">
                        <div
                            className="h-full bg-white transition-all duration-300"
                            style={{ width: `${(currentHP / maxHP) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Hit Dice Widget */}
                <HitDiceWidget
                    hitDice={hitDice}
                    conMod={conMod}
                    currentHP={currentHP}
                    maxHP={maxHP}
                    onSpend={onSpendHitDie}
                />

                <div className="mt-8 flex flex-col gap-4">
                    <button
                        onClick={() => {
                            onShortRest();
                            setShowShortRest(false);
                        }}
                        className="w-full card-parchment p-4 text-center border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors"
                    >
                        <span className="font-kyoto uppercase tracking-[0.2em] text-accent">Finish Short Rest</span>
                    </button>

                    <p className="text-xs text-muted text-center opacity-60">
                        Pact Slots will be refilled upon finishing the rest.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20 flex flex-col items-center justify-center h-full min-h-[60vh]">
            <div className="text-center mb-10">
                <div className="relative inline-block mb-4">
                    <Tent size={48} className="text-parchment" />
                    <Sparkles size={16} className="text-white absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h2 className="font-display text-2xl text-parchment-light tracking-wider mb-2">Rest & Recovery</h2>
                <p className="text-sm text-muted max-w-xs mx-auto">
                    Choose a rest type to recover hit points and spell slots.
                </p>
            </div>

            <div className="w-full space-y-4">
                {/* Short Rest */}
                <button
                    onClick={() => setShowShortRest(true)}
                    className="w-full card-parchment p-5 text-left group transition-all hover:shadow-[0_0_20px_rgba(201,162,39,0.05)]"
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-card-elevated rounded-full border border-accent/10 group-hover:border-accent/30 transition-colors">
                            <Sun size={24} className="text-accent group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-kyoto text-lg text-parchment group-hover:text-white transition-colors tracking-widest uppercase">
                                Short Rest
                            </h3>
                            <p className="text-[10px] text-muted uppercase tracking-widest">
                                Spend Hit Dice to heal • {hitDice.current}/{hitDice.max} available
                            </p>
                        </div>
                        <ChevronRight size={20} className="text-muted group-hover:text-white transition-colors" />
                    </div>
                </button>

                {/* Long Rest */}
                <button
                    onClick={() => {
                        if (confirm("Take a Long Rest? This will reset HP, Pact Slots, Invocations, and recover Hit Dice.")) {
                            onLongRest();
                        }
                    }}
                    className="w-full card-parchment p-5 text-left group transition-all hover:shadow-[0_0_25px_rgba(201,162,39,0.08)]"
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-card-elevated rounded-full border border-accent/10 group-hover:border-accent/30 transition-colors">
                            <Moon size={24} className="text-accent group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-kyoto text-lg text-parchment group-hover:text-white transition-colors tracking-widest uppercase">
                                Long Rest
                            </h3>
                            <p className="text-[10px] text-muted uppercase tracking-widest">Full HP, Pact Slots, Invocations, ½ Hit Dice</p>
                        </div>
                        <ChevronRight size={20} className="text-muted group-hover:text-white transition-colors" />
                    </div>
                </button>
            </div>
        </div>
    );
}
