import React, { memo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { pactSlotUsed, pactSlotRestored } from '../../store/slices/warlockSlice';
import { selectPactSlots } from '../../store/selectors';
import { Wand2, Info } from 'lucide-react';

export const PactSlotsWidget = memo(function PactSlotsWidget() {
    const dispatch = useAppDispatch();
    const { current, max, level } = useAppSelector(selectPactSlots);
    const [showInfo, setShowInfo] = React.useState(false);

    const handleUseSlot = () => {
        if (current > 0) {
            dispatch(pactSlotUsed());
        }
    };

    const handleRestoreSlot = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (current < max) {
            dispatch(pactSlotRestored());
        }
    };

    return (
        <div className="card-parchment p-4 flex flex-col gap-3 relative animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-accent">
                    <Wand2 size={18} />
                    <h3 className="text-sm font-kyoto uppercase tracking-widest">Pact Magic</h3>
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="text-parchment/70 hover:text-white transition-colors ml-1"
                        aria-label="Pact Magic Info"
                    >
                        <Info size={12} />
                    </button>
                    {showInfo && (
                        <div className="absolute top-10 left-4 bg-stone-900 border border-stone-600 p-2 rounded text-[10px] text-stone-300 w-48 z-10 shadow-xl animate-in fade-in zoom-in-95">
                            Pact Magic slots recover on a Short Rest. They are always cast at level {level}.
                        </div>
                    )}
                </div>
                <span className="text-xs font-medium text-parchment/70">Level {level}</span>
            </div>

            {/* Fitts's Law: 48px Min Touch Target */}
            <div className="flex flex-wrap gap-2 py-1 justify-start">
                {Array.from({ length: max }).map((_, i) => {
                    const isUsed = i >= current;
                    return (
                        <button
                            key={i}
                            className={`w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 active:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 group`}
                            onClick={isUsed ? handleRestoreSlot : handleUseSlot}
                            aria-label={isUsed ? "Restore Pact Slot" : "Use Pact Slot"}
                            data-testid={`pact-slot-btn-${i}`}
                        >
                            <div
                                className={`orb transition-all duration-300 ${isUsed ? 'orb-empty scale-90 opacity-50' : 'animate-pulse-glow group-hover:scale-110'}`}
                                data-testid={`pact-slot-orb-${i}`}
                            />
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center justify-between mt-1 px-1">
                <span className="text-2xl font-display font-bold text-text-bright" data-testid="pact-slots-display">
                    {current}<span className="text-lg text-parchment/70 mx-1">/</span>{max}
                </span>
                <span className="text-[10px] text-parchment/70 uppercase tracking-tighter">
                    {current === 0 ? 'Short Rest needed' : 'Tap orb to cast'}
                </span>
            </div>
        </div>
    );
});
