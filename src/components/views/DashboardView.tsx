import { HealthWidget } from '../widgets/HealthWidget';
import { PactSlotsWidget } from '../widgets/PactSlotsWidget';
import { ArcanumWidget } from '../widgets/ArcanumWidget';
import { ConcentrationWidget } from '../widgets/ConcentrationWidget';
import { DeathSavesWidget } from '../widgets/DeathSavesWidget';
import { TrinketWidget } from '../widgets/TrinketWidget';
import { useAppDispatch } from '../../store/hooks';
import { concentrationSet } from '../../store/slices/healthSlice';
import { getRequiredLevelForSpell } from '../../utils/spellRules';
import { spells } from '../../data/spells';

import type { CharacterData } from '../../types';

interface DashboardViewProps {
    character: CharacterData;
    updateHealth: (val: number) => void;
    updateTempHP: (val: number) => void;
    updateDeathSaves: (type: 'successes' | 'failures', val: number) => void;
}

export function DashboardView({ character, updateHealth, updateTempHP, updateDeathSaves }: DashboardViewProps) {
    const dispatch = useAppDispatch();
    const concentrationSuggestions = spells
        .filter(s => s.concentration)
        .filter(s => getRequiredLevelForSpell(s.lvl) <= character.level)
        .map(s => s.name);

    return (
        <div className="animate-fade-in space-y-6 pb-20">
            {/* Vitals Section */}
            <section>
                <div>
                    <h3 className="text-xs font-kyoto uppercase tracking-widest text-muted mb-1 pl-1">Vitals</h3>
                    <div className="text-[10px] font-japanese text-muted opacity-50 mb-3 pl-1 tracking-widest">活力</div>
                </div>
                <div className="stagger-1 animate-slide-up">
                    <HealthWidget
                        current={character.hp.current}
                        max={character.hp.max}
                        temp={character.hp.temp}
                        onChange={updateHealth}
                        onTempChange={updateTempHP}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                    <div className="stagger-2 animate-slide-up">
                        <ConcentrationWidget
                            spell={character.concentration}
                            suggestions={concentrationSuggestions.length ? concentrationSuggestions : undefined}
                            onClear={() => dispatch(concentrationSet(null))}
                            onSet={(spell) => dispatch(concentrationSet(spell))}
                        />
                    </div>

                    {character.hp.current <= 0 && (
                        <div className="stagger-3 animate-slide-up">
                            <DeathSavesWidget
                                successes={character.deathSaves.successes}
                                failures={character.deathSaves.failures}
                                onChange={updateDeathSaves}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Resources Section */}
            <section>
                <div className="border-t border-white/5 pt-4">
                    <h3 className="text-xs font-kyoto uppercase tracking-widest text-muted mb-1 pl-1">Resources</h3>
                    <div className="text-[10px] font-japanese text-muted opacity-50 mb-3 pl-1 tracking-widest">資源</div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div className="stagger-4 animate-slide-up">
                        <PactSlotsWidget />
                    </div>
                    <div className="stagger-5 animate-slide-up">
                        <ArcanumWidget />
                    </div>
                </div>
            </section>

            {/* Curiosities Section */}
            <section>
                <div className="border-t border-white/5 pt-4">
                    <h3 className="text-xs font-kyoto uppercase tracking-widest text-muted mb-1 pl-1">Curiosities</h3>
                    <div className="text-[10px] font-japanese text-muted opacity-50 mb-3 pl-1 tracking-widest">好奇心</div>
                </div>
                <div className="stagger-6 animate-slide-up grid grid-cols-1 gap-4">
                    <TrinketWidget />
                </div>
            </section>
        </div>
    );
}
