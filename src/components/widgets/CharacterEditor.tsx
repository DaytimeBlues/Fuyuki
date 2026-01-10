import { useState } from 'react';
import { Settings, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import {
    ABILITY_SCORE_MIN,
    ABILITY_SCORE_STANDARD_MAX,
    LEVEL_MIN,
    LEVEL_MAX,
    clamp,
} from '../../utils/srdRules';
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

    const handleLevelIncrement = (delta: number) => {
        const newLevel = clamp(data.level + delta, LEVEL_MIN, LEVEL_MAX);
        if (newLevel !== data.level) {
            onLevelChange(newLevel);
        }
    };

    const handleAbilityIncrement = (ability: AbilityKey, delta: number) => {
        const currentScore = data.abilities[ability];
        const newScore = clamp(currentScore + delta, ABILITY_SCORE_MIN, ABILITY_SCORE_STANDARD_MAX);
        if (newScore !== currentScore) {
            onAbilityChange(ability, newScore);
        }
    };

    const formatMod = (mod: number): string => {
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    return (
        <div className="card-parchment p-4 mb-4">
            {/* Header - Always Visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <Settings size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">
                        CHARACTER EDITOR
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">Tap to {isExpanded ? 'collapse' : 'expand'}</span>
                    {isExpanded ? (
                        <ChevronUp size={18} className="text-parchment-dark" />
                    ) : (
                        <ChevronDown size={18} className="text-parchment-dark" />
                    )}
                </div>
            </button>

            {/* Collapsible Content */}
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
                    {/* Level Editor */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-display text-xs text-parchment-dark uppercase tracking-wider">
                                Level
                            </span>
                            <div className="flex items-center gap-1 text-xs text-muted">
                                <Sparkles size={12} />
                                <span>Prof +{data.profBonus}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => handleLevelIncrement(-1)}
                                disabled={data.level <= LEVEL_MIN}
                                className="btn-fantasy w-10 h-10 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Decrease level"
                            >
                                −
                            </button>
                            <div className="stat-circle">
                                <span className="font-display text-2xl text-parchment-light">
                                    {data.level}
                                </span>
                            </div>
                            <button
                                onClick={() => handleLevelIncrement(1)}
                                disabled={data.level >= LEVEL_MAX}
                                className="btn-fantasy w-10 h-10 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Increase level"
                            >
                                +
                            </button>
                        </div>
                        {/* Derived Stats Preview */}
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="bg-black/20 rounded p-2">
                                <div className="text-muted">Max HP</div>
                                <div className="text-parchment-light font-display">{data.hp.max}</div>
                            </div>
                            <div className="bg-black/20 rounded p-2">
                                <div className="text-muted">Hit Dice</div>
                                <div className="text-parchment-light font-display">{data.hitDice.max}d{data.hitDice.size}</div>
                            </div>
                            <div className="bg-black/20 rounded p-2">
                                <div className="text-muted">Spell DC</div>
                                <div className="text-parchment-light font-display">{data.dc}</div>
                            </div>
                        </div>
                    </div>

                    {/* Ability Scores Editor */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="font-display text-xs text-parchment-dark uppercase tracking-wider">
                                Ability Scores
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {(Object.keys(ABILITY_NAMES) as AbilityKey[]).map((ability) => (
                                <div
                                    key={ability}
                                    className="bg-black/20 rounded-lg p-3"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-display text-xs text-parchment uppercase tracking-wider">
                                            {ability}
                                        </span>
                                        <span className="text-xs text-accent font-display">
                                            {formatMod(data.abilityMods[ability])}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <button
                                            onClick={() => handleAbilityIncrement(ability, -1)}
                                            disabled={data.abilities[ability] <= ABILITY_SCORE_MIN}
                                            className="btn-fantasy w-8 h-8 text-sm flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                                            aria-label={`Decrease ${ABILITY_NAMES[ability]}`}
                                        >
                                            −
                                        </button>
                                        <div className="flex-1 text-center">
                                            <span className="font-display text-xl text-parchment-light">
                                                {data.abilities[ability]}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleAbilityIncrement(ability, 1)}
                                            disabled={data.abilities[ability] >= ABILITY_SCORE_STANDARD_MAX}
                                            className="btn-fantasy w-8 h-8 text-sm flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                                            aria-label={`Increase ${ABILITY_NAMES[ability]}`}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="mt-1 text-center text-xs text-muted">
                                        {ABILITY_NAMES[ability]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Footer */}
                    <div className="mt-4 pt-3 border-t border-white/10 text-center">
                        <p className="text-xs text-muted italic">
                            Changes auto-save and cascade to derived stats per SRD 5.1
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
