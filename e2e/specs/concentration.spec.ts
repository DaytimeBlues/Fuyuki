import { test, expect } from '../fixtures/testFixtures';

test.describe('Concentration Management', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
        await homePage.waitForAppReady();
        await homePage.navigateTo('stats');
    });

    test('should set and clear concentration via suggestions', async ({ homePage }) => {
        // Hex is a classic Warlock concentration spell
        await homePage.setConcentrationFromSuggestion('Hex');
        await expect(homePage.page.getByTestId('concentration-spell')).toContainText('Hex');

        await homePage.clearConcentration();
        await expect(homePage.page.getByTestId('concentration-spell')).not.toBeVisible();
    });

    test('should show concentration save toast on damage', async ({ homePage }) => {
        await homePage.setConcentrationFromSuggestion('Hex');

        // Take damage
        await homePage.decreaseHP(5);

        // Concentration check toast - matches characterSlice.ts:64
        await expect(homePage.page.getByTestId('toast-message')).toContainText(/CON Save DC/i);
    });
});
