import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HealthWidget } from './components/widgets/HealthWidget';
import { ArmorClassWidget } from './components/widgets/ArmorClassWidget';
import { SpellSlotsWidget } from './components/widgets/SpellSlotsWidget';
import { DeathSavesWidget } from './components/widgets/DeathSavesWidget';
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
    setData(prev => ({
      ...prev,
      hp: { ...prev.hp, current: Math.min(prev.hp.max, Math.max(0, newCurrent)) }
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
      hp: { ...prev.hp, current: prev.hp.max },
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
              onChange={updateHealth}
            />
          </div>

          <div className="animate-slide-up stagger-2">
            <ArmorClassWidget
              baseAC={data.baseAC}
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
        </div>
      )}

      {activeTab === 'grimoire' && <div className="animate-fade-in"><GrimoireView /></div>}

      {activeTab === 'bio' && <div className="animate-fade-in"><BiographyView /></div>}

      {activeTab === 'settings' && (
        <div className="animate-fade-in">
          <ErrorBoundary>
            <CharacterView data={data} />
            <div className="mt-8 border-t border-gray-800 pt-8">
              <RestView onShortRest={handleShortRest} onLongRest={handleLongRest} />
            </div>
          </ErrorBoundary>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-accent/90 text-white px-6 py-3 rounded-lg shadow-xl shadow-accent/20 z-[100] animate-slide-up font-display text-sm uppercase tracking-widest border border-accent/50">
          {toast}
        </div>
      )}
    </AppShell>
  );
}

export default App;
