import { useState, useEffect, useCallback, useRef } from 'react';
import { AppShell } from './components/layout/AppShell';

import { HealthWidget } from './components/widgets/HealthWidget';
import { ArmorClassWidget } from './components/widgets/ArmorClassWidget';
import { SpellSlotsWidget } from './components/widgets/SpellSlotsWidget';
import { DeathSavesWidget } from './components/widgets/DeathSavesWidget';
import { ConcentrationWidget } from './components/widgets/ConcentrationWidget';
import { AttunementWidget } from './components/widgets/AttunementWidget';
import { InventoryWidget } from './components/widgets/InventoryWidget';
import { MulticlassSpellSlotsWidget } from './components/widgets/MulticlassSpellSlotsWidget';
import { HitDiceWidget } from './components/widgets/HitDiceWidget';
import { InitiativeWidget } from './components/widgets/InitiativeWidget';
import { ProficiencyWidget } from './components/widgets/ProficiencyWidget';
import { SavingThrowsWidget } from './components/widgets/SavingThrowsWidget';
import { CharacterEditor } from './components/widgets/CharacterEditor';
import SpellsView from './components/views/SpellsView';
import { CombatView } from './components/views/CombatView';
import { CombatOverlay } from './components/views/CombatOverlay';
import { RestView } from './components/views/RestView';
import { GrimoireView } from './components/views/GrimoireView';
import { BiographyView } from './components/views/BiographyView';
import { SessionPicker } from './components/SessionPicker';
import { initialCharacterData } from './data/initialState';
import { spells } from './data/spells';
import { getActiveSession, updateActiveSession } from './utils/sessionStorage';
import {
  recalculateDerivedCharacterData,
} from './utils/srdRules';
import { getRequiredLevelForSpell } from './utils/spellRules';
import type { CharacterData, Minion, Session } from './types';
import type { InventoryItem } from './types';
import { useAppDispatch } from './store/hooks';
import { castingStarted, slotConfirmed } from './store/slices/combatSlice';

