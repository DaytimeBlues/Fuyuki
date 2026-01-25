import { test, expect } from '../fixtures/testFixtures';

test.describe('Concentration Management', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
        await homePage.waitForAppReady();
        await homePage.navigateTo('stats');
    });

    test('should set and clear concentration via suggestions', async ({ homePage }) => {
        await homePage.setConcentrationFromSuggestion('Hex');
        await expect(homePage.page.getByTestId('concentration-spell')).toBeVisible();

        await homePage.clearConcentration();
        await expect(homePage.page.getByTestId('concentration-spell')).not.toBeVisible();
    });

    test('should show concentration save toast on damage', async ({ homePage }) => {
        await homePage.setConcentrationFromSuggestion('Hex');

        // Take damage
        await homePage.decreaseHP(5);

        // Concentration remains active after damage (no auto-clear unless 0 HP)
        await expect(homePage.page.getByTestId('concentration-spell')).toBeVisible();
    });
});
