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
            let damage = state.hp.current - action.payload; // Positive if taking damage

            // Handle Wild Shape / Polymorph damage interception
            if (state.transformed && damage > 0) {
                const shapeHp = state.transformed.hp.current;
                const absorbed = Math.min(shapeHp, damage);
                const remaining = damage - absorbed;

                state.transformed.hp.current -= absorbed;

                // Revert if shape reaches 0
                if (state.transformed.hp.current <= 0) {
                    state.transformed = null;
                    state.toast = "Wild Shape Reverted!";

                    // Apply carryover damage to normal HP
                    damage = remaining;
                } else {
                    // Damage fully absorbed by shape
                    return;
                }
            } else if (state.transformed && damage < 0) {
                // Healed while transformed? Usually heals the form.
                // Assuming payload is absolute new HP... this is tricky with `hpChanged` taking newCurrent.
                // Let's assume the UI sends the TARGET new HP for the *visible* bar.
                // If visible bar is Wild Shape, we update Wild Shape.
                // But `hpChanged` signature is simple `number`. 
                // To support both, we might need separate actions or smart inference.
                // For now, let's assume `hpChanged` targets base HP unless specific `wildShapeHpChanged` is used.
                // BUT, conflict resolution strategy: The widget dispatches `hpChanged`.
                // Let's stick to base HP logic here and add specific Wild Shape actions for the widget to use.
                // If we want simple generic 'take damage', we use a new action `takeDamage` that routes automatically.
                // For now, I'll keep `hpChanged` targeting BASE character to be safe, and handle Wild Shape in specific actions.
                // REVERTING the automatic wild shape intersection in `hpChanged` to avoid confusion with direct HP edits.
            }

            // Standard HP Logic (Base Character)
            const delta = action.payload - state.hp.current;

            if (delta < 0) {
                const damageAmt = Math.abs(delta);
                const tempAbsorbed = Math.min(state.hp.temp, damageAmt);
                const remainingDamage = damageAmt - tempAbsorbed;
                const newHP = Math.max(0, state.hp.current - remainingDamage);

                state.hp.temp -= tempAbsorbed;
                state.hp.current = newHP;

                if (state.concentration && remainingDamage > 0 && newHP > 0) {
                    const dc = Math.max(10, Math.floor(damageAmt / 2));
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

        // --- WILD SHAPE ACTIONS ---
        wildShapeStarted: (state, action: PayloadAction<{ name: string; hp: number; ac: number }>) => {
            state.transformed = {
                active: true,
                creatureName: action.payload.name,
                hp: { current: action.payload.hp, max: action.payload.hp },
                ac: action.payload.ac
            };
            state.toast = `Wild Shape: ${action.payload.name}`;
        },
        wildShapeEnded: (state) => {
            state.transformed = null;
            state.toast = "Wild Shape Ended";
        },
        wildShapeHpChanged: (state, action: PayloadAction<number>) => {
            if (state.transformed) {
                const newCurrent = Math.max(0, action.payload);
                const oldCurrent = state.transformed.hp.current;
                state.transformed.hp.current = newCurrent;

                // Check revert on 0 HP (optional auto-revert logic)
                if (newCurrent === 0 && oldCurrent > 0) {
                    // We let the UI handle the 'revert' action or we do it here?
                    // Safe to just let it sit at 0 until user confirms revert? 
                    // SRD says redundant damage carries over. 
                    // Let's implement 'damageDealtToWildShape' instead of absolute set if we want carryover.
                    // For now, simple setter.
                }
            }
        },
        wildShapeDamageTaken: (state, action: PayloadAction<number>) => {
            if (state.transformed) {
                const damage = action.payload;
                const shapeHp = state.transformed.hp.current;

                if (damage >= shapeHp) {
                    const carryover = damage - shapeHp;
                    state.transformed = null;
                    state.toast = `Wild Shape Reverted! ${carryover > 0 ? carryover + ' carryover damage' : ''}`;

                    // Apply carryover to main HP
                    if (carryover > 0) {
                        // Reuse HP changed logic (copy-paste or internal call not poss in reducer easily)
                        // Manual subtract
                        const tempAbsorbed = Math.min(state.hp.temp, carryover);
                        const remaining = carryover - tempAbsorbed;
                        state.hp.temp -= tempAbsorbed;
                        state.hp.current = Math.max(0, state.hp.current - remaining);
                    }
                } else {
                    state.transformed.hp.current -= damage;
                }
            }
        },

        // --- SLOTS MANAGEMENT ---
        slotsUpdated: (state, action: PayloadAction<Record<number, { used: number; max: number }>>) => {
            // Merge or overwrite? Overwrite is safer for calculation widget.
            state.slots = action.payload;
        },
        slotExpended: (state, action: PayloadAction<{ level: number }>) => {
            const slot = state.slots[action.payload.level];
            if (slot && slot.used < slot.max) {
                slot.used += 1;
            }
        },
        slotRestored: (state, action: PayloadAction<{ level: number }>) => {
            const slot = state.slots[action.payload.level];
            if (slot && slot.used > 0) {
                slot.used -= 1;
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

        // --- ATTUNEMENT / EQUIPMENT ---
        itemEquipped: (state, action: PayloadAction<number>) => {
            const item = state.inventory[action.payload];
            if (!item) return;

            // Simple toggle
            const wasEquipped = !!item.equipped;

            // If equipping armor, unequip other armor
            if (!wasEquipped && item.type === 'armor') {
                state.inventory.forEach(i => {
                    if (i.type === 'armor') i.equipped = false;
                });
            }

            item.equipped = !wasEquipped;

            // Recalculate derived data (AC/stats)
            const updated = recalculateDerivedCharacterData(state);
            Object.assign(state, updated);

            state.toast = `${item.name} ${item.equipped ? 'Equipped' : 'Unequipped'}`;
        },
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
    itemEquipped,
    itemAttuned,
    itemUnattuned,
    inventoryItemAdded,
    inventoryItemRemoved,
    inventoryItemUpdated,
    itemChargeConsumed,
    toastShown,
    toastCleared,
    wildShapeStarted,
    wildShapeEnded,
    wildShapeHpChanged,
    wildShapeDamageTaken,
    slotsUpdated,
    slotExpended,
    slotRestored,
} = characterSlice.actions;

export default characterSlice.reducer;
