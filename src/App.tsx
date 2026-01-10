import { useState, useEffect, useCallback } from 'react';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HealthWidget } from './components/widgets/HealthWidget';
import { ArmorClassWidget } from './components/widgets/ArmorClassWidget';
import { SpellSlotsWidget } from './components/widgets/SpellSlotsWidget';
import { DeathSavesWidget } from './components/widgets/DeathSavesWidget';
import { ConcentrationWidget } from './components/widgets/ConcentrationWidget';
import { AttunementWidget } from './components/widgets/AttunementWidget';
import { InventoryWidget } from './components/widgets/InventoryWidget';
import { WildShapeWidget } from './components/widgets/WildShapeWidget';
import { MulticlassSpellSlotsWidget } from './components/widgets/MulticlassSpellSlotsWidget';
import { HitDiceWidget } from './components/widgets/HitDiceWidget';
import { InitiativeWidget } from './components/widgets/InitiativeWidget';
import { ProficiencyWidget } from './components/widgets/ProficiencyWidget';
import { SavingThrowsWidget } from './components/widgets/SavingThrowsWidget';
import { CharacterEditor } from './components/widgets/CharacterEditor';
import { SpellsView } from './components/views/SpellsView';
import { CombatView } from './components/views/CombatView';
import { RestView } from './components/views/RestView';
import { GrimoireView } from './components/views/GrimoireView';
import { BiographyView } from './components/views/BiographyView';
import { SessionPicker } from './components/SessionPicker';
import { initialCharacterData } from './data/initialState';
import { getActiveSession, updateActiveSession } from './utils/sessionStorage';
import {
  getProfBonus,
  getAbilityMod,
  getSpellSlotsWithUsed,
  calculateMaxHP,
  calculateSpellSaveDC,
} from './utils/srdRules';
import type { CharacterData, Minion, Session } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showSessionPicker, setShowSessionPicker] = useState<boolean>(() => {
    return !getActiveSession();
  });
  const [data, setData] = useState<CharacterData>(() => {
    const session = getActiveSession();
    return session ? session.characterData : initialCharacterData;
  });
  const [minions, setMinions] = useState<Minion[]>(() => {
    const session = getActiveSession();
    return session ? session.minions : [];
  });
  const [toast, setToast] = useState<string | null>(null);

  // Persist state to active session
  useEffect(() => {
    updateActiveSession(data, minions);
  }, [data, minions]);

  const handleSessionSelected = (session: Session) => {
    setData(session.characterData);
    setMinions(session.minions);
    setShowSessionPicker(false);
  };

  // Toast notification - declared early so other callbacks can use it
  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const updateHealth = (newCurrent: number) => {
    const delta = newCurrent - data.hp.current;

    // If taking damage (negative delta), THP absorbs first per RAW
    if (delta < 0) {
      const damage = Math.abs(delta);
      const tempAbsorbed = Math.min(data.hp.temp, damage);
      const remainingDamage = damage - tempAbsorbed;
      const newHP = Math.max(0, data.hp.current - remainingDamage);

      setData(prev => ({
        ...prev,
        hp: {
          ...prev.hp,
          temp: prev.hp.temp - tempAbsorbed,
          current: newHP
        },
        // RAW: Concentration ends when incapacitated (0 HP)
        concentration: newHP === 0 ? null : prev.concentration
      }));

      // CON save for concentration when taking damage
      // RAW: DC = max(10, damage/2) - using total damage taken (common ruling)
      if (data.concentration && remainingDamage > 0 && newHP > 0) {
        const conSaveDC = Math.max(10, Math.floor(damage / 2));
        showToast(`CON Save DC ${conSaveDC} to maintain ${data.concentration}`);
      }

      // Notify if concentration lost due to dropping to 0 HP
      if (data.concentration && newHP === 0) {
        showToast(`Concentration on ${data.concentration} lost - Incapacitated!`);
      }
    } else {
      // Healing - only affects current HP, not THP
      // RAW: Reset death saves when healed from 0 HP
      const wasAtZero = data.hp.current === 0;
      setData(prev => ({
        ...prev,
        hp: { ...prev.hp, current: Math.min(prev.hp.max, Math.max(0, newCurrent)) },
        deathSaves: wasAtZero && newCurrent > 0
          ? { successes: 0, failures: 0 }
          : prev.deathSaves
      }));

      if (wasAtZero && newCurrent > 0) {
        showToast("Stabilized! Death saves reset.");
      }
    }
  };

  const updateTempHP = useCallback((newTemp: number) => {
    setData(prev => ({
      ...prev,
      hp: { ...prev.hp, temp: Math.max(0, newTemp) }
    }));
  }, []);

  const updateAC = useCallback((key: 'mageArmour' | 'shield') => {
    setData(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const updateSpellSlot = useCallback((level: number, used: number) => {
    setData(prev => ({
      ...prev,
      slots: {
        ...prev.slots,
        [level]: { ...prev.slots[level], used }
      }
    }));
  }, []);

  const updateDeathSaves = useCallback((type: 'successes' | 'failures', value: number) => {
    setData(prev => ({
      ...prev,
      deathSaves: { ...prev.deathSaves, [type]: value }
    }));
  }, []);

  const addMinion = (type: 'Skeleton' | 'Zombie') => {
    const stats = data.defaultMinion[type];
    const newMinion: Minion = {
      id: crypto.randomUUID(),
      type,
      name: `${type} ${minions.filter(m => m.type === type).length + 1}`,
      hp: { current: stats.hp, max: stats.hp },
      ac: stats.ac,
      notes: stats.notes
    };
    setMinions(prev => [...prev, newMinion]);
    showToast(`Raised ${type}`);
  };

  const updateMinion = useCallback((id: string, hp: number) => {
    setMinions(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, hp: { ...m.hp, current: Math.max(0, hp) } };
      }
      return m;
    }));
  }, []);

  const removeMinion = useCallback((id: string) => {
    setMinions(prev => prev.filter(m => m.id !== id));
    showToast("Minion Destroyed");
  }, [showToast]);

  const clearMinions = useCallback(() => {
    setMinions([]);
    showToast("All Minions Released");
  }, [showToast]);

  const handleSpendHitDie = useCallback((healed: number, diceSpent: number) => {
    setData(prev => ({
      ...prev,
      hp: { ...prev.hp, current: Math.min(prev.hp.max, prev.hp.current + healed) },
      hitDice: { ...prev.hitDice, current: Math.max(0, prev.hitDice.current - diceSpent) }
    }));
    if (healed > 0) {
      showToast(`Healed ${healed} HP`);
    }
  }, [showToast]);

  const handleLongRest = useCallback(() => {
    setData(prev => {
      // RAW: Recover half of max hit dice (minimum 1) on long rest
      const hitDiceRecovered = Math.max(1, Math.ceil(prev.hitDice.max / 2));
      const newHitDice = Math.min(prev.hitDice.max, prev.hitDice.current + hitDiceRecovered);

      return {
        ...prev,
        hp: { ...prev.hp, current: prev.hp.max, temp: 0 },
        hitDice: { ...prev.hitDice, current: newHitDice },
        slots: Object.fromEntries(Object.entries(prev.slots).map(([k, v]) => [k, { ...v, used: 0 }])),
        mageArmour: false,
        shield: false,
        concentration: null,
        deathSaves: { successes: 0, failures: 0 }
      };
    });
    showToast("Long Rest Completed");
    setActiveTab('home');
  }, [showToast]);

  /**
   * Handle level change with cascade updates per SRD 5.1
   * Cascades: proficiency bonus, hit dice max, spell slots, max HP, spell save DC
   */
  const handleLevelChange = useCallback((newLevel: number) => {
    setData(prev => {
      const newProfBonus = getProfBonus(newLevel);
      const conMod = prev.abilities.con.mod;
      const intMod = prev.abilities.int.mod; // Wizard spellcasting ability
      const newMaxHP = calculateMaxHP(newLevel, prev.hitDice.size, conMod);
      const newSpellSlots = getSpellSlotsWithUsed(newLevel, prev.slots);
      const newSpellDC = calculateSpellSaveDC(newProfBonus, intMod);

      // Cap current HP/Hit Dice at new max if level decreased
      const newCurrentHP = Math.min(prev.hp.current, newMaxHP);
      const newCurrentHitDice = Math.min(prev.hitDice.current, newLevel);

      return {
        ...prev,
        level: newLevel,
        profBonus: newProfBonus,
        hp: { ...prev.hp, current: newCurrentHP, max: newMaxHP },
        hitDice: { ...prev.hitDice, current: newCurrentHitDice, max: newLevel },
        slots: newSpellSlots,
        dc: newSpellDC,
      };
    });
    showToast(`Level changed to ${newLevel}`);
  }, [showToast]);

  /**
   * Handle ability score change with cascade updates per SRD 5.1
   * Cascades: ability modifier, and if CON/INT: max HP, spell save DC
   */
  const handleAbilityChange = useCallback((ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha', newScore: number) => {
    setData(prev => {
      const newMod = getAbilityMod(newScore);
      const newAbilities = {
        ...prev.abilities,
        [ability]: { score: newScore, mod: newMod },
      };

      // Base updates with new abilities
      const updates: Partial<CharacterData> = {
        abilities: newAbilities,
      };

      // CON change affects max HP
      if (ability === 'con') {
        const newMaxHP = calculateMaxHP(prev.level, prev.hitDice.size, newMod);
        const newCurrentHP = Math.min(prev.hp.current, newMaxHP);
        updates.hp = { ...prev.hp, current: newCurrentHP, max: newMaxHP };
      }

      // INT change affects spell save DC (Wizard)
      if (ability === 'int') {
        updates.dc = calculateSpellSaveDC(prev.profBonus, newMod);
      }

      return { ...prev, ...updates };
    });
    showToast(`${ability.toUpperCase()} updated to ${newScore}`);
  }, [showToast]);


  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'home' && (
        <div className="animate-fade-in">
          <div className="animate-slide-up stagger-1">
            <HealthWidget
              current={data.hp.current}
              max={data.hp.max}
              temp={data.hp.temp}
              onChange={updateHealth}
              onTempChange={updateTempHP}
            />
          </div>

          <div className="animate-slide-up stagger-2">
            <ArmorClassWidget
              baseAC={data.baseAC}
              dexMod={data.abilities.dex.mod}
              mageArmour={data.mageArmour}
              hasShield={data.shield}
              onToggle={updateAC}
            />
          </div>

          <div className="animate-slide-up stagger-3">
            <SpellSlotsWidget
              slots={data.slots}
              onChange={updateSpellSlot}
              spellSaveDC={data.dc}
            />
          </div>

          <div className="animate-slide-up stagger-4">
            <ConcentrationWidget
              spell={data.concentration}
              onClear={() => setData(prev => ({ ...prev, concentration: null }))}
              onSet={(spell) => setData(prev => ({ ...prev, concentration: spell }))}
            />
          </div>

          <div className="animate-slide-up stagger-5">
            <DeathSavesWidget
              successes={data.deathSaves.successes}
              failures={data.deathSaves.failures}
              onChange={updateDeathSaves}
            />
          </div>
        </div>
      )}

      {activeTab === 'spells' && <div className="animate-fade-in"><SpellsView /></div>}

      {activeTab === 'combat' && (
        <div className="animate-fade-in">
          <CombatView
            minions={minions}
            onAddMinion={addMinion}
            onUpdateMinion={updateMinion}
            onRemoveMinion={removeMinion}
            onClearMinions={clearMinions}
          />
          <WildShapeWidget
            transformed={data.transformed}
            originalHP={data.hp.current}
            onTransform={(creature) => setData(prev => ({
              ...prev,
              transformed: {
                active: true,
                creatureName: creature.name,
                hp: { current: creature.hp, max: creature.hp },
                ac: creature.ac
              }
            }))}
            onDamage={(damage) => {
              if (!data.transformed) return { revert: false, carryoverDamage: 0 };
              const newHP = data.transformed.hp.current - damage;
              if (newHP <= 0) {
                const carryover = Math.abs(newHP);
                setData(prev => ({ ...prev, transformed: null }));
                if (carryover > 0) {
                  updateHealth(data.hp.current - carryover);
                  showToast(`Reverted! ${carryover} damage carried over`);
                } else {
                  showToast('Wild Shape ended');
                }
                return { revert: true, carryoverDamage: carryover };
              }
              setData(prev => ({
                ...prev,
                transformed: prev.transformed ? {
                  ...prev.transformed,
                  hp: { ...prev.transformed.hp, current: newHP }
                } : null
              }));
              return { revert: false, carryoverDamage: 0 };
            }}
            onRevert={() => {
              setData(prev => ({ ...prev, transformed: null }));
              showToast('Wild Shape ended');
            }}
            onHeal={(amount) => setData(prev => ({
              ...prev,
              transformed: prev.transformed ? {
                ...prev.transformed,
                hp: {
                  ...prev.transformed.hp,
                  current: Math.min(prev.transformed.hp.max, prev.transformed.hp.current + amount)
                }
              } : null
            }))}
          />
        </div>
      )}

      {activeTab === 'grimoire' && <div className="animate-fade-in"><GrimoireView /></div>}

      {activeTab === 'bio' && (
        <div className="animate-fade-in">
          <BiographyView />
          <AttunementWidget
            items={data.attunement}
            onAdd={(item) => {
              if (data.attunement.length < 3) {
                setData(prev => ({ ...prev, attunement: [...prev.attunement, item] }));
              } else {
                showToast('Maximum 3 attuned items!');
              }
            }}
            onRemove={(index) => setData(prev => ({
              ...prev,
              attunement: prev.attunement.filter((_, i) => i !== index)
            }))}
          />
          <InventoryWidget
            items={data.inventory || []}
            onAdd={(item) => setData(prev => ({ ...prev, inventory: [...(prev.inventory || []), item] }))}
            onRemove={(index) => setData(prev => ({
              ...prev,
              inventory: (prev.inventory || []).filter((_, i) => i !== index)
            }))}
          />
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-fade-in">
          <ErrorBoundary>
            <CharacterEditor
              data={data}
              onLevelChange={handleLevelChange}
              onAbilityChange={handleAbilityChange}
            />
            <InitiativeWidget
              dexMod={data.abilities.dex.mod}
              profBonus={data.profBonus}
            />
            <ProficiencyWidget
              profBonus={data.profBonus}
              level={data.level}
            />
            <SavingThrowsWidget
              abilities={data.abilities}
              profBonus={data.profBonus}
              savingThrowProficiencies={data.savingThrowProficiencies}
            />
            <HitDiceWidget
              hitDice={data.hitDice}
              conMod={data.abilities.con.mod}
              currentHP={data.hp.current}
              maxHP={data.hp.max}
              onSpend={handleSpendHitDie}
            />
            <div className="mt-8 border-t border-gray-800 pt-8">
              <RestView
                hitDice={data.hitDice}
                conMod={data.abilities.con.mod}
                currentHP={data.hp.current}
                maxHP={data.hp.max}
                onSpendHitDie={handleSpendHitDie}
                onLongRest={handleLongRest}
              />
            </div>
            <div className="mt-8 border-t border-gray-800 pt-8">
              <MulticlassSpellSlotsWidget
                onSlotsCalculated={(newSlots) => {
                  setData(prev => ({ ...prev, slots: newSlots }));
                  showToast('Spell slots updated!');
                }}
              />
            </div>
          </ErrorBoundary>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white/95 text-black px-6 py-3 rounded-lg shadow-xl shadow-white/20 z-[100] animate-slide-up font-display text-sm uppercase tracking-widest border border-white/50">
          {toast}
        </div>
      )}

      {/* Session Picker Modal */}
      {showSessionPicker && (
        <SessionPicker onSessionSelected={handleSessionSelected} />
      )}
    </AppShell>
  );
}

export default App;
