import { useAppSelector } from '../../store/hooks';
import { selectSpellAttackBonus, selectSpellSaveDC } from '../../store/slices/characterSlice';

interface CombatHUDProps {
    baseAC: number;
    dexMod: number;
    mageArmour: boolean;
    hasShield: boolean;
    concentrationSpell?: string | null;
}

export function CombatHUD({
    baseAC,
    dexMod,
    mageArmour,
    hasShield,
    concentrationSpell,
}: CombatHUDProps) {
    const spellSaveDC = useAppSelector(selectSpellSaveDC);
    const spellAttackBonus = useAppSelector(selectSpellAttackBonus);
    const activeConcentration = useAppSelector(state => state.combat.activeConcentration);

    const mageArmorAC = 13 + dexMod;
    const effectiveBaseAC = mageArmour ? mageArmorAC : baseAC;
    const currentAC = effectiveBaseAC + (hasShield ? 5 : 0);

    const concentrationName = activeConcentration?.spellName ?? concentrationSpell;
    const attackBonusLabel = spellAttackBonus >= 0 ? `+${spellAttackBonus}` : `${spellAttackBonus}`;
    const concentrationActive = Boolean(concentrationName);

    return (
        <div
            className={`fixed top-20 right-4 z-40 w-44 rounded-lg bg-black/70 backdrop-blur-md p-3 text-parchment shadow-lg sm:w-52 ${concentrationActive
                    ? 'glow-border border border-purple-400/40 shadow-[0_0_14px_rgba(168,85,247,0.35)]'
                    : 'border border-white/10'
                }`}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-display text-xs uppercase tracking-[0.2em] text-parchment-light">⚔️ Combat</span>
                {concentrationActive && (
                    <span className="text-[10px] uppercase tracking-widest text-purple-300">Concentrating</span>
                )}
            </div>

            <div className="mt-2 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted">DC</span>
                    <span className="font-display text-parchment-light">{spellSaveDC}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted">ATK</span>
                    <span className="font-display text-parchment-light">{attackBonusLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted">AC</span>
                    <span className="font-display text-parchment-light">{currentAC}</span>
                </div>
                {concentrationName && (
                    <div className="flex items-center gap-2 text-xs text-parchment-light">
                        <span>🔮</span>
                        <span className="truncate">{concentrationName}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
