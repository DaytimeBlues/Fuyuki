/**
 * characterSlice.ts
 * 
 * WHY: This is the SINGLE SOURCE OF TRUTH for all character data.
 * All widgets read state via selectors and dispatch actions to mutate.
 * This eliminates the dual-state problem of local useState + Redux.
 * 
 * Persistence is handled by the persistenceMiddleware which saves
 * to sessionStorage on every action.
 */
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { CharacterData, AbilityKey, InventoryItem, Minion } from '../../types';
import { initialCharacterData } from '../../data/initialState';
import { getActiveSession } from '../../utils/sessionStorage';
import { recalculateDerivedCharacterData } from '../../utils/srdRules';

// --- STATE INTERFACE ---
// Extends CharacterData with session-level data (minions)
export interface CharacterState extends CharacterData {
    minions: Minion[];
    // Toast message (ephemeral UI state, OK to keep here for simplicity)
    toast: string | null;
}

// --- INITIAL STATE ---
// Hydrate from sessionStorage if available, otherwise use defaults
function getInitialState(): CharacterState {
    const session = getActiveSession();
    if (session) {
        return {
            ...session.characterData,
            minions: session.minions || [],
            toast: null,
        };
    }
    return {
        ...initialCharacterData,
        minions: [],
        toast: null,
    };
}

const initialState: CharacterState = getInitialState();

