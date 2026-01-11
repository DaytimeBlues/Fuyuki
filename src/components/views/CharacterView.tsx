import type { CharacterData, Skill } from '../../types';
import { Brain, Target } from 'lucide-react';
import { InitiativeWidget } from '../widgets/InitiativeWidget';
import { ProficiencyWidget } from '../widgets/ProficiencyWidget';
import { SavingThrowsWidget } from '../widgets/SavingThrowsWidget';

interface CharacterViewProps {
    data: CharacterData;
}

export function CharacterView({ data }: CharacterViewProps) {
    if (!data) return null;

    const abilityOrder: Array<keyof CharacterData['abilities']> = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const skillsByAbility = Object.values(data.skills || {}).reduce<Record<string, Record<string, Skill>>>((acc, skill) => {
        const list = acc[skill.attr] || {};
        list[skill.name] = skill;
        acc[skill.attr] = list;
        return acc;
    }, {});

    return (
        <div className="pb-20">
            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <InitiativeWidget
                    dexMod={data.abilityMods.dex}
                    profBonus={data.profBonus}
                />
                <ProficiencyWidget
                    profBonus={data.profBonus}
                    level={data.level}
                />
            </div>

            <div className="mb-6">
                <SavingThrowsWidget
                    abilityMods={data.abilityMods}
                    profBonus={data.profBonus}
                    savingThrowProficiencies={data.savingThrowProficiencies}
                />
            </div>

            {/* Abilities Grid */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Brain size={18} className="text-white" />
                    <h3 className="font-display text-lg text-parchment-light tracking-wider">Abilities</h3>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {Object.entries(data.abilities || {}).map(([key, score]) => (
                        <div key={key} className="card-parchment p-3 text-center">
                            <div className="relative z-10">
                                <div className="text-[10px] text-muted uppercase tracking-wider mb-1">{key}</div>
                                <div className={`text-xl font-display ${((data.abilityMods as Record<string, number>)?.[key] ?? 0) >= 0 ? 'text-white' : 'text-red-400'}`}>
                                    {((data.abilityMods as Record<string, number>)?.[key] ?? 0) >= 0 ? '+' : ''}{(data.abilityMods as Record<string, number>)?.[key] ?? 0}
                                </div>
                                <div className="text-[10px] text-muted/50">{score}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills Card */}
            <div className="card-parchment overflow-hidden">
                <div className="p-3 border-b border-white/10 flex justify-between items-center bg-card-elevated/50 relative z-10">
                    <div className="flex items-center gap-2">
                        <Target size={16} className="text-white" />
                        <span className="font-display text-base text-parchment-light tracking-wider">Skills</span>
                    </div>
                    <span className="text-[10px] text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                        Prof +{data.profBonus}
                    </span>
                </div>

                <div className="divide-y divide-white/5 relative z-10 max-h-[420px] overflow-y-auto">
                    {abilityOrder.map((ability) => {
                        const skillsForAbility = Object.values(skillsByAbility[ability] || {}).sort((a, b) =>
                            a.name.localeCompare(b.name)
                        );
                        if (!skillsForAbility.length) return null;
                        const abilityMod = data.abilityMods?.[ability] || 0;

                        return (
                            <div key={ability} className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] uppercase tracking-wider text-muted">{ability.toUpperCase()}</span>
                                        <span className="text-sm font-display text-parchment-light">
                                            {abilityMod >= 0 ? '+' : ''}{abilityMod}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-muted/70">
                                        {data.abilities[ability]}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {skillsForAbility.map((skill) => {
                                        const totalMod = abilityMod + (skill.prof ? data.profBonus : 0);
                                        return (
                                            <div key={skill.name} className={`flex justify-between items-center p-2 rounded ${skill.prof ? 'bg-white/5' : ''}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${skill.prof ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]' : 'bg-white/20'}`} />
                                                    <span className={`text-sm ${skill.prof ? 'text-parchment-light font-display' : 'text-muted'}`}>
                                                        {skill.name}
                                                    </span>
                                                </div>
                                                <span className={`font-display text-sm ${skill.prof ? 'text-white' : 'text-muted'}`}>
                                                    {totalMod >= 0 ? '+' : ''}{totalMod}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