function App() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('home');
  const [showSessionPicker, setShowSessionPicker] = useState<boolean>(() => {
    return !getActiveSession();
  });
  const normalizeInventory = useCallback((inv: unknown): InventoryItem[] => {
    if (!Array.isArray(inv)) return [];
    return inv
      .map((entry): InventoryItem | null => {
        if (typeof entry === 'string') return { name: entry };
        if (entry && typeof entry === 'object' && typeof (entry as any).name === 'string') {
          const maybe = entry as any;
          return {
            name: maybe.name,
            spells: Array.isArray(maybe.spells) ? maybe.spells.filter((s: unknown) => typeof s === 'string') : undefined,
          };
        }
        return null;
      })
      .filter((x): x is InventoryItem => Boolean(x));
  }, []);

  const normalizeCharacterData = useCallback((d: CharacterData): CharacterData => {
    return {
      ...d,
      inventory: normalizeInventory((d as any).inventory),
    };
  }, [normalizeInventory]);

  const [data, setData] = useState<CharacterData>(() => {
    const session = getActiveSession();
    return session ? normalizeCharacterData(session.characterData) : normalizeCharacterData(initialCharacterData);
  });
  const [minions, setMinions] = useState<Minion[]>(() => {
    const session = getActiveSession();
    return session ? session.minions : [];
  });
  const [toast, setToast] = useState<string | null>(null);

  // Debounce timer ref for localStorage writes
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist state to active session with debouncing (500ms delay)
  // This prevents main thread blocking during rapid HP/stat updates
  useEffect(() => {
    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Schedule debounced save
    saveTimeoutRef.current = setTimeout(() => {
      updateActiveSession(data, minions);
    }, 500);

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, minions]);

  const handleSessionSelected = (session: Session) => {
    setData(normalizeCharacterData(session.characterData));
    setMinions(session.minions);
    setShowSessionPicker(false);
  };

  // Toast notification - declared early so other callbacks can use it
  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const updateHealth = useCallback((newCurrent: number) => {
    setData(prev => {
      const delta = newCurrent - prev.hp.current;

      // If taking damage (negative delta), THP absorbs first per RAW
      if (delta < 0) {
        const damage = Math.abs(delta);
        const tempAbsorbed = Math.min(prev.hp.temp, damage);
        const remainingDamage = damage - tempAbsorbed;
        const newHP = Math.max(0, prev.hp.current - remainingDamage);

        // CON save for concentration when taking damage
        // RAW: DC = max(10, damage/2) - using total damage taken (common ruling)
        if (prev.concentration && remainingDamage > 0 && newHP > 0) {
          const conSaveDC = Math.max(10, Math.floor(damage / 2));
          setTimeout(() => showToast(`CON Save DC ${conSaveDC} to maintain ${prev.concentration}`), 0);
        }

        // Notify if concentration lost due to dropping to 0 HP
        if (prev.concentration && newHP === 0) {
          setTimeout(() => showToast(`Concentration on ${prev.concentration} lost - Incapacitated!`), 0);
        }

        return {
          ...prev,
          hp: {
            ...prev.hp,
            temp: prev.hp.temp - tempAbsorbed,
            current: newHP
          },
          // RAW: Concentration ends when incapacitated (0 HP)
          concentration: newHP === 0 ? null : prev.concentration
        };
      } else {
        // Healing - only affects current HP, not THP
        // RAW: Reset death saves when healed from 0 HP
        const wasAtZero = prev.hp.current === 0;

        if (wasAtZero && newCurrent > 0) {
          setTimeout(() => showToast("Stabilized! Death saves reset."), 0);
        }

        return {
          ...prev,
          hp: { ...prev.hp, current: Math.min(prev.hp.max, Math.max(0, newCurrent)) },
          deathSaves: wasAtZero && newCurrent > 0
            ? { successes: 0, failures: 0 }
            : prev.deathSaves
        };
      }
    });
  }, [showToast]);

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

  const handleCastFromInventory = useCallback((spellName: string) => {
    const spell = spells.find(s => s.name === spellName) ||
      spells.find(s => s.name.toLowerCase() === spellName.toLowerCase());
    if (!spell) {
      showToast(`Unknown spell: ${spellName}`);
      return;
    }

    const rollsLower = (spell.rolls ?? '').toLowerCase();
    const resolutionMode: 'attack' | 'save' | 'automatic' =
      rollsLower.includes('attack') ? 'attack' : rollsLower.includes('save') ? 'save' : 'automatic';

    dispatch(castingStarted({ spellId: spell.name }));
    dispatch(slotConfirmed({ slotLevel: spell.lvl, resolutionMode }));
    setActiveTab('combat');
  }, [dispatch, showToast]);

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
      return recalculateDerivedCharacterData({ ...prev, level: newLevel });
    });
    showToast(`Level changed to ${newLevel}`);
  }, [showToast]);

  /**
   * Handle ability score change with cascade updates per SRD 5.1
   * Cascades: ability modifier, and if CON/INT: max HP, spell save DC
   */
  const handleAbilityChange = useCallback((ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha', newScore: number) => {
    setData(prev => {
      const next: CharacterData = {
        ...prev,
        abilities: { ...prev.abilities, [ability]: newScore },
      };
      return recalculateDerivedCharacterData(next);
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
              dexMod={data.abilityMods.dex}
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
              suggestions={spells
                .filter(spell => spell.concentration)
                .filter(spell => getRequiredLevelForSpell(spell.lvl) <= data.level)
                .map(spell => spell.name)}
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

      {activeTab === 'spells' && (
        <div className="animate-fade-in">
          <SpellsView />
        </div>
      )}

      {activeTab === 'combat' && (
        <div className="animate-fade-in">
          <CombatView
            minions={minions}
            onAddMinion={addMinion}
            onUpdateMinion={updateMinion}
            onRemoveMinion={removeMinion}
            onClearMinions={clearMinions}
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
            onCastSpell={handleCastFromInventory}
          />
        </div>
      )}





      {activeTab === 'settings' && (
        <div className="animate-fade-in">
          {/* ... existing settings content ... */}
          {/* (omitted for brevity in replacement, will rely on context matching) */}
          <CharacterEditor
            data={data}
            onLevelChange={handleLevelChange}
            onAbilityChange={handleAbilityChange}
          />
          {/* ... other widgets ... */}
          <InitiativeWidget
            dexMod={data.abilityMods.dex}
            profBonus={data.profBonus}
          />
          <ProficiencyWidget
            profBonus={data.profBonus}
            level={data.level}
          />
          <SavingThrowsWidget
            abilityMods={data.abilityMods}
            profBonus={data.profBonus}
            savingThrowProficiencies={data.savingThrowProficiencies}
          />
          <HitDiceWidget
            hitDice={data.hitDice}
            conMod={data.abilityMods.con}
            currentHP={data.hp.current}
            maxHP={data.hp.max}
            onSpend={handleSpendHitDie}
          />
          <div className="mt-8 border-t border-gray-800 pt-8">
            <RestView
              hitDice={data.hitDice}
              conMod={data.abilityMods.con}
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

        </div>
      )
      }

      {/* Combat Overlay System */}
      <CombatOverlay />

      {/* Toast */}
      {
        toast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white/95 text-black px-6 py-3 rounded-lg shadow-xl shadow-white/20 z-[100] animate-slide-up font-display text-sm uppercase tracking-widest border border-white/50">
            {toast}
          </div>
        )
      }

      {/* Session Picker Modal */}
      {
        showSessionPicker && (
          <SessionPicker onSessionSelected={handleSessionSelected} />
        )
      }
    </AppShell >
  );
}

export default App;