// --- SLICE DEFINITION ---
export const characterSlice = createSlice({
    name: 'character',
    initialState,
    reducers: {
        /**
         * Hydrate state from sessionStorage (called on app mount or session switch)
         */
        hydrate: (state, action: PayloadAction<{ characterData: CharacterData; minions: Minion[] }>) => {
            Object.assign(state, action.payload.characterData);
            state.minions = action.payload.minions;
        },

        // --- HP ACTIONS ---
        /**
         * Update current HP. Handles THP absorption and concentration checks per RAW.
         */
        hpChanged: (state, action: PayloadAction<number>) => {
            const delta = action.payload - state.hp.current;

            if (delta < 0) {
                // Taking damage: THP absorbs first (SRD 5.1)
                const damage = Math.abs(delta);
                const tempAbsorbed = Math.min(state.hp.temp, damage);
                const remainingDamage = damage - tempAbsorbed;
                const newHP = Math.max(0, state.hp.current - remainingDamage);

                state.hp.temp -= tempAbsorbed;
                state.hp.current = newHP;

                // Concentration check toast
                if (state.concentration && remainingDamage > 0 && newHP > 0) {
                    const dc = Math.max(10, Math.floor(damage / 2));
                    state.toast = `CON Save DC ${dc} to maintain ${state.concentration}`;
                }

                // Incapacitated: lose concentration
                if (newHP === 0) {
                    if (state.concentration) {
                        state.toast = `Concentration on ${state.concentration} lost - Incapacitated!`;
                    }
                    state.concentration = null;
                }
            } else {
                // Healing
                const wasAtZero = state.hp.current === 0;
                state.hp.current = Math.min(state.hp.max, Math.max(0, action.payload));

                // Reset death saves when healed from 0
                if (wasAtZero && state.hp.current > 0) {
                    state.deathSaves = { successes: 0, failures: 0 };
                    state.toast = "Stabilized! Death saves reset.";
                }
            }
        },

        tempHpSet: (state, action: PayloadAction<number>) => {
            state.hp.temp = Math.max(0, action.payload);
        },

        // --- AC ACTIONS ---
        mageArmourToggled: (state) => {
            state.mageArmour = !state.mageArmour;
        },
        shieldToggled: (state) => {
            state.shield = !state.shield;
        },

        // --- SPELL SLOT ACTIONS ---
        slotUsed: (state, action: PayloadAction<{ level: number }>) => {
            const { level } = action.payload;
            if (state.slots[level] && state.slots[level].used < state.slots[level].max) {
                state.slots[level].used += 1;
            }
        },
        slotRestored: (state, action: PayloadAction<{ level: number }>) => {
            const { level } = action.payload;
            if (state.slots[level] && state.slots[level].used > 0) {
                state.slots[level].used -= 1;
            }
        },
        allSlotsRestored: (state) => {
            Object.keys(state.slots).forEach(key => {
                const level = Number(key);
                state.slots[level].used = 0;
            });
        },
        slotsUpdated: (state, action: PayloadAction<Record<number, { used: number; max: number }>>) => {
            Object.entries(action.payload).forEach(([level, slotData]) => {
                const slotLevel = Number(level);
                const currentUsed = state.slots[slotLevel]?.used ?? 0;
                state.slots[slotLevel] = {
                    used: Math.min(currentUsed, slotData.max),
                    max: slotData.max
                };
            });
        },

        // --- CONCENTRATION ---
        concentrationSet: (state, action: PayloadAction<string | null>) => {
            state.concentration = action.payload;
        },

        // --- DEATH SAVES ---
        deathSaveChanged: (state, action: PayloadAction<{ type: 'successes' | 'failures'; value: number }>) => {
            state.deathSaves[action.payload.type] = action.payload.value;
        },

        // --- HIT DICE ---
        hitDiceSpent: (state, action: PayloadAction<{ count: number; healed: number }>) => {
            state.hitDice.current = Math.max(0, state.hitDice.current - action.payload.count);
            state.hp.current = Math.min(state.hp.max, state.hp.current + action.payload.healed);
            if (action.payload.healed > 0) {
                state.toast = `Healed ${action.payload.healed} HP`;
            }
        },

        // --- LONG REST ---
        longRestCompleted: (state) => {
            // HP to max, THP reset
            state.hp.current = state.hp.max;
            state.hp.temp = 0;

            // Recover half hit dice (min 1)
            const recovered = Math.max(1, Math.ceil(state.hitDice.max / 2));
            state.hitDice.current = Math.min(state.hitDice.max, state.hitDice.current + recovered);

            // All spell slots restored
            Object.keys(state.slots).forEach(key => {
                const level = Number(key);
                state.slots[level].used = 0;
            });

            // Clear temp effects
            state.mageArmour = false;
            state.shield = false;
            state.concentration = null;
            state.deathSaves = { successes: 0, failures: 0 };

            state.toast = "Long Rest Completed";
        },

        // --- LEVEL & ABILITIES ---
        levelChanged: (state, action: PayloadAction<number>) => {
            const updated = recalculateDerivedCharacterData({ ...state, level: action.payload });
            Object.assign(state, updated);
            state.toast = `Level changed to ${action.payload}`;
        },
        abilityScoreChanged: (state, action: PayloadAction<{ ability: AbilityKey; newScore: number }>) => {
            state.abilities[action.payload.ability] = action.payload.newScore;
            const updated = recalculateDerivedCharacterData(state);
            Object.assign(state, updated);
            state.toast = `${action.payload.ability.toUpperCase()} updated to ${action.payload.newScore}`;
        },

        // --- ATTUNEMENT ---
        itemAttuned: (state, action: PayloadAction<string>) => {
            if (state.attunement.length < 3) {
                state.attunement.push(action.payload);
            } else {
                state.toast = 'Maximum 3 attuned items!';
            }
        },
        itemUnattuned: (state, action: PayloadAction<number>) => {
            state.attunement.splice(action.payload, 1);
        },

        // --- INVENTORY ---
        inventoryItemAdded: (state, action: PayloadAction<InventoryItem>) => {
            state.inventory.push(action.payload);
            state.toast = `Added ${action.payload.name}`;
        },
        inventoryItemRemoved: (state, action: PayloadAction<number>) => {
            state.inventory.splice(action.payload, 1);
        },
        inventoryItemUpdated: (state, action: PayloadAction<{ index: number; item: InventoryItem }>) => {
            if (state.inventory[action.payload.index]) {
                state.inventory[action.payload.index] = action.payload.item;
            }
        },
        itemChargeConsumed: (state, action: PayloadAction<number>) => {
            const item = state.inventory[action.payload];
            if (item && item.charges && item.charges.current > 0) {
                item.charges.current -= 1;
                state.toast = `Used charge on ${item.name}`;
            } else if (item) {
                state.toast = `${item.name} has no charges left!`;
            }
        },

        // --- MINIONS ---
        minionAdded: (state, action: PayloadAction<Minion>) => {
            state.minions.push(action.payload);
            state.toast = `Raised ${action.payload.type}`;
        },
        minionHpChanged: (state, action: PayloadAction<{ id: string; hp: number }>) => {
            const minion = state.minions.find(m => m.id === action.payload.id);
            if (minion) {
                minion.hp = Math.max(0, action.payload.hp);
            }
        },
        minionRemoved: (state, action: PayloadAction<string>) => {
            state.minions = state.minions.filter(m => m.id !== action.payload);
            state.toast = "Minion Destroyed";
        },
        allMinionsCleared: (state) => {
            state.minions = [];
            state.toast = "All Minions Released";
        },

        // --- TOAST ---
        toastShown: (state, action: PayloadAction<string>) => {
            state.toast = action.payload;
        },
        toastCleared: (state) => {
            state.toast = null;
        },

        // --- PREPARED SPELLS ---
        spellPrepared: (state, action: PayloadAction<string>) => {
            if (!state.preparedSpells.includes(action.payload)) {
                state.preparedSpells.push(action.payload);
            }
        },
        spellUnprepared: (state, action: PayloadAction<string>) => {
            state.preparedSpells = state.preparedSpells.filter(s => s !== action.payload);
        },
    },
});

