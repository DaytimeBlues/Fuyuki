import { useMemo, useState } from 'react';
import { Bone, Bolt, HeartPulse, Info, ShieldAlert, Skull, Swords, Timer, Users, Zap } from 'lucide-react';
import type { CharacterData, CombatLogEntry, Minion } from '../../types';
import { MinionDrawer } from '../minions/MinionDrawer';
import { undeadStats } from '../../data/undeadStats';
import type { UndeadStatBlock } from '../../data/undeadStats';
import { ConcentrationWidget } from '../widgets/ConcentrationWidget';
import { DeathSavesWidget } from '../widgets/DeathSavesWidget';

interface CombatViewProps {
    data: CharacterData;
    minions: Minion[];
    onUpdateHealth: (newCurrent: number) => void;
    onUpdateTempHP: (newTemp: number) => void;
    onUpdateDeathSaves: (type: 'successes' | 'failures', value: number) => void;
    onUpdateSpellSlot: (level: number, used: number) => void;
    onUpdateConcentration: (spell: string | null) => void;
    onUpdateCombat: (updater: (prev: CharacterData['combat']) => CharacterData['combat']) => void;
    onAddLog: (entry: Omit<CombatLogEntry, 'id' | 'timestamp'>) => void;
    onAddMinion: (type: 'Skeleton' | 'Zombie') => void;
    onUpdateMinion: (id: string, hp: number) => void;
    onRemoveMinion: (id: string) => void;
    onClearMinions: () => void;
}

const QUICK_CONDITIONS = [
    'Prone',
    'Poisoned',
    'Frightened',
    'Grappled',
    'Restrained',
    'Invisible',
    'Stunned',
    'Paralyzed'
];

