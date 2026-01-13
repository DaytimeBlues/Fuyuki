import { Brain, Star, Zap, Heart, Eye, Sparkles, Dumbbell, ChevronRight } from 'lucide-react';
import type { AbilityKey, Skill } from '../../types';

interface StatsViewProps {
    abilities: Record<AbilityKey, number>;
    abilityMods: Record<AbilityKey, number>;
    skills: Record<string, Skill>;
    profBonus: number;
}

// Map abilities to their display info
const abilityInfo: Record<AbilityKey, { name: string; icon: typeof Brain; color: string }> = {
    str: { name: 'Strength', icon: Dumbbell, color: 'text-red-400' },
    dex: { name: 'Dexterity', icon: Zap, color: 'text-green-400' },
    con: { name: 'Constitution', icon: Heart, color: 'text-orange-400' },
    int: { name: 'Intelligence', icon: Brain, color: 'text-blue-400' },
    wis: { name: 'Wisdom', icon: Eye, color: 'text-purple-400' },
    cha: { name: 'Charisma', icon: Sparkles, color: 'text-pink-400' },
};

// Format modifier with sign
function formatMod(mod: number): string {
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

// Calculate skill bonus
function getSkillBonus(skill: Skill, abilityMod: number, profBonus: number): number {
    return abilityMod + (skill.prof ? profBonus : 0);
}

export function StatsView({ abilities, abilityMods, skills, profBonus }: StatsViewProps) {
    // Group skills by their parent ability
    const skillsByAbility: Record<AbilityKey, { key: string; skill: Skill }[]> = {
        str: [],
        dex: [],
        con: [],
        int: [],
        wis: [],
        cha: [],
    };

    Object.entries(skills).forEach(([key, skill]) => {
        if (skillsByAbility[skill.attr]) {
            skillsByAbility[skill.attr].push({ key, skill });
        }
    });

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
                <h2 className="font-display text-xl text-parchment tracking-wider">Abilities & Skills</h2>
                <p className="text-xs text-muted mt-1">Proficiency Bonus: {formatMod(profBonus)}</p>
            </div>

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
                                    <div className="text-2xl font-mono text-white font-bold">
                                        {score}
                                    </div>
                                    <div className={`text-sm font-mono ${mod >= 0 ? 'text-green-400' : 'text-red-400'}`}>
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
                                                    <div className={`font-mono text-sm font-bold ${bonus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
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
