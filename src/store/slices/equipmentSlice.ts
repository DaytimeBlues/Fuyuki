import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EquipmentSlots, EquippedItem, ArmorSlot, StatModifier } from '../../types';

export interface EquipmentState {
    equipped: EquipmentSlots;
}

const initialState: EquipmentState = {
    equipped: {
        head: null,
        cloak: null,
        chest: null,
        hands: null,
        feet: null,
        ring1: null,
        ring2: null,
        amulet: null,
        mainHand: null,
        offHand: null,
    },
};

export const equipmentSlice = createSlice({
    name: 'equipment',
    initialState,
    reducers: {
        hydrateEquipment: (state, action: PayloadAction<EquipmentSlots>) => {
            state.equipped = action.payload || initialState.equipped;
        },
        equipItem: (state, action: PayloadAction<{ slot: ArmorSlot; item: EquippedItem }>) => {
            const { slot, item } = action.payload;
            (state.equipped as any)[slot] = item;
        },
        unequipItem: (state, action: PayloadAction<ArmorSlot>) => {
            (state.equipped as any)[action.payload] = null;
        },
        toggleCosmeticOnly: (state, action: PayloadAction<ArmorSlot>) => {
            const slot = action.payload;
            const item = (state.equipped as any)[slot];
            if (item) {
                item.cosmeticOnly = !item.cosmeticOnly;
            }
        },
        updateItemModifiers: (
            state,
            action: PayloadAction<{ slot: ArmorSlot; modifiers: StatModifier[] }>
        ) => {
            const { slot, modifiers } = action.payload;
            const item = (state.equipped as any)[slot];
            if (item) {
                item.modifiers = modifiers;
            }
        },
        clearAllEquipment: (state) => {
            state.equipped = { ...initialState.equipped };
        },
    },
});

export const {
    hydrateEquipment,
    equipItem,
    unequipItem,
    toggleCosmeticOnly,
    updateItemModifiers,
    clearAllEquipment,
} = equipmentSlice.actions;

export default equipmentSlice.reducer;