export function CombatView({
    data,
    minions,
    onUpdateHealth,
    onUpdateTempHP,
    onUpdateDeathSaves,
    onUpdateSpellSlot,
    onUpdateConcentration,
    onUpdateCombat,
    onAddLog,
    onAddMinion,
    onUpdateMinion,
    onRemoveMinion,
    onClearMinions
}: CombatViewProps) {
    const [damageInput, setDamageInput] = useState('');
    const [healInput, setHealInput] = useState('');
    const [tempInput, setTempInput] = useState('');
    const [conditionInput, setConditionInput] = useState('');
    const [noteInput, setNoteInput] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStatBlock, setSelectedStatBlock] = useState<UndeadStatBlock | null>(null);

    const logEntries = data.combat.log;
    const slots = useMemo(() => Object.entries(data.slots).map(([level, info]) => ({
        level: Number(level),
        ...info
    })), [data.slots]);
    const skeletonCount = minions.filter(m => m.type === 'Skeleton').length;
    const zombieCount = minions.filter(m => m.type === 'Zombie').length;

    const openStats = (name: string) => {
        const stats = undeadStats.find(s => s.name.includes(name));
        if (stats) setSelectedStatBlock(stats);
    };

    const appendLog = (entry: Omit<CombatLogEntry, 'id' | 'timestamp'>) => {
        onAddLog(entry);
    };

    const handleDamage = () => {
        const amount = Number(damageInput);
        if (!Number.isFinite(amount) || amount <= 0) return;
        onUpdateHealth(data.hp.current - amount);
        appendLog({ type: 'damageTaken', title: `Took ${amount} damage` });
        setDamageInput('');
    };

    const handleHeal = () => {
        const amount = Number(healInput);
        if (!Number.isFinite(amount) || amount <= 0) return;
        onUpdateHealth(data.hp.current + amount);
        appendLog({ type: 'heal', title: `Healed ${amount} HP` });
        setHealInput('');
    };

    const handleTempHP = () => {
        const amount = Number(tempInput);
        if (!Number.isFinite(amount) || amount < 0) return;
        onUpdateTempHP(amount);
        appendLog({ type: 'resourceUse', title: `Temp HP set to ${amount}` });
        setTempInput('');
    };

    const handleAddCondition = (condition: string) => {
        const trimmed = condition.trim();
        if (!trimmed) return;
        onUpdateCombat(prev => {
            if (prev.conditions.includes(trimmed)) {
                return prev;
            }
            return {
                ...prev,
                conditions: [...prev.conditions, trimmed]
            };
        });
        appendLog({ type: 'conditionAdd', title: `Condition: ${trimmed}` });
        setConditionInput('');
    };

    const handleRemoveCondition = (condition: string) => {
        onUpdateCombat(prev => ({
            ...prev,
            conditions: prev.conditions.filter(item => item !== condition)
        }));
        appendLog({ type: 'conditionRemove', title: `Removed ${condition}` });
    };

    const handleSetConcentration = (spell: string) => {
        onUpdateConcentration(spell);
        appendLog({ type: 'concentrationStart', title: `Concentrating on ${spell}` });
    };

    const handleClearConcentration = () => {
        if (!data.concentration) return;
        appendLog({ type: 'concentrationEnd', title: `Ended ${data.concentration}` });
        onUpdateConcentration(null);
    };

    const handleUseSlot = (level: number) => {
        const slot = data.slots[level];
        if (!slot || slot.used >= slot.max) return;
        onUpdateSpellSlot(level, slot.used + 1);
        appendLog({ type: 'resourceUse', title: `Used level ${level} slot` });
    };

    const handleRestoreSlot = (level: number) => {
        const slot = data.slots[level];
        if (!slot || slot.used <= 0) return;
        onUpdateSpellSlot(level, slot.used - 1);
        appendLog({ type: 'resourceUse', title: `Restored level ${level} slot` });
    };

    const handleAddNote = () => {
        const trimmed = noteInput.trim();
        if (!trimmed) return;
        appendLog({ type: 'note', title: trimmed });
        setNoteInput('');
    };

    const handleUndeadCommand = (mode: 'commanded' | 'defend') => {
        onUpdateCombat(prev => ({
            ...prev,
            undeadCommand: mode,
            bonusActionAvailable: mode === 'commanded' ? false : prev.bonusActionAvailable
        }));
        appendLog({
            type: 'resourceUse',
            title: mode === 'commanded' ? 'Commanded undead (bonus action)' : 'No command issued'
        });
    };

    return (
        <div className="pb-20 space-y-4">
            <div className="card-parchment p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Swords size={18} className="text-white" />
                        <h3 className="font-display text-sm text-parchment tracking-wider">Combat Mode</h3>
                    </div>
                    <button
                        className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border ${data.combat.inCombat ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' : 'bg-white/5 text-muted border-white/10'}`}
                        onClick={() => onUpdateCombat(prev => ({ ...prev, inCombat: !prev.inCombat }))}
                    >
                        {data.combat.inCombat ? 'Active' : 'Inactive'}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                        <div className="text-[10px] text-muted uppercase tracking-wider mb-1">Round</div>
                        <div className="flex items-center gap-2">
                            <Timer size={16} className="text-white" />
                            <input
                                type="number"
                                min={1}
                                className="w-full bg-transparent text-white text-lg font-display outline-none"
                                value={data.combat.round}
                                onChange={(event) => onUpdateCombat(prev => ({ ...prev, round: Math.max(1, Number(event.target.value) || 1) }))}
                            />
                        </div>
                    </div>
                    <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                        <div className="text-[10px] text-muted uppercase tracking-wider mb-1">Turn</div>
                        <button
                            className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-xs uppercase tracking-wider border ${data.combat.myTurn ? 'bg-amber-500/20 text-amber-200 border-amber-400/40' : 'bg-white/5 text-muted border-white/10'}`}
                            onClick={() => onUpdateCombat(prev => ({ ...prev, myTurn: !prev.myTurn }))}
                        >
                            <Zap size={14} />
                            {data.combat.myTurn ? 'My Turn' : 'Waiting'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="card-parchment p-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                        <div className="text-[10px] text-muted uppercase tracking-wider">HP</div>
                        <div className="text-lg font-display text-white">{data.hp.current}/{data.hp.max}</div>
                    </div>
                    <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                        <div className="text-[10px] text-muted uppercase tracking-wider">Temp</div>
                        <div className="text-lg font-display text-parchment-light">{data.hp.temp}</div>
                    </div>
                    <div className="bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                        <div className="text-[10px] text-muted uppercase tracking-wider">AC</div>
                        <div className="text-lg font-display text-white">{data.baseAC + data.abilityMods.dex + (data.mageArmour ? 3 : 0) + (data.shield ? 5 : 0)}</div>
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
                            onChange={(event) => setDamageInput(event.target.value)}
                        />
                        <button className="btn-primary px-4" onClick={handleDamage}>
                            Take
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min={0}
                            placeholder="Heal"
                            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-muted"
                            value={healInput}
                            onChange={(event) => setHealInput(event.target.value)}
                        />
                        <button className="btn-primary px-4" onClick={handleHeal}>
                            Heal
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min={0}
                            placeholder="Temp HP"
                            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-muted"
                            value={tempInput}
                            onChange={(event) => setTempInput(event.target.value)}
                        />
                        <button className="btn-primary px-4" onClick={handleTempHP}>
                            Set
                        </button>
                    </div>
                </div>
            </div>

            <div className="card-parchment p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <Bone size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Animate Dead</h3>
                </div>
                <div className="text-xs text-muted leading-relaxed">
                    Issue a bonus action command to direct your undead on their next turn. If you give no command, they only defend themselves.
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-wider border ${data.combat.undeadCommand === 'commanded' ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' : 'bg-white/5 text-muted border-white/10'}`}
                        onClick={() => handleUndeadCommand('commanded')}
                    >
                        Command Undead
                    </button>
                    <button
                        className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-wider border ${data.combat.undeadCommand === 'defend' ? 'bg-amber-500/20 text-amber-200 border-amber-400/40' : 'bg-white/5 text-muted border-white/10'}`}
                        onClick={() => handleUndeadCommand('defend')}
                    >
                        No Command
                    </button>
                </div>
            </div>

            <div className="card-parchment p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <ShieldAlert size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Conditions</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.combat.conditions.length === 0 && (
                        <span className="text-xs text-muted">No active conditions</span>
                    )}
                    {data.combat.conditions.map(condition => (
                        <button
                            key={condition}
                            className="px-3 py-1 rounded-full text-xs uppercase tracking-wider bg-amber-500/10 text-amber-200 border border-amber-400/30"
                            onClick={() => handleRemoveCondition(condition)}
                        >
                            {condition}
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    {QUICK_CONDITIONS.map(condition => (
                        <button
                            key={condition}
                            className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider bg-white/5 text-muted border border-white/10 hover:border-white/30"
                            onClick={() => handleAddCondition(condition)}
                        >
                            {condition}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Add condition"
                        className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-muted"
                        value={conditionInput}
                        onChange={(event) => setConditionInput(event.target.value)}
                    />
                    <button className="btn-primary px-4" onClick={() => handleAddCondition(conditionInput)}>
                        Add
                    </button>
                </div>
            </div>

            <div className="card-parchment p-4">
                <div className="flex items-center gap-2 mb-3">
                    <HeartPulse size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Concentration</h3>
                </div>
                <ConcentrationWidget
                    spell={data.concentration}
                    onClear={handleClearConcentration}
                    onSet={handleSetConcentration}
                />
            </div>

            <div className="card-parchment p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <Bolt size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Resources</h3>
                </div>

                <div className="grid gap-2">
                    {slots.map(slot => (
                        <div key={slot.level} className="flex items-center justify-between bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                            <div className="text-sm text-parchment-light">
                                Level {slot.level} • {slot.max - slot.used} / {slot.max} remaining
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-1 rounded-md text-[10px] uppercase tracking-wider border border-white/10 text-muted hover:border-white/30"
                                    onClick={() => handleRestoreSlot(slot.level)}
                                >
                                    Restore
                                </button>
                                <button
                                    className="px-3 py-1 rounded-md text-[10px] uppercase tracking-wider border border-white/10 text-muted hover:border-white/30"
                                    onClick={() => handleUseSlot(slot.level)}
                                >
                                    Use
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        className={`px-3 py-2 rounded-md text-xs uppercase tracking-wider border ${data.combat.reactionAvailable ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' : 'bg-white/5 text-muted border-white/10'}`}
                        onClick={() => onUpdateCombat(prev => ({ ...prev, reactionAvailable: !prev.reactionAvailable }))}
                    >
                        Reaction {data.combat.reactionAvailable ? 'Ready' : 'Spent'}
                    </button>
                    <button
                        className={`px-3 py-2 rounded-md text-xs uppercase tracking-wider border ${data.combat.bonusActionAvailable ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' : 'bg-white/5 text-muted border-white/10'}`}
                        onClick={() => onUpdateCombat(prev => ({ ...prev, bonusActionAvailable: !prev.bonusActionAvailable }))}
                    >
                        Bonus {data.combat.bonusActionAvailable ? 'Ready' : 'Spent'}
                    </button>
                </div>
            </div>

            <div className="card-parchment p-4 mb-4">
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <Users size={18} className="text-white" />
                        <h3 className="font-display text-sm text-parchment tracking-wider">Undead Horde</h3>
                    </div>
                    <span className="text-xs text-white font-display">{minions.length} Active</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                    <div
                        className="bg-card-elevated/80 p-4 rounded-lg border border-white/10 text-center relative group cursor-pointer hover:border-white/30 transition-all"
                        onClick={() => openStats('Skeleton')}
                    >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Info size={12} className="text-white" />
                        </div>
                        <Skull size={24} className="text-parchment mx-auto mb-2 group-hover:text-white transition-colors" />
                        <div className="text-2xl font-display text-parchment-light mb-1">{skeletonCount}</div>
                        <div className="text-[10px] text-muted uppercase tracking-wider">Skeletons</div>
                    </div>

                    <div
                        className="bg-card-elevated/80 p-4 rounded-lg border border-white/10 text-center relative group cursor-pointer hover:border-white/30 transition-all"
                        onClick={() => openStats('Zombie')}
                    >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Info size={12} className="text-white" />
                        </div>
                        <ShieldAlert size={24} className="text-parchment mx-auto mb-2 group-hover:text-white transition-colors" />
                        <div className="text-2xl font-display text-parchment-light mb-1">{zombieCount}</div>
                        <div className="text-[10px] text-muted uppercase tracking-wider">Zombies</div>
                    </div>
                </div>

                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="w-full btn-primary flex items-center justify-center gap-2 relative z-10"
                >
                    <Skull size={16} />
                    Manage Horde
                </button>
            </div>

            {data.hp.current === 0 && (
                <div className="card-parchment p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-display text-sm text-parchment tracking-wider">Downed</h3>
                        <button
                            className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border ${data.combat.stable ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' : 'bg-white/5 text-muted border-white/10'}`}
                            onClick={() => onUpdateCombat(prev => ({ ...prev, stable: !prev.stable }))}
                        >
                            {data.combat.stable ? 'Stable' : 'Unstable'}
                        </button>
                    </div>
                    <DeathSavesWidget
                        successes={data.deathSaves.successes}
                        failures={data.deathSaves.failures}
                        onChange={onUpdateDeathSaves}
                    />
                </div>
            )}

            <div className="card-parchment p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <Bolt size={18} className="text-white" />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Combat Log</h3>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Quick note"
                        className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-muted"
                        value={noteInput}
                        onChange={(event) => setNoteInput(event.target.value)}
                    />
                    <button className="btn-primary px-4" onClick={handleAddNote}>
                        Log
                    </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {logEntries.length === 0 && (
                        <div className="text-xs text-muted">No combat events yet.</div>
                    )}
                    {logEntries.map(entry => (
                        <div key={entry.id} className="bg-card-elevated/70 border border-white/10 rounded-lg p-3">
                            <div className="text-[10px] text-muted uppercase tracking-wider">
                                {new Date(entry.timestamp).toLocaleTimeString()}
                            </div>
                            <div className="text-sm text-parchment-light">{entry.title}</div>
                            {entry.detail && (
                                <div className="text-xs text-muted mt-1">{entry.detail}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <MinionDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                minions={minions}
                onAddMinion={onAddMinion}
                onUpdateMinion={onUpdateMinion}
                onRemoveMinion={onRemoveMinion}
                onClearMinions={onClearMinions}
            />

            {selectedStatBlock && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    onClick={() => setSelectedStatBlock(null)}
                >
                    <div
                        className="card-parchment w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl shadow-white/5 animate-scale-in"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start p-4 border-b border-white/10 shrink-0">
                            <div>
                                <h2 className="text-xl font-display text-parchment-light">{selectedStatBlock.name}</h2>
                                <p className="text-xs text-muted italic">{selectedStatBlock.type}</p>
                            </div>
                            <button
                                onClick={() => setSelectedStatBlock(null)}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/20 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all shrink-0"
                                aria-label="Close"
                            >
                                <span className="text-lg">×</span>
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto flex-1">
                            <div className="space-y-4 text-sm">
                                <div className="grid grid-cols-3 gap-2 text-center bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                                    <div>
                                        <div className="text-[10px] text-muted uppercase tracking-wider">AC</div>
                                        <div className="font-display text-lg text-white">{selectedStatBlock.ac}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-muted uppercase tracking-wider">HP</div>
                                        <div className="font-display text-lg text-white">{selectedStatBlock.hp}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-muted uppercase tracking-wider">Speed</div>
                                        <div className="font-display text-lg text-parchment-light">{selectedStatBlock.speed}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-6 gap-1 text-center text-xs">
                                    {Object.entries(selectedStatBlock.stats).map(([stat, val]) => (
                                        <div key={stat} className="bg-card-elevated p-2 rounded border border-white/10">
                                            <div className="text-[8px] text-muted uppercase">{stat}</div>
                                            <div className="font-display text-parchment-light">{val}</div>
                                            <div className="text-[8px] text-white">{val >= 10 ? '+' : ''}{Math.floor((val - 10) / 2)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 text-xs text-parchment border-t border-white/10 pt-3">
                                    {selectedStatBlock.damageImmunities && (
                                        <p><span className="text-white font-display">Damage Immunities:</span> {selectedStatBlock.damageImmunities}</p>
                                    )}
                                    {selectedStatBlock.conditionImmunities && (
                                        <p><span className="text-white font-display">Condition Immunities:</span> {selectedStatBlock.conditionImmunities}</p>
                                    )}
                                    <p><span className="text-white font-display">Senses:</span> {selectedStatBlock.senses}</p>
                                    <p><span className="text-white font-display">Languages:</span> {selectedStatBlock.languages}</p>
                                </div>

                                {selectedStatBlock.traits && (
                                    <div className="border-t border-white/10 pt-3">
                                        {selectedStatBlock.traits.map(trait => (
                                            <div key={trait.name} className="mb-2">
                                                <span className="text-parchment-light font-display italic">{trait.name}.</span>{' '}
                                                <span className="text-parchment">{trait.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="border-t border-white/10 pt-3">
                                    <h4 className="text-white font-display border-b border-white/10 pb-1 mb-2">Actions</h4>
                                    {selectedStatBlock.actions.map(action => (
                                        <div key={action.name} className="mb-2">
                                            <span className="text-parchment-light font-display italic">{action.name}.</span>{' '}
                                            <span className="text-parchment">{action.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
