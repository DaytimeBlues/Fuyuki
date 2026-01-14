import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { pactSlotUsed, pactSlotRestored, selectPactSlots } from '../../store/slices/characterSlice';
import { Wand2 } from 'lucide-react';

export const PactSlotsWidget: React.FC = () => {
    const dispatch = useAppDispatch();
    const { current, max, level } = useAppSelector(selectPactSlots);

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
        <div
            className="card-parchment p-4 flex flex-col gap-3 cursor-pointer active:scale-[0.98] transition-transform"
            onClick={handleUseSlot}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-accent">
                    <Wand2 size={18} />
                    <h3 className="text-sm font-kyoto uppercase tracking-widest">Pact Magic</h3>
                </div>
                <span className="text-xs font-medium text-muted">Level {level}</span>
            </div>

            <div className="flex flex-wrap gap-2 py-1">
                {Array.from({ length: max }).map((_, i) => (
                    <div
                        key={i}
                        className={`orb ${i >= current ? 'orb-empty' : 'animate-pulse-glow'}`}
                        onClick={(e) => i >= current ? handleRestoreSlot(e) : null}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-display font-bold text-text-bright">
                    {current}<span className="text-lg text-muted mx-1">/</span>{max}
                </span>
                <span className="text-[10px] text-muted uppercase tracking-tighter">
                    {current === 0 ? 'No Slots Left' : 'Tap to Use'}
                </span>
            </div>
        </div>
    );
};
