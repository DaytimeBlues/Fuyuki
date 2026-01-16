import { useState } from 'react';
import { Settings, ChevronUp, ChevronDown, Plus, Minus } from 'lucide-react';
import {
    ABILITY_SCORE_MIN,
    LEVEL_MIN,
} from '../../utils/srdRules';
import { validateAndClampAbilityScore, validateAndClampLevel } from '../../utils/inputValidation';
import type { AbilityKey, CharacterData } from '../../types';

const ABILITY_NAMES: Record<AbilityKey, string> = {
    str: 'Strength',
    dex: 'Dexterity',
    con: 'Constitution',
    int: 'Intelligence',
    wis: 'Wisdom',
    cha: 'Charisma',
};

interface CharacterEditorProps {
    data: CharacterData;
    onLevelChange: (newLevel: number) => void;
    onAbilityChange: (ability: AbilityKey, newScore: number) => void;
}

export function CharacterEditor({
    data,
    onLevelChange,
    onAbilityChange,
}: CharacterEditorProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleLevelChange = (value: string) => {
        const newLevel = validateAndClampLevel(parseInt(value) || LEVEL_MIN);
        onLevelChange(newLevel);
    };

    const handleAbilityChange = (ability: AbilityKey, value: string) => {
        const newScore = validateAndClampAbilityScore(parseInt(value) || ABILITY_SCORE_MIN);
        onAbilityChange(ability, newScore);
    };

    const handleLevelIncrement = (delta: number) => {
        const newLevel = validateAndClampLevel(data.level + delta);
        if (newLevel !== data.level) {
            onLevelChange(newLevel);
        }
    };

    const handleAbilityIncrement = (ability: AbilityKey, delta: number) => {
        const newScore = validateAndClampAbilityScore(data.abilities[ability] + delta);
        if (newScore !== data.abilities[ability]) {
            onAbilityChange(ability, newScore);
        }
    };

    return (
        <div className="card-parchment p-4 mb-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between"
                data-testid="character-editor-toggle"
            >
                <div className="flex items-center gap-2 text-accent">
                    <Settings size={18} />
                    <h3 className="text-sm font-kyoto uppercase tracking-widest">Character Settings</h3>
                </div>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {isExpanded && (
                <div className="mt-4 space-y-4 animate-scale-in">
                    {/* Level Setting */}
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                        <div className="flex flex-col">
                            <span className="label-kyoto mb-0">Character Level</span>
                            <span className="text-[10px] text-accent/60 font-display">総レベル</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => handleLevelIncrement(-1)} className="p-1 hover:text-accent" data-testid="level-decrease-btn"><Minus size={16} /></button>
                            <input
                                type="number"
                                value={data.level}
                                onChange={(e) => handleLevelChange(e.target.value)}
                                className="w-16 text-center input-kyoto font-display"
                                data-testid="level-input"
                            />
                            <button onClick={() => handleLevelIncrement(1)} className="p-1 hover:text-accent" data-testid="level-increase-btn"><Plus size={16} /></button>
                        </div>
                    </div>

                    {/* Ability Scores */}
                    <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(ABILITY_NAMES) as AbilityKey[]).map((ability) => (
                            <div key={ability} className="bg-white/5 p-2 rounded border border-white/10">
                                <span className="label-kyoto text-[10px] mb-1">{ABILITY_NAMES[ability]}</span>
                                <div className="flex items-center justify-between gap-1">
                                    <input
                                        type="number"
                                        value={data.abilities[ability]}
                                        onChange={(e) => handleAbilityChange(ability, e.target.value)}
                                        className="w-12 text-center input-kyoto font-display text-sm p-1"
                                        data-testid={`ability-${ability}-input`}
                                    />
                                    <div className="flex flex-col">
                                        <button onClick={() => handleAbilityIncrement(ability, 1)} className="p-0.5 hover:text-accent" data-testid={`ability-${ability}-increase-btn`}><ChevronUp size={12} /></button>
                                        <button onClick={() => handleAbilityIncrement(ability, -1)} className="p-0.5 hover:text-accent" data-testid={`ability-${ability}-decrease-btn`}><ChevronDown size={12} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 text-center">
                        <p className="text-[10px] text-muted italic">
                            Changes auto-save and cascade to derived stats per SRD 5.1
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
