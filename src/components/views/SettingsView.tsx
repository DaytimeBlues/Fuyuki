import { CharacterEditor } from '../widgets/CharacterEditor';
import { RestView } from './RestView';
import { CharacterHubView } from './CharacterHubView';
import { CharacterData } from '../../types';
import { AppDispatch } from '../../store';
import { levelChanged, abilityScoreChanged } from '../../store/slices/statSlice';
import { hitDiceSpent, longRestHealth } from '../../store/slices/healthSlice';
import { shortRestWarlock, longRestWarlock } from '../../store/slices/warlockSlice';

interface SettingsViewProps {
    character: CharacterData;
    dispatch: AppDispatch;
    onNavigate: (tab: string) => void;
    actions: {
        itemAttuned: (itemName: string) => void;
        itemUnattuned: (index: number) => void;
    };
}

export function SettingsView({ character, dispatch, onNavigate, actions }: SettingsViewProps) {
    return (
        <div className="animate-fade-in space-y-8 pb-24">
            <button
                onClick={() => onNavigate('more')}
                className="mb-4 flex items-center gap-1 text-sm text-accent hover:text-white transition-colors"
            >
                ← Back to Menu
            </button>

            {/* Character Editor Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <h2 className="text-xs font-kyoto uppercase tracking-[0.2em] text-muted">Core Stats</h2>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>
                
                <CharacterEditor
                    data={character}
                    onLevelChange={(l) => dispatch(levelChanged(l))}
                    onAbilityChange={(a, s) => dispatch(abilityScoreChanged({ ability: a, newScore: s }))}
                />
            </section>

            {/* Rest Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <h2 className="text-xs font-kyoto uppercase tracking-[0.2em] text-muted">Rest & Recovery</h2>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                {/* Wrapper with compact RestView */}
                <div className="bg-white/5 rounded-lg border border-white/5 p-4 relative overflow-hidden">
                    <RestView
                        hitDice={character.hitDice}
                        conMod={character.abilityMods.con}
                        currentHP={character.hp.current}
                        maxHP={character.hp.max}
                        onSpendHitDie={(healed, diceSpent) => dispatch(hitDiceSpent({ count: diceSpent, healed }))}
                        onShortRest={() => dispatch(shortRestWarlock())}
                        onLongRest={() => {
                            dispatch(longRestHealth());
                            dispatch(longRestWarlock());
                        }}
                        compact={true}
                    />
                </div>
            </section>

            {/* Character Details (Hub) */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <h2 className="text-xs font-kyoto uppercase tracking-[0.2em] text-muted">Details</h2>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>
                
                <CharacterHubView
                    character={character}
                    actions={actions}
                />
            </section>
        </div>
    );
}
