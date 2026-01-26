import { Brain, Star, Zap, Heart, Eye, Sparkles, Dumbbell, ChevronRight, X } from 'lucide-react';
import type { AbilityKey, Skill } from '../../types';



interface StatsViewProps {
    abilities: Record<AbilityKey, number>;
    abilityMods: Record<AbilityKey, number>;
    skills: Record<string, Skill>;
    profBonus: number;
    level: number;
    conditions: string[];
    onRemoveCondition?: (condition: string) => void;
}

export function StatsView({
    abilities,
    abilityMods,
    skills,
    profBonus,
    conditions,
    onRemoveCondition
}: StatsViewProps) {

    // Map abilities to their display info
    const abilityInfo: Record<AbilityKey, { name: string; icon: typeof Brain; color: string }> = {
        str: { name: 'Strength', icon: Dumbbell, color: 'text-stone-400' },
        dex: { name: 'Dexterity', icon: Zap, color: 'text-stone-400' },
        con: { name: 'Constitution', icon: Heart, color: 'text-stone-400' },
        int: { name: 'Intelligence', icon: Brain, color: 'text-stone-400' },
        wis: { name: 'Wisdom', icon: Eye, color: 'text-stone-400' },
        cha: { name: 'Charisma', icon: Sparkles, color: 'text-accent' },
    };

    // Format modifier with sign
    function formatMod(mod: number): string {
        return mod >= 0 ? `+${mod}` : `${mod}`;
    }

    // Calculate skill bonus
    function getSkillBonus(skill: Skill, abilityMod: number, profBonus: number): number {
        return abilityMod + (skill.prof ? profBonus : 0);
    }

    // Group skills by ability for the UI
    const skillsByAbility: Record<AbilityKey, { key: string; skill: Skill }[]> = {
        str: [], dex: [], con: [], int: [], wis: [], cha: []
    };

    Object.entries(skills).forEach(([key, skill]) => {
        if (skillsByAbility[skill.attr]) {
            skillsByAbility[skill.attr].push({ key, skill });
        }
    });



    return (
        <div className="space-y-4 animate-fade-in pb-20">
            <div className="text-center mb-6">
                <h2 className="font-kyoto uppercase text-lg text-parchment tracking-[0.2em]">Attributes</h2>
                <p className="text-[10px] text-muted uppercase tracking-widest mt-1">Proficiency Bonus: {formatMod(profBonus)}</p>
            </div>

            {/* Active Conditions */}
            {conditions && conditions.length > 0 && (
                <div className="card-parchment p-4 mb-4 border-accent/20 bg-accent/5">
                    <div className="flex items-center gap-2 mb-3">
                        <Star size={16} className="text-accent animate-pulse-slow" />
                        <h3 className="font-display text-xs text-accent uppercase tracking-[0.1em]">Active Conditions</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {conditions.map(condition => (
                            <div
                                key={condition}
                                className="px-3 py-1 bg-bg-void/60 border border-accent/30 rounded-full flex items-center gap-2 hover:border-accent group transition-all"
                            >
                                <span className="text-[10px] text-parchment uppercase tracking-widest font-bold">{condition}</span>
                                <button
                                    onClick={() => onRemoveCondition?.(condition)}
                                    className="p-0.5 hover:bg-vermillion/20 rounded-full text-muted group-hover:text-vermillion transition-colors"
                                    title={`Remove ${condition}`}
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}



            <div className="grid gap-3">
                {(Object.keys(abilityInfo) as AbilityKey[]).map((abilityKey, index) => {
                    const info = abilityInfo[abilityKey];
                    const Icon = info.icon;
                    const score = abilities[abilityKey];
                    const mod = abilityMods[abilityKey];
                    const relatedSkills = skillsByAbility[abilityKey];

                    return (
                        <div
                            key={abilityKey}
                            className={`card-parchment p-4 animate-slide-up`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Ability Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-white/5 ${info.color}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-sm text-parchment tracking-wide">
                                            {info.name}
                                        </h3>
                                        <p className="text-[10px] text-muted uppercase tracking-wider">
                                            {abilityKey.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-mono text-white font-bold" data-testid={`ability-score-${abilityKey}`}>
                                        {score}
                                    </div>
                                    <div className={`text-sm font-mono ${mod >= 0 ? 'text-green-400' : 'text-red-400'}`} data-testid={`ability-mod-${abilityKey}`}>
                                        {formatMod(mod)}
                                    </div>
                                </div>
                            </div>

                            {/* Skills Tree */}
                            {relatedSkills.length > 0 && (
                                <div className="border-t border-white/10 pt-3 mt-3">
                                    <div className="space-y-2">
                                        {relatedSkills.map(({ key, skill }) => {
                                            const bonus = getSkillBonus(skill, mod, profBonus);
                                            return (
                                                <div
                                                    key={key}
                                                    className="flex items-center justify-between pl-4 py-1.5 rounded-lg bg-white/3 hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <ChevronRight size={12} className="text-muted" />
                                                        <span className="text-sm text-parchment-light">
                                                            {skill.name}
                                                        </span>
                                                        {skill.prof && (
                                                            <Star
                                                                size={12}
                                                                className="text-yellow-500 fill-yellow-500"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className={`font-mono text-sm font-bold ${bonus >= 0 ? 'text-green-400' : 'text-red-400'}`} data-testid={`skill-bonus-${skill.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                                        {formatMod(bonus)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Empty state for CON */}
                            {relatedSkills.length === 0 && (
                                <div className="border-t border-white/10 pt-3 mt-3">
                                    <p className="text-xs text-muted italic pl-4">No associated skills</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted">
                <div className="flex items-center gap-1">
                    <Star size={10} className="text-yellow-500 fill-yellow-500" />
                    <span>Proficient</span>
                </div>
            </div>
        </div>
    );
}
