import { test, expect } from '../fixtures/testFixtures';

test.describe('Pact Slots & Arcanum', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
        await homePage.waitForAppReady();
    });

    test('should track pact slot usage', async ({ homePage }) => {
        // Level 5 has 2 slots
        await homePage.usePactSlot(0);
        await expect(homePage.page.getByTestId('pact-slots-display')).toContainText('1'); // 1/2
    });

    test('should track mystic arcanum usage at high level', async ({ homePage, settingsPage }) => {
        await homePage.navigateTo('settings');
        // Level 5 -> Level 11 (6 clicks)
        await settingsPage.adjustLevel(6);
        await homePage.navigateTo('home');

        // At level 11, should have 6th level arcanum
        const arcanumBtn = homePage.page.getByTestId('arcanum-6');
        await expect(arcanumBtn).toBeVisible({ timeout: 10000 });

        // Wait for animation to settle
        await homePage.page.waitForTimeout(500);

        await arcanumBtn.click();
        await expect(homePage.page.getByTestId('arcanum-orb-6')).toHaveClass(/bg-bg/);
    });
});
