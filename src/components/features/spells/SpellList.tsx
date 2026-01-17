import React, { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { initialSpellsV3 } from '../../../data/spellsV3';
import { SpellCard } from './SpellCard';
import { spellPrepared, spellUnprepared, slotExpended } from '../../../store/slices/spellbookSlice';
import { concentrationSet } from '../../../store/slices/characterSlice';
import { CastModal } from './CastModal';
import { SpellV3 } from '../../../schemas/spellSchema';
import { SpellInfoModal } from './SpellInfoModal';

export const SpellList: React.FC = () => {
    const dispatch = useAppDispatch();

    // Selectors
    const preparedSpells = useAppSelector(state => state.spellbook.preparedSpellIds);
    // Use spellbook slots (Source of Truth)
    const characterSlots = useAppSelector(state => state.spellbook.availableSlots);

    // Derived available slots for UI compatibility
    const availableSlots = useMemo(() => {
        const avail: Record<number, number> = {};
        Object.keys(characterSlots).forEach(key => {
            const level = Number(key);
            const slots = characterSlots[level];
            avail[level] = Math.max(0, slots);
        });
        return avail;
    }, [characterSlots]);

    // UI State
    const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
    const [filterClass, setFilterClass] = useState<'Warlock' | 'all'>('Warlock');
    const [showPreparedOnly, setShowPreparedOnly] = useState(false);
    const [castingSpell, setCastingSpell] = useState<SpellV3 | null>(null);
    const [infoSpellSlug, setInfoSpellSlug] = useState<string | null>(null);

    // Grouping Logic
    const groupedSpells = useMemo(() => {
        let spells = initialSpellsV3;

        // Class Filter
        if (filterClass === 'Warlock') {
            spells = spells.filter(s => s.classes?.includes('Warlock'));
        }

        if (showPreparedOnly) {
            spells = spells.filter(s => preparedSpells.includes(s.id));
        }

        if (filterLevel !== 'all') {
            spells = spells.filter(s => s.level === filterLevel);
        }

        // Group by level
        const groups: Record<number, typeof spells> = {};
        spells.forEach(spell => {
            if (!groups[spell.level]) {
                groups[spell.level] = [];
            }
            groups[spell.level].push(spell);
        });

        return groups;
    }, [filterLevel, filterClass, showPreparedOnly, preparedSpells]);

    const handlePrepareToggle = (spellId: string) => {
        if (preparedSpells.includes(spellId)) {
            dispatch(spellUnprepared(spellId));
        } else {
            dispatch(spellPrepared(spellId));
        }
    };

    const handleCastConfirm = (slotLevel: number) => {
        if (castingSpell) {
            // 1. Consume Slot
            if (slotLevel > 0) { // Cantrips match slot 0 but don't consume? Actually logic handles cantrips by not confirming with >0 usually.
                // But wait, cantrips don't use slots.
                dispatch(slotExpended({ level: slotLevel }));
            }

            // 2. Set Concentration
            if (castingSpell.duration.type === 'concentration') {
                dispatch(concentrationSet(castingSpell.name));
            }

            setCastingSpell(null);
        }
    };

    // Helper to check if currently concentrating (for the warning in CastModal)
    const currentConcentration = useAppSelector(state => state.character.concentration);

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-stone-950 border border-stone-900 sticky top-0 z-10 shadow-xl backdrop-blur-md bg-stone-950/90">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 uppercase tracking-wider font-bold">Class:</span>
                    <button
                        onClick={() => setFilterClass(prev => prev === 'Warlock' ? 'all' : 'Warlock')}
                        className={`px-3 py-1 text-xs rounded border transition-colors ${filterClass === 'Warlock'
                            ? 'bg-purple-900/20 text-purple-400 border-purple-900/50'
                            : 'bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-700'
                            }`}
                    >
                        {filterClass === 'Warlock' ? 'Warlock Only' : 'All Spells'}
                    </button>
                </div>

                <div className="h-4 w-px bg-stone-800 hidden sm:block" />

                <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 uppercase tracking-wider font-bold">Show:</span>
                    <button
                        onClick={() => setShowPreparedOnly(!showPreparedOnly)}
                        className={`px-3 py-1 text-xs rounded border transition-colors ${showPreparedOnly
                            ? 'bg-yellow-900/20 text-yellow-500 border-yellow-900/50'
                            : 'bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-700'
                            }`}
                    >
                        Prepared Only
                    </button>
                </div>

                <div className="h-4 w-px bg-stone-800 hidden sm:block" />

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-gradient-r w-full sm:w-auto">
                    <button
                        onClick={() => setFilterLevel('all')}
                        className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${filterLevel === 'all' ? 'text-white font-bold' : 'text-stone-500 hover:text-stone-300'
                            }`}
                    >
                        All
                    </button>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                        <button
                            key={level}
                            onClick={() => setFilterLevel(level)}
                            className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${filterLevel === level
                                ? 'bg-stone-800 text-white'
                                : 'text-stone-500 hover:text-stone-300'
                                }`}
                        >
                            {level === 0 ? 'Cnt' : `Lvl ${level}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Spell List */}
            <div className="space-y-8 pb-20">
                {Object.entries(groupedSpells).sort(([a], [b]) => Number(a) - Number(b)).map(([level, spells]) => (
                    <div key={level} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-stone-500 font-cinzel border-b border-stone-800 pb-2 mb-6 flex justify-between items-end max-w-7xl mx-auto">
                            <span>{Number(level) === 0 ? 'Cantrips' : `Level ${level} Spells`}</span>
                            {Number(level) > 0 && (
                                <span className="text-xs font-sans text-stone-600 font-bold tracking-widest uppercase">
                                    {availableSlots[Number(level)] || 0} Slots Available
                                </span>
                            )}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            {spells.map(spell => (
                                <SpellCard
                                    key={spell.id}
                                    spell={spell}
                                    isPrepared={preparedSpells.includes(spell.id)}
                                    // Logic: Can cast if Cantrip OR (Not Cantrip AND has slots >= spell level)
                                    slotsAvailable={spell.level === 0 || Object.entries(availableSlots).some(([lvl, count]) => Number(lvl) >= spell.level && count > 0)}
                                    onPrepare={() => handlePrepareToggle(spell.id)}
                                    onCast={() => setCastingSpell(spell)}
                                    onInfo={() => setInfoSpellSlug(spell.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {Object.keys(groupedSpells).length === 0 && (
                    <div className="text-center py-12 text-stone-600 italic">
                        No spells found matching your criteria.
                    </div>
                )}
            </div>

            {/* Cast Modal */}
            {castingSpell && (
                <CastModal
                    spell={castingSpell}
                    availableSlots={availableSlots}
                    onConfirm={handleCastConfirm}
                    onCancel={() => setCastingSpell(null)}
                    isConcentrating={!!currentConcentration}
                />
            )}

            {infoSpellSlug && (
                <SpellInfoModal
                    spellSlug={infoSpellSlug}
                    onClose={() => setInfoSpellSlug(null)}
                />
            )}
        </div>
    );
};
