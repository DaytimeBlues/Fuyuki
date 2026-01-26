/**
 * App.tsx - Main Application Entry
 * 
 * WHY: This component coordinates global state and orchestration.
 * Logic is delegated to sub-components:
 * - AppShell: Layout, Navigation, Global Overlays (Toasts, SessionPicker)
 * - TabRouter: View-specific routing and state mapping
 */
import { useState, useEffect, useMemo, useCallback, memo } from 'react';

import { AppShell } from './components/layout/AppShell';
import { TabRouter } from './components/layout/TabRouter';
import { CombatOverlay } from './components/views/CombatOverlay';
import { CombatBubble } from './components/widgets/CombatBubble';
import { VoiceCommandButton } from './components/widgets/VoiceCommandButton';
import { ensureActiveSession } from './utils/sessionStorage';
import { migrateSessionToV3, createSessionBackup } from './utils/sessionMigration';
import { validateSessionForMigration } from './utils/migrationValidator';
import type { CharacterData, AbilityKey, Session } from './types';
import {
  showToast,
  clearToast,
  setInitialized,
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
  updateDerivedStats,
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

  const stats = useAppSelector(state => state.stats);
  const health = useAppSelector(state => state.health);
  const warlock = useAppSelector(state => state.warlock);
  const inventory = useAppSelector(state => state.inventory);
  const isInitialized = useAppSelector(state => state.ui.isInitialized);

  const character = useMemo(() => ({
    ...stats,
    ...health,
    ...warlock,
    ...inventory
  }), [stats, health, warlock, inventory]);

  const toast = useAppSelector(state => state.ui.toast);

  // Helper to hydrate all slices
  const hydrateFromSession = useCallback((session: Session): void => {
    const data = JSON.parse(JSON.stringify(session.characterData)) as CharacterData;
    console.log('App: Hydrating from session', session.id);
    dispatch(hydrateStats(data));
    dispatch(hydrateHealth(data));
    dispatch(hydrateWarlock(data));
    dispatch(hydrateInventory(data));
    if (data.equipmentSlots) {
      dispatch(hydrateEquipment(data.equipmentSlots));
    }
    if (data.familiar) {
      dispatch(hydrateFamiliar(data.familiar));
    }
  }, [dispatch]);

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
        hydrateFromSession(session);
        dispatch(setInitialized(true));
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
          const parsed = JSON.parse(sessions) as Session[];
          const index = parsed.findIndex((storedSession) => storedSession.id === session.id);
          if (index !== -1) {
            parsed[index] = migrated;
            localStorage.setItem('fuyuki-sessions', JSON.stringify(parsed));
          }
        }

        // Load migrated session
        hydrateFromSession(migrated);
      } catch (error) {
        console.error('App: Migration failed, loading original session:', error);
        hydrateFromSession(session);
      }
    } else {
      // No migration needed, load as-is
      hydrateFromSession(session);
    }

    window.scrollTo(0, 0);
    console.log('App: Session auto-loaded', session.id);
    dispatch(setInitialized(true));
  }, [dispatch, hydrateFromSession]);

  // --- ACTIONS ---
  const actions = {
    updateHealth: (newCurrent: number) => dispatch(hpChanged(newCurrent)),
    updateTempHP: (newTemp: number) => dispatch(tempHpSet(newTemp)),
    updateDeathSaves: (type: 'successes' | 'failures', value: number) => dispatch(deathSaveChanged({ type, value })),
    onSpendHitDie: (healed: number, diceSpent: number) => dispatch(hitDiceSpent({ count: diceSpent, healed })),
    onShortRest: () => {
      dispatch(shortRestWarlock());
      dispatch(showToast("Short Rest Completed"));
      setActiveTab('stats');
    },
    onLongRest: () => {
      dispatch(longRestHealth());
      dispatch(longRestWarlock());
      dispatch(showToast("Long Rest Completed"));
      setActiveTab('stats');
    },
    onLevelChange: (newLevel: number) => {
      dispatch(levelChanged(newLevel));
      const nextAbilities = { ...stats.abilities };
      const nextAbilityMods = {
        str: Math.floor((nextAbilities.str - 10) / 2),
        dex: Math.floor((nextAbilities.dex - 10) / 2),
        con: Math.floor((nextAbilities.con - 10) / 2),
        int: Math.floor((nextAbilities.int - 10) / 2),
        wis: Math.floor((nextAbilities.wis - 10) / 2),
        cha: Math.floor((nextAbilities.cha - 10) / 2),
      };
      const nextProfBonus = Math.floor((Math.max(1, Math.min(20, newLevel)) - 1) / 4) + 2;
      const nextMaxHP = (() => {
        const clampedLevel = Math.max(1, Math.min(20, newLevel));
        const conMod = nextAbilityMods.con;
        const firstLevelHP = health.hitDice.size + conMod;
        if (clampedLevel === 1) return Math.max(1, firstLevelHP);
        const avgHitDie = Math.floor(health.hitDice.size / 2) + 1;
        const totalHP = firstLevelHP + (clampedLevel - 1) * (avgHitDie + conMod);
        return Math.max(clampedLevel, totalHP);
      })();
      dispatch(updateDerivedStats({
        abilityMods: nextAbilityMods,
        profBonus: nextProfBonus,
        dc: 8 + nextProfBonus + nextAbilityMods.cha,
        level: newLevel,
      }));
      dispatch(hydrateHealth({
        ...character,
        hp: { ...health.hp, max: nextMaxHP, current: Math.min(health.hp.current, nextMaxHP) },
        hitDice: { ...health.hitDice, max: Math.max(1, newLevel) },
      }));
    },
    onAbilityChange: (ability: AbilityKey, newScore: number) => {
      dispatch(abilityScoreChanged({ ability, newScore }));
      const nextAbilities = { ...stats.abilities, [ability]: newScore };
      const nextAbilityMods = {
        str: Math.floor((nextAbilities.str - 10) / 2),
        dex: Math.floor((nextAbilities.dex - 10) / 2),
        con: Math.floor((nextAbilities.con - 10) / 2),
        int: Math.floor((nextAbilities.int - 10) / 2),
        wis: Math.floor((nextAbilities.wis - 10) / 2),
        cha: Math.floor((nextAbilities.cha - 10) / 2),
      };
      const nextMaxHP = (() => {
        const clampedLevel = Math.max(1, Math.min(20, stats.level));
        const conMod = nextAbilityMods.con;
        const firstLevelHP = health.hitDice.size + conMod;
        if (clampedLevel === 1) return Math.max(1, firstLevelHP);
        const avgHitDie = Math.floor(health.hitDice.size / 2) + 1;
        const totalHP = firstLevelHP + (clampedLevel - 1) * (avgHitDie + conMod);
        return Math.max(clampedLevel, totalHP);
      })();
      dispatch(updateDerivedStats({
        abilityMods: nextAbilityMods,
        dc: 8 + stats.profBonus + nextAbilityMods.cha,
      }));
      dispatch(hydrateHealth({
        ...character,
        hp: { ...health.hp, max: nextMaxHP, current: Math.min(health.hp.current, nextMaxHP) },
      }));
    },
    itemAttuned: (itemName: string) => dispatch(itemAttuned(itemName)),
    itemUnattuned: (index: number) => dispatch(itemUnattuned(index)),
  };

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

export default memo(App);
