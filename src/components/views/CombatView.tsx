import { useState, useMemo } from 'react';
import { Bone, Bolt, Info, ShieldAlert, Skull, Swords, Timer, Users, X, Ghost, Biohazard, ChevronUp, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { minionSelectors, conditionAdded, conditionRemoved, combatLogAdded, reactionToggled, bonusActionToggled } from '../../store/slices/combatSlice';
import { hpChanged, tempHpSet, slotExpended, slotRestored } from '../../store/slices/characterSlice';
import { selectCharacter } from '../../store/slices/characterSlice';
import { MinionDrawer } from '../minions/MinionDrawer';
import { MathStrip } from '../features/combat/MathStrip';
import { PactMagicSlots } from '../combat/PactMagicSlots';
import { undeadStats, type UndeadStatBlock } from '../../data/undeadStats';
import { rollDiceFormula } from '../../utils/dice';

const QUICK_CONDITIONS = [
    'Prone', 'Poisoned', 'Frightened', 'Grappled',
    'Restrained', 'Invisible', 'Stunned', 'Paralyzed'
];

function extractToHit(desc: string): number | null {
    const m = desc.match(/\+\s*(\d+)\s*to hit/i);
    if (!m) return null;
    const n = Number.parseInt(m[1], 10);
    return Number.isFinite(n) ? n : null;
}

function extractDamageFormula(desc: string): string | null {
    const paren = desc.match(/Hit:\s*[^()]*\(([^)]+)\)/i);
    if (paren?.[1]) return paren[1].replace(/\s+/g, '');
    const inline = desc.match(/Hit:\s*([0-9]+d[0-9]+(?:\s*[+-]\s*\d+)*)/i);
    if (inline?.[1]) return inline[1].replace(/\s+/g, '');
    return null;
}

