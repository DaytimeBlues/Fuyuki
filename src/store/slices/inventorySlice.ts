import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CharacterData, InventoryItem } from '../../types';
import { getActiveSession } from '../../utils/sessionStorage';
import { initialCharacterData } from '../../data/initialState';

export interface InventoryState {
    inventory: InventoryItem[];
    attunement: string[];
    mageArmour: boolean;
    shield: boolean;
}

const getInitialState = (): InventoryState => {
    const session = getActiveSession();
    const data = session ? session.characterData : initialCharacterData;
    return {
        inventory: data.inventory || [],
        attunement: data.attunement || [],
        mageArmour: data.mageArmour || false,
        shield: data.shield || false,
    };
};

const initialState: InventoryState = getInitialState();

export const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        hydrateInventory: (state, action: PayloadAction<CharacterData>) => {
            state.inventory = action.payload.inventory || [];
            state.attunement = action.payload.attunement || [];
            state.mageArmour = action.payload.mageArmour || false;
            state.shield = action.payload.shield || false;
        },
        inventoryItemAdded: (state, action: PayloadAction<InventoryItem>) => {
            state.inventory.push(action.payload);
        },
        inventoryItemRemoved: (state, action: PayloadAction<number>) => {
            state.inventory.splice(action.payload, 1);
        },
        inventoryItemUpdated: (state, action: PayloadAction<{ index: number; item: InventoryItem }>) => {
            if (state.inventory[action.payload.index]) {
                state.inventory[action.payload.index] = action.payload.item;
            }
        },
        itemEquipped: (state, action: PayloadAction<number>) => {
            const item = state.inventory[action.payload];
            if (!item) return;

            const wasEquipped = !!item.equipped;
            if (!wasEquipped && item.type === 'armor') {
                state.inventory.forEach(i => {
                    if (i.type === 'armor') i.equipped = false;
                });
            }
            item.equipped = !wasEquipped;
        },
        itemAttuned: (state, action: PayloadAction<string>) => {
            if (state.attunement.length < 3) {
                state.attunement.push(action.payload);
            }
        },
        itemUnattuned: (state, action: PayloadAction<number>) => {
            state.attunement.splice(action.payload, 1);
        },
        itemChargeConsumed: (state, action: PayloadAction<number>) => {
            const item = state.inventory[action.payload];
            if (item && item.charges && item.charges.current > 0) {
                item.charges.current -= 1;
            }
        }
    },
});

export const {
    hydrateInventory,
    inventoryItemAdded,
    inventoryItemRemoved,
    inventoryItemUpdated,
    itemEquipped,
    itemAttuned,
    itemUnattuned,
    itemChargeConsumed
} = inventorySlice.actions;

export default inventorySlice.reducer;
