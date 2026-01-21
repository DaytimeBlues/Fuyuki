import { lazy, Suspense } from 'react';
import type { CharacterData, AbilityKey } from '../../types';
import type { AppDispatch } from '../../store';
import {
    wildShapeStarted,
    wildShapeEnded,
    wildShapeDamageTaken,
    wildShapeHpChanged,
} from '../../store/slices/healthSlice';
import { slotsUpdated } from '../../store/slices/statSlice';
import { InitiativeWidget } from '../widgets/InitiativeWidget';
import { ProficiencyWidget } from '../widgets/ProficiencyWidget';
import { SavingThrowsWidget } from '../widgets/SavingThrowsWidget';
import { WildShapeWidget } from '../widgets/WildShapeWidget';
import { MulticlassSpellSlotsWidget } from '../widgets/MulticlassSpellSlotsWidget';
import { RestView } from '../views/RestView';
import { CharacterEditor } from '../widgets/CharacterEditor';

const DashboardView = lazy(() => import('../views/DashboardView').then(m => ({ default: m.DashboardView })));
const SpellsView = lazy(() => import('../views/SpellsView')));
const CombatView = lazy(() => import('../views/CombatView').then(m => ({ default: m.CombatView })));
const CharacterHubView = lazy(() => import('../views/CharacterHubView').then(m => ({ default: m.CharacterHubView })));
const MoreView = lazy(() => import('../views/MoreView').then(m => ({ default: m.MoreView })));
const InventoryView = lazy(() => import('../views/InventoryView').then(m => ({ default: m.InventoryView })));
const PatronView = lazy(() => import('../views/PatronView').then(m => ({ default: m.PatronView })));
const GrimoireView = lazy(() => import('../views/GrimoireView').then(m => ({ default: m.GrimoireView })));
const WeaponsView = lazy(() => import('../views/WeaponsView').then(m => ({ default: m.WeaponsView })));

function ViewFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse text-muted">Loading...</div>
        </div>
    );
}

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
    return (
        <Suspense fallback={<ViewFallback />}>
            {(() => {
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
                                {character.transformed && (
                                    <WildShapeWidget
                                        transformed={character.transformed}
                                        originalHP={character.hp.current}
                                        onTransform={(creature) => dispatch(wildShapeStarted(creature))}
                                        onDamage={(damage) => {
                                            dispatch(wildShapeDamageTaken(damage));
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
                                actions={{ itemAttuned, itemUnattuned }}
                            />
                        );
                    case 'more':
                        return <MoreView onSelectView={onNavigate} />;
                    case 'patron':
                        return (
                            <div className="animate-fade-in">
                                <button
                                    onClick={() => onNavigate('more')}
                                    className="mb-4 flex items-center gap-1 text-sm text-accent hover:text-white transition-colors"
                                >
                                    ← Back to Menu
                                </button>
                                <PatronView />
                            </div>
                        );
                    case 'inventory':
                        return (
                            <div className="animate-fade-in">
                                <button
                                    onClick={() => onNavigate('more')}
                                    className="mb-4 flex items-center gap-1 text-sm text-accent hover:text-white transition-colors"
                                >
                                    ← Back to Menu
                                </button>
                                <WeaponsView />
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
            })()}
        </Suspense>
    );
}

