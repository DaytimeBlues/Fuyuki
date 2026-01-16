import { useAppSelector } from '../../store/hooks';
import { selectSpellAttackBonus, selectSpellSaveDC, selectCurrentAC } from '../../store/slices/characterSlice';
import { Swords } from 'lucide-react';

interface CombatHUDProps {
    concentrationSpell?: string | null;
}

export function CombatHUD({
    concentrationSpell,
}: CombatHUDProps) {
    const spellSaveDC = useAppSelector(selectSpellSaveDC);
    const spellAttackBonus = useAppSelector(selectSpellAttackBonus);
    const currentAC = useAppSelector(selectCurrentAC);
    const activeConcentration = useAppSelector(state => state.combat.activeConcentration);

    const concentrationName = activeConcentration?.spellName ?? concentrationSpell;
    const attackBonusLabel = spellAttackBonus >= 0 ? `+${spellAttackBonus}` : `${spellAttackBonus}`;
    const concentrationActive = Boolean(concentrationName);

    return (
        <div
            className={`fixed top-20 right-4 z-40 w-40 rounded border p-3 backdrop-blur-md transition-all sm:w-44 ${concentrationActive
                    ? 'border-accent/50 bg-bg-dark/80 shadow-[0_0_15px_rgba(201,162,39,0.2)]'
                    : 'border-white/10 bg-bg-dark/60'
                }`}
        >
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                <div className="flex items-center gap-2">
                    <Swords size={14} className="text-accent" />
                    <span className="font-kyoto text-[10px] uppercase tracking-[0.2em] text-parchment/80">Combat</span>
                </div>
            </div>

            <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-muted">DC</span>
                    <span className="font-display font-bold text-accent">{spellSaveDC}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-muted">ATK</span>
                    <span className="font-display font-bold text-accent">{attackBonusLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-muted">AC</span>
                    <span className="font-display font-bold text-parchment">{currentAC}</span>
                </div>

                {concentrationName && (
                    <div className="mt-2 pt-2 border-t border-white/5">
                        <div className="text-[9px] uppercase tracking-tighter text-accent/70 mb-0.5">Focusing</div>
                        <div className="text-[11px] font-kyoto text-parchment truncate">
                            {concentrationName}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

