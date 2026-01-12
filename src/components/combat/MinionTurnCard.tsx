import React from 'react';
import type { Minion } from '../../types';
import { undeadStats } from '../../data/undeadStats';

interface MinionTurnCardProps {
    minion: Minion;
    onRollFormula: (label: string, formula: string) => void;
}

export function MinionTurnCard(props: MinionTurnCardProps) {
    const { minion } = props;

    // 1. Find the stat block to get actions
    // This looks up "Skeleton", "Zombie", etc.
    // Note: minion.type matches the 'name' field in undeadStats loosely or strictly
    const stats = undeadStats.find(s => s.name.startsWith(minion.type));

    if (!stats) return null;

    return (
        <div className="card-parchment p-4 mb-4 border-l-4 border-l-purple-500">
            <h3 className="font-display text-lg text-parchment-light mb-1">
                {minion.name} <span className="text-muted text-sm">({minion.type})</span>
            </h3>

            <div className="text-xs text-muted mb-3 flex gap-4">
                <span>HP: {minion.hp.current}/{minion.hp.max}</span>
                <span>AC: {minion.ac}</span>
            </div>

            <div className="space-y-3">
                {stats.actions.map((action) => {
                    // Quick parse for to-hit and damage
                    // Format typically: "Melee Weapon Attack: +4 to hit..."
                    const toHitMatch = action.desc.match(/\+(\d+) to hit/);
                    const damageMatch = action.desc.match(/Hit: \d+ \(([^)]+)\)/); // Matches "Hit: 5 (1d6 + 2)"

                    const toHit = toHitMatch ? parseInt(toHitMatch[1]) : 0;
                    const damageFormula = damageMatch ? damageMatch[1] : null;

                    return (
                        <div key={action.name} className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="font-display text-sm text-parchment-light">{action.name}</div>
                            <div className="text-xs text-muted italic mb-2">{action.desc}</div>

                            <div className="flex flex-wrap gap-2">
                                {/* Attack Roll Button */}
                                {toHitMatch && (
                                    <button
                                        className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors text-xs text-parchment border border-white/10"
                                        onClick={() => props.onRollFormula(
                                            `${minion.name}: ${action.name} Attack`,
                                            `1d20+${toHit}`
                                        )}
                                    >
                                        Attack (1d20+{toHit})
                                    </button>
                                )}

                                {/* Damage Roll Button */}
                                {damageFormula && (
                                    <button
                                        className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors text-xs text-parchment border border-white/10"
                                        onClick={() => props.onRollFormula(
                                            `${minion.name}: ${action.name} Damage`,
                                            damageFormula
                                        )}
                                    >
                                        Damage ({damageFormula})
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
