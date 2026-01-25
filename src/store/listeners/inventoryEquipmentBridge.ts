import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { itemEquipped } from '../slices/inventorySlice';
import { equipItem, unequipItem } from '../slices/equipmentSlice';
import { ArmorSlot, EquippedItem } from '../../types';

export const inventoryEquipmentListener = createListenerMiddleware();

inventoryEquipmentListener.startListening({
    actionCreator: itemEquipped,
    effect: async (action, listenerApi) => {
        const state = listenerApi.getState() as RootState;
        const index = action.payload;
        const item = state.inventory.inventory[index];

        if (!item) return;

        // Determine slot
        let slot: ArmorSlot | undefined = item.preferredSlot;

        if (!slot) {
            if (item.type === 'armor') slot = 'chest';
            if (item.type === 'weapon') slot = 'mainHand';
        }

        if (!slot) return;

        if (item.equipped) {
            // Equipping
            const equippedItem: EquippedItem = {
                itemId: item.id,
                name: item.name,
                description: item.description,
                cosmeticOnly: false,
                modifiers: item.modifiers || []
            };

            // If it's armor, add AC modifier if not present but armorStats is
            if (item.type === 'armor' && item.armorStats && !equippedItem.modifiers.some(m => m.stat === 'ac')) {
                equippedItem.modifiers.push({
                    stat: 'ac',
                    type: 'set',
                    value: item.armorStats.baseAC
                });
            }

            listenerApi.dispatch(equipItem({ slot, item: equippedItem }));
        } else {
            // Unequipping
            listenerApi.dispatch(unequipItem(slot));
        }
    }
});
