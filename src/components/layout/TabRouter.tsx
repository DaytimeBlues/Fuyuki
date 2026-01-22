import { lazy, Suspense } from 'react';
import type { CharacterData } from '../../types';
import type { AppDispatch } from '../../store';
import {
    wildShapeStarted,
    wildShapeEnded,
    wildShapeDamageTaken,
    wildShapeHpChanged,
} from '../../store/slices/healthSlice';
import { WildShapeWidget } from '../widgets/WildShapeWidget';

const DashboardView = lazy(() => import('../views/DashboardView').then(m => ({ default: m.DashboardView })));
const SpellsView = lazy(() => import('../views/SpellsView'));
const CombatView = lazy(() => import('../views/CombatView').then(m => ({ default: m.CombatView })));
const CharacterHubView = lazy(() => import('../views/CharacterHubView').then(m => ({ default: m.CharacterHubView })));
const MoreView = lazy(() => import('../views/MoreView').then(m => ({ default: m.MoreView })));
const InventoryView = lazy(() => import('../views/InventoryView').then(m => ({ default: m.InventoryView })));
const PatronView = lazy(() => import('../views/PatronView').then(m => ({ default: m.PatronView })));
const GrimoireView = lazy(() => import('../views/GrimoireView').then(m => ({ default: m.GrimoireView })));

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
                                <CharacterHubView
                                    character={character}
                                    actions={{ itemAttuned, itemUnattuned }}
                                />
                            </div>
                        );
                    default:
                        return null;
                }
            })()}
        </Suspense>
    );
}
