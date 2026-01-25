import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { AbilityKey, EquippedItem, WeaponStats, StatModifier } from '../types';

// Root Selectors
export const selectStats = (state: RootState) => state.stats;
export const selectHealth = (state: RootState) => state.health;
export const selectWarlock = (state: RootState) => state.warlock;
export const selectInventory = (state: RootState) => state.inventory;
export const selectEquipment = (state: RootState) => state.equipment.equipped;
export const selectFamiliar = (state: RootState) => state.familiar.active;
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

// === EQUIPMENT MODIFIER SELECTORS ===

/**
 * Returns sum of all non-cosmetic equipment modifiers for a given stat.
 * 'bonus' type modifiers are summed, 'set' type override the value.
 */
export const selectEquipmentModifiers = createSelector(
    [selectEquipment, (_: RootState, stat: StatModifier['stat']) => stat],
    (equipment, stat) => {
        const equippedItems = Object.values(equipment).filter((item): item is EquippedItem => item !== null && !item.cosmeticOnly);

        // First check for 'set' modifiers (which override base values)
        const setModifier = equippedItems
            .flatMap(item => item.modifiers)
            .find(mod => mod.stat === stat && mod.type === 'set');

        if (setModifier) {
            return setModifier.value;
        }

        // If no 'set' modifier, sum all 'bonus' modifiers
        return equippedItems
            .flatMap(item => item.modifiers)
            .filter(mod => mod.stat === stat && mod.type === 'bonus')
            .reduce((sum, mod) => sum + mod.value, 0);
    }
);

/**
 * Returns array of all non-cosmetic equipped items for iteration.
 */
export const selectEquippedItems = createSelector(
    [selectEquipment],
    (equipment) => {
        return Object.values(equipment).filter((item): item is EquippedItem => item !== null && !item.cosmeticOnly);
    }
);

// === AC SELECTOR (Updated with equipment modifiers) ===

export const selectCurrentAC = createSelector(
    [selectStats, selectWarlock, selectEquipment],
    (stats, warlock, equipment) => {
        let baseAC = stats.baseAC;

        // Armor of Shadows invocation
        const armorOfShadows = warlock.invocations.find(i => i.id === 'armor-of-shadows' || i.name === 'Armor of Shadows');
        if (armorOfShadows?.active) {
            baseAC = Math.max(baseAC, 13 + stats.abilityMods.dex);
        }

        // Add equipment AC bonuses (non-cosmetic)
        const equippedItems = Object.values(equipment).filter((item): item is EquippedItem => item !== null && !item.cosmeticOnly);
        const equipmentBonus = equippedItems
            .flatMap(item => item.modifiers)
            .filter(mod => mod.stat === 'ac' && mod.type === 'bonus')
            .reduce((sum, mod) => sum + mod.value, 0);

        // Check for 'set' AC modifier (which overrides everything)
        const setAC = equippedItems
            .flatMap(item => item.modifiers)
            .find(mod => mod.stat === 'ac' && mod.type === 'set');

        if (setAC) {
            return setAC.value;
        }

        return baseAC + equipmentBonus;
    }
);

// === WEAPON ATTACK BONUS SELECTOR ===

export const selectWeaponAttackBonus = createSelector(
    [selectStats, selectEquipment, (_: RootState, weapon: WeaponStats | undefined) => weapon],
    (stats, equipment, weapon) => {
        if (!weapon) return 0;

        // Finesse: use higher of STR or DEX
        const abilityMod = weapon.properties.includes('finesse')
            ? Math.max(stats.abilityMods.str, stats.abilityMods.dex)
            : stats.abilityMods.str;

        // Equipment attack bonus (e.g., +1 gloves)
        const equippedItems = Object.values(equipment).filter((item): item is EquippedItem => item !== null && !item.cosmeticOnly);
        const equipmentBonus = equippedItems
            .flatMap(item => item.modifiers)
            .filter(mod => mod.stat === 'attackBonus' && mod.type === 'bonus')
            .reduce((sum, mod) => sum + mod.value, 0);

        return stats.profBonus + abilityMod + (weapon.bonus || 0) + equipmentBonus;
    }
);

export const selectSpellAttackBonus = createSelector(
    [selectStats],
    (stats) => stats.profBonus + stats.abilityMods.cha
);
