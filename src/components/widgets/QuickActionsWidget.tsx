import { Dice1, RefreshCw, Heart, Shield, Zap } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { hpChanged, longRestHealth } from '../../store/slices/healthSlice';
import { shortRestWarlock, longRestWarlock } from '../../store/slices/warlockSlice';
import { levelChanged } from '../../store/slices/statSlice';
import { showToast } from '../../store/slices/uiSlice';
import { HapticPresets } from '../../utils/haptics';
import { useState } from 'react';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function QuickActionsWidget() {
    const dispatch = useAppDispatch();
    const hp = useAppSelector(state => state.health.hp);
    const concentration = useAppSelector(state => state.health.concentration);
    const level = useAppSelector(state => state.stats.level);

    // Dialog State
    const [dialogConfig, setDialogConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        variant?: 'default' | 'destructive';
        confirmLabel?: string;
        onConfirm: () => void;
    } | null>(null);

    const closeDialog = () => setDialogConfig(null);

    const handleDamage = (amount: number) => {
        const newHP = Math.max(0, hp.current - amount);
        dispatch(hpChanged(newHP));
        HapticPresets.damageTaken();
    };

    const handleHeal = (amount: number) => {
        const newHP = Math.min(hp.max, hp.current + amount);
        dispatch(hpChanged(newHP));
        HapticPresets.healing();
    };

    const handleConcentrationCheck = () => {
        if (concentration) {
            const dc = Math.max(10, Math.floor(15 / 2));
            console.log(`CON Save DC ${dc} to maintain ${concentration}`);
        }
    };

    const handleShortRest = () => {
        dispatch(shortRestWarlock());
        dispatch(showToast("Short Rest Completed"));
        HapticPresets.healing();
    };

    // INTENT GATE: Long Rest
    const handleLongRest = () => {
        setDialogConfig({
            isOpen: true,
            title: 'Long Rest',
            message: 'Take a Long Rest? This will restore all hit points, spell slots, and ability uses. Current concentration will be broken.',
            confirmLabel: 'Rest',
            onConfirm: () => {
                dispatch(longRestHealth());
                dispatch(longRestWarlock());
                dispatch(showToast("Long Rest Completed"));
                HapticPresets.levelUp(); // Heavy haptic for long rest
                closeDialog();
            }
        });
    };

    // INTENT GATE: Level Up
    const handleLevelUp = () => {
        if (level < 20) {
            setDialogConfig({
                isOpen: true,
                title: 'Level Up',
                message: `Advance to Level ${level + 1}? This increases maximum HP and may unlock new features.`,
                confirmLabel: 'Level Up',
                onConfirm: () => {
                    dispatch(levelChanged(level + 1));
                    HapticPresets.levelUp();
                    closeDialog();
                }
            });
        }
    };

    return (
        <>
            <div className="grid grid-cols-4 gap-3">
                {/* Level Up - Now Gated */}
                <button onClick={handleLevelUp} className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-card-elevated/80 hover:bg-card-elevated border border-white/10 hover:border-white/30 transition-all row-span-2">
                    <Zap size={24} className="text-accent" />
                    <span className="text-[10px] font-display text-parchment mt-1">LEVEL UP</span>
                </button>

                {/* Damage & Heal */}
                <button onClick={() => handleDamage(10)} className="col-span-1 flex flex-col items-center justify-center p-3 rounded-lg bg-card-elevated/80 hover:bg-red-900/30 border border-white/10 hover:border-red-500/30 transition-all">
                    <Heart size={20} className="text-red-400" />
                    <span className="text-[10px] font-display text-parchment mt-1">-10 HP</span>
                </button>

                <button onClick={() => handleHeal(10)} className="col-span-1 flex flex-col items-center justify-center p-3 rounded-lg bg-card-elevated/80 hover:bg-green-900/30 border border-white/10 hover:border-green-500/30 transition-all">
                    <RefreshCw size={20} className="text-green-400" />
                    <span className="text-[10px] font-display text-parchment mt-1">+10 HP</span>
                </button>

                {/* Rest Options */}
                <button onClick={handleShortRest} className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-card-elevated/80 hover:bg-card-elevated border border-white/10 hover:border-white/30 transition-all">
                    <Dice1 size={20} className="text-blue-400" />
                    <span className="text-[10px] font-display text-parchment">SHORT</span>
                </button>

                <button onClick={handleLongRest} className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-card-elevated/80 hover:bg-card-elevated border border-white/10 hover:border-white/30 transition-all">
                    <div className="relative">
                        <RefreshCw size={20} className="text-accent" />
                        <div className="absolute inset-0 animate-pulse bg-accent/20 blur-lg rounded-full" />
                    </div>
                    <span className="text-[10px] font-display text-accent font-bold">LONG REST</span>
                </button>

                <button onClick={handleConcentrationCheck} disabled={!concentration} className="col-span-2 flex flex-row items-center justify-center gap-2 p-3 rounded-lg bg-card-elevated/80 hover:bg-card-elevated border border-white/10 hover:border-white/30 transition-all">
                    <Shield size={18} className={concentration ? "text-accent" : "text-muted"} />
                    <span className="text-[10px] font-display text-parchment">Check Concentration</span>
                </button>
            </div>

            {/* Global Dialog Instance */}
            {dialogConfig && (
                <ConfirmDialog
                    isOpen={dialogConfig.isOpen}
                    title={dialogConfig.title}
                    message={dialogConfig.message}
                    confirmLabel={dialogConfig.confirmLabel}
                    variant={dialogConfig.variant}
                    onConfirm={dialogConfig.onConfirm}
                    onCancel={closeDialog}
                />
            )}
        </>
    );
}
