/**
 * App.tsx - Main Application Entry
 * 
 * WHY: This component coordinates global state and orchestration.
 * Logic is delegated to sub-components:
 * - AppShell: Layout, Navigation, Global Overlays (Toasts, SessionPicker)
 * - TabRouter: View-specific routing and state mapping
 */
import { useState, useEffect, useMemo } from 'react';

import { AppShell } from './components/layout/AppShell';
import { TabRouter } from './components/layout/TabRouter';
import { CombatOverlay } from './components/views/CombatOverlay';
import { CombatBubble } from './components/widgets/CombatBubble';
import { VoiceCommandButton } from './components/widgets/VoiceCommandButton';
import { ensureActiveSession } from './utils/sessionStorage';
import { migrateSessionToV3, createSessionBackup } from './utils/sessionMigration';
import { validateSessionForMigration } from './utils/migrationValidator';
import type { CharacterData, AbilityKey } from './types';
import {
  showToast,
  clearToast,
} from './store/slices/uiSlice';
import {
  hpChanged,
  tempHpSet,
  deathSaveChanged,
  hitDiceSpent,
  hydrateHealth,
  longRestHealth,
} from './store/slices/healthSlice';
import {
  hydrateStats,
  levelChanged,
  abilityScoreChanged,
} from './store/slices/statSlice';
import {
  hydrateInventory,
  itemAttuned,
  itemUnattuned,
} from './store/slices/inventorySlice';
import {
  hydrateWarlock,
  shortRestWarlock,
  longRestWarlock,
} from './store/slices/warlockSlice';
import { hydrateEquipment } from './store/slices/equipmentSlice';
import { hydrateFamiliar } from './store/slices/familiarSlice';

import { useAppDispatch, useAppSelector } from './store/hooks';

function App() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('stats');
  const [isInitialized, setIsInitialized] = useState(false);

  const stats = useAppSelector(state => state.stats);
  const health = useAppSelector(state => state.health);
  const warlock = useAppSelector(state => state.warlock);
  const inventory = useAppSelector(state => state.inventory);

  const character = useMemo(() => ({
    ...stats,
    ...health,
    ...warlock,
    ...inventory
  }), [stats, health, warlock, inventory]);

  const toast = useAppSelector(state => state.ui.toast);

  // Auto-clear toasts
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => dispatch(clearToast()), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  // Auto-load (or create) session on startup
  useEffect(() => {
    const session = ensureActiveSession();

    // Run migration if needed
    if (session.migrationVersion !== 3) { // Target migration version
      console.log('App: Running migration from version', session.migrationVersion, 'to 3');

      // Validate before migration
      const validation = validateSessionForMigration(session);
      if (!validation.isValid) {
        console.error('App: Session validation failed:', validation.errors);
        // Load without migration to prevent data corruption
        dispatch(hydrateFromSession(session));
        setIsInitialized(true);
        return;
      }

      // Warn if needed
      if (validation.warnings.length > 0) {
        console.warn('App: Migration warnings:', validation.warnings);
      }

      try {
        // Create backup before migration
        createSessionBackup(session);

        // Run migration
        const migrated = migrateSessionToV3(session);

        // Update session in localStorage (persistence will pick it up)
        const sessions = localStorage.getItem('fuyuki-sessions');
        if (sessions) {
          const parsed = JSON.parse(sessions);
          const index = parsed.findIndex((s: any) => s.id === session.id);
          if (index !== -1) {
            parsed[index] = migrated;
            localStorage.setItem('fuyuki-sessions', JSON.stringify(parsed));
          }
        }

        // Load migrated session
        dispatch(hydrateFromSession(migrated));
      } catch (error) {
        console.error('App: Migration failed, loading original session:', error);
        dispatch(hydrateFromSession(session));
      }
    } else {
      // No migration needed, load as-is
      dispatch(hydrateFromSession(session));
    }

    window.scrollTo(0, 0);
    console.log('App: Session auto-loaded', session.id);
    setIsInitialized(true);
  }, [dispatch]);

  // Helper to hydrate all slices
  const hydrateFromSession = (session: any) => {
    dispatch(hydrateStats(session.characterData));
    dispatch(hydrateHealth(session.characterData));
    dispatch(hydrateWarlock(session.characterData));
    dispatch(hydrateInventory(session.characterData));
    if (session.characterData.equipmentSlots) {
      dispatch(hydrateEquipment(session.characterData.equipmentSlots));
    }
    if (session.characterData.familiar) {
      dispatch(hydrateFamiliar(session.characterData.familiar));
    }
  };

  // --- ACTIONS ---
  // Memoize actions to prevent unnecessary re-renders of TabRouter
  const actions = useMemo(() => ({
    updateHealth: (newCurrent: number) => dispatch(hpChanged(newCurrent)),
    updateTempHP: (newTemp: number) => dispatch(tempHpSet(newTemp)),
    updateDeathSaves: (type: 'successes' | 'failures', value: number) => dispatch(deathSaveChanged({ type, value })),
    handleSpendHitDie: (healed: number, diceSpent: number) => dispatch(hitDiceSpent({ count: diceSpent, healed })),
    handleShortRest: () => {
      dispatch(shortRestWarlock());
      dispatch(showToast("Short Rest Completed"));
      setActiveTab('stats');
    },
    handleLongRest: () => {
      dispatch(longRestHealth());
      dispatch(longRestWarlock());
      dispatch(showToast("Long Rest Completed"));
      setActiveTab('stats');
    },
    handleLevelChange: (newLevel: number) => dispatch(levelChanged(newLevel)),
    handleAbilityChange: (ability: AbilityKey, newScore: number) => dispatch(abilityScoreChanged({ ability, newScore })),
    itemAttuned: (itemName: string) => dispatch(itemAttuned(itemName)),
    itemUnattuned: (index: number) => dispatch(itemUnattuned(index)),
  }), [dispatch]);

  const navTab = activeTab === 'inventory' || activeTab === 'settings' ? 'more' : activeTab;

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-bg-void flex items-center justify-center">
        <div className="text-parchment font-display">Loading...</div>
      </div>
    );
  }

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
