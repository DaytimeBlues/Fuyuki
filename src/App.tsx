/**
 * App.tsx - Main Application Entry
 * 
 * WHY: This component coordinates global state and orchestration.
 * Logic is delegated to sub-components:
 * - AppShell: Layout, Navigation, Global Overlays (Toasts, SessionPicker)
 * - TabRouter: View-specific routing and state mapping
 */
import { useState, useEffect, useMemo, useCallback } from 'react';

import { AppShell } from './components/layout/AppShell';
import { TabRouter } from './components/layout/TabRouter';
import { CombatOverlay } from './components/views/CombatOverlay';
import { CombatBubble } from './components/widgets/CombatBubble';
import { VoiceCommandButton } from './components/widgets/VoiceCommandButton';
import { SessionPicker } from './components/SessionPicker';
import { getActiveSession } from './utils/sessionStorage';
import type { Session, CharacterData, AbilityKey } from './types';
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

function App() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('stats');
  const [showSessionPicker, setShowSessionPicker] = useState<boolean>(() => {
    return !getActiveSession();
  });

  const character = useAppSelector(selectCharacter);
  const toast = useAppSelector(selectToast);

  // Auto-clear toasts
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => dispatch(toastCleared()), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  const handleSessionSelected = useCallback((session: Session) => {
    console.log('App: handleSessionSelected called', session);
    try {
      dispatch(hydrate({ characterData: session.characterData }));
      setShowSessionPicker(false);
      window.scrollTo(0, 0);
      console.log('App: Session picker hidden');
    } catch (error) {
      console.error('App: Error in handleSessionSelected', error);
    }
  }, [dispatch]);

  // --- ACTIONS ---
  // Memoize actions to prevent unnecessary re-renders of TabRouter
  const actions = useMemo(() => ({
    updateHealth: (newCurrent: number) => dispatch(hpChanged(newCurrent)),
    updateTempHP: (newTemp: number) => dispatch(tempHpSet(newTemp)),
    updateDeathSaves: (type: 'successes' | 'failures', value: number) => dispatch(deathSaveChanged({ type, value })),
    handleSpendHitDie: (healed: number, diceSpent: number) => dispatch(hitDiceSpent({ count: diceSpent, healed })),
    handleShortRest: () => {
      dispatch(shortRestCompleted());
      setActiveTab('stats');
    },
    handleLongRest: () => {
      dispatch(longRestCompleted());
      setActiveTab('stats');
    },
    handleLevelChange: (newLevel: number) => dispatch(levelChanged(newLevel)),
    handleAbilityChange: (ability: AbilityKey, newScore: number) => dispatch(abilityScoreChanged({ ability, newScore })),
    itemAttuned: (itemName: string) => dispatch(itemAttuned(itemName)),
    itemUnattuned: (index: number) => dispatch(itemUnattuned(index)),
  }), [dispatch]);

  const navTab = activeTab === 'inventory' || activeTab === 'settings' ? 'more' : activeTab;

  return (
    <AppShell
      activeTab={navTab}
      onTabChange={(tab) => {
        if (tab === 'more' && (activeTab === 'inventory' || activeTab === 'settings')) {
          setActiveTab('more');
        } else {
          setActiveTab(tab);
        }
      }}
      toast={toast}
      showSessionPicker={showSessionPicker}
      renderSessionPicker={() => <SessionPicker onSessionSelected={handleSessionSelected} />}
    >
      <TabRouter
        activeTab={activeTab}
        onNavigate={setActiveTab}
        character={character as CharacterData}
        dispatch={dispatch}
        {...actions}
      />

      <CombatOverlay />
      <CombatBubble />

      {activeTab === 'home' && <VoiceCommandButton />}
    </AppShell>
  );
}

export default App;
