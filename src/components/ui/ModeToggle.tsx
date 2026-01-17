import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleViewMode } from '../../store/slices/uiSlice';
import { Swords, Feather } from 'lucide-react';

export function ModeToggle() {
    const dispatch = useDispatch();
    const mode = useSelector((state: RootState) => state.ui.viewMode);
    const isCombat = mode === 'COMBAT';

    return (
        <button
            onClick={() => dispatch(toggleViewMode())}
            className={`
                relative w-16 h-8 rounded-full border border-white/10 shadow-inner overflow-hidden transition-colors duration-500
                ${isCombat ? 'bg-vermillion-ink/50 border-vermillion/30' : 'bg-bg-ink border-gold-dim/20'}
            `}
            aria-label={`Switch to ${isCombat ? 'Roleplay' : 'Combat'} Mode`}
        >
            {/* Sliding Thumb */}
            <div
                className={`
                    absolute top-1 bottom-1 w-6 rounded-full shadow-lg flex items-center justify-center transition-all duration-500 cubic-bezier(0.68, -0.55, 0.265, 1.55)
                    ${isCombat ? 'left-[calc(100%-1.75rem)] bg-vermillion text-white' : 'left-1 bg-gold-mid text-bg-dark'}
                `}
            >
                {isCombat ? <Swords size={12} /> : <Feather size={12} />}
            </div>

            {/* Labels (Background) */}
            <div className="absolute inset-0 flex items-center justify-between px-2 text-[8px] font-display uppercase tracking-widest text-muted/50 pointer-events-none">
                <span className={isCombat ? 'opacity-50' : 'opacity-0'}>RP</span>
                <span className={!isCombat ? 'opacity-50' : 'opacity-0'}>CMBT</span>
            </div>
        </button>
    );
}
