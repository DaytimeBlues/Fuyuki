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
                relative w-20 h-10 rounded-full border shadow-2xl overflow-hidden transition-all duration-500
                ${isCombat
                    ? 'bg-vermillion-ink border-vermillion/40 ring-1 ring-vermillion/20'
                    : 'bg-stone-900 border-gold-dim/30 ring-1 ring-gold-dim/10'}
            `}
            aria-label={`Switch to ${isCombat ? 'Roleplay' : 'Combat'} Mode`}
        >
            {/* Sliding Thumb */}
            <div
                className={`
                    absolute top-1 bottom-1 w-8 rounded-full shadow-lg flex items-center justify-center transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
                    ${isCombat ? 'left-[calc(100%-2.25rem)] bg-vermillion text-white' : 'left-1 bg-gold-mid text-bg-dark'}
                `}
            >
                {isCombat ? <Swords size={14} /> : <Feather size={14} />}
            </div>

            {/* Labels (Background) */}
            <div className="absolute inset-0 flex items-center justify-between px-3 text-[9px] font-display font-bold uppercase tracking-[0.2em] pointer-events-none">
                <span className={`transition-opacity duration-300 ${isCombat ? 'text-white/40' : 'text-gold-mid shadow-gold-mid/20'}`}>RP</span>
                <span className={`transition-opacity duration-300 ${!isCombat ? 'text-white/40' : 'text-white shadow-vermillion/20'}`}>CMBT</span>
            </div>
        </button>
    );
}

