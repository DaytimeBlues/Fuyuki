import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
    async openAddItemForm() {
        await this.page.getByTestId('add-item-btn').click();
    }

    async createItem(name: string, description: string, charges?: number, spells?: string) {
        await this.page.getByTestId('item-name-input').fill(name);
        await this.page.getByTestId('item-desc-input').fill(description);
        if (charges !== undefined) {
            await this.page.getByTestId('item-charges-input').fill(charges.toString());
        }
        if (spells) {
            await this.page.getByTestId('item-spells-input').fill(spells);
        }
        await this.page.getByTestId('item-create-btn').click();
    }

    async useItemCharge(index: number) {
        await this.page.getByTestId(`item-use-charge-btn-${index}`).click();
    }

    async deleteItem(index: number) {
        await this.page.getByTestId(`item-delete-btn-${index}`).click();
    }

    async getItemCard(index: number) {
        return this.page.getByTestId(`inventory-item-${index}`);
    }
}
