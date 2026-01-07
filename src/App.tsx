import { useState } from 'react';
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
import { SpellsView } from './components/views/SpellsView';
import { CharacterView } from './components/views/CharacterView';
import { CombatView } from './components/views/CombatView';
import { RestView } from './components/views/RestView';
import { GrimoireView } from './components/views/GrimoireView';
import { BiographyView } from './components/views/BiographyView';
import { initialCharacterData } from './data/initialState';
import type { CharacterData, Minion } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [data, setData] = useState<CharacterData>(initialCharacterData);
  const [minions, setMinions] = useState<Minion[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const updateHealth = (newCurrent: number) => {
    const delta = newCurrent - data.hp.current;

    // If taking damage (negative delta), THP absorbs first per RAW
    if (delta < 0) {
      const damage = Math.abs(delta);
      const tempAbsorbed = Math.min(data.hp.temp, damage);
      const remainingDamage = damage - tempAbsorbed;

      setData(prev => ({
        ...prev,
        hp: {
          ...prev.hp,
          temp: prev.hp.temp - tempAbsorbed,
          current: Math.max(0, prev.hp.current - remainingDamage)
        }
      }));

      // CON save for concentration when taking damage (RAW: DC = max(10, damage/2))
      if (data.concentration && remainingDamage > 0) {
        const conSaveDC = Math.max(10, Math.floor(damage / 2));
        showToast(`CON Save DC ${conSaveDC} to maintain ${data.concentration}`);
      }
    } else {
      // Healing - only affects current HP, not THP
      setData(prev => ({
        ...prev,
        hp: { ...prev.hp, current: Math.min(prev.hp.max, Math.max(0, newCurrent)) }
      }));
    }
  };

  const updateTempHP = (newTemp: number) => {
    setData(prev => ({
      ...prev,
      hp: { ...prev.hp, temp: Math.max(0, newTemp) }
    }));
  };

  const updateAC = (key: 'mageArmour' | 'shield') => {
    setData(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateSpellSlot = (level: number, used: number) => {
    setData(prev => ({
      ...prev,
      slots: {
        ...prev.slots,
        [level]: { ...prev.slots[level], used }
      }
    }));
  };

  const updateDeathSaves = (type: 'successes' | 'failures', value: number) => {
    setData(prev => ({
      ...prev,
      deathSaves: { ...prev.deathSaves, [type]: value }
    }));
  };

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

  const updateMinion = (id: string, hp: number) => {
    setMinions(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, hp: { ...m.hp, current: Math.max(0, hp) } };
      }
      return m;
    }));
  };

  const removeMinion = (id: string) => {
    setMinions(prev => prev.filter(m => m.id !== id));
    showToast("Minion Destroyed");
  };

  const clearMinions = () => {
    setMinions([]);
    showToast("All Minions Released");
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleShortRest = () => {
    // Logic for short rest (could be expanded)
    showToast("Short Rest Taken");
  };

  const handleLongRest = () => {
    setData(prev => ({
      ...prev,
      hp: { ...prev.hp, current: prev.hp.max, temp: 0 },
      slots: Object.fromEntries(Object.entries(prev.slots).map(([k, v]) => [k, { ...v, used: 0 }])),
      mageArmour: false,
      shield: false,
      deathSaves: { successes: 0, failures: 0 }
    }));
    showToast("Long Rest Completed");
    setActiveTab('home');
  };

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
            <CharacterView data={data} />
            <div className="mt-8 border-t border-gray-800 pt-8">
              <RestView onShortRest={handleShortRest} onLongRest={handleLongRest} />
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
    </AppShell>
  );
}

export default App;
