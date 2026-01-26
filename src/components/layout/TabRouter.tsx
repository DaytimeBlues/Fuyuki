import { lazy, Suspense } from 'react';
import type { CharacterData, AbilityKey } from '../../types';
import type { AppDispatch } from '../../store';
import {
    wildShapeStarted,
    wildShapeEnded,
    wildShapeDamageTaken,
    wildShapeHpChanged,
    conditionRemoved,
} from '../../store/slices/healthSlice';
import { WildShapeWidget } from '../widgets/WildShapeWidget';

const DashboardView = lazy(() => import('../views/DashboardView').then(m => ({ default: m.DashboardView })));
const SpellsView = lazy(() => import('../views/SpellsView'));
const CombatView = lazy(() => import('../views/CombatView').then(m => ({ default: m.CombatView })));
const CharacterHubView = lazy(() => import('../views/CharacterHubView').then(m => ({ default: m.CharacterHubView })));
const MoreView = lazy(() => import('../views/MoreView').then(m => ({ default: m.MoreView })));
const GearView = lazy(() => import('../views/GearView').then(m => ({ default: m.GearView })));
const SettingsView = lazy(() => import('../views/SettingsView').then(m => ({ default: m.SettingsView })));


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
    onLevelChange: (level: number) => void;
    onAbilityChange: (ability: AbilityKey, score: number) => void;
    onSpendHitDie: (healed: number, diceSpent: number) => void;
    onShortRest: () => void;
    onLongRest: () => void;
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
    onLevelChange,
    onAbilityChange,
    onSpendHitDie,
    onShortRest,
    onLongRest,
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
                    case 'gear':
                        return (
                            <div className="animate-fade-in">
                                <GearView />
                            </div>
                        );
                    case 'character':
                        return (
                            <CharacterHubView
                                character={character}
                                actions={{
                                    itemAttuned,
                                    itemUnattuned,
                                    conditionRemoved: (condition: string) => dispatch(conditionRemoved(condition))
                                }}
                            />
                        );
                    case 'more':
                        return <MoreView onSelectView={onNavigate} />;
                    case 'settings':
                        return (
                            <SettingsView
                                character={character}
                                actions={{
                                    itemAttuned,
                                    itemUnattuned,
                                    conditionRemoved: (condition: string) => dispatch(conditionRemoved(condition))
                                }}
                                onLevelChange={onLevelChange}
                                onAbilityChange={onAbilityChange}
                                onSpendHitDie={onSpendHitDie}
                                onShortRest={onShortRest}
                                onLongRest={onLongRest}
                            />
                        );
                    default:
                        return null;
                }
            })()}
        </Suspense>
    );
}
