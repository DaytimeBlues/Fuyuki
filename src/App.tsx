/**
 * App.tsx - Main Application Component
 * 
 * WHY: This component now serves as the routing/layout layer.
 * All character state is managed in Redux's characterSlice.
 * Widgets consume state via useAppSelector and dispatch actions.
 */
import { useState, useEffect, useCallback } from 'react';
import { InitiativeWidget } from './components/widgets/InitiativeWidget';
import { AppShell } from './components/layout/AppShell';
import { ProficiencyWidget } from './components/widgets/ProficiencyWidget';
import { SavingThrowsWidget } from './components/widgets/SavingThrowsWidget';
import { CharacterEditor } from './components/widgets/CharacterEditor';
import { CombatHUD } from './components/widgets/CombatHUD';
import { VoiceCommandButton } from './components/widgets/VoiceCommandButton';
import SpellsView from './components/views/SpellsView';
import { CombatView } from './components/views/CombatView';
import { CombatOverlay } from './components/views/CombatOverlay';
import { DashboardView } from './components/views/DashboardView';
import { CharacterHubView } from './components/views/CharacterHubView';
import { MoreView } from './components/views/MoreView';
import { RestView } from './components/views/RestView';
import { InventoryView } from './components/views/InventoryView';
import { SessionPicker } from './components/SessionPicker';
import { getActiveSession } from './utils/sessionStorage';
import type { Session } from './types';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  selectCharacter,
  selectToast,
  hpChanged,
  tempHpSet,
  deathSaveChanged,
  hitDiceSpent,
  shortRestCompleted,
  longRestCompleted,
  levelChanged,
  abilityScoreChanged,
  itemAttuned,
  itemUnattuned,
  toastCleared,
  hydrate,
} from './store/slices/characterSlice';


// ...

function App() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('stats');
  const [showSessionPicker, setShowSessionPicker] = useState<boolean>(() => {
    return !getActiveSession();
  });

  // --- REDUX SELECTORS ---
  const character = useAppSelector(selectCharacter);
  const toast = useAppSelector(selectToast);
  // NOTE: minions are now managed in CombatView via combatSlice

  // Clear toast after 2 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => dispatch(toastCleared()), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  // --- SESSION HANDLING ---
  const handleSessionSelected = (session: Session) => {
    dispatch(hydrate({ characterData: session.characterData }));
    setShowSessionPicker(false);
  };

  // --- CALLBACKS (dispatch Redux actions) ---
  const updateHealth = useCallback((newCurrent: number) => {
    dispatch(hpChanged(newCurrent));
  }, [dispatch]);

  const updateTempHP = useCallback((newTemp: number) => {
    dispatch(tempHpSet(newTemp));
  }, [dispatch]);

  const updateDeathSaves = useCallback((type: 'successes' | 'failures', value: number) => {
    dispatch(deathSaveChanged({ type, value }));
  }, [dispatch]);


  const handleSpendHitDie = useCallback((healed: number, diceSpent: number) => {
    dispatch(hitDiceSpent({ count: diceSpent, healed }));
  }, [dispatch]);

  const handleShortRest = useCallback(() => {
    dispatch(shortRestCompleted());
    setActiveTab('home');
  }, [dispatch]);

  const handleLongRest = useCallback(() => {
    dispatch(longRestCompleted());
    setActiveTab('home');
  }, [dispatch]);

  const handleLevelChange = useCallback((newLevel: number) => {
    dispatch(levelChanged(newLevel));
  }, [dispatch]);

  const handleAbilityChange = useCallback((ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha', newScore: number) => {
    dispatch(abilityScoreChanged({ ability, newScore }));
  }, [dispatch]);


  return (
    <AppShell activeTab={activeTab === 'inventory' || activeTab === 'settings' ? 'more' : activeTab} onTabChange={(tab) => {
      // Reset to main view if clicking active 'more' tab
      if (tab === 'more' && (activeTab === 'inventory' || activeTab === 'settings')) {
        setActiveTab('more');
        return;
      }
      setActiveTab(tab);
    }}>
      {activeTab === 'stats' && (
        <DashboardView
          character={character}
          updateHealth={updateHealth}
          updateTempHP={updateTempHP}
          updateDeathSaves={updateDeathSaves}
        />
      )}

      {activeTab === 'spells' && (
        <div className="animate-fade-in">
          <SpellsView />
        </div>
      )}

      {activeTab === 'combat' && (
        <div className="animate-fade-in">
          <CombatView />
        </div>
      )}

      {activeTab === 'character' && (
        <CharacterHubView
          character={character}
          dispatch={dispatch}
          actions={{ itemAttuned, itemUnattuned }}
        />
      )}

      {/* MORE TAB & SUB-VIEWS */}
      {activeTab === 'more' && (
        <MoreView onSelectView={(view) => setActiveTab(view)} />
      )}

      {activeTab === 'inventory' && (
        <div className="animate-fade-in">
          <button
            onClick={() => setActiveTab('more')}
            className="mb-4 flex items-center gap-1 text-sm text-accent hover:text-white transition-colors"
          >
            ← Back to Menu
          </button>
          <InventoryView />
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-fade-in">
          <button
            onClick={() => setActiveTab('more')}
            className="mb-4 flex items-center gap-1 text-sm text-accent hover:text-white transition-colors"
          >
            ← Back to Menu
          </button>
          <CharacterEditor
            data={character}
            onLevelChange={handleLevelChange}
            onAbilityChange={handleAbilityChange}
          />
          <InitiativeWidget
            dexMod={character.abilityMods.dex}
            profBonus={character.profBonus}
          />
          <ProficiencyWidget
            profBonus={character.profBonus}
            level={character.level}
          />
          <SavingThrowsWidget
            abilityMods={character.abilityMods}
            profBonus={character.profBonus}
            savingThrowProficiencies={character.savingThrowProficiencies}
          />
          <div className="mt-8 border-t border-white/5 pt-8">
            <RestView
              hitDice={character.hitDice}
              conMod={character.abilityMods.con}
              currentHP={character.hp.current}
              maxHP={character.hp.max}
              onSpendHitDie={handleSpendHitDie}
              onShortRest={handleShortRest}
              onLongRest={handleLongRest}
            />
          </div>
        </div>
      )}

      {/* Combat Overlay System */}
      <CombatOverlay />

      {/* Persistent HUD (except on settings/more to reduce clutter) */}
      {activeTab !== 'stats' && activeTab !== 'settings' && activeTab !== 'more' && (
        <CombatHUD
          concentrationSpell={character.concentration}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white/95 text-black px-6 py-3 rounded-lg shadow-xl shadow-white/20 z-[100] animate-slide-up font-display text-sm uppercase tracking-widest border border-white/50"
          data-testid="toast-message"
        >
          {toast}
        </div>
      )}

      {/* Session Picker Modal */}
      {showSessionPicker && (
        <SessionPicker onSessionSelected={handleSessionSelected} />
      )}

      {activeTab === 'home' && <VoiceCommandButton />}
    </AppShell>
  );
}

export default App;
