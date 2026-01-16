import React from 'react';
import { SpellV3 } from '../../../schemas/spellSchema';
import { Book, Flame, Shield, Skull, Eye, Star, Zap, Activity, Info } from 'lucide-react';

interface SpellCardProps {
    spell: SpellV3;
    isPrepared: boolean;
    slotsAvailable: boolean;
    onPrepare: () => void;
    onCast: () => void;
    onInfo: () => void;
}

const SchoolIcon = ({ school }: { school: string }) => {
    switch (school) {
        case 'Evocation': return <Flame className="w-4 h-4 text-red-400" />;
        case 'Abjuration': return <Shield className="w-4 h-4 text-blue-400" />;
        case 'Necromancy': return <Skull className="w-4 h-4 text-green-400" />;
        case 'Divination': return <Eye className="w-4 h-4 text-indigo-400" />;
        case 'Enchantment': return <Star className="w-4 h-4 text-pink-400" />;
        case 'Transmutation': return <Zap className="w-4 h-4 text-yellow-400" />;
        case 'Illusion': return <Activity className="w-4 h-4 text-purple-400" />;
        default: return <Book className="w-4 h-4 text-stone-400" />;
    }
};

export const SpellCard: React.FC<SpellCardProps> = ({ spell, isPrepared, slotsAvailable, onPrepare, onCast, onInfo }) => {
    const isRitual = spell.ritual;
    const isConcentration = spell.duration.type === 'concentration';

    return (
        <div className={`
      relative p-5 rounded-xl border transition-all duration-300 group flex flex-col h-full
      ${isPrepared
                ? 'bg-stone-900/90 border-stone-600 shadow-xl shadow-black/60 ring-1 ring-stone-600/30'
                : 'bg-stone-950/80 border-stone-800 opacity-90 hover:opacity-100 hover:border-stone-600'
            }
    `}
            data-testid={`spell-card-${spell.id}`}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 shadow-inner shrink-0 mt-0.5">
                        <SchoolIcon school={spell.school} />
                    </div>
                    <div className="min-w-0">
                        <h3 className={`font-cinzel text-lg font-bold truncate ${isPrepared ? 'text-stone-100' : 'text-stone-400'}`}>
                            {spell.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 mt-1.5 font-medium">
                            <span className="bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800/50">{spell.school}</span>
                            <span className="text-stone-700">•</span>
                            <span className="bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800/50">Lvl {spell.level}</span>
                        </div>
                    </div>
                </div>

                {/* Toggle Prepare Button */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={onInfo}
                        className="p-2 rounded-lg transition-all duration-200 border text-stone-400 bg-stone-900/50 border-stone-800 hover:text-stone-200 hover:border-stone-700"
                        title="View spell details"
                        data-testid={`spell-info-btn-${spell.id}`}
                    >
                        <Info className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onPrepare}
                        className={`
            p-2 rounded-lg transition-all duration-200 shrink-0 border
            ${isPrepared
                                ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20 shadow-lg shadow-yellow-500/5'
                                : 'text-stone-600 bg-stone-900/50 border-stone-800 hover:text-stone-400 hover:border-stone-700'
                            }
          `}
                        title={isPrepared ? "Unprepare" : "Prepare"}
                    >
                        <Book className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {isRitual && (
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded bg-amber-950/20 text-amber-500 border border-amber-900/30">
                        Ritual
                    </span>
                )}
                {isConcentration && (
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded bg-indigo-950/20 text-indigo-400 border border-indigo-900/30">
                        Concentration
                    </span>
                )}
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded bg-stone-900 text-stone-500 border border-stone-800">
                    {spell.castingTime}
                </span>
            </div>

            {/* Description Snippet */}
            <div className="flex-grow space-y-3">
                <p className="text-sm text-stone-400 line-clamp-3 font-serif leading-relaxed italic">
                    {spell.description}
                </p>
                {spell.scenario && (
                    <div className="bg-blue-950/30 border border-blue-900/50 p-2 rounded text-xs text-blue-200 font-sans">
                        <span className="font-bold text-blue-400 block mb-1">EXAMPLE SCENARIO:</span>
                        {spell.scenario}
                    </div>
                )}
            </div>

            {/* Actions */}
            {isPrepared && (
                <div className="pt-4 mt-4 border-t border-stone-800/50 flex justify-end">
                    <button
                        onClick={onCast}
                        disabled={!slotsAvailable && !isRitual}
                        className={`
                    px-5 py-2 text-[10px] uppercase tracking-[0.2em] rounded-md
                    transition-all duration-300 flex items-center gap-2 group/btn
                    ${slotsAvailable
                                ? 'btn-primary-action'
                                : 'bg-stone-900/50 text-stone-600 cursor-not-allowed border border-stone-800'
                            }
                `}
                    >
                        <Zap className={`w-3.5 h-3.5 transition-transform duration-300 ${slotsAvailable ? 'group-hover/btn:scale-125 group-hover/btn:rotate-12' : ''}`} />
                        Cast Spell
                    </button>
                </div>
            )}
        </div>
    );
};
