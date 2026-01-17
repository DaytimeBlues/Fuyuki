import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpellSaveDC, selectSpellAttackBonus } from '../../../store/slices/characterSlice';
import { SpellV3 } from '../../../schemas/spellSchema';
import { Crosshair, Shield, Sparkles, Check, X } from 'lucide-react';

type SpellDecision = { level: number; summary: string };
type SpellDetailsLike = Partial<SpellV3> & {
    name: string;
    level: number;
    desc?: string;
    decisionTree?: SpellDecision[];
};

interface ResolutionPanelProps {
    spell: SpellDetailsLike;
    slotLevel: number;
    onHit?: () => void;
    onMiss?: () => void;
    onPass?: () => void;
    onFail?: () => void;
    onApply?: () => void;
    onCancel: () => void;
}

/**
 * Central panel displaying the resolution flow based on spell mode.
 * 
 * Physical Dice Mode: Shows formulas for the user to roll, then records outcome.
 * 
 * SRD 5.1 Resolution Patterns:
 * - Attack: "make a spell attack" → d20 + spell attack bonus vs AC
 * - Save: "target makes a saving throw" → target rolls vs Spell Save DC
 * - Automatic: No attack/save mentioned → effect applies directly
 */
export const ResolutionPanel: React.FC<ResolutionPanelProps> = ({
    spell,
    slotLevel,
    onHit,
    onMiss,
    onPass,
    onFail,
    onApply,
    onCancel,
}) => {
    const spellAttackBonus = useAppSelector(selectSpellAttackBonus);
    const spellSaveDC = useAppSelector(selectSpellSaveDC);

    const longDescription = spell.description || spell.desc || '';
    const decisionTree = spell.decisionTree ?? [];

    // Determine resolution mode
    const isAttackMode = spell.requiresAttackRoll;
    const isSaveMode = spell.requiresSavingThrow;
    const isAutoMode = !isAttackMode && !isSaveMode;

    // Calculate scaled damage if applicable
    const getScaledDamage = (): string | null => {
        if (!spell.damage || spell.damage.length === 0) return null;

        const dmg = spell.damage[0];
        let diceCount = dmg.count;

        // Apply scaling for upcasting
        if (dmg.scaling?.type === 'per_slot_level' && dmg.scaling.diceIncreasePerLevel) {
            const extraDice = (slotLevel - spell.level) * dmg.scaling.diceIncreasePerLevel;
            diceCount += extraDice;
        }

        return `${diceCount}d${dmg.sides} ${dmg.type}`;
    };

    const scaledDamage = getScaledDamage();

    return (
        <div className="card-parchment overflow-hidden shadow-2xl" data-testid="resolution-panel">
            {/* Header */}
            <div className="relative px-6 py-4 border-b border-gold-dim/10 bg-white/5">
                <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-display font-bold text-parchment-light tracking-wide uppercase">
                        {spell.name}
                    </h3>
                    <span className="text-xs font-japanese text-gold-dim opacity-50 tracking-widest">
                        レベル {spell.level || '0'}
                    </span>
                </div>
                {slotLevel > 0 && slotLevel > spell.level && (
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-1 h-1 rounded-full bg-accent" />
                        <span className="text-[10px] text-accent font-display tracking-wider uppercase">
                            Upcast / Level {slotLevel}
                        </span>
                    </div>
                )}
                {/* Decorative Accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold-dim/20" />
            </div>

            {/* Resolution Mode Content */}
            <div className="p-4 space-y-4">
                {/* Spell Description + Decision Tree */}
                {(longDescription || decisionTree.length > 0 || spell.higherLevelDescription) && (
                    <details className="bg-card-elevated/60 border border-white/10 rounded-lg p-3">
                        <summary className="cursor-pointer text-xs text-muted font-display tracking-wider uppercase">
                            Spell details
                        </summary>
                        <div className="mt-3 space-y-3">
                            {longDescription && (
                                <p className="text-sm text-parchment leading-relaxed whitespace-pre-wrap">
                                    {longDescription}
                                </p>
                            )}
                            {spell.higherLevelDescription && (
                                <div className="text-xs text-muted">
                                    <span className="font-display text-parchment-light">At Higher Levels:</span>{' '}
                                    <span className="text-parchment">{spell.higherLevelDescription}</span>
                                </div>
                            )}
                            {decisionTree.length > 0 && (
                                <div className="space-y-1">
                                    <div className="text-[10px] text-muted uppercase tracking-wider font-display">
                                        Decision Tree / Scaling
                                    </div>
                                    <ul className="list-disc pl-5 text-sm text-parchment">
                                        {decisionTree.map((d) => (
                                            <li key={`${d.level}-${d.summary}`}>
                                                <span className="text-parchment-light font-display">Lvl {d.level}:</span>{' '}
                                                {d.summary}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </details>
                )}

                {/* === ATTACK MODE === */}
                {isAttackMode && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-red-400">
                            <Crosshair className="w-6 h-6" />
                            <span className="text-lg font-bold uppercase tracking-wider">Spell Attack</span>
                        </div>

                        {/* Formula Display */}
                        <div className="bg-card-elevated rounded-lg p-4 text-center border border-white/10">
                            <div className="text-xs text-muted uppercase tracking-wider mb-2 font-display">Roll</div>
                            <div className="text-3xl font-mono font-bold text-white">
                                d20 + {spellAttackBonus}
                            </div>
                            <div className="text-sm text-muted mt-2">vs Target AC</div>
                        </div>

                        {scaledDamage && (
                            <div className="bg-card-elevated/60 border border-white/10 rounded-lg p-3 text-center">
                                <div className="text-xs text-muted uppercase tracking-wider mb-1 font-display">On Hit</div>
                                <div className="text-xl font-mono text-red-400">{scaledDamage}</div>
                            </div>
                        )}

                        {/* Outcome Buttons - Inkan Style */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <button
                                onClick={onHit}
                                className="group relative overflow-hidden h-16 rounded bg-stone-900 border border-stone-700 hover:border-moss transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-10" />
                                <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                                    <span className="text-2xl font-japanese text-moss group-hover:scale-110 transition-transform duration-300">命中</span>
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-moss/70">Hit</span>
                                </div>
                                {/* Stamp Effect */}
                                <div className="absolute -right-2 -bottom-2 w-8 h-8 opacity-0 group-hover:opacity-20 bg-moss rounded-full blur-lg transition-opacity duration-300" />
                            </button>

                            <button
                                onClick={onMiss}
                                className="group relative overflow-hidden h-16 rounded bg-stone-900 border border-stone-700 hover:border-stone-500 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-10" />
                                <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                                    <span className="text-2xl font-japanese text-stone-500 group-hover:text-stone-300 transition-colors duration-300">失敗</span>
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-stone-600">Miss</span>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* === SAVE MODE === */}
                {isSaveMode && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-blue-400">
                            <Shield className="w-6 h-6" />
                            <span className="text-lg font-bold uppercase tracking-wider">Saving Throw</span>
                        </div>

                        {/* Formula Display */}
                        <div className="bg-card-elevated rounded-lg p-4 text-center border border-white/10">
                            <div className="text-xs text-muted uppercase tracking-wider mb-2 font-display">
                                Target rolls {spell.savingThrowDetails?.ability || 'Dexterity'} Save
                            </div>
                            <div className="text-3xl font-mono font-bold text-white">
                                DC {spellSaveDC}
                            </div>
                        </div>

                        {scaledDamage && (
                            <div className="flex gap-3">
                                <div className="flex-1 bg-red-950/30 border border-red-900/30 rounded-lg p-3 text-center">
                                    <div className="text-xs text-muted uppercase tracking-wider mb-1 font-display">On Fail</div>
                                    <div className="text-lg font-mono text-red-400">{scaledDamage}</div>
                                </div>
                                <div className="flex-1 bg-card-elevated/60 border border-white/10 rounded-lg p-3 text-center">
                                    <div className="text-xs text-muted uppercase tracking-wider mb-1 font-display">On Pass</div>
                                    <div className="text-lg font-mono text-muted">
                                        {spell.savingThrowDetails?.onSuccess === 'half' ? 'Half Damage' : 'No Effect'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Outcome Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={onFail}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-800 rounded-lg text-red-400 font-bold uppercase tracking-wider transition-colors"
                            >
                                <X className="w-5 h-5" />
                                Failed Save
                            </button>
                            <button
                                onClick={onPass}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-900/30 hover:bg-green-900/50 border border-green-800 rounded-lg text-green-300 font-bold uppercase tracking-wider transition-colors"
                            >
                                <Check className="w-5 h-5" />
                                Passed Save
                            </button>
                        </div>
                    </div>
                )}

                {/* === AUTOMATIC MODE === */}
                {isAutoMode && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-purple-400">
                            <Sparkles className="w-6 h-6" />
                            <span className="text-lg font-bold uppercase tracking-wider">Automatic Effect</span>
                        </div>

                        <div className="bg-card-elevated rounded-lg p-4 text-center border border-white/10">
                            <div className="text-xs text-muted uppercase tracking-wider mb-2 font-display">No Roll Needed</div>
                            <div className="text-lg text-parchment-light">
                                Effect applies automatically
                            </div>
                        </div>

                        {scaledDamage && (
                            <div className="bg-purple-950/30 border border-purple-900/30 rounded-lg p-3 text-center">
                                <div className="text-xs text-muted uppercase tracking-wider mb-1 font-display">Damage</div>
                                <div className="text-xl font-mono text-purple-400">{scaledDamage}</div>
                            </div>
                        )}

                        <button
                            onClick={onApply}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-800 rounded-lg text-purple-300 font-bold uppercase tracking-wider transition-colors"
                        >
                            <Sparkles className="w-5 h-5" />
                            Apply Effect
                        </button>
                    </div>
                )}
            </div>

            {/* Footer / Cancel */}
            <div className="px-4 py-3 border-t border-white/10 bg-card-elevated/40">
                <button
                    onClick={onCancel}
                    className="w-full text-center text-muted hover:text-white text-sm font-bold uppercase tracking-wider transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
