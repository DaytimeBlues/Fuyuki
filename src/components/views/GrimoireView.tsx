import { useState } from 'react';
import { magicSchools } from '../../data/lore';
import { BookOpen, ChevronRight, Crown } from 'lucide-react';

export function GrimoireView() {
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-lg border border-white/20">
                    <BookOpen className="text-white" size={20} />
                </div>
                <div>
                    <h2 className="font-display text-xl text-parchment-light tracking-wider">Grimoire</h2>
                    <p className="text-xs text-muted">Schools of Magic</p>
                </div>
            </div>

            <div className="space-y-3">
                {magicSchools.map((school) => (
                    <div
                        key={school.name}
                        className={`card-parchment overflow-hidden transition-all duration-300 ${selectedSchool === school.name ? 'ring-1 ring-white/30 shadow-[0_0_20px_rgba(255,255,255,0.08)]' : ''
                            }`}
                    >
                        <button
                            onClick={() => setSelectedSchool(selectedSchool === school.name ? null : school.name)}
                            className="w-full p-4 flex items-center justify-between text-left relative z-10"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full transition-colors ${school.name === 'Necromancy'
                                    ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse'
                                    : 'bg-white/30'
                                    }`} />
                                <span className={`font-display text-base tracking-wide transition-colors ${selectedSchool === school.name ? 'text-white' : 'text-parchment-light'
                                    }`}>
                                    {school.name}
                                </span>
                                {school.name === 'Necromancy' && (
                                    <span className="text-[9px] text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                                        Specialty
                                    </span>
                                )}
                            </div>
                            <ChevronRight
                                size={18}
                                className={`text-muted transition-all duration-300 ${selectedSchool === school.name ? 'rotate-90 text-white' : ''
                                    }`}
                            />
                        </button>

                        {selectedSchool === school.name && (
                            <div className="px-4 pb-4 relative z-10">
                                <div className="border-l-2 border-white/20 pl-4 mb-4">
                                    <p className="text-sm text-parchment leading-relaxed">
                                        {school.description}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Crown size={14} className="text-white" />
                                        <h4 className="text-xs font-display text-parchment-light uppercase tracking-widest">
                                            Famous Practitioners
                                        </h4>
                                    </div>
                                    {school.famousWizards.map((wizard) => (
                                        <div key={wizard.name} className="bg-card-elevated/60 rounded-lg p-3 border border-white/10">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-sm font-display text-parchment-light">{wizard.name}</span>
                                                <span className="text-[9px] text-white/60 uppercase tracking-wider">{wizard.title}</span>
                                            </div>
                                            <p className="text-xs text-muted italic">"{wizard.desc}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