export function CombatView() {
    const dispatch = useAppDispatch();
    const character = useAppSelector(selectCharacter);
    const combat = useAppSelector(state => state.combat);
    const minions = useAppSelector(state => minionSelectors.selectAll(state.combat.minions));

    const [damageInput, setDamageInput] = useState('');
    const [healInput, setHealInput] = useState('');
    const [tempInput, setTempInput] = useState('');
    const [conditionInput, setConditionInput] = useState('');
    const [noteInput, setNoteInput] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStatBlock, setSelectedStatBlock] = useState<UndeadStatBlock | null>(null);
    const [showSummons, setShowSummons] = useState(false);
    const [lastRoll, setLastRoll] = useState<{ label: string; detail: string } | null>(null);

    // Derived state
    const slots = useMemo(() => Object.entries(character.slots).map(([level, info]) => ({
        level: Number(level),
        ...info
    })), [character.slots]);

    const skeletonCount = minions.filter(m => m.type.toLowerCase().includes('skeleton')).length;
    const zombieCount = minions.filter(m => m.type.toLowerCase().includes('zombie')).length;

    // --- Actions ---
    const appendLog = (title: string, detail?: string) => {
        dispatch(combatLogAdded({ type: 'note', title, detail }));
    };

    const handleDamage = () => {
        const amount = Number(damageInput);
        if (!Number.isFinite(amount) || amount <= 0) return;
        dispatch(hpChanged(character.hp.current - amount));
        appendLog(`Took ${amount} damage`);
        setDamageInput('');
    };

    const handleHeal = () => {
        const amount = Number(healInput);
        if (!Number.isFinite(amount) || amount <= 0) return;
        dispatch(hpChanged(character.hp.current + amount));
        appendLog(`Healed ${amount} HP`);
        setHealInput('');
    };

    const handleTempHP = () => {
        const amount = Number(tempInput);
        if (!Number.isFinite(amount) || amount < 0) return;
        dispatch(tempHpSet(amount));
        appendLog(`Temp HP set to ${amount}`);
        setTempInput('');
    };

    const handleAddCondition = (condition: string) => {
        const trimmed = condition.trim();
        if (!trimmed) return;
        dispatch(conditionAdded(trimmed));
        appendLog(`Condition: ${trimmed}`);
        setConditionInput('');
    };

    const handleUseSlot = (level: number) => {
        const slot = character.slots[level];
        if (!slot || slot.used >= slot.max) return;
        dispatch(slotExpended({ level }));
        appendLog(`Used level ${level} slot`);
    };

    const handleRestoreSlot = (level: number) => {
        const slot = character.slots[level];
        if (!slot || slot.used <= 0) return;
        dispatch(slotRestored({ level }));
        appendLog(`Restored level ${level} slot`);
    };

    const openStats = (name: string) => {
        const stats = undeadStats.find(s => s.name.includes(name));
        if (stats) setSelectedStatBlock(stats);
    };

    return (
        <div className="pb-20 space-y-4 animate-fade-in">
            {/* Math Strip */}
            <div className="mb-4 shadow-lg sticky top-0 z-20">
                <MathStrip />
            </div>

            {/* Combat Mode Toggle / Round Tracker */}
            <div className="card-parchment p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Swords size={18} className="text-white" />
                        <h3 className="font-display text-sm text-parchment tracking-wider">Combat Mode</h3>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                        <div className="text-[10px] text-muted uppercase tracking-wider mb-1">Round</div>
                        <div className="flex items-center gap-2">
                            <Timer size={16} className="text-white" />
                            <span className="text-white text-lg font-display">{combat.currentRound}</span>
                        </div>
                    </div>
                    <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                        <div className="text-[10px] text-muted uppercase tracking-wider mb-1">Turn</div>
                        <div className="text-white text-sm">{combat.currentTurnIndex}</div>
                    </div>
                </div>
            </div>

            {/* Vitals Card */}
            <div className="card-parchment p-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                        <div className="text-[10px] text-muted uppercase tracking-wider">HP</div>
                        <div className="text-lg font-display text-white" data-testid="hp-current-display"><span data-testid="hp-current">{character.hp.current}</span>/<span data-testid="hp-max">{character.hp.max}</span></div>
                    </div>
                    <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                        <div className="text-[10px] text-muted uppercase tracking-wider">Temp</div>
                        <div className="text-lg font-display text-parchment-light" data-testid="hp-temp-display">{character.hp.temp}</div>
                    </div>
                    <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                        <div className="text-[10px] text-muted uppercase tracking-wider">AC</div>
                        <div className="text-lg font-display text-white">{character.baseAC + character.abilityMods.dex + (character.mageArmour ? 3 : 0) + (character.shield ? 5 : 0)}</div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min={0}
                            placeholder="Damage"
                            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-muted"
                            value={damageInput}
                            onChange={(e) => setDamageInput(e.target.value)}
                            data-testid="hp-damage-input"
                        />
                        <button className="btn-primary px-4" onClick={handleDamage} data-testid="hp-decrease-btn">Take</button>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min={0}
                            placeholder="Heal"
                            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-muted"
                            value={healInput}
                            onChange={(e) => setHealInput(e.target.value)}
                            data-testid="hp-heal-input"
                        />
                        <button className="btn-primary px-4" onClick={handleHeal} data-testid="hp-increase-btn">Heal</button>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min={0}
                            placeholder="Temp HP"
                            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-muted"
                            value={tempInput}
                            onChange={(e) => setTempInput(e.target.value)}
                            data-testid="hp-temp-input"
                        />
                        <button className="btn-primary px-4" onClick={handleTempHP} data-testid="hp-temp-set-btn">Set</button>
                    </div>
                </div>
            </div>

            {/* Conditions */}
            <div className="card-parchment p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <ShieldAlert size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Conditions</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {combat.conditions.map(c => (
                        <button key={c} onClick={() => dispatch(conditionRemoved(c))} className="px-3 py-1 rounded-full text-xs uppercase tracking-wider bg-amber-500/10 text-amber-200 border border-amber-400/30">
                            {c}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Custom Condition"
                        className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                        value={conditionInput}
                        onChange={e => setConditionInput(e.target.value)}
                    />
                    <button className="btn-primary px-4" onClick={() => handleAddCondition(conditionInput)}>Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {QUICK_CONDITIONS.map(c => (
                        <button key={c} onClick={() => handleAddCondition(c)} className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider bg-white/5 text-muted border border-white/10 hover:border-white/30">
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Slots / Resources (Updated) */}
            <div className="space-y-4">
                <PactMagicSlots
                    slots={slots}
                    onUseSlot={handleUseSlot}
                    onRestoreSlot={handleRestoreSlot}
                />

                <div className="card-parchment p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <Bolt size={18} className="text-white" />
                        <h3 className="font-display text-sm text-parchment tracking-wider">Action Economy</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            className={`px-3 py-2 rounded-md text-xs uppercase tracking-wider border ${combat.reactionAvailable ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' : 'bg-white/5 text-muted border-white/10'}`}
                            onClick={() => dispatch(reactionToggled())}
                        >
                            Reaction {combat.reactionAvailable ? 'Ready' : 'Spent'}
                        </button>
                        <button
                            className={`px-3 py-2 rounded-md text-xs uppercase tracking-wider border ${combat.bonusActionAvailable ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' : 'bg-white/5 text-muted border-white/10'}`}
                            onClick={() => dispatch(bonusActionToggled())}
                        >
                            Bonus {combat.bonusActionAvailable ? 'Ready' : 'Spent'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Combat Log */}
            <div className="card-parchment p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <Bolt size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Combat Log</h3>
                </div>
                <div className="flex gap-2">
                    <input type="text" placeholder="Quick note" className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white" value={noteInput} onChange={e => setNoteInput(e.target.value)} />
                    <button className="btn-primary px-4" onClick={() => {
                        if (noteInput.trim()) { dispatch(combatLogAdded({ type: 'note', title: noteInput })); setNoteInput(''); }
                    }}>Log</button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {combat.log.map(entry => (
                        <div key={entry.id} className="bg-card-elevated/70 border border-white/10 rounded-lg p-3">
                            <div className="text-[10px] text-muted uppercase tracking-wider">{new Date(entry.timestamp).toLocaleTimeString()}</div>
                            <div className="text-sm text-parchment-light">{entry.title}</div>
                            {entry.detail && <div className="text-xs text-muted mt-1">{entry.detail}</div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Minions Manager */}
            <div className="card-parchment p-4 mb-4">
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <Users size={18} className="text-white" />
                        <h3 className="font-display text-sm text-parchment tracking-wider">Undead Horde</h3>
                    </div>
                    <span className="text-xs text-white font-display">{minions.length} Active</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                    {/* Skeleton Counter */}
                    <div
                        className="bg-card-elevated/80 p-4 rounded-lg border border-white/10 text-center relative group cursor-pointer hover:border-white/30 transition-all"
                        onClick={() => openStats('Skeleton')}
                        data-testid="skeleton-counter"
                    >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Info size={12} className="text-white" />
                        </div>
                        <div className="relative w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                            <img src="/assets/minion-bubble.png" alt="" className="absolute inset-0 w-full h-full object-contain opacity-80" />
                            <Skull size={20} className="relative z-10 text-parchment group-hover:text-white transition-colors" />
                        </div>
                        <div className="text-2xl font-display text-parchment-light mb-1">{skeletonCount}</div>
                        <div className="text-[10px] text-muted uppercase tracking-wider">Skeletons</div>
                    </div>

                    {/* Zombie Counter */}
                    <div
                        className="bg-card-elevated/80 p-4 rounded-lg border border-white/10 text-center relative group cursor-pointer hover:border-white/30 transition-all"
                        onClick={() => openStats('Zombie')}
                        data-testid="zombie-counter"
                    >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Info size={12} className="text-white" />
                        </div>
                        <div className="relative w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                            <img src="/assets/minion-bubble.png" alt="" className="absolute inset-0 w-full h-full object-contain opacity-80" />
                            <Biohazard size={20} className="relative z-10 text-parchment group-hover:text-white transition-colors" />
                        </div>
                        <div className="text-2xl font-display text-parchment-light mb-1">{zombieCount}</div>
                        <div className="text-[10px] text-muted uppercase tracking-wider">Zombies</div>
                    </div>
                </div>

                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="w-full btn-primary flex items-center justify-center gap-2 relative z-10"
                    data-testid="manage-horde-btn"
                >
                    <Skull size={16} />
                    Manage Horde
                </button>
            </div>

            {/* Summon Undead Ref */}
            <div className="card-parchment p-4">
                <button className="flex items-center justify-between w-full mb-2" onClick={() => setShowSummons(!showSummons)}>
                    <div className="flex items-center gap-2">
                        <Bone size={18} className="text-white" />
                        <h3 className="font-display text-sm text-parchment tracking-wider">Summon Undead</h3>
                    </div>
                    {showSummons ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                </button>
                {showSummons && (
                    <div className="space-y-2 mt-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-card-elevated/60 border border-white/10 cursor-pointer" onClick={() => openStats('Ghostly')}>
                            <Ghost size={18} className="text-parchment" />
                            <div className="flex-1">
                                <div className="text-sm font-display text-parchment-light">Ghostly</div>
                                <div className="text-xs text-muted">Fly 40ft • 1d8+7 Necrotic</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-card-elevated/60 border border-white/10 cursor-pointer" onClick={() => openStats('Putrid')}>
                            <ShieldAlert size={18} className="text-parchment" />
                            <div className="flex-1">
                                <div className="text-sm font-display text-parchment-light">Putrid</div>
                                <div className="text-xs text-muted">Poison Aura • 1d6+7 Slash</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-card-elevated/60 border border-white/10 cursor-pointer" onClick={() => openStats('Skeletal')}>
                            <Swords size={18} className="text-parchment" />
                            <div className="flex-1">
                                <div className="text-sm font-display text-parchment-light">Skeletal</div>
                                <div className="text-xs text-muted">Ranged 150ft • 2d4+7 Necrotic</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <MinionDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                minions={minions}
            />

            {/* Stat Block Modal */}
            {selectedStatBlock && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    onClick={() => setSelectedStatBlock(null)}
                    data-testid="stat-block-modal"
                >
                    <div
                        className="card-parchment w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl shadow-white/5 animate-scale-in"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start p-4 border-b border-white/10 shrink-0">
                            <div>
                                <h2 className="text-xl font-display text-parchment-light">{selectedStatBlock.name}</h2>
                                <p className="text-xs text-muted italic">{selectedStatBlock.type}</p>
                            </div>
                            <button onClick={() => setSelectedStatBlock(null)}>
                                <X size={20} className="text-white/60 hover:text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 overflow-y-auto flex-1 text-sm space-y-4">
                            {/* Roll Result */}
                            {lastRoll && (
                                <div className="bg-white/10 border border-white/20 rounded-lg p-3">
                                    <div className="text-[10px] text-muted uppercase tracking-wider mb-1">{lastRoll.label}</div>
                                    <div className="font-display text-parchment-light">{lastRoll.detail}</div>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-2 text-center bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                                <div><div className="text-[10px] text-muted uppercase">AC</div><div className="font-display text-lg text-white">{selectedStatBlock.ac}</div></div>
                                <div><div className="text-[10px] text-muted uppercase">HP</div><div className="font-display text-lg text-white">{selectedStatBlock.hp}</div></div>
                                <div><div className="text-[10px] text-muted uppercase">SPD</div><div className="font-display text-lg text-white">{selectedStatBlock.speed}</div></div>
                            </div>

                            <div className="grid grid-cols-6 gap-1 text-center text-xs">
                                {Object.entries(selectedStatBlock.stats).map(([stat, val]) => (
                                    <div key={stat} className="bg-card-elevated p-2 rounded border border-white/10">
                                        <div className="text-[8px] text-muted uppercase">{stat}</div>
                                        <div className="font-display text-parchment-light">{val}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-3">
                                <h4 className="text-white font-display border-b border-white/10 pb-1 mb-2">Actions</h4>
                                {selectedStatBlock.actions.map(action => (
                                    <div key={action.name} className="mb-2">
                                        <span className="text-parchment-light font-display italic">{action.name}.</span>{' '}
                                        <span className="text-parchment">{action.desc}</span>
                                        {(() => {
                                            const toHit = extractToHit(action.desc);
                                            const damageFormula = extractDamageFormula(action.desc);
                                            if (!toHit && !damageFormula) return null;
                                            return (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {toHit != null && (
                                                        <button className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-xs"
                                                            onClick={() => {
                                                                const r = rollDiceFormula(`1d20+${toHit}`);
                                                                setLastRoll({ label: `${action.name} Attack`, detail: r.detail });
                                                            }}
                                                        >Attack (+{toHit})</button>
                                                    )}
                                                    {damageFormula && (
                                                        <button className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-xs"
                                                            onClick={() => {
                                                                const r = rollDiceFormula(damageFormula);
                                                                setLastRoll({ label: `${action.name} Damage`, detail: r.detail });
                                                            }}
                                                        >Damage ({damageFormula})</button>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
