import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { AbilityKey } from '../types';

// Root Selectors
export const selectStats = (state: RootState) => state.stats;
export const selectHealth = (state: RootState) => state.health;
export const selectWarlock = (state: RootState) => state.warlock;
export const selectInventory = (state: RootState) => state.inventory;
export const selectUI = (state: RootState) => state.ui;

// Aggregate Selector
export const selectCharacter = createSelector(
    [selectStats, selectHealth, selectWarlock, selectInventory],
    (stats, health, warlock, inventory) => ({
        ...stats,
        ...health,
        ...warlock,
        ...inventory
    })
);

// Health Selectors
export const selectHp = (state: RootState) => state.health.hp;
export const selectConcentration = (state: RootState) => state.health.concentration;

// Warlock Selectors
export const selectPactSlots = (state: RootState) => state.warlock.pactSlots;
export const selectArcanum = (state: RootState) => state.warlock.arcanum;
export const selectInvocations = (state: RootState) => state.warlock.invocations;

// UI Selectors
export const selectToast = (state: RootState) => state.ui.toast;

// Derived Stat Selectors
export const selectSpellSaveDC = (state: RootState) => state.stats.dc;
export const selectProfBonus = (state: RootState) => state.stats.profBonus;

export const selectAbilityModifier = createSelector(
    [selectStats, (_: RootState, ability: AbilityKey) => ability],
    (stats, ability) => stats.abilityMods[ability]
);

export const selectCurrentAC = createSelector(
    [selectStats, selectWarlock],
    (stats, warlock) => {
        const armorOfShadows = warlock.invocations.find(i => i.id === 'armor-of-shadows' || i.name === 'Armor of Shadows');
        if (armorOfShadows?.active) {
            return 13 + stats.abilityMods.dex;
        }
        return stats.baseAC + stats.abilityMods.dex;
    }
);

export const selectSpellAttackBonus = createSelector(
    [selectStats],
    (stats) => stats.profBonus + stats.abilityMods.cha
);
