/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CombatPage } from '../pages/CombatPage';
import { SettingsPage } from '../pages/SettingsPage';
import { InventoryPage } from '../pages/InventoryPage';

type MyFixtures = {
    homePage: HomePage;
    combatPage: CombatPage;
    settingsPage: SettingsPage;
    inventoryPage: InventoryPage;
};

export const test = base.extend<MyFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    combatPage: async ({ page }, use) => {
        await use(new CombatPage(page));
    },
    settingsPage: async ({ page }, use) => {
        await use(new SettingsPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
});

export { expect } from '@playwright/test';
