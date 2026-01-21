import React, { useState } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpellSaveDC, selectSpellAttackBonus, selectAbilityModifier } from '../../../store/selectors';
import { Zap, Shield, Award, Brain } from 'lucide-react';

interface StatBlockProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    formula?: string;
    color: string;
}

const StatBlock: React.FC<StatBlockProps> = ({ icon, label, value, formula, color }) => {
    const [showFormula, setShowFormula] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => formula && setShowFormula(!showFormula)}
                className={`
                    flex flex-col items-center p-2 rounded-lg transition-all
                    bg-stone-900 border border-stone-800 hover:border-stone-700
                    ${formula ? 'cursor-pointer' : 'cursor-default'}
                `}
            >
                <div className={`${color} mb-1`}>{icon}</div>
                <div className="text-xl font-bold text-stone-100">{typeof value === 'number' && value >= 0 ? `+${value}` : value}</div>
                <div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">{label}</div>
            </button>

            {/* Formula Tooltip */}
            {showFormula && formula && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 w-max max-w-48">
                    <div className="bg-stone-800 border border-stone-700 rounded-lg p-3 shadow-xl text-xs text-stone-300">
                        <div className="font-mono">{formula}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * Always-visible compact row showing key combat numbers.
 * Tapping any value shows the formula breakdown.
 * 
 * SRD Reference:
 * - Spell Attack Bonus = Proficiency + INT mod (SRD 5.1, Wizard Spellcasting, p. 53)
 * - Spell Save DC = 8 + Proficiency + INT mod (SRD 5.1, Wizard Spellcasting, p. 53)
 */
export const MathStrip: React.FC = () => {
    const spellAttackBonus = useAppSelector(selectSpellAttackBonus);
    const spellSaveDC = useAppSelector(selectSpellSaveDC);
    const intMod = useAppSelector(state => selectAbilityModifier(state, 'int'));
    const profBonus = useAppSelector(state => state.stats.profBonus);

    return (
        <div className="bg-stone-950/80 backdrop-blur-md border-b border-stone-800 p-3">
            <div className="flex items-center justify-center gap-3 max-w-2xl mx-auto">
                <StatBlock
                    icon={<Zap className="w-4 h-4" />}
                    label="Spell Atk"
                    value={spellAttackBonus}
                    formula={`= Prof (${profBonus}) + INT (${intMod})`}
                    color="text-yellow-500"
                />

                <div className="h-8 w-px bg-stone-800" />

                <StatBlock
                    icon={<Shield className="w-4 h-4" />}
                    label="Save DC"
                    value={spellSaveDC}
                    formula={`= 8 + Prof (${profBonus}) + INT (${intMod})`}
                    color="text-blue-500"
                />

                <div className="h-8 w-px bg-stone-800" />

                <StatBlock
                    icon={<Award className="w-4 h-4" />}
                    label="Prof"
                    value={profBonus}
                    color="text-green-500"
                />

                <div className="h-8 w-px bg-stone-800" />

                <StatBlock
                    icon={<Brain className="w-4 h-4" />}
                    label="INT"
                    value={intMod}
                    color="text-purple-500"
                />
            </div>
        </div>
    );
};
