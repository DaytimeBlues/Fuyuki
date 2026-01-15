import { Dice, RefreshCw, Heart, Shield, Zap } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { hpChanged, concentrationSet, shortRestCompleted, levelChanged } from '../../store/slices/characterSlice';
import { HapticPresets } from '../../utils/haptics';

export function QuickActionsWidget() {
    const dispatch = useAppDispatch();
    const hp = useAppSelector(state => state.character.hp);
    const concentration = useAppSelector(state => state.character.concentration);
    const level = useAppSelector(state => state.character.level);
    const abilityMods = useAppSelector(state => state.character.abilityMods);

    const handleDamage = (amount: number) => {
        dispatch(hpChanged(Math.max(0, hp.current - amount)));
        HapticPresets.damageTaken();
    };

    const handleHeal = (amount: number) => {
        dispatch(hpChanged(Math.min(hp.max, hp.current + amount)));
        HapticPresets.healing();
    };

    const handleConcentrationCheck = () => {
        if (concentration) {
            const con = abilityMods.con;
            const dc = Math.max(10, Math.floor(15 / 2));
            console.log('CON Save DC ' + dc + ' to maintain ' + concentration);
        }
    };

    const handleShortRest = () => {
        dispatch(shortRestCompleted());
        HapticPresets.healing();
    };

    const handleLevelUp = () => {
        if (level < 20) {
            dispatch(levelChanged(level + 1));
            HapticPresets.levelUp();
        }
    };

    return (
        <div className="grid grid-cols-5 gap-3">
            <button onClick={handleLevelUp} className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-card-elevated/80 hover:bg-card-elevated border border-white/10 hover:border-white/30 transition-all">
                <Zap size={20} className="text-muted" />
                <span className="text-[10px] font-display text-parchment">LEVEL UP</span>
            </button>

            <button onClick={() => handleDamage(10)} className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-card-elevated/80 hover:bg-card-elevated border border-white/10 hover:border-white/30 transition-all">
                <Heart size={20} className="text-red-400" />
                <span className="text-[10px] font-display text-parchment">10 DMG</span>
            </button>

            <button onClick={() => handleHeal(10)} className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-card-elevated/80 hover:bg-card-elevated border border-white/10 hover:border-white/30 transition-all">
                <RefreshCw size={20} className="text-green-400" />
                <span className="text-[10px] font-display text-parchment">+10 HEAL</span>
            </button>

            <button onClick={handleConcentrationCheck} disabled={!concentration} className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-card-elevated/80 hover:bg-card-elevated border border-white/10 hover:border-white/30 transition-all ${!concentration ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Shield size={20} className={concentration ? 'text-accent' : 'text-muted'} />
                <span className="text-[10px] font-display text-parchment">CONC. CHECK</span>
            </button>

            <button onClick={handleShortRest} className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-card-elevated/80 hover:bg-card-elevated border border-white/10 hover:border-white/30 transition-all">
                <Dice size={20} className="text-blue-400" />
                <span className="text-[10px] font-display text-parchment">SHORT REST</span>
            </button>
        </div>
    );
}
