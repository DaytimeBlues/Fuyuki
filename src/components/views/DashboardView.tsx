import { HealthWidget } from '../widgets/HealthWidget';
import { PactSlotsWidget } from '../widgets/PactSlotsWidget';
import { ArcanumWidget } from '../widgets/ArcanumWidget';
import { ConcentrationWidget } from '../widgets/ConcentrationWidget';
import { DeathSavesWidget } from '../widgets/DeathSavesWidget';
import { useAppDispatch } from '../../store/hooks';
import { concentrationSet } from '../../store/slices/characterSlice';
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

    return (
        <div className="animate-fade-in space-y-6 pb-20">
            {/* Vitals Section */}
            <section>
                <h3 className="text-xs font-kyoto uppercase tracking-widest text-muted mb-3 pl-1">Vitals</h3>
                <div className="stagger-1">
                    <HealthWidget
                        current={character.hp.current}
                        max={character.hp.max}
                        temp={character.hp.temp}
                        onChange={updateHealth}
                        onTempChange={updateTempHP}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                    <div className="stagger-2">
                        <ConcentrationWidget
                            spell={character.concentration}
                            suggestions={spells
                                .filter(s => s.concentration)
                                .filter(s => getRequiredLevelForSpell(s.lvl) <= character.level)
                                .map(s => s.name)}
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
                <h3 className="text-xs font-kyoto uppercase tracking-widest text-muted mb-3 pl-1 border-t border-white/5 pt-4">Resources</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div className="stagger-4">
                        <PactSlotsWidget />
                    </div>
                    <div className="stagger-5">
                        <ArcanumWidget />
                    </div>
                </div>
            </section>
        </div>
    );
}
