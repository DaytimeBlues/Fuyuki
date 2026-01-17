import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { arcanumUsed, arcanumRestored, selectArcanum, selectCharacter } from '../../store/slices/characterSlice';
import { Sparkles } from 'lucide-react';

export const ArcanumWidget: React.FC = () => {
    const dispatch = useAppDispatch();
    const arcanum = useAppSelector(selectArcanum);
    const { level } = useAppSelector(selectCharacter);

    // Only show if character is level 11+
    if (level < 11) return null;

    const availableLevels = ([6, 7, 8, 9] as const).filter(lvl => {
        if (lvl === 6) return level >= 11;
        if (lvl === 7) return level >= 13;
        if (lvl === 8) return level >= 15;
        if (lvl === 9) return level >= 17;
        return false;
    });

    return (
        <div className="card-parchment p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-accent">
                <Sparkles size={18} />
                <h3 className="text-sm font-kyoto uppercase tracking-widest">Mystic Arcanum</h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {availableLevels.map(lvl => {
                    const slot = arcanum[lvl];
                    const isUsed = slot?.used ?? false;

                    return (
                        <button
                            key={lvl}
                            onClick={() => isUsed ? dispatch(arcanumRestored(lvl)) : dispatch(arcanumUsed(lvl))}
                            className={`flex items-center justify-between p-2 rounded border transition-all ${isUsed
                                ? 'bg-bg-dark border-transparent text-muted'
                                : 'bg-card-elevated border-accent/20 text-text hover:border-accent/50'
                                }`}
                            data-testid={`arcanum-${lvl}`}
                        >
                            <span className="text-xs font-bold">{lvl}th</span>
                            <div
                                className={`w-2 h-2 rounded-full ${isUsed ? 'bg-bg' : 'bg-accent shadow-accent-sm'}`}
                                data-testid={`arcanum-orb-${lvl}`}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