// --- SELECTORS ---
// Local type to avoid circular dependency with RootState
interface StateWithCharacter {
    character: CharacterState;
}

export const selectCharacter = (state: StateWithCharacter) => state.character;
export const selectHp = (state: StateWithCharacter) => state.character.hp;
export const selectSlots = (state: StateWithCharacter) => state.character.slots;
export const selectConcentration = (state: StateWithCharacter) => state.character.concentration;
export const selectMinions = (state: StateWithCharacter) => state.character.minions;
export const selectToast = (state: StateWithCharacter) => state.character.toast;

export const selectAbilityModifier = createSelector(
    [selectCharacter, (_: StateWithCharacter, ability: AbilityKey) => ability],
    (character, ability) => character.abilityMods[ability]
);

export const selectSpellSaveDC = (state: StateWithCharacter) => state.character.dc;
export const selectProfBonus = (state: StateWithCharacter) => state.character.profBonus;

/**
 * Calculate current AC based on base AC, dex mod, mage armor, and shield spell.
 */
export const selectCurrentAC = createSelector(
    [selectCharacter],
    (character) => {
        let ac = character.mageArmour ? 13 + character.abilityMods.dex : character.baseAC;
        if (character.shield) ac += 5;
        return ac;
    }
);

/**
 * Calculate spell attack bonus (proficiency + INT mod)
 * SRD 5.1: Wizard Spellcasting, p. 53
 */
export const selectSpellAttackBonus = createSelector(
    [selectCharacter],
    (character) => character.profBonus + character.abilityMods.int
);

// --- EXPORT ACTIONS ---
export const {
    hydrate,
    hpChanged,
    tempHpSet,
    mageArmourToggled,
    shieldToggled,
    slotUsed,
    slotRestored,
    allSlotsRestored,
    slotsUpdated,
    concentrationSet,
    deathSaveChanged,
    hitDiceSpent,
    longRestCompleted,
    levelChanged,
    abilityScoreChanged,
    itemAttuned,
    itemUnattuned,
    inventoryItemAdded,
    inventoryItemRemoved,
    inventoryItemUpdated,
    itemChargeConsumed,
    minionAdded,
    minionHpChanged,
    minionRemoved,
    allMinionsCleared,
    toastShown,
    toastCleared,
    spellPrepared,
    spellUnprepared,
} = characterSlice.actions;

export default characterSlice.reducer;
