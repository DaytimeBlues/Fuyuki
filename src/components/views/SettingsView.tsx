import { CharacterEditor } from '../widgets/CharacterEditor';
import { RestView } from './RestView';
import { CharacterHubView } from './CharacterHubView';
import { CharacterData, AbilityKey } from '../../types';

interface SettingsViewProps {
    character: CharacterData;
    actions: {
        itemAttuned: (itemName: string) => void;
        itemUnattuned: (index: number) => void;
        conditionRemoved: (condition: string) => void;
    };
    onLevelChange: (level: number) => void;
    onAbilityChange: (ability: AbilityKey, score: number) => void;
    onSpendHitDie: (healed: number, diceSpent: number) => void;
    onShortRest: () => void;
    onLongRest: () => void;
}

export function SettingsView({
    character,
    actions,
    onLevelChange,
    onAbilityChange,
    onSpendHitDie,
    onShortRest,
    onLongRest,
}: SettingsViewProps) {
    return (
        <div className="animate-fade-in space-y-8 pb-24">
            {/* Character Editor Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <h2 className="text-xs font-kyoto uppercase tracking-[0.2em] text-muted">Core Stats</h2>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>
                
                <CharacterEditor
                    data={character}
                    onLevelChange={onLevelChange}
                    onAbilityChange={onAbilityChange}
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
                        onSpendHitDie={onSpendHitDie}
                        onShortRest={onShortRest}
                        onLongRest={onLongRest}
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
