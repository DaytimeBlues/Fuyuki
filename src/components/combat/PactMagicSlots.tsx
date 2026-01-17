import { useState } from 'react';
import { Bolt, X, ChevronsUp, Fingerprint } from 'lucide-react';

interface PactMagicSlotsProps {
    slots: { level: number; max: number; used: number }[];
    onUseSlot: (level: number) => void;
    onRestoreSlot: (level: number) => void;
}

export function PactMagicSlots({ slots, onUseSlot, onRestoreSlot }: PactMagicSlotsProps) {
    const [primedSlot, setPrimedSlot] = useState<number | null>(null);

    const handleSlotClick = (level: number, isAvailable: boolean) => {
        if (!isAvailable) return;

        if (primedSlot === level) {
            // Confirm Use
            onUseSlot(level);
            setPrimedSlot(null);
        } else {
            // Prime
            setPrimedSlot(level);
        }
    };

    return (
        <div className="card-parchment p-5 shadow-2xl shadow-bg-void/50 border border-white/5 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <Bolt size={18} className="text-purp-bright" />
                    <h3 className="font-display text-sm text-parchment tracking-wider uppercase">Pact Magic</h3>
                </div>
                {primedSlot !== null && (
                    <button
                        onClick={() => setPrimedSlot(null)}
                        className="text-[10px] text-muted hover:text-white flex items-center gap-1 uppercase tracking-wide animate-fade-in"
                    >
                        <X size={12} /> Cancel
                    </button>
                )}
            </div>

            {/* Slots Grid */}
            <div className="space-y-6 relative z-10">
                {slots.map(slot => (
                    <div key={slot.level}>
                        <div className="flex items-baseline justify-between mb-2">
                            <div className="text-xs text-muted uppercase tracking-widest font-mono">Level {slot.level}</div>
                            <div className="text-[10px] text-gold-dim font-japanese opacity-50">呪文枠</div>
                        </div>

                        <div className="flex gap-4">
                            {Array.from({ length: slot.max }).map((_, i) => {
                                const isUsed = i < slot.used;
                                const isPrimed = primedSlot === slot.level && !isUsed;
                                const isAvailable = !isUsed;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleSlotClick(slot.level, isAvailable)}
                                        disabled={isUsed && primedSlot !== slot.level}
                                        className={`
                                            relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                                            ${isUsed
                                                ? 'bg-bg-dark border border-white/5 opacity-50 cursor-not-allowed grayscale'
                                                : 'cursor-pointer hover:scale-110 active:scale-95'
                                            }
                                            ${isPrimed
                                                ? 'bg-vermillion-ink border-2 border-vermillion shadow-[0_0_15px_rgba(255,100,100,0.5)] animate-pulse-fast'
                                                : isAvailable ? 'bg-bg-ink border border-purp-dim shadow-inner' : ''
                                            }
                                        `}
                                    >
                                        {/* Orb Content */}
                                        {isAvailable && !isPrimed && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purp-dim to-bg-void opacity-80" />
                                        )}

                                        {/* Primed Icon */}
                                        {isPrimed && (
                                            <Fingerprint size={20} className="text-white animate-ping-slow" />
                                        )}

                                        {/* Used Icon */}
                                        {isUsed && (
                                            <div className="w-8 h-8 rounded-full bg-bg-void inset-shadow-black" />
                                        )}
                                    </button>
                                );
                            })}

                            {/* Restore Button (Small, discreet) */}
                            {slot.used > 0 && (
                                <button
                                    onClick={() => onRestoreSlot(slot.level)}
                                    className="ml-auto w-8 h-12 rounded-full border border-white/5 hover:border-gold-mid/30 flex items-center justify-center text-muted hover:text-gold-mid transition-all"
                                    title="Restore Slot"
                                >
                                    <ChevronsUp size={14} />
                                </button>
                            )}
                        </div>

                        {/* Confirmation Tip */}
                        {primedSlot === slot.level && (
                            <div className="mt-2 text-center text-[10px] text-vermillion font-bold uppercase tracking-widest animate-slide-up">
                                Tap again to Cast
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Ambient Background Effect */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purp-dim/5 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}
