import { test, expect } from '../fixtures/testFixtures';

test.describe('Inventory Management', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
        await homePage.waitForAppReady();
        await homePage.navigateTo('inventory');
    });

    test('should add and use item charges', async ({ inventoryPage }) => {
        const itemName = 'Wand of Magic Missile';
        await inventoryPage.openAddItemForm();
        await inventoryPage.createItem(itemName, '7 charges', 7);

        const itemCard = inventoryPage.page.locator(`[data-testid^="inventory-item-"]`).filter({ hasText: itemName });
        await expect(itemCard).toBeVisible();

        await itemCard.getByTestId(/item-use-charge-btn-/).click();
        await expect(itemCard).toContainText('6 / 7');
    });

    test('should delete items', async ({ inventoryPage }) => {
        const itemName = 'Trinket';
        await inventoryPage.openAddItemForm();
        await inventoryPage.createItem(itemName, 'test');

        const itemCard = inventoryPage.page.locator(`[data-testid^="inventory-item-"]`).filter({ hasText: itemName });
        await expect(itemCard).toBeVisible();

        inventoryPage.page.once('dialog', dialog => dialog.accept());
        await itemCard.getByTestId(/item-delete-btn-/).click();

        await expect(itemCard).not.toBeVisible();
    });

    test('should cast spell from linked item', async ({ inventoryPage }) => {
        const itemName = 'Wand of Fire';
        const spellName = 'Fireball';

        await inventoryPage.openAddItemForm();
        await inventoryPage.createItem(itemName, 'burns things', 5, spellName);

        const itemCard = inventoryPage.page.locator(`[data-testid^="inventory-item-"]`).filter({ hasText: itemName });
        await expect(itemCard).toBeVisible();
        await expect(itemCard).toContainText('5 / 5');

        // Click Cast Fireball
        await itemCard.getByTestId(`cast-spell-${spellName}`).click();

        // Check charge consumed
        await expect(itemCard).toContainText('4 / 5');

        // Check Toast (approximate check since toast is transient)
        await expect(inventoryPage.page.getByTestId('toast-message')).toContainText(`Casting ${spellName}`);
    });
});
