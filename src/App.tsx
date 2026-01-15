/**
 * App.tsx - Main Application Component
 * 
 * WHY: This component now serves as the routing/layout layer.
 * All character state is managed in Redux's characterSlice.
 * Widgets consume state via useAppSelector and dispatch actions.
 */
import { useState, useEffect, useCallback } from 'react';
import { AppShell } from './components/layout/AppShell';
import { HealthWidget } from './components/widgets/HealthWidget';

import { PactSlotsWidget } from './components/widgets/PactSlotsWidget';
import { ArcanumWidget } from './components/widgets/ArcanumWidget';
import { DeathSavesWidget } from './components/widgets/DeathSavesWidget';
import { ConcentrationWidget } from './components/widgets/ConcentrationWidget';
import { AttunementWidget } from './components/widgets/AttunementWidget';
import { InventoryWidget } from './components/widgets/InventoryWidget';
import { HitDiceWidget } from './components/widgets/HitDiceWidget';
import { InitiativeWidget } from './components/widgets/InitiativeWidget';
import { ProficiencyWidget } from './components/widgets/ProficiencyWidget';
import { SavingThrowsWidget } from './components/widgets/SavingThrowsWidget';
import { CharacterEditor } from './components/widgets/CharacterEditor';
import { CombatHUD } from './components/widgets/CombatHUD';
import SpellsView from './components/views/SpellsView';
import { CombatView } from './components/views/CombatView';
import { CombatOverlay } from './components/views/CombatOverlay';
import { RestView } from './components/views/RestView';
import { GrimoireView } from './components/views/GrimoireView';
import { BiographyView } from './components/views/BiographyView';
import { StatsView } from './components/views/StatsView';
import { InventoryView } from './components/views/InventoryView';
import { SessionPicker } from './components/SessionPicker';
import { spells } from './data/spells';
import { getActiveSession } from './utils/sessionStorage';
import { getRequiredLevelForSpell } from './utils/spellRules';
import type { Session } from './types';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  selectCharacter,
  selectToast,
  hpChanged,
  tempHpSet,
  concentrationSet,
  deathSaveChanged,
  hitDiceSpent,
  shortRestCompleted,
  longRestCompleted,
  levelChanged,
  abilityScoreChanged,
  itemAttuned,
  itemUnattuned,
  inventoryItemAdded,
  inventoryItemRemoved,
  toastShown,
  toastCleared,
  hydrate,
} from './store/slices/characterSlice';
import { castingStarted, slotConfirmed } from './store/slices/combatSlice';

function App() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('home');
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

  const handleCastFromInventory = useCallback((spellName: string) => {
    const spell = spells.find(s => s.name === spellName) ||
      spells.find(s => s.name.toLowerCase() === spellName.toLowerCase());
    if (!spell) {
      dispatch(toastShown(`Unknown spell: ${spellName}`));
      return;
    }

    const rollsLower = (spell.rolls ?? '').toLowerCase();
    const resolutionMode: 'attack' | 'save' | 'automatic' =
      rollsLower.includes('attack') ? 'attack' : rollsLower.includes('save') ? 'save' : 'automatic';

    dispatch(castingStarted({ spellId: spell.name }));
    dispatch(slotConfirmed({ slotLevel: spell.lvl, resolutionMode }));
    setActiveTab('combat');
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
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'home' && (
        <div className="animate-fade-in">
          <div className="animate-slide-up stagger-1">
            <HealthWidget
              current={character.hp.current}
              max={character.hp.max}
              temp={character.hp.temp}
              onChange={updateHealth}
              onTempChange={updateTempHP}
            />
          </div>

          <div className="animate-slide-up stagger-3">
            <PactSlotsWidget />
          </div>

          <div className="animate-slide-up stagger-3.5">
            <ArcanumWidget />
          </div>

          <div className="animate-slide-up stagger-4">
            <ConcentrationWidget
              spell={character.concentration}
              suggestions={spells
                .filter(spell => spell.concentration)
                .filter(spell => getRequiredLevelForSpell(spell.lvl) <= character.level)
                .map(spell => spell.name)}
              onClear={() => dispatch(concentrationSet(null))}
              onSet={(spell) => dispatch(concentrationSet(spell))}
            />
          </div>

          <div className="animate-slide-up stagger-5">
            <DeathSavesWidget
              successes={character.deathSaves.successes}
              failures={character.deathSaves.failures}
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
          <CombatView />
        </div>
      )}

      {activeTab === 'grimoire' && <div className="animate-fade-in"><GrimoireView /></div>}

      {activeTab === 'abilities' && (
        <div className="animate-fade-in">
          <StatsView
            abilities={character.abilities}
            abilityMods={character.abilityMods}
            skills={character.skills}
            profBonus={character.profBonus}
            level={character.level}
          />
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="animate-fade-in">
          <InventoryView />
        </div>
      )}

      {activeTab === 'bio' && (
        <div className="animate-fade-in">
          <BiographyView />
          <AttunementWidget
            items={character.attunement}
            onAdd={(item) => dispatch(itemAttuned(item))}
            onRemove={(index) => dispatch(itemUnattuned(index))}
          />
          <InventoryWidget
            items={character.inventory || []}
            onAdd={(item) => dispatch(inventoryItemAdded(item))}
            onRemove={(index) => dispatch(inventoryItemRemoved(index))}
            onCastSpell={handleCastFromInventory}
          />
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-fade-in">
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
          <HitDiceWidget
            hitDice={character.hitDice}
            conMod={character.abilityMods.con}
            currentHP={character.hp.current}
            maxHP={character.hp.max}
            onSpend={handleSpendHitDie}
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

      {activeTab !== 'home' && activeTab !== 'settings' && (
        <CombatHUD
          concentrationSpell={character.concentration}
        />
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
