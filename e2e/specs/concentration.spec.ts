import { test, expect } from '../fixtures/testFixtures';

test.describe('Concentration Management', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
        await homePage.waitForAppReady();
    });

    test('should set and clear concentration via suggestions', async ({ homePage }) => {
        // Detect Magic is a common level 1 concentration spell likely in first 4
        await homePage.setConcentrationFromSuggestion('Detect Magic');
        await expect(homePage.page.getByTestId('concentration-spell')).toContainText('Detect Magic');

        await homePage.clearConcentration();
        await expect(homePage.page.getByTestId('concentration-spell')).not.toBeVisible();
    });

    test('should show concentration save toast on damage', async ({ homePage }) => {
        await homePage.setConcentrationFromSuggestion('Detect Magic');

        // Take damage
        await homePage.decreaseHP(5);

        // Concentration check toast - matches characterSlice.ts:64
        await expect(homePage.page.getByTestId('toast-message')).toContainText(/CON Save DC/i);
    });
});
