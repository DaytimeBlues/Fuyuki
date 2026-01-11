import { useMemo, useState } from 'react';
import { spells } from '../../data/spells';
import type { Spell } from '../../types';
import { X, Scroll, Sparkles, Clock, Target, Hourglass, Zap, ShieldCheck, Wand2, Activity } from 'lucide-react';
import { getRequiredLevelForSpell } from '../../utils/spellRules';

interface SpellsViewProps {
    level: number;
    concentration: string | null;
    onSetConcentration: (spell: string) => void;
}

export function SpellsView({ level, concentration, onSetConcentration }: SpellsViewProps) {
    const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

    const { cantrips, level1, level2, level3 } = useMemo(() => ({
        cantrips: spells.filter(s => s.lvl === 0),
        level1: spells.filter(s => s.lvl === 1),
        level2: spells.filter(s => s.lvl === 2),
        level3: spells.filter(s => s.lvl === 3)
    }), []);

    return (
        <div className="pb-20">
            <SpellList title="Cantrips" list={cantrips} level={level} onSelect={setSelectedSpell} />
            <SpellList title="Level 1" list={level1} level={level} onSelect={setSelectedSpell} />
            <SpellList title="Level 2" list={level2} level={level} onSelect={setSelectedSpell} />
            <SpellList title="Level 3" list={level3} level={level} onSelect={setSelectedSpell} />

            {/* Spell Detail Modal */}
            {selectedSpell && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    onClick={() => setSelectedSpell(null)}
                >
                    <div
                        className="card-parchment w-full max-w-lg max-h-[85vh] flex flex-col relative shadow-2xl shadow-white/5 animate-scale-in"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Fixed Header with Close Button */}
                        <div className="flex items-start justify-between p-4 border-b border-white/10 shrink-0">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-lg border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                    <Scroll className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-display text-xl text-parchment-light tracking-wide">{selectedSpell.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted mt-1">
                                        <span className="text-white">Level {selectedSpell.lvl}</span>
                                        <span className="text-white/30">•</span>
                                        <span>{selectedSpell.school}</span>
                                    </div>
                                    <div className="text-[10px] text-muted mt-2">
                                        Required level {getRequiredLevelForSpell(selectedSpell.lvl)} • You are level {level}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedSpell.concentration && (
                                    <button
                                        onClick={() => onSetConcentration(selectedSpell.name)}
                                        className={`text-[10px] px-3 py-1 rounded-full border transition-colors ${
                                            concentration === selectedSpell.name
                                                ? 'bg-white/20 text-white border-white/40'
                                                : 'bg-white/5 text-muted border-white/20 hover:text-white hover:border-white/40'
                                        }`}
                                    >
                                        {concentration === selectedSpell.name ? 'Concentrating' : 'Set Concentration'}
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedSpell(null)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/20 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all shrink-0"
                                    aria-label="Close"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-4 overflow-y-auto flex-1">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock size={12} className="text-white" />
                                        <span className="text-[10px] text-muted uppercase tracking-wider">Casting Time</span>
                                    </div>
                                    <div className="text-sm text-parchment-light">{selectedSpell.castTime}</div>
                                </div>
                                <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Target size={12} className="text-white" />
                                        <span className="text-[10px] text-muted uppercase tracking-wider">Range</span>
                                    </div>
                                    <div className="text-sm text-parchment-light">{selectedSpell.range}</div>
                                </div>
                                <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Hourglass size={12} className="text-white" />
                                        <span className="text-[10px] text-muted uppercase tracking-wider">Duration</span>
                                    </div>
                                    <div className="text-sm text-parchment-light">{selectedSpell.duration}</div>
                                </div>
                                <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles size={12} className="text-white" />
                                        <span className="text-[10px] text-muted uppercase tracking-wider">Components</span>
                                    </div>
                                    <div className="text-sm text-parchment-light">{selectedSpell.components}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Wand2 size={12} className="text-white" />
                                        <span className="text-[10px] text-muted uppercase tracking-wider">What It Does</span>
                                    </div>
                                    <div className="text-sm text-parchment-light">{selectedSpell.effect}</div>
                                </div>
                                <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <ShieldCheck size={12} className="text-white" />
                                        <span className="text-[10px] text-muted uppercase tracking-wider">Rolls</span>
                                    </div>
                                    <div className="text-sm text-parchment-light">{selectedSpell.rolls}</div>
                                </div>
                                <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Zap size={12} className="text-white" />
                                        <span className="text-[10px] text-muted uppercase tracking-wider">Damage</span>
                                    </div>
                                    <div className="text-sm text-parchment-light">{selectedSpell.damage}</div>
                                </div>
                                <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Activity size={12} className="text-white" />
                                        <span className="text-[10px] text-muted uppercase tracking-wider">Damage Type</span>
                                    </div>
                                    <div className="text-sm text-parchment-light">{selectedSpell.damageType}</div>
                                </div>
                            </div>

                            <div className="bg-card-elevated/60 p-4 rounded-lg border border-white/10 mb-6">
                                <div className="text-[10px] text-muted uppercase tracking-wider mb-3">Decision Tree by Level</div>
                                <div className="space-y-2">
                                    {selectedSpell.decisionTree.map((node) => {
                                        const isActive = level >= node.level;
                                        return (
                                            <div
                                                key={`${selectedSpell.name}-${node.level}`}
                                                className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${
                                                    isActive
                                                        ? 'border-white/30 bg-white/10 text-parchment-light'
                                                        : 'border-white/10 bg-white/5 text-muted'
                                                }`}
                                            >
                                                <div className={`text-[10px] uppercase tracking-wider ${isActive ? 'text-white' : 'text-muted/60'}`}>
                                                    Level {node.level}
                                                </div>
                                                <div className="text-xs">{node.summary}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-4 text-parchment text-sm leading-relaxed border-t border-white/10 pt-4">
                                <p>{selectedSpell.desc}</p>
                                {selectedSpell.incantation && (
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg mt-4 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                        <div className="text-[10px] text-white uppercase mb-2 tracking-wider flex items-center gap-2">
                                            <Sparkles size={10} />
                                            Verbal Component
                                        </div>
                                        <p className="font-display italic text-white text-lg">"{selectedSpell.incantation}"</p>
                                        {selectedSpell.pronunciation && (
                                            <p className="text-xs text-white/50 mt-1">/ {selectedSpell.pronunciation} /</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const SpellList = ({
    title,
    list,
    level,
    onSelect
}: {
    title: string;
    list: Spell[];
    level: number;
    onSelect: (spell: Spell) => void;
}) => (
    <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
            <h3 className="font-display text-lg text-parchment-light tracking-wider">{title}</h3>
            <div className="h-px bg-gradient-to-r from-white/20 to-transparent flex-1" />
            <span className="text-xs text-muted">{list.length} spells</span>
        </div>
        <div className="space-y-2">
            {list.map((spell) => {
                const requiredLevel = getRequiredLevelForSpell(spell.lvl);
                const isAvailable = level >= requiredLevel;
                return (
                <button
                    key={spell.name}
                    onClick={() => onSelect(spell)}
                    className={`w-full text-left card-parchment p-3 transition-all group ${
                        isAvailable ? 'hover:border-white/30' : 'opacity-60 cursor-not-allowed'
                    }`}
                    disabled={!isAvailable}
                >
                    <div className="flex justify-between items-center relative z-10 min-w-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 rounded bg-card-elevated flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors shrink-0">
                                <Scroll size={14} className="text-muted group-hover:text-white transition-colors" />
                            </div>
                            <span className="font-display text-parchment group-hover:text-parchment-light transition-colors truncate pr-2">
                                {spell.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {spell.concentration && (
                                <span className="text-[10px] text-white/70 border border-white/20 px-2 py-0.5 rounded-full bg-white/5">
                                    Conc.
                                </span>
                            )}
                            {spell.incantation && (
                                <span className="text-[10px] text-white/70 border border-white/20 px-2 py-0.5 rounded-full bg-white/5">
                                    Verbal
                                </span>
                            )}
                            {!isAvailable && (
                                <span className="text-[10px] text-white/50 border border-white/10 px-2 py-0.5 rounded-full bg-white/5">
                                    L{requiredLevel}+
                                </span>
                            )}
                            <Sparkles size={14} className="text-muted group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                        </div>
                    </div>
                </button>
                );
            })}
        </div>
    </div>
);
