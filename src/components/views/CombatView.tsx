import { useMemo, useState } from 'react';
import { Bolt, HeartPulse, ShieldAlert, Swords, Timer, Zap } from 'lucide-react';
import type { CharacterData, CombatLogEntry } from '../../types';
import { ConcentrationWidget } from '../widgets/ConcentrationWidget';
import { DeathSavesWidget } from '../widgets/DeathSavesWidget';

interface CombatViewProps {
    data: CharacterData;
    onUpdateHealth: (newCurrent: number) => void;
    onUpdateTempHP: (newTemp: number) => void;
    onUpdateDeathSaves: (type: 'successes' | 'failures', value: number) => void;
    onUpdateSpellSlot: (level: number, used: number) => void;
    onUpdateConcentration: (spell: string | null) => void;
    onUpdateCombat: (updater: (prev: CharacterData['combat']) => CharacterData['combat']) => void;
    onAddLog: (entry: Omit<CombatLogEntry, 'id' | 'timestamp'>) => void;
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
    onUpdateHealth,
    onUpdateTempHP,
    onUpdateDeathSaves,
    onUpdateSpellSlot,
    onUpdateConcentration,
    onUpdateCombat,
    onAddLog
}: CombatViewProps) {
    const [damageInput, setDamageInput] = useState('');
    const [healInput, setHealInput] = useState('');
    const [tempInput, setTempInput] = useState('');
    const [conditionInput, setConditionInput] = useState('');
    const [noteInput, setNoteInput] = useState('');

    const logEntries = data.combat.log;
    const slots = useMemo(() => Object.entries(data.slots).map(([level, info]) => ({
        level: Number(level),
        ...info
    })), [data.slots]);

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
        </div>
    );
}
