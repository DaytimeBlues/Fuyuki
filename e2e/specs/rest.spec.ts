import { test, expect } from '../fixtures/testFixtures';

test.describe('Rest & Recovery', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
        await homePage.waitForAppReady();
    });

    test('should perform a short rest and spend hit dice', async ({ homePage, settingsPage }) => {
        await homePage.decreaseHP(5);
        await homePage.navigateTo('settings');
        await settingsPage.startShortRest();
        // HitDiceWidget should be visible
        await expect(homePage.page.getByTestId('hit-dice-available').first()).toContainText('5');
        await settingsPage.spendHitDie();
        await settingsPage.finishShortRest();
        await expect(homePage.page.getByTestId('nav-tab-stats')).toBeVisible();
    });

    test('should perform a long rest', async ({ homePage, settingsPage }) => {
        await homePage.usePactSlot(0);
        await homePage.decreaseHP(3);
        await homePage.navigateTo('settings');
        settingsPage.page.once('dialog', dialog => dialog.accept());
        await settingsPage.takeLongRest();
        await expect(homePage.page.getByTestId('nav-tab-stats')).toBeVisible();
        await homePage.verifyHP(38, 38);
    });
});
