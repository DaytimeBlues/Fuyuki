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
import type { CharacterData, AbilityKey, InventoryItem } from '../../types';
import { initialCharacterData } from '../../data/initialState';
import { getActiveSession } from '../../utils/sessionStorage';
import { recalculateDerivedCharacterData } from '../../utils/srdRules';

// --- STATE INTERFACE ---
export interface CharacterState extends CharacterData {
    // Toast message (ephemeral UI state)
    toast: string | null;
}

// --- INITIAL STATE ---
function getInitialState(): CharacterState {
    const session = getActiveSession();
    if (session) {
        return {
            ...session.characterData,
            toast: null,
        };
    }
    return {
        ...initialCharacterData,
        toast: null,
    };
}

const initialState: CharacterState = getInitialState();

// --- SLICE DEFINITION ---
export const characterSlice = createSlice({
    name: 'character',
    initialState,
    reducers: {
        hydrate: (state, action: PayloadAction<{ characterData: CharacterData }>) => {
            Object.assign(state, action.payload.characterData);
        },

        // --- HP ACTIONS ---
        hpChanged: (state, action: PayloadAction<number>) => {
            const delta = action.payload - state.hp.current;

            if (delta < 0) {
                const damage = Math.abs(delta);
                const tempAbsorbed = Math.min(state.hp.temp, damage);
                const remainingDamage = damage - tempAbsorbed;
                const newHP = Math.max(0, state.hp.current - remainingDamage);

                state.hp.temp -= tempAbsorbed;
                state.hp.current = newHP;

                if (state.concentration && remainingDamage > 0 && newHP > 0) {
                    const dc = Math.max(10, Math.floor(damage / 2));
                    state.toast = `CON Save DC ${dc} to maintain ${state.concentration}`;
                }

                if (newHP === 0) {
                    if (state.concentration) {
                        state.toast = `Concentration on ${state.concentration} lost - Incapacitated!`;
                    }
                    state.concentration = null;
                }
            } else {
                const wasAtZero = state.hp.current === 0;
                state.hp.current = Math.min(state.hp.max, Math.max(0, action.payload));

                if (wasAtZero && state.hp.current > 0) {
                    state.deathSaves = { successes: 0, failures: 0 };
                    state.toast = "Stabilized! Death saves reset.";
                }
            }
        },

        tempHpSet: (state, action: PayloadAction<number>) => {
            state.hp.temp = Math.max(0, action.payload);
        },

        // --- PACT MAGIC ACTIONS ---
        pactSlotUsed: (state) => {
            if (state.pactSlots.current > 0) {
                state.pactSlots.current -= 1;
            }
        },
        pactSlotRestored: (state) => {
            if (state.pactSlots.current < state.pactSlots.max) {
                state.pactSlots.current += 1;
            }
        },
        pactSlotsRefilled: (state) => {
            state.pactSlots.current = state.pactSlots.max;
        },

        // --- MYSTIC ARCANUM ---
        arcanumUsed: (state, action: PayloadAction<number>) => {
            const lvl = action.payload as 6 | 7 | 8 | 9;
            if (state.arcanum[lvl]) {
                state.arcanum[lvl]!.used = true;
            }
        },
        arcanumRestored: (state, action: PayloadAction<number>) => {
            const lvl = action.payload as 6 | 7 | 8 | 9;
            if (state.arcanum[lvl]) {
                state.arcanum[lvl]!.used = false;
            }
        },

        // --- INVOCATIONS ---
        invocationToggled: (state, action: PayloadAction<string>) => {
            const invocation = state.invocations.find(i => i.id === action.payload);
            if (invocation) {
                invocation.active = !invocation.active;
            }
        },
        invocationUseConsumed: (state, action: PayloadAction<string>) => {
            const invocation = state.invocations.find(i => i.id === action.payload);
            if (invocation && invocation.currentUses !== undefined && invocation.currentUses > 0) {
                invocation.currentUses -= 1;
            }
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

        // --- RESTS ---
        shortRestCompleted: (state) => {
            state.pactSlots.current = state.pactSlots.max;
            state.toast = "Short Rest: Pact Slots Refilled";
        },
        longRestCompleted: (state) => {
            state.hp.current = state.hp.max;
            state.hp.temp = 0;

            const recovered = Math.max(1, Math.ceil(state.hitDice.max / 2));
            state.hitDice.current = Math.min(state.hitDice.max, state.hitDice.current + recovered);

            state.pactSlots.current = state.pactSlots.max;

            // Restore Mystic Arcanum
            Object.values(state.arcanum).forEach(slot => {
                if (slot) slot.used = false;
            });

            // Restore Limited Use Invocations
            state.invocations.forEach(inv => {
                if (inv.usesPerLongRest !== undefined) {
                    inv.currentUses = inv.usesPerLongRest;
                }
            });

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

        // --- TOAST ---
        toastShown: (state, action: PayloadAction<string>) => {
            state.toast = action.payload;
        },
        toastCleared: (state) => {
            state.toast = null;
        },
    },
});

// --- SELECTORS ---
interface StateWithCharacter {
    character: CharacterState;
}

export const selectCharacter = (state: StateWithCharacter) => state.character;
export const selectHp = (state: StateWithCharacter) => state.character.hp;
export const selectPactSlots = (state: StateWithCharacter) => state.character.pactSlots;
export const selectArcanum = (state: StateWithCharacter) => state.character.arcanum;
export const selectInvocations = (state: StateWithCharacter) => state.character.invocations;
export const selectConcentration = (state: StateWithCharacter) => state.character.concentration;
export const selectToast = (state: StateWithCharacter) => state.character.toast;

export const selectAbilityModifier = createSelector(
    [selectCharacter, (_: StateWithCharacter, ability: AbilityKey) => ability],
    (character, ability) => character.abilityMods[ability]
);

export const selectSpellSaveDC = (state: StateWithCharacter) => state.character.dc;
export const selectProfBonus = (state: StateWithCharacter) => state.character.profBonus;

export const selectCurrentAC = createSelector(
    [selectCharacter],
    (character) => {
        const armorOfShadows = character.invocations.find(i => i.id === 'armor-of-shadows' || i.name === 'Armor of Shadows');
        if (armorOfShadows?.active) {
            return 13 + character.abilityMods.dex;
        }
        return character.baseAC + character.abilityMods.dex;
    }
);

/**
 * Warlock uses CHA for spell attack bonus.
 */
export const selectSpellAttackBonus = createSelector(
    [selectCharacter],
    (character) => character.profBonus + character.abilityMods.cha
);

// --- EXPORT ACTIONS ---
export const {
    hydrate,
    hpChanged,
    tempHpSet,
    pactSlotUsed,
    pactSlotRestored,
    pactSlotsRefilled,
    arcanumUsed,
    arcanumRestored,
    invocationToggled,
    invocationUseConsumed,
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
    inventoryItemUpdated,
    itemChargeConsumed,
    toastShown,
    toastCleared,
} = characterSlice.actions;

export default characterSlice.reducer;
