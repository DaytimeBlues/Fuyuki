import { useState } from 'react';
import { spells } from '../../data/spells';
import type { Spell } from '../../types';
import { X, Scroll, Sparkles, Clock, Target, Hourglass } from 'lucide-react';

export function SpellsView() {
    const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

    const cantrips = spells.filter(s => s.lvl === 0);
    const level1 = spells.filter(s => s.lvl === 1);
    const level2 = spells.filter(s => s.lvl === 2);
    const level3 = spells.filter(s => s.lvl === 3);

    return (
        <div className="pb-20">
            <SpellList title="Cantrips" list={cantrips} onSelect={setSelectedSpell} />
            <SpellList title="Level 1" list={level1} onSelect={setSelectedSpell} />
            <SpellList title="Level 2" list={level2} onSelect={setSelectedSpell} />
            <SpellList title="Level 3" list={level3} onSelect={setSelectedSpell} />

            {/* Spell Detail Modal */}
            {selectedSpell && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    onClick={() => setSelectedSpell(null)}
                >
                    <div
                        className="card-parchment w-full max-w-lg max-h-[80vh] overflow-y-auto relative shadow-2xl shadow-accent/10"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedSpell(null)}
                            className="absolute top-4 right-4 flex items-center gap-1 text-muted hover:text-accent transition-colors z-10"
                        >
                            <span className="text-xs font-display uppercase tracking-wider">Close</span>
                            <X size={24} />
                        </button>

                        <div className="p-6 relative z-10">
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 bg-accent/10 rounded-lg border border-accent/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                                    <Scroll className="text-accent" size={28} />
                                </div>
                                <div>
                                    <h3 className="font-display text-xl text-parchment-light tracking-wide">{selectedSpell.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted mt-1">
                                        <span className="text-accent">Level {selectedSpell.lvl}</span>
                                        <span className="text-parchment-dark">•</span>
                                        <span>{selectedSpell.school}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-card-elevated/80 p-3 rounded-lg border border-parchment-dark/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock size={12} className="text-accent" />
                                        <span className="text-[10px] text-muted uppercase tracking-wider">Casting Time</span>
                                    </div>
                                    <div className="text-sm text-parchment-light">{selectedSpell.castTime}</div>
                                </div>
                                <div className="bg-card-elevated/80 p-3 rounded-lg border border-parchment-dark/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Target size={12} className="text-accent" />
                                        <span className="text-[10px] text-muted uppercase tracking-wider">Range</span>
                                    </div>
                                    <div className="text-sm text-parchment-light">{selectedSpell.range}</div>
                                </div>
                                <div className="bg-card-elevated/80 p-3 rounded-lg border border-parchment-dark/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Hourglass size={12} className="text-accent" />
                                        <span className="text-[10px] text-muted uppercase tracking-wider">Duration</span>
                                    </div>
                                    <div className="text-sm text-parchment-light">{selectedSpell.duration}</div>
                                </div>
                                <div className="bg-card-elevated/80 p-3 rounded-lg border border-parchment-dark/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles size={12} className="text-accent" />
                                        <span className="text-[10px] text-muted uppercase tracking-wider">Components</span>
                                    </div>
                                    <div className="text-sm text-parchment-light">{selectedSpell.components}</div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-4 text-parchment text-sm leading-relaxed border-t border-parchment-dark/20 pt-4">
                                <p>{selectedSpell.desc}</p>
                                {selectedSpell.incantation && (
                                    <div className="bg-accent/5 border border-accent/20 p-4 rounded-lg mt-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                                        <div className="text-[10px] text-accent uppercase mb-2 tracking-wider flex items-center gap-2">
                                            <Sparkles size={10} />
                                            Verbal Component
                                        </div>
                                        <p className="font-display italic text-accent text-lg">"{selectedSpell.incantation}"</p>
                                        {selectedSpell.pronunciation && (
                                            <p className="text-xs text-accent/60 mt-1">/ {selectedSpell.pronunciation} /</p>
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

const SpellList = ({ title, list, onSelect }: { title: string, list: Spell[], onSelect: (spell: Spell) => void }) => (
    <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
            <h3 className="font-display text-lg text-parchment-light tracking-wider">{title}</h3>
            <div className="h-px bg-gradient-to-r from-parchment-dark/30 to-transparent flex-1" />
            <span className="text-xs text-muted">{list.length} spells</span>
        </div>
        <div className="space-y-2">
            {list.map((spell) => (
                <button
                    key={spell.name}
                    onClick={() => onSelect(spell)}
                    className="w-full text-left card-parchment p-3 hover:border-accent/50 transition-all group"
                >
                    <div className="flex justify-between items-center relative z-10 min-w-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 rounded bg-card-elevated flex items-center justify-center border border-parchment-dark/20 group-hover:border-accent/30 transition-colors shrink-0">
                                <Scroll size={14} className="text-muted group-hover:text-accent transition-colors" />
                            </div>
                            <span className="font-display text-parchment group-hover:text-parchment-light transition-colors truncate pr-2">
                                {spell.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {spell.incantation && (
                                <span className="text-[10px] text-accent/70 border border-accent/30 px-2 py-0.5 rounded-full bg-accent/5">
                                    Verbal
                                </span>
                            )}
                            <Sparkles size={14} className="text-muted group-hover:text-accent transition-colors opacity-0 group-hover:opacity-100" />
                        </div>
                    </div>
                </button>
            ))}
        </div>
    </div>
);
