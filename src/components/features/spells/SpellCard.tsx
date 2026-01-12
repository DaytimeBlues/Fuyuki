import React from 'react';
import { SpellV3 } from '../../../schemas/spellSchema';
import { Book, Flame, Shield, Skull, Eye, Star, Zap, Activity } from 'lucide-react';

interface SpellCardProps {
    spell: SpellV3;
    isPrepared: boolean;
    slotsAvailable: boolean;
    onPrepare: () => void;
    onCast: () => void;
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

export const SpellCard: React.FC<SpellCardProps> = ({ spell, isPrepared, slotsAvailable, onPrepare, onCast }) => {
    const isRitual = spell.ritual;
    const isConcentration = spell.duration.type === 'concentration';

    return (
        <div className={`
      relative p-4 rounded-lg border transition-all duration-200 group
      ${isPrepared
                ? 'bg-stone-900 border-stone-600 shadow-lg shadow-black/50'
                : 'bg-stone-950 border-stone-800 opacity-80 hover:opacity-100 hover:border-stone-700'
            }
    `}>
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-stone-950 border border-stone-800">
                        <SchoolIcon school={spell.school} />
                    </div>
                    <div>
                        <h3 className={`font-cinzel text-lg leading-none ${isPrepared ? 'text-stone-100' : 'text-stone-400'}`}>
                            {spell.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                            <span>{spell.school}</span>
                            <span>•</span>
                            <span>Level {spell.level}</span>
                        </div>
                    </div>
                </div>

                {/* Toggle Prepare Button */}
                <button
                    onClick={onPrepare}
                    className={`
            p-1.5 rounded-full transition-colors
            ${isPrepared
                            ? 'text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20'
                            : 'text-stone-600 hover:text-stone-400 hover:bg-stone-800'
                        }
          `}
                    title={isPrepared ? "Unprepare" : "Prepare"}
                >
                    <Book className="w-4 h-4" />
                </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
                {isRitual && (
                    <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider rounded bg-stone-800 text-stone-400 border border-stone-700">
                        Ritual
                    </span>
                )}
                {isConcentration && (
                    <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider rounded bg-indigo-950/30 text-indigo-400 border border-indigo-900/30">
                        Concentration
                    </span>
                )}
                <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider rounded bg-stone-900 text-stone-500 border border-stone-800">
                    {spell.castingTime}
                </span>
            </div>

            {/* Description Snippet */}
            <p className="text-sm text-stone-400 line-clamp-2 mb-4 font-serif leading-relaxed">
                {spell.description}
            </p>

            {/* Actions */}
            {isPrepared && (
                <div className="pt-3 mt-3 border-t border-stone-800 flex justify-end">
                    <button
                        onClick={onCast}
                        disabled={!slotsAvailable && !isRitual} // Allow casting if ritual (assuming out of combat/resource logic elsewhere) or slots avail
                        className={`
                    px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded
                    transition-all duration-200 flex items-center gap-2
                    ${slotsAvailable
                                ? 'bg-red-900/50 text-red-200 hover:bg-red-800/50 border border-red-900'
                                : 'bg-stone-900 text-stone-600 cursor-not-allowed border border-stone-800'
                            }
                `}
                    >
                        <Zap className="w-3 h-3" />
                        Cast
                    </button>
                </div>
            )}
        </div>
    );
};
