import { Sparkles, X, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface TransformedState {
    active: boolean;
    creatureName: string;
    hp: { current: number; max: number };
    ac: number;
}

interface WildShapeWidgetProps {
    transformed: TransformedState | null;
    originalHP: number;
    onTransform: (creature: { name: string; hp: number; ac: number }) => void;
    onDamage: (damage: number) => { revert: boolean; carryoverDamage: number };
    onRevert: () => void;
    onHeal: (amount: number) => void;
}

// Common wild shape forms
const BEAST_FORMS = [
    { name: 'Brown Bear', hp: 34, ac: 11 },
    { name: 'Dire Wolf', hp: 37, ac: 14 },
    { name: 'Giant Spider', hp: 26, ac: 14 },
    { name: 'Giant Eagle', hp: 26, ac: 13 },
];

export function WildShapeWidget({
    transformed,
    originalHP,
    onTransform,
    onDamage,
    onRevert,
    onHeal
}: WildShapeWidgetProps) {
    const [damageInput, setDamageInput] = useState('');

    const handleDamage = () => {
        const damage = parseInt(damageInput) || 0;
        if (damage > 0 && transformed) {
            const result = onDamage(damage);
            if (result.revert && result.carryoverDamage > 0) {
                // Show message about carryover damage
            }
        }
        setDamageInput('');
    };

    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className={transformed ? 'text-green-400' : 'text-muted'} />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Wild Shape</h3>
                </div>
                {transformed && (
                    <button
                        onClick={onRevert}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                        <X size={12} />
                        Revert
                    </button>
                )}
            </div>

            {transformed ? (
                <div className="space-y-3">
                    {/* Creature Info */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-display text-green-300">{transformed.creatureName}</span>
                            <span className="text-xs text-muted">AC {transformed.ac}</span>
                        </div>

                        {/* HP Bar */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <div className="h-2 bg-card-elevated rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all"
                                        style={{ width: `${(transformed.hp.current / transformed.hp.max) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <span className="text-sm text-green-300">
                                {transformed.hp.current}/{transformed.hp.max}
                            </span>
                        </div>
                    </div>

                    {/* Damage/Heal Controls */}
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min="1"
                            value={damageInput}
                            onChange={(e) => setDamageInput(e.target.value)}
                            placeholder="Damage"
                            className="flex-1 bg-card-elevated border border-parchment-dark/30 rounded px-2 py-1 text-sm text-parchment text-center"
                        />
                        <button
                            onClick={handleDamage}
                            className="btn-fantasy text-xs px-2 py-1 text-red-400"
                        >
                            <Minus size={14} />
                        </button>
                        <button
                            onClick={() => {
                                const heal = parseInt(damageInput) || 0;
                                if (heal > 0) onHeal(heal);
                                setDamageInput('');
                            }}
                            className="btn-fantasy text-xs px-2 py-1 text-green-400"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    <p className="text-[10px] text-muted opacity-60">
                        Excess damage carries over to original form ({originalHP} HP)
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    <p className="text-xs text-muted">Select a beast form:</p>
                    <div className="grid grid-cols-2 gap-2">
                        {BEAST_FORMS.map(beast => (
                            <button
                                key={beast.name}
                                onClick={() => onTransform(beast)}
                                className="text-left p-2 bg-card-elevated border border-parchment-dark/30 rounded hover:border-green-500/50 transition-colors"
                            >
                                <div className="text-xs text-parchment">{beast.name}</div>
                                <div className="text-[10px] text-muted">
                                    HP {beast.hp} • AC {beast.ac}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
