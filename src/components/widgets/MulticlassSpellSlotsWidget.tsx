import { useState } from 'react';
import { BookOpen, Plus, Minus, RefreshCw } from 'lucide-react';
import type { ClassLevel, CasterType } from '../../utils/spellSlotCalculator';
import {
    calculateCasterLevel,
    getSpellSlots,
    formatClassLevels
} from '../../utils/spellSlotCalculator';

interface MulticlassSpellSlotsWidgetProps {
    onSlotsCalculated: (slots: Record<number, { used: number; max: number }>) => void;
}

const CASTER_CLASSES = [
    { name: 'Wizard', type: 'full' as CasterType },
    { name: 'Cleric', type: 'full' as CasterType },
    { name: 'Druid', type: 'full' as CasterType },
    { name: 'Bard', type: 'full' as CasterType },
    { name: 'Sorcerer', type: 'full' as CasterType },
    { name: 'Paladin', type: 'half' as CasterType },
    { name: 'Ranger', type: 'half' as CasterType },
    { name: 'Eldritch Knight', type: 'third' as CasterType },
    { name: 'Arcane Trickster', type: 'third' as CasterType },
];

export function MulticlassSpellSlotsWidget({ onSlotsCalculated }: MulticlassSpellSlotsWidgetProps) {
    const [classLevels, setClassLevels] = useState<ClassLevel[]>([
        { className: 'Wizard', level: 5, casterType: 'full' }
    ]);
    const [showConfig, setShowConfig] = useState(false);

    const casterLevel = calculateCasterLevel(classLevels);
    const slots = getSpellSlots(casterLevel);

    const handleAddClass = () => {
        const availableClasses = CASTER_CLASSES.filter(
            c => !classLevels.some(cl => cl.className === c.name)
        );
        if (availableClasses.length > 0) {
            setClassLevels([...classLevels, {
                className: availableClasses[0].name,
                level: 1,
                casterType: availableClasses[0].type
            }]);
        }
    };

    const handleRemoveClass = (index: number) => {
        if (classLevels.length > 1) {
            setClassLevels(classLevels.filter((_, i) => i !== index));
        }
    };

    const handleLevelChange = (index: number, delta: number) => {
        setClassLevels(classLevels.map((cl, i) => {
            if (i === index) {
                return { ...cl, level: Math.max(1, Math.min(20, cl.level + delta)) };
            }
            return cl;
        }));
    };

    const handleApply = () => {
        const newSlots: Record<number, { used: number; max: number }> = {};
        Object.entries(slots).forEach(([level, max]) => {
            newSlots[parseInt(level)] = { used: 0, max };
        });
        onSlotsCalculated(newSlots);
        setShowConfig(false);
    };

    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">
                        Multiclass Spellcasting
                    </h3>
                </div>
                <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="text-xs text-white hover:text-white/80"
                >
                    {showConfig ? 'Hide' : 'Configure'}
                </button>
            </div>

            {/* Summary */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted">Classes</p>
                        <p className="text-sm text-white">{formatClassLevels(classLevels)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted">Caster Level</p>
                        <p className="text-2xl font-display text-white">{casterLevel}</p>
                    </div>
                </div>
            </div>

            {/* Calculated Slots Preview */}
            <div className="flex flex-wrap gap-2 mb-3">
                {Object.entries(slots).map(([level, max]) => (
                    <div key={level} className="text-center bg-card-elevated rounded px-2 py-1 border border-white/10">
                        <p className="text-[10px] text-muted">Lv{level}</p>
                        <p className="text-sm text-parchment">{max}</p>
                    </div>
                ))}
            </div>

            {/* Configuration Panel */}
            {showConfig && (
                <div className="border-t border-white/10 pt-3 space-y-3">
                    {classLevels.map((cl, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <select
                                value={cl.className}
                                onChange={(e) => {
                                    const newClass = CASTER_CLASSES.find(c => c.name === e.target.value);
                                    if (newClass) {
                                        setClassLevels(classLevels.map((c, i) =>
                                            i === index ? { ...c, className: newClass.name, casterType: newClass.type } : c
                                        ));
                                    }
                                }}
                                className="flex-1 bg-card-elevated border border-white/10 rounded px-2 py-1 text-sm text-parchment focus:outline-none focus:border-white/30"
                            >
                                {CASTER_CLASSES.map(c => (
                                    <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                            </select>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleLevelChange(index, -1)}
                                    className="p-1 text-muted hover:text-parchment"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-6 text-center text-parchment">{cl.level}</span>
                                <button
                                    onClick={() => handleLevelChange(index, 1)}
                                    className="p-1 text-muted hover:text-parchment"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            <span className="text-[10px] text-muted w-12">
                                ({cl.casterType === 'full' ? '1x' : cl.casterType === 'half' ? '½x' : '⅓x'})
                            </span>

                            {classLevels.length > 1 && (
                                <button
                                    onClick={() => handleRemoveClass(index)}
                                    className="text-red-400 hover:text-red-300 text-xs"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}

                    <div className="flex gap-2">
                        <button
                            onClick={handleAddClass}
                            className="flex-1 btn-fantasy text-xs py-2"
                            disabled={classLevels.length >= CASTER_CLASSES.length}
                        >
                            <Plus size={12} className="inline mr-1" />
                            Add Class
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 btn-fantasy text-xs py-2 bg-white/20"
                        >
                            <RefreshCw size={12} className="inline mr-1" />
                            Apply Slots
                        </button>
                    </div>

                    <p className="text-[10px] text-muted opacity-60">
                        Full: Wizard, Cleric, Druid, Bard, Sorcerer (1x) • Half: Paladin, Ranger (½x) • Third: EK, AT (⅓x)
                    </p>
                </div>
            )}
        </div>
    );
}
