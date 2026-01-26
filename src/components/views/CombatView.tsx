import { useState, useMemo } from 'react';
import { Bolt, ShieldAlert, Swords, Timer, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { conditionAdded, conditionRemoved, combatLogAdded, reactionToggled, bonusActionToggled } from '../../store/slices/combatSlice';
import { hpChanged, tempHpSet } from '../../store/slices/healthSlice';
import { slotExpended, slotRestored } from '../../store/slices/statSlice';
import { selectCharacter, selectCurrentAC } from '../../store/selectors';
import { MathStrip } from '../features/combat/MathStrip';
import { PactMagicSlots } from '../combat/PactMagicSlots';
import { TacticalWidget } from '../widgets/TacticalWidget';

const QUICK_CONDITIONS = [
    'Prone', 'Poisoned', 'Frightened', 'Grappled',
    'Restrained', 'Invisible', 'Stunned', 'Paralyzed'
];

export function CombatView() {
    const dispatch = useAppDispatch();
    const character = useAppSelector(selectCharacter);
    const currentAC = useAppSelector(selectCurrentAC);
    const combat = useAppSelector(state => state.combat);

    const [damageInput, setDamageInput] = useState('');
    const [healInput, setHealInput] = useState('');
    const [tempInput, setTempInput] = useState('');
    const [conditionInput, setConditionInput] = useState('');
    const [noteInput, setNoteInput] = useState('');

    // Derived state
    const slots = useMemo(() => Object.entries(character.slots).map(([level, info]) => ({
        level: Number(level),
        ...info
    })), [character.slots]);

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

    return (
        <div className="pb-24 space-y-4 animate-fade-in">
            {/* Tactical Advisor (New) */}
            <div className="stagger-1">
                <TacticalWidget />
            </div>

            {/* Math Strip */}
            <div className="mb-4 shadow-lg sticky top-0 z-20 stagger-2">
                <MathStrip />
            </div>

            {/* Combat Mode / Round Tracker */}
            <div className="card-parchment p-4 stagger-3">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Swords size={18} className="text-white" />
                        <div>
                            <h3 className="font-display text-sm text-parchment tracking-wider uppercase">Combat Status</h3>
                            <div className="text-[10px] font-japanese text-muted -mt-1 opacity-50 tracking-widest">戦闘状況</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card-elevated p-3 rounded-lg border border-white/5 shadow-inner">
                        <div className="text-[10px] text-muted uppercase tracking-wider mb-1">Round</div>
                        <div className="flex items-center gap-2">
                            <Timer size={16} className="text-gold-mid" />
                            <span className="text-white text-lg font-display">{combat.currentRound}</span>
                        </div>
                    </div>
                    <div className="bg-card-elevated p-3 rounded-lg border border-white/5 shadow-inner">
                        <div className="text-[10px] text-muted uppercase tracking-wider mb-1">Turn Count</div>
                        <div className="text-white text-sm font-display">{combat.currentTurnIndex}</div>
                    </div>
                </div>
            </div>

            {/* Vitals Card */}
            <div className="card-parchment p-4 stagger-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-card-elevated p-3 rounded-lg border border-white/5">
                        <div className="text-[10px] text-muted uppercase tracking-wider">HP</div>
                        <div className="text-lg font-display text-white">{character.hp.current}/{character.hp.max}</div>
                    </div>
                    <div className="bg-card-elevated p-3 rounded-lg border border-white/5">
                        <div className="text-[10px] text-muted uppercase tracking-wider">Temp</div>
                        <div className="text-lg font-display text-accent-glow">{character.hp.temp}</div>
                    </div>
                    <div className="bg-card-elevated p-3 rounded-lg border border-white/5">
                        <div className="text-[10px] text-muted uppercase tracking-wider">AC</div>
                        <div className="text-lg font-display text-white">{currentAC}</div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min={0}
                            placeholder="Damage"
                            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                            value={damageInput}
                            onChange={(e) => setDamageInput(e.target.value)}
                        />
                        <button className="btn-primary px-4 bg-vermillion/20 hover:bg-vermillion/40 text-white min-h-[48px] border-vermillion/30" onClick={handleDamage}>Take</button>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min={0}
                            placeholder="Heal"
                            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                            value={healInput}
                            onChange={(e) => setHealInput(e.target.value)}
                        />
                        <button className="btn-primary px-4 bg-moss/20 hover:bg-moss/40 text-white min-h-[48px] border-moss/30" onClick={handleHeal}>Heal</button>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min={0}
                            placeholder="Temp HP"
                            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-muted"
                            value={tempInput}
                            onChange={(e) => setTempInput(e.target.value)}
                        />
                        <button className="btn-primary px-4" onClick={handleTempHP}>Set</button>
                    </div>
                </div>
            </div>

            {/* Conditions (Simplified) */}
            <div className="card-parchment p-4 space-y-3 stagger-5">
                <div className="flex items-center gap-2">
                    <ShieldAlert size={18} className="text-white" />
                    <div>
                        <h3 className="font-display text-sm text-parchment tracking-wider uppercase">Active Buffs / Conditions</h3>
                    </div>
                </div>
                {combat.conditions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {combat.conditions.map(c => (
                            <button key={c} onClick={() => dispatch(conditionRemoved(c))} className="px-3 py-2 rounded-lg text-[10px] uppercase tracking-wider bg-accent/10 text-accent border border-accent/30 flex items-center gap-1">
                                {c} <X size={10} />
                            </button>
                        ))}
                    </div>
                )}
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
                        <button
                            key={c}
                            onClick={() => handleAddCondition(c)}
                            className={`px-3 py-3 rounded-xl text-[10px] uppercase tracking-wider border transition-all min-h-[48px] flex-1 min-w-[30%]
                                ${combat.conditions.includes(c) ? 'bg-accent text-bg-dark border-accent' : 'bg-white/5 text-muted border-white/10 hover:border-white/30'}
                            `}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Slots / Resources */}
            <div className="space-y-4">
                <PactMagicSlots
                    slots={slots}
                    onUseSlot={handleUseSlot}
                    onRestoreSlot={handleRestoreSlot}
                />

                <div className="card-parchment p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <Bolt size={18} className="text-white" />
                        <h3 className="font-display text-sm text-parchment tracking-wider uppercase">Action Economy</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            className={`px-3 py-3 rounded-xl text-xs uppercase tracking-wider border transition-all min-h-[48px] ${combat.reactionAvailable ? 'bg-moss/20 text-moss border-moss/40' : 'bg-white/5 text-muted border-white/10'}`}
                            onClick={() => dispatch(reactionToggled())}
                        >
                            Reaction {combat.reactionAvailable ? 'Ready' : 'Spent'}
                        </button>
                        <button
                            className={`px-3 py-3 rounded-xl text-xs uppercase tracking-wider border transition-all min-h-[48px] ${combat.bonusActionAvailable ? 'bg-moss/20 text-moss border-moss/40' : 'bg-white/5 text-muted border-white/10'}`}
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
                    <div>
                        <h3 className="font-display text-sm text-parchment tracking-wider uppercase">Combat Log</h3>
                        <div className="text-[10px] font-japanese text-muted -mt-1 opacity-50 tracking-widest">戦闘記録</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <input type="text" placeholder="Quick note" className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white" value={noteInput} onChange={e => setNoteInput(e.target.value)} />
                    <button className="btn-primary px-4" onClick={() => {
                        if (noteInput.trim()) { dispatch(combatLogAdded({ type: 'note', title: noteInput })); setNoteInput(''); }
                    }}>Log</button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {combat.log.slice(0, 50).map(entry => (
                        <div key={entry.id} className="bg-card-elevated/70 border border-white/10 rounded-lg p-3">
                            <div className="text-[10px] text-muted uppercase tracking-wider">{new Date(entry.timestamp).toLocaleTimeString()}</div>
                            <div className="text-sm text-parchment-light">{entry.title}</div>
                            {entry.detail && <div className="text-xs text-muted mt-1">{entry.detail}</div>}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
