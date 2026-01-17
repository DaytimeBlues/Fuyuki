
import SpellsView from '../views/SpellsView';
import { CombatView } from '../views/CombatView';
import { DashboardView } from '../views/DashboardView';
import { CharacterHubView } from '../views/CharacterHubView';
import { MoreView } from '../views/MoreView';
import { RestView } from '../views/RestView';
import { InventoryView } from '../views/InventoryView';
import { CharacterEditor } from '../widgets/CharacterEditor';
import { InitiativeWidget } from '../widgets/InitiativeWidget';
import { ProficiencyWidget } from '../widgets/ProficiencyWidget';
import { SavingThrowsWidget } from '../widgets/SavingThrowsWidget';
import { WildShapeWidget } from '../widgets/WildShapeWidget';
import { MulticlassSpellSlotsWidget } from '../widgets/MulticlassSpellSlotsWidget';
import { GrimoireView } from '../views/GrimoireView';
import type { CharacterData, AbilityKey } from '../../types';
import type { AppDispatch } from '../../store';
import {
    wildShapeStarted,
    wildShapeEnded,
    wildShapeDamageTaken,
    wildShapeHpChanged,
    slotsUpdated
} from '../../store/slices/characterSlice';

interface TabRouterProps {
    activeTab: string;
    onNavigate: (tab: string) => void;
    // Shared state/actions needed by views
    character: CharacterData;
    dispatch: AppDispatch;
    updateHealth: (hp: number) => void;
    updateTempHP: (hp: number) => void;
    updateDeathSaves: (type: 'successes' | 'failures', value: number) => void;
    handleSpendHitDie: (healed: number, diceSpent: number) => void;
    handleShortRest: () => void;
    handleLongRest: () => void;
    handleLevelChange: (level: number) => void;
    handleAbilityChange: (ability: AbilityKey, score: number) => void;
    itemAttuned: (itemName: string) => void;
    itemUnattuned: (index: number) => void;
}

export function TabRouter({
    activeTab,
    onNavigate,
    character,
    dispatch,
    updateHealth,
    updateTempHP,
    updateDeathSaves,
    handleSpendHitDie,
    handleShortRest,
    handleLongRest,
    handleLevelChange,
    handleAbilityChange,
    itemAttuned,
    itemUnattuned
}: TabRouterProps) {
    switch (activeTab) {
        case 'stats':
            return (
                <DashboardView
                    character={character}
                    updateHealth={updateHealth}
                    updateTempHP={updateTempHP}
                    updateDeathSaves={updateDeathSaves}
                />
            );
        case 'spells':
            return (
                <div className="animate-fade-in">
                    <SpellsView />
                </div>
            );
        case 'combat':
            return (
                <div className="animate-fade-in">
                    <CombatView />
                    {/* 
                      TODO: Wire up WildShapeWidget to Redux. 
                      Currently passing undefined props would fail if widget requires them.
                      Assuming WildShapeWidget needs refactoring to Redux or passing props from 'character'.
                      CharacterData has 'transformed'.
                    */}
                    {character.transformed && (
                        <WildShapeWidget
                            transformed={character.transformed}
                            originalHP={character.hp.current} // This might be wrong if current is transformed HP. Logic needs checking.
                            onTransform={(creature) => dispatch(wildShapeStarted(creature))}
                            onDamage={(damage) => {
                                dispatch(wildShapeDamageTaken(damage));
                                // Actual logic handled in slice, return dummy to satisfy prop
                                return { revert: false, carryoverDamage: 0 };
                            }}
                            onRevert={() => dispatch(wildShapeEnded())}
                            onHeal={(amount) => {
                                if (character.transformed) {
                                    const newHp = character.transformed.hp.current + amount;
                                    dispatch(wildShapeHpChanged(newHp));
                                }
                            }}
                        />
                    )}
                </div>
            );
        case 'grimoire':
            return (
                <div className="animate-fade-in">
                    <GrimoireView />
                </div>
            );
        case 'character':
            return (
                <CharacterHubView
                    character={character}
                    dispatch={dispatch}
                    actions={{ itemAttuned, itemUnattuned }}
                />
            );
        case 'more':
            return <MoreView onSelectView={onNavigate} />;
        case 'inventory':
            return (
                <div className="animate-fade-in">
                    <button
                        onClick={() => onNavigate('more')}
                        className="mb-4 flex items-center gap-1 text-sm text-accent hover:text-white transition-colors"
                    >
                        ← Back to Menu
                    </button>
                    <InventoryView />
                </div>
            );
        case 'settings':
            return (
                <div className="animate-fade-in">
                    <button
                        onClick={() => onNavigate('more')}
                        className="mb-4 flex items-center gap-1 text-sm text-accent hover:text-white transition-colors"
                    >
                        ← Back to Menu
                    </button>
                    <CharacterEditor
                        data={character}
                        onLevelChange={handleLevelChange}
                        onAbilityChange={handleAbilityChange}
                    />
                    <InitiativeWidget
                        dexMod={character.abilityMods.dex}
                        profBonus={character.profBonus}
                    />
                    <ProficiencyWidget
                        profBonus={character.profBonus}
                        level={character.level}
                    />
                    <SavingThrowsWidget
                        abilityMods={character.abilityMods}
                        profBonus={character.profBonus}
                        savingThrowProficiencies={character.savingThrowProficiencies}
                    />
                    <div className="mt-8 border-t border-white/5 pt-8">
                        <RestView
                            hitDice={character.hitDice}
                            conMod={character.abilityMods.con}
                            currentHP={character.hp.current}
                            maxHP={character.hp.max}
                            onSpendHitDie={handleSpendHitDie}
                            onShortRest={handleShortRest}
                            onLongRest={handleLongRest}
                        />
                    </div>
                    <div className="mt-8 border-t border-white/5 pt-8">
                        <MulticlassSpellSlotsWidget
                            currentSlots={character.slots}
                            onSlotsCalculated={(slots) => dispatch(slotsUpdated(slots))}
                        />
                    </div>
                </div>
            );
        default:
            return null;
    }
}
